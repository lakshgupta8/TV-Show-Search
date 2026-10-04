export interface Image {
  medium: string;
  original: string;
}

export interface Country {
  name: string;
  code: string;
  timezone: string;
}

export interface Channel {
  id: number;
  name: string;
  country: Country | null;
}

export interface Show {
  id: number;
  name: string;
  type: string;
  language: string | null;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: { time: string; days: string[] };
  rating: { average: number | null };
  weight: number;
  network: Channel | null;
  webChannel: Channel | null;
  externals: { imdb: string | null; thetvdb: number | null; tvrage: number | null };
  image: Image | null;
  summary: string | null;
}

export interface Person {
  id: number;
  name: string;
  country: Country | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  image: Image | null;
}

export interface Character {
  id: number;
  name: string;
  image: Image | null;
}

export interface CastMember {
  person: Person;
  character: Character;
  self: boolean;
  voice: boolean;
}

export interface CrewMember {
  type: string;
  person: Person;
}

export interface Season {
  id: number;
  number: number;
  name: string;
  episodeOrder: number | null;
  premiereDate: string | null;
  endDate: string | null;
  image: Image | null;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate: string | null;
  airtime: string;
  airstamp: string | null;
  runtime: number | null;
  rating: { average: number | null };
  image: Image | null;
  summary: string | null;
}

export interface ImageResolution {
  url: string;
  width: number;
  height: number;
}

export interface ShowImage {
  id: number;
  type: string | null;
  main: boolean;
  resolutions: { original: ImageResolution; medium?: ImageResolution };
}

export interface Aka {
  name: string;
  country: Country | null;
}

export interface ShowDetails {
  show: Show;
  cast: CastMember[];
  crew: CrewMember[];
  seasons: Season[];
  episodes: Episode[];
  images: ShowImage[];
  akas: Aka[];
  nextEpisode: Episode | null;
  previousEpisode: Episode | null;
}

export interface EpisodeDetails {
  episode: Episode;
  show: Show;
  guestCast: CastMember[];
  guestCrew: CrewMember[];
}

export interface CastCredit {
  show: Show;
  character: Character;
  self: boolean;
  voice: boolean;
}

export interface CrewCredit {
  show: Show;
  type: string;
}

export interface PersonDetails {
  person: Person;
  castCredits: CastCredit[];
  crewCredits: CrewCredit[];
}

export interface ScheduleItem {
  episode: Episode;
  show: Show;
}

export type Status = "idle" | "loading" | "succeeded" | "failed";
