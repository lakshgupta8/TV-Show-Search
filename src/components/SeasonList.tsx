import type { FC } from "react";
import type { Season } from "../types";
import { formatDate } from "../utils";

const SeasonList: FC<{ seasons: Season[] }> = ({ seasons }) => {
  if (seasons.length === 0) {
    return <p className="text-text-muted text-sm">No season information available.</p>;
  }

  return (
    <ul className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {seasons.map((season) => {
        const start = formatDate(season.premiereDate);
        const end = formatDate(season.endDate);
        const dates = start ? (end && end !== start ? `${start} – ${end}` : start) : "Dates TBA";

        return (
          <li
            key={season.id}
            className="flex items-center gap-4 bg-surface p-4 border border-border-base hover:border-border-hover rounded-xl transition-colors"
          >
            <span className="flex justify-center items-center bg-accent-bg border border-accent-border rounded-lg w-11 h-11 font-black text-accent-text text-lg shrink-0">
              {season.number}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-text-primary truncate">
                {season.name || `Season ${season.number}`}
              </p>
              <p className="text-text-muted text-xs">
                {season.episodeOrder ? `${season.episodeOrder} episodes · ` : ""}
                {dates}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SeasonList;
