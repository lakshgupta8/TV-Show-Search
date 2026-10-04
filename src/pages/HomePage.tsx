import { useMemo, type FC, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Header";
import Rail, { RailItem, SectionHeading } from "../components/Rail";
import SearchBar from "../components/SearchBar";
import ShowCard from "../components/ShowCard";
import { ShowCardSkeleton } from "../components/Skeletons";
import { secondaryButtonClass } from "../components/StatusMessage";
import { GENRES } from "../constants";
import { useQuery, type QueryResult } from "../store/useQuery";
import type { ScheduleItem, Show } from "../types";
import { byRating, channelName, episodeCode, isoDate, uniqueBy } from "../utils";

interface RailEntry {
  show: Show;
  subtitle?: ReactNode;
}

function ShowRail<T>({
  query,
  select,
  ...heading
}: {
  query: QueryResult<T>;
  select: (data: T) => RailEntry[];
  title: string;
  subtitle?: string;
  link?: { to: string; label: string };
}) {
  const entries = useMemo(() => (query.data ? select(query.data) : null), [query.data, select]);

  let content: ReactNode;
  if (entries) {
    content =
      entries.length > 0 ? (
        entries.map(({ show, subtitle }) => (
          <RailItem key={show.id}>
            <ShowCard show={show} subtitle={subtitle} compact />
          </RailItem>
        ))
      ) : (
        <p className="py-6 text-text-muted text-sm">Nothing here right now.</p>
      );
  } else if (query.status === "failed") {
    content = (
      <div className="flex items-center gap-4 py-6 text-text-muted text-sm">
        Couldn't load this row.
        <button type="button" onClick={query.refetch} className={secondaryButtonClass}>
          Retry
        </button>
      </div>
    );
  } else {
    content = Array.from({ length: 8 }, (_, i) => (
      <RailItem key={i}>
        <ShowCardSkeleton compact />
      </RailItem>
    ));
  }

  return (
    <section>
      <SectionHeading {...heading} />
      <Rail>{content}</Rail>
    </section>
  );
}

// One entry per show (a show can air several episodes in a day), most popular first.
const fromSchedule = (items: ScheduleItem[]): RailEntry[] =>
  uniqueBy(items, (item) => item.show.id)
    .sort((a, b) => b.show.weight - a.show.weight)
    .slice(0, 20)
    .map(({ show, episode }) => ({
      show,
      subtitle: [episode.airtime, episodeCode(episode), channelName(show)].filter(Boolean).join(" · "),
    }));

const topRated = (shows: Show[]): RailEntry[] =>
  shows
    .filter((show) => show.rating.average)
    .sort(byRating)
    .slice(0, 20)
    .map((show) => ({ show }));

const HomePage: FC = () => {
  const navigate = useNavigate();
  const today = useMemo(() => isoDate(), []);

  const tonight = useQuery("schedule", { country: "US", date: today });
  const streaming = useQuery("webSchedule", { date: today });
  const catalog = useQuery("showIndex", 0);

  return (
    <div className="space-y-14 mx-auto px-4 max-w-6xl">
      <section className="flex flex-col items-center gap-6 pt-14 sm:pt-20 pb-2 text-center animate-fade-in">
        <h1>
          <Logo className="text-5xl sm:text-7xl" />
        </h1>
        <p className="mx-auto max-w-xl text-text-muted text-lg leading-relaxed">
          Search through thousands of shows, explore cast details, and find your next obsession.
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar
            value=""
            autoFocus={false}
            onChange={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)}
          />
        </div>
      </section>

      <ShowRail
        title="Airing tonight"
        subtitle="On US television today"
        link={{ to: "/schedule", label: "Full schedule" }}
        query={tonight}
        select={fromSchedule}
      />

      <ShowRail
        title="New on streaming"
        subtitle="Episodes released on streaming services today"
        link={{ to: "/schedule?type=web", label: "Streaming schedule" }}
        query={streaming}
        select={fromSchedule}
      />

      <ShowRail
        title="Top rated"
        subtitle="Highest-rated classics from the TVmaze catalog"
        link={{ to: "/browse?sort=rating", label: "Browse all" }}
        query={catalog}
        select={topRated}
      />

      <section>
        <SectionHeading title="Browse by genre" />
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <Link
              key={genre}
              to={`/browse?genre=${encodeURIComponent(genre)}`}
              className="bg-surface hover:bg-accent-bg px-4 py-2 border border-border-hover hover:border-accent-border rounded-full text-text-secondary hover:text-accent-text text-sm transition-colors"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
