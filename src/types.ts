export interface Image {
  medium: string;
  original: string;
}

export interface Show {
  id: number;
  name: string;
  genres: string[];
  status: string;
  language: string | null;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: { time: string; days: string[] };
  rating: { average: number | null };
  network: { name: string } | null;
  webChannel: { name: string } | null;
  image: Image | null;
  summary: string | null;
}

export interface CastMember {
  person: { id: number; name: string; image: Image | null };
  character: { id: number; name: string };
}

export interface Season {
  id: number;
  number: number;
  name: string;
  episodeOrder: number | null;
  premiereDate: string | null;
  endDate: string | null;
}

export interface ShowExtras {
  cast: CastMember[];
  seasons: Season[];
}

export type Status = "loading" | "succeeded" | "failed";
