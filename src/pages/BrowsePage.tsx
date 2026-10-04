import { useEffect, useMemo, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import ShowCard from "../components/ShowCard";
import { CardGridSkeleton } from "../components/Skeletons";
import StatusMessage, { ErrorMessage, buttonClass, secondaryButtonClass } from "../components/StatusMessage";
import { GENRES, selectClass } from "../constants";
import { useQueries } from "../store/useQuery";
import type { Show } from "../types";
import { byRating } from "../utils";

const SORTS = {
  popular: { label: "Most popular", compare: (a: Show, b: Show) => b.weight - a.weight },
  rating: { label: "Highest rated", compare: byRating },
  newest: {
    label: "Newest",
    compare: (a: Show, b: Show) => (b.premiered ?? "").localeCompare(a.premiered ?? ""),
  },
  name: { label: "A – Z", compare: (a: Show, b: Show) => a.name.localeCompare(b.name) },
};
type SortKey = keyof typeof SORTS;

const PAGE_SIZE = 40;
const INITIAL_CATALOG_PAGES = 2;
const gridClass = "gap-4 sm:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

const BrowsePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre") ?? "";
  const status = searchParams.get("status") ?? "";
  const language = searchParams.get("language") ?? "";
  const sortParam = searchParams.get("sort") ?? "";
  const sort: SortKey = sortParam in SORTS ? (sortParam as SortKey) : "popular";

  // The catalog is served 250 shows per page; load more pages on demand.
  const [catalogPages, setCatalogPages] = useState(INITIAL_CATALOG_PAGES);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const pages = useMemo(() => Array.from({ length: catalogPages }, (_, i) => i), [catalogPages]);
  const results = useQueries("showIndex", pages);

  useEffect(() => setVisible(PAGE_SIZE), [genre, status, language, sort]);

  const loaded = results.flatMap((result) => result.data ?? []);
  const isLoading = results.some((result) => result.status === "loading");
  const failed = results.find((result) => result.status === "failed");
  const reachedEnd = results.some((result) => result.data?.length === 0);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    loaded.forEach((show) => show.language && counts.set(show.language, (counts.get(show.language) ?? 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1]).map(([name]) => name);
    // Recount only when another catalog page arrives.
  }, [loaded.length]);

  const filtered = loaded
    .filter(
      (show) =>
        (!genre || show.genres.includes(genre)) &&
        (!status || show.status === status) &&
        (!language || show.language === language)
    )
    .sort(SORTS[sort].compare);
  const shown = filtered.slice(0, visible);

  const setFilter = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next, { replace: true });
  };

  const loadMore = () => {
    if (visible >= filtered.length && !reachedEnd) setCatalogPages((count) => count + 1);
    setVisible((count) => count + PAGE_SIZE);
  };

  const hasFilters = genre || status || language || sortParam;

  return (
    <div className="mx-auto px-4 pt-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-extrabold text-text-primary text-4xl tracking-tight">
          {genre ? <>{genre} <span className="text-brand">shows</span></> : "Browse shows"}
        </h1>
        <p className="mt-1 text-text-muted">Explore the TVmaze catalog by genre, status and language.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-surface mb-8 p-3 border border-border-base rounded-xl">
        <select aria-label="Genre" value={genre} onChange={(e) => setFilter("genre", e.target.value)} className={selectClass}>
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setFilter("status", e.target.value)} className={selectClass}>
          <option value="">Any status</option>
          <option value="Running">Running</option>
          <option value="Ended">Ended</option>
          <option value="To Be Determined">To be determined</option>
        </select>
        <select
          aria-label="Language"
          value={language}
          onChange={(e) => setFilter("language", e.target.value)}
          className={selectClass}
        >
          <option value="">Any language</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 sm:ml-auto">
          <label htmlFor="sort" className="text-text-muted text-sm">
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => setFilter("sort", e.target.value)} className={selectClass}>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <button type="button" onClick={() => setSearchParams({}, { replace: true })} className={secondaryButtonClass}>
            Clear
          </button>
        )}
      </div>

      {loaded.length === 0 && failed ? (
        <ErrorMessage error={failed.error} onRetry={failed.refetch} />
      ) : loaded.length === 0 ? (
        <CardGridSkeleton className={gridClass} count={12} />
      ) : filtered.length === 0 && !isLoading ? (
        <StatusMessage
          title="No shows match these filters"
          description={reachedEnd ? "Try a different combination." : "Load more of the catalog, or try a different combination."}
          action={
            !reachedEnd && (
              <button type="button" onClick={loadMore} className={buttonClass}>
                Search more of the catalog
              </button>
            )
          }
        />
      ) : (
        <>
          <div className={`${gridClass} animate-fade-in`}>
            {shown.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 mt-10">
            {failed && (
              <p className="text-text-muted text-sm">
                Part of the catalog failed to load.{" "}
                <button type="button" onClick={failed.refetch} className="text-accent-text underline underline-offset-4 cursor-pointer">
                  Retry
                </button>
              </p>
            )}
            {(visible < filtered.length || !reachedEnd) && (
              <button type="button" onClick={loadMore} disabled={isLoading} className={buttonClass}>
                {isLoading ? "Loading…" : "Load more"}
              </button>
            )}
            <p className="text-text-muted text-xs">
              Showing {shown.length} of {filtered.length.toLocaleString()} matching shows ·{" "}
              {loaded.length.toLocaleString()} catalog entries scanned
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowsePage;
