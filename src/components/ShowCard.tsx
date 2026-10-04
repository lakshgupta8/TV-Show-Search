import { memo, type FC } from "react";
import { Link } from "react-router-dom";
import type { Show } from "../types";
import { channelName, stripHtml, yearRange } from "../utils";
import Poster from "./Poster";
import RatingBadge from "./RatingBadge";

const ShowCard: FC<{ show: Show }> = ({ show }) => {
  const meta = [yearRange(show), channelName(show)].filter(Boolean).join(" · ");

  return (
    <Link
      to={`/show/${show.id}`}
      className="group flex flex-col bg-surface hover:shadow-accent-bg/40 hover:shadow-xl border border-border-base hover:border-accent-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand h-full overflow-hidden transition duration-300 hover:-translate-y-1"
    >
      <div className="relative bg-surface-raised aspect-2/3 overflow-hidden">
        <Poster
          src={show.image?.medium}
          alt={show.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="top-2 right-2 absolute">
          <RatingBadge value={show.rating.average} />
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-1.5 p-4">
        <h3
          className="font-bold text-text-primary group-hover:text-accent-text leading-tight transition-colors line-clamp-1"
          title={show.name}
        >
          {show.name}
        </h3>
        {meta && <p className="text-text-muted text-xs">{meta}</p>}
        <p className="mt-1 text-text-secondary/80 text-sm line-clamp-3">
          {stripHtml(show.summary) || "No summary available."}
        </p>
      </div>
    </Link>
  );
};

export default memo(ShowCard);
