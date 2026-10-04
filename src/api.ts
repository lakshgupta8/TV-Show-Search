import type { CastMember, Season, Show, ShowExtras } from "./types";

const BASE_URL = "https://api.tvmaze.com";

export class NotFoundError extends Error {}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (response.status === 404) throw new NotFoundError("Show not found");
  if (response.status === 429) throw new Error("Too many requests — please wait a moment and try again.");
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export async function searchShows(query: string): Promise<Show[]> {
  const results = await get<{ score: number; show: Show }[]>(
    `/search/shows?q=${encodeURIComponent(query)}`
  );
  return results.map((result) => result.show);
}

type ShowWithEmbeds = Show & {
  _embedded?: { cast?: CastMember[]; seasons?: Season[] };
};

// One request returns the show together with its cast and seasons.
export async function fetchShow(id: number): Promise<{ show: Show; extras: ShowExtras }> {
  const { _embedded, ...show } = await get<ShowWithEmbeds>(
    `/shows/${id}?embed[]=cast&embed[]=seasons`
  );
  return {
    show,
    extras: { cast: _embedded?.cast ?? [], seasons: _embedded?.seasons ?? [] },
  };
}
