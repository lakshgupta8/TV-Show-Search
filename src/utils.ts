import type { Episode, Show } from "./types";

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";
}

export function yearRange(show: Pick<Show, "premiered" | "ended" | "status">): string {
  const start = show.premiered?.slice(0, 4);
  if (!start) return "";
  const end = show.ended?.slice(0, 4);
  if (end && end !== start) return `${start} – ${end}`;
  if (!end && show.status === "Running") return `${start} – Present`;
  return start;
}

export function formatDate(date: string | null | undefined, month: "short" | "long" = "short"): string | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month,
    day: "numeric",
  });
}

export function channelName(show: Show): string | undefined {
  return show.network?.name ?? show.webChannel?.name;
}

// "S02E05", or "Special" for episodes without a number.
export function episodeCode(episode: Pick<Episode, "season" | "number">): string {
  if (episode.number === null) return `S${String(episode.season).padStart(2, "0")} Special`;
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function age(birthday: string, until?: string | null): number {
  const from = new Date(`${birthday}T00:00:00`);
  const to = until ? new Date(`${until}T00:00:00`) : new Date();
  let years = to.getFullYear() - from.getFullYear();
  const beforeBirthday =
    to.getMonth() < from.getMonth() || (to.getMonth() === from.getMonth() && to.getDate() < from.getDate());
  if (beforeBirthday) years--;
  return years;
}

// Local calendar date as YYYY-MM-DD (toISOString would give the UTC date).
export function isoDate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return isoDate(d);
}

export function relativeDay(date: string): string | null {
  const diff = Math.round(
    (new Date(`${date}T00:00:00`).getTime() - new Date(`${isoDate()}T00:00:00`).getTime()) / 86_400_000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return null;
}

export function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return [...groups];
}

export const byRating = (a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0);

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
