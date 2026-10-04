import type { FC, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import PersonCard from "../components/PersonCard";
import SearchBar from "../components/SearchBar";
import ShowCard from "../components/ShowCard";
import { CardGridSkeleton } from "../components/Skeletons";
import StatusMessage, { ErrorMessage } from "../components/StatusMessage";
import { useQuery, type QueryResult } from "../store/useQuery";

const SUGGESTIONS = ["Breaking Bad", "The Office", "Stranger Things", "Sherlock", "Bryan Cranston", "Zendaya"];

const showGrid = "gap-4 sm:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
const personGrid = "gap-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5";

function Results<T>({
  query,
  term,
  gridClass,
  render,
}: {
  query: QueryResult<T[]>;
  term: string;
  gridClass: string;
  render: (item: T) => ReactNode;
}) {
  const items = query.data;
  const isLoading = query.status === "loading";

  if (query.status === "failed") return <ErrorMessage error={query.error} onRetry={query.refetch} />;
  if (!items) return <CardGridSkeleton className={gridClass} />;
  if (items.length === 0 && !isLoading) {
    return (
      <StatusMessage
        title="No matches"
        description={<>Nothing matches “{term}”. Check the spelling or try another name.</>}
      />
    );
  }
  return (
    <div className={`${gridClass} transition-opacity ${query.isPreviousData ? "opacity-50" : "animate-fade-in"}`}>
      {items.map(render)}
    </div>
  );
}

const SearchPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // The query lives in the URL so results survive refreshes and the back button.
  const query = searchParams.get("q") ?? "";
  const type = searchParams.get("type") === "people" ? "people" : "shows";
  const key = query.trim().toLowerCase();

  const shows = useQuery("searchShows", key || null, { keepPreviousData: true });
  const people = useQuery("searchPeople", key || null, { keepPreviousData: true });

  const update = (next: { q?: string; type?: string }) => {
    const params: Record<string, string> = {};
    const q = next.q ?? query;
    const t = next.type ?? type;
    if (q) params.q = q;
    if (t === "people") params.type = t;
    setSearchParams(params, { replace: true });
  };

  const tabs = [
    { id: "shows", label: "Shows", count: shows.data?.length },
    { id: "people", label: "People", count: people.data?.length },
  ];
  const active = type === "people" ? people : shows;

  return (
    <div className="mx-auto px-4 max-w-6xl">
      <section className="flex flex-col items-center gap-6 pt-8 pb-6">
        <div className="w-full max-w-2xl">
          <SearchBar value={query} onChange={(q) => update({ q })} loading={active.status === "loading"} />
        </div>
      </section>

      {!key ? (
        <div className="flex flex-col items-center gap-4 pt-6 animate-fade-in">
          <div className="bg-accent-bg/50 rounded-full w-16 md:w-24 h-1" />
          <p className="font-medium text-text-muted text-sm">Find shows, actors and creators. Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => update({ q: suggestion })}
                className="bg-surface hover:bg-accent-bg px-4 py-2 border border-border-hover hover:border-accent-border rounded-full text-text-secondary hover:text-accent-text text-sm transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div role="tablist" className="flex gap-1 mb-6 border-b border-border-base">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={type === tab.id}
                onClick={() => update({ type: tab.id })}
                className={`-mb-px px-4 py-2.5 border-b-2 font-semibold text-sm transition-colors cursor-pointer ${
                  type === tab.id
                    ? "border-brand text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="bg-surface-raised ml-2 px-1.5 py-0.5 rounded font-medium text-text-muted text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {type === "shows" ? (
            <Results query={shows} term={query.trim()} gridClass={showGrid} render={(show) => <ShowCard key={show.id} show={show} />} />
          ) : (
            <Results
              query={people}
              term={query.trim()}
              gridClass={personGrid}
              render={(person) => <PersonCard key={person.id} person={person} />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
