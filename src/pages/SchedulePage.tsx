import { useMemo, useState, type FC } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link, useSearchParams } from "react-router-dom";
import Poster from "../components/Poster";
import { RowsSkeleton } from "../components/Skeletons";
import StatusMessage, { ErrorMessage, secondaryButtonClass } from "../components/StatusMessage";
import { COUNTRIES, selectClass } from "../constants";
import { useQuery } from "../store/useQuery";
import type { ScheduleItem } from "../types";
import { channelName, episodeCode, formatDate, groupBy, isoDate, relativeDay, shiftDate } from "../utils";

const ScheduleRow: FC<{ item: ScheduleItem }> = ({ item: { show, episode } }) => (
  <li className="flex items-center gap-4 bg-surface p-3 border border-border-base hover:border-border-hover rounded-xl transition-colors">
    <Link to={`/show/${show.id}`} className="bg-surface-raised rounded-md w-12 aspect-2/3 overflow-hidden shrink-0">
      <Poster src={show.image?.medium} alt={show.name} className="w-full h-full" />
    </Link>
    <div className="flex-1 min-w-0">
      <Link to={`/show/${show.id}`} className="font-bold text-text-primary hover:text-accent-text transition-colors line-clamp-1">
        {show.name}
      </Link>
      <Link to={`/episode/${episode.id}`} className="block text-text-secondary hover:text-accent-text text-sm transition-colors line-clamp-1">
        <span className="font-mono text-text-muted text-xs">{episodeCode(episode)}</span> · {episode.name}
      </Link>
    </div>
    <span className="hidden sm:block text-text-muted text-xs text-right shrink-0">{channelName(show)}</span>
  </li>
);

const SchedulePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => isoDate(), []);
  const type = searchParams.get("type") === "web" ? "web" : "tv";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.get("date") ?? "") ? searchParams.get("date")! : today;
  const country = searchParams.get("country") ?? (type === "tv" ? "US" : "");
  const [filter, setFilter] = useState("");

  const tv = useQuery("schedule", type === "tv" ? { country: country || "US", date } : null);
  const web = useQuery("webSchedule", type === "web" ? (country ? { country, date } : { date }) : null);
  const active = type === "web" ? web : tv;

  const set = (changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setSearchParams(next, { replace: true });
  };

  const groups = useMemo(() => {
    const term = filter.trim().toLowerCase();
    const items = (active.data ?? [])
      .filter((item) => !term || item.show.name.toLowerCase().includes(term) || channelName(item.show)?.toLowerCase().includes(term))
      .sort((a, b) => a.episode.airtime.localeCompare(b.episode.airtime) || b.show.weight - a.show.weight);
    return groupBy(items, (item) => item.episode.airtime || "Anytime");
  }, [active.data, filter]);

  const tabClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
      selected ? "bg-accent-bg text-accent-text" : "text-text-muted hover:text-text-primary"
    }`;

  return (
    <div className="mx-auto px-4 pt-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-extrabold text-text-primary text-4xl tracking-tight">Schedule</h1>
        <p className="mt-1 text-text-muted">Every episode airing on TV or released on streaming, day by day.</p>
      </div>

      <div className="space-y-3 bg-surface mb-8 p-3 border border-border-base rounded-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-1 bg-surface-base p-1 rounded-xl">
            <button type="button" className={tabClass(type === "tv")} onClick={() => set({ type: "", country: "" })}>
              TV
            </button>
            <button type="button" className={tabClass(type === "web")} onClick={() => set({ type: "web", country: "" })}>
              Streaming
            </button>
          </div>
          <select aria-label="Country" value={country} onChange={(e) => set({ country: e.target.value })} className={selectClass}>
            {type === "web" && <option value="">All countries</option>}
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-label="Previous day" onClick={() => set({ date: shiftDate(date, -1) })} className={secondaryButtonClass}>
            <BsChevronLeft />
          </button>
          <input
            type="date"
            aria-label="Date"
            value={date}
            onChange={(e) => e.target.value && set({ date: e.target.value })}
            className={selectClass}
          />
          <button type="button" aria-label="Next day" onClick={() => set({ date: shiftDate(date, 1) })} className={secondaryButtonClass}>
            <BsChevronRight />
          </button>
          {date !== today && (
            <button type="button" onClick={() => set({ date: "" })} className={secondaryButtonClass}>
              Today
            </button>
          )}
          <input
            type="search"
            placeholder="Filter by show or network"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`${selectClass} flex-1 min-w-48 cursor-text`}
          />
        </div>
      </div>

      <h2 className="mb-4 font-bold text-text-primary text-xl">
        {relativeDay(date) && <span className="text-brand">{relativeDay(date)} · </span>}
        {formatDate(date, "long")}
        {active.data && (
          <span className="ml-2 font-medium text-text-muted text-sm">{active.data.length} episodes</span>
        )}
      </h2>

      {active.status === "failed" && !active.data ? (
        <ErrorMessage error={active.error} onRetry={active.refetch} />
      ) : !active.data ? (
        <RowsSkeleton count={6} />
      ) : groups.length === 0 ? (
        <StatusMessage
          title={filter ? "No matching episodes" : "Nothing scheduled"}
          description={filter ? "Try a different filter." : "Try another day or country."}
        />
      ) : (
        <div className={`space-y-8 ${active.status === "loading" ? "opacity-50" : "animate-fade-in"}`}>
          {groups.map(([time, items]) => (
            <section key={time} className="sm:gap-6 sm:grid sm:grid-cols-[5rem_1fr]">
              <h3 className="top-20 sm:sticky mb-2 sm:mb-0 pt-3 font-mono font-bold text-accent-text text-lg self-start">{time}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <ScheduleRow key={item.episode.id} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
