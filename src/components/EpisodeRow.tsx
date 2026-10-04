import { memo, type FC } from "react";
import { BsFilm } from "react-icons/bs";
import { Link } from "react-router-dom";
import type { Episode } from "../types";
import { episodeCode, formatDate, stripHtml } from "../utils";
import Poster from "./Poster";
import RatingBadge from "./RatingBadge";

const EpisodeRow: FC<{ episode: Episode }> = ({ episode }) => {
  const meta = [formatDate(episode.airdate), episode.runtime && `${episode.runtime} min`].filter(Boolean).join(" · ");
  const isUpcoming = !!episode.airstamp && new Date(episode.airstamp) > new Date();

  return (
    <Link
      to={`/episode/${episode.id}`}
      className="group flex sm:flex-row flex-col gap-4 bg-surface hover:bg-surface-raised/60 p-3 border border-border-base hover:border-accent-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
    >
      <div className="relative bg-surface-raised rounded-lg sm:w-56 aspect-video overflow-hidden shrink-0">
        <Poster src={episode.image?.medium} alt={episode.name} icon={BsFilm} className="w-full h-full" />
        <span className="bottom-2 left-2 absolute bg-surface-base/85 px-2 py-0.5 rounded font-mono font-semibold text-accent-text text-xs">
          {episodeCode(episode)}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 py-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-text-primary group-hover:text-accent-text transition-colors">{episode.name}</h3>
          <RatingBadge value={episode.rating.average} />
          {isUpcoming && (
            <span className="bg-accent-bg/60 px-2 py-0.5 border border-accent-border rounded-full font-semibold text-[10px] text-accent-text uppercase tracking-wider">
              Upcoming
            </span>
          )}
        </div>
        {meta && <p className="text-text-muted text-xs">{meta}</p>}
        <p className="text-text-secondary/80 text-sm line-clamp-2">{stripHtml(episode.summary) || "No summary yet."}</p>
      </div>
    </Link>
  );
};

export default memo(EpisodeRow);
