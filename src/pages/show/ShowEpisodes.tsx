import { useMemo, type FC } from "react";
import { BsStarFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import EpisodeRow from "../../components/EpisodeRow";
import StatusMessage from "../../components/StatusMessage";
import { formatDate, groupBy } from "../../utils";
import { useShowDetails } from "./ShowLayout";

const ShowEpisodes: FC = () => {
  const { episodes, seasons } = useShowDetails();
  const [searchParams, setSearchParams] = useSearchParams();

  const bySeason = useMemo(() => new Map(groupBy(episodes, (episode) => String(episode.season))), [episodes]);
  const seasonNumbers = [...bySeason.keys()].map(Number).sort((a, b) => a - b);

  if (seasonNumbers.length === 0) {
    return <StatusMessage title="No episodes yet" description="Episodes will appear here once they're announced." />;
  }

  const requested = Number(searchParams.get("season"));
  const selected = seasonNumbers.includes(requested) ? requested : seasonNumbers[0];
  const seasonEpisodes = bySeason.get(String(selected)) ?? [];
  const season = seasons.find((s) => s.number === selected);

  const rated = seasonEpisodes.filter((episode) => episode.rating.average);
  const averageRating = rated.length
    ? rated.reduce((sum, episode) => sum + (episode.rating.average ?? 0), 0) / rated.length
    : null;
  const dates = [formatDate(season?.premiereDate), formatDate(season?.endDate)].filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-2 pb-2 overflow-x-auto custom-scrollbar-x">
        {seasonNumbers.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => setSearchParams({ season: String(number) }, { replace: true })}
            className={`px-4 py-2 border rounded-lg font-semibold text-sm whitespace-nowrap transition-colors cursor-pointer ${
              number === selected
                ? "bg-accent-bg border-accent-border text-accent-text"
                : "bg-surface border-border-hover text-text-secondary hover:bg-surface-raised"
            }`}
          >
            Season {number}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-text-muted text-sm">
        <span>
          <span className="font-semibold text-text-primary">{seasonEpisodes.length}</span> episodes
        </span>
        {dates.length > 0 && <span>{[...new Set(dates)].join(" – ")}</span>}
        {averageRating && (
          <span className="inline-flex items-center gap-1.5">
            <BsStarFill className="text-brand" /> {averageRating.toFixed(1)} season average
          </span>
        )}
      </div>

      <ul className="space-y-3">
        {seasonEpisodes.map((episode) => (
          <li key={episode.id}>
            <EpisodeRow episode={episode} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowEpisodes;
