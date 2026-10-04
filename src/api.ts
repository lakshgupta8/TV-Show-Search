import type {
  Aka,
  CastMember,
  Character,
  CrewMember,
  Episode,
  EpisodeDetails,
  Person,
  PersonDetails,
  ScheduleItem,
  Season,
  Show,
  ShowDetails,
  ShowImage,
} from "./types";

const BASE_URL = "https://api.tvmaze.com";

export class NotFoundError extends Error {}
export class RateLimitError extends Error {}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (response.status === 404) throw new NotFoundError("Not found");
  if (response.status === 429) {
    throw new RateLimitError("Too many requests — please wait a moment and try again.");
  }
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

const query = (params: Record<string, string | number | undefined>) =>
  new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== "")
      .map(([key, value]) => [key, String(value)])
  ).toString();

async function searchShows(q: string): Promise<Show[]> {
  const results = await get<{ show: Show }[]>(`/search/shows?${query({ q })}`);
  return results.map((result) => result.show);
}

async function searchPeople(q: string): Promise<Person[]> {
  const results = await get<{ person: Person }[]>(`/search/people?${query({ q })}`);
  return results.map((result) => result.person);
}

type ShowResponse = Show & {
  _embedded?: {
    cast?: CastMember[];
    crew?: CrewMember[];
    seasons?: Season[];
    episodes?: Episode[];
    images?: ShowImage[];
    akas?: Aka[];
    nextepisode?: Episode;
    previousepisode?: Episode;
  };
};

const SHOW_EMBEDS = ["cast", "crew", "seasons", "episodes", "images", "akas", "nextepisode", "previousepisode"]
  .map((embed) => `embed[]=${embed}`)
  .join("&");

// One request returns the show with everything the show pages need.
async function showDetails(id: number): Promise<ShowDetails> {
  const { _embedded: e = {}, ...show } = await get<ShowResponse>(`/shows/${id}?${SHOW_EMBEDS}`);
  return {
    show,
    cast: e.cast ?? [],
    crew: e.crew ?? [],
    seasons: e.seasons ?? [],
    episodes: e.episodes ?? [],
    images: e.images ?? [],
    akas: e.akas ?? [],
    nextEpisode: e.nextepisode ?? null,
    previousEpisode: e.previousepisode ?? null,
  };
}

type EpisodeResponse = Episode & {
  _embedded: {
    show: Show;
    guestcast?: CastMember[];
    guestcrew?: { guestCrewType: string; person: Person }[];
  };
};

async function episodeDetails(id: number): Promise<EpisodeDetails> {
  const { _embedded: e, ...episode } = await get<EpisodeResponse>(
    `/episodes/${id}?embed[]=show&embed[]=guestcast&embed[]=guestcrew`
  );
  return {
    episode,
    show: e.show,
    guestCast: e.guestcast ?? [],
    guestCrew: (e.guestcrew ?? []).map((member) => ({ type: member.guestCrewType, person: member.person })),
  };
}

async function personDetails(id: number): Promise<PersonDetails> {
  const [person, castCredits, crewCredits] = await Promise.all([
    get<Person>(`/people/${id}`),
    get<{ self: boolean; voice: boolean; _embedded: { show: Show; character: Character } }[]>(
      `/people/${id}/castcredits?embed[]=show&embed[]=character`
    ),
    get<{ type: string; _embedded: { show: Show } }[]>(`/people/${id}/crewcredits?embed=show`),
  ]);
  return {
    person,
    castCredits: castCredits.map(({ self, voice, _embedded }) => ({ self, voice, ..._embedded })),
    crewCredits: crewCredits.map(({ type, _embedded }) => ({ type, show: _embedded.show })),
  };
}

// Broadcast TV schedule for one country; each episode comes with its show inline.
async function schedule({ country, date }: { country: string; date: string }): Promise<ScheduleItem[]> {
  const episodes = await get<(Episode & { show: Show })[]>(`/schedule?${query({ country, date })}`);
  return episodes.map(({ show, ...episode }) => ({ episode, show }));
}

// Streaming schedule; leaving out the country returns every web channel worldwide.
async function webSchedule({ country, date }: { country?: string; date: string }): Promise<ScheduleItem[]> {
  const episodes = await get<(Episode & { _embedded: { show: Show } })[]>(
    `/schedule/web?${query({ country, date })}`
  );
  return episodes.map(({ _embedded, ...episode }) => ({ episode, show: _embedded.show }));
}

// The full catalog, 250 shows per page ordered by id. Past the last page the API returns 404.
async function showIndex(page: number): Promise<Show[]> {
  try {
    return await get<Show[]>(`/shows?page=${page}`);
  } catch (error) {
    if (error instanceof NotFoundError) return [];
    throw error;
  }
}

export const api = {
  searchShows,
  searchPeople,
  showDetails,
  episodeDetails,
  personDetails,
  schedule,
  webSchedule,
  showIndex,
};

export type Api = typeof api;
export type Endpoint = keyof Api;
export type EndpointArg<E extends Endpoint> = Parameters<Api[E]>[0];
export type EndpointData<E extends Endpoint> = Awaited<ReturnType<Api[E]>>;
