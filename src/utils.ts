import type { Show } from "./types";

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

export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function channelName(show: Show): string | undefined {
  return show.network?.name ?? show.webChannel?.name;
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

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
