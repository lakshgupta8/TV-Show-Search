import type { FC } from "react";
import { BsStarFill } from "react-icons/bs";

interface RatingBadgeProps {
  value: number | null;
  size?: "sm" | "lg";
}

const RatingBadge: FC<RatingBadgeProps> = ({ value, size = "sm" }) => {
  if (size === "lg") {
    return (
      <div className="inline-flex items-center gap-2 bg-accent-bg px-3 py-1.5 border border-accent-border rounded-lg text-accent-text">
        <BsStarFill />
        <span className="font-bold text-lg">{value ? value.toFixed(1) : "N/A"}</span>
        {value && <span className="text-accent-text/70 text-sm">/ 10</span>}
      </div>
    );
  }

  if (!value) return null;

  return (
    <span className="inline-flex items-center gap-1 bg-accent-bg/90 shadow px-2 py-0.5 rounded-md font-bold text-accent-text text-xs backdrop-blur">
      <BsStarFill className="text-[10px]" />
      {value.toFixed(1)}
    </span>
  );
};

export default RatingBadge;
