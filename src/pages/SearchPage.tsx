import { useEffect, useRef, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { Logo } from "../components/Header";
import SearchBar from "../components/SearchBar";
import ShowCard from "../components/ShowCard";
import { ShowCardSkeleton } from "../components/Skeletons";
import StatusMessage, { buttonClass } from "../components/StatusMessage";
import { useAppDispatch, useAppSelector } from "../store";
import { selectSearchEntry, selectSearchResults } from "../store/selectors";
import { searchRequested } from "../store/showsSlice";
import type { Show } from "../types";

const SUGGESTIONS = ["Breaking Bad", "The Office", "Stranger Things", "Sherlock", "Friends", "Dark"];

const gridClass = "gap-4 sm:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

const SearchPage: FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // The query lives in the URL so results survive refreshes and the back button.
  const query = searchParams.get("q") ?? "";
  const key = query.trim().toLowerCase();

  const entry = useAppSelector((state) => selectSearchEntry(state, key));
  const results = useAppSelector((state) => selectSearchResults(state, key));

  // Keep showing the previous results while the next query loads, instead of flashing skeletons.
  const previousResults = useRef<Show[]>([]);
  useEffect(() => {
    if (!key) previousResults.current = [];
    else if (entry?.status === "succeeded") previousResults.current = results;
  }, [key, entry?.status, results]);

  useEffect(() => {
    if (key) dispatch(searchRequested(key));
  }, [key, dispatch]);

  const setQuery = (value: string) =>
    setSearchParams(value ? { q: value } : {}, { replace: true });

  const isLoading = entry?.status === "loading";
  const shown = isLoading ? previousResults.current : results;

  let content;
  if (!key) {
    content = (
      <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in">
        <div className="bg-accent-bg/50 rounded-full w-16 md:w-24 h-1" />
        <p className="font-medium text-text-muted text-sm">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-xl">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="bg-surface hover:bg-accent-bg px-4 py-2 border border-border-hover hover:border-accent-border rounded-full text-text-secondary hover:text-accent-text text-sm transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  } else if (entry?.status === "failed") {
    content = (
      <StatusMessage
        title="Couldn't load shows"
        description={entry.error}
        action={
          <button type="button" className={buttonClass} onClick={() => dispatch(searchRequested(key))}>
            Try again
          </button>
        }
      />
    );
  } else if (isLoading && shown.length === 0) {
    content = (
      <div className={gridClass}>
        {Array.from({ length: 8 }, (_, i) => (
          <ShowCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (!isLoading && shown.length === 0) {
    content = (
      <StatusMessage
        title="No shows found"
        description={<>Nothing matches “{query.trim()}”. Check the spelling or try another title.</>}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {!isLoading && (
          <p className="text-text-muted text-sm">
            {shown.length} {shown.length === 1 ? "result" : "results"} for{" "}
            <span className="text-text-primary">“{query.trim()}”</span>
          </p>
        )}
        <div className={`${gridClass} transition-opacity ${isLoading ? "opacity-50" : "animate-fade-in"}`}>
          {shown.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 max-w-6xl">
      <section
        className={`flex flex-col items-center gap-6 text-center transition-all duration-300 ${
          key ? "pt-8 pb-8" : "pt-16 sm:pt-24 pb-10"
        }`}
      >
        {!key && (
          <div className="space-y-4 animate-fade-in">
            <h1>
              <Logo className="text-5xl sm:text-7xl" />
            </h1>
            <p className="mx-auto max-w-xl text-text-muted text-lg leading-relaxed">
              Search through thousands of shows, explore cast details, and find your next obsession.
            </p>
          </div>
        )}
        <div className="w-full max-w-2xl">
          <SearchBar value={query} onChange={setQuery} loading={isLoading} />
        </div>
      </section>

      {content}
    </div>
  );
};

export default SearchPage;
