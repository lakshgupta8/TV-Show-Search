import type { FC } from "react";
import { Link } from "react-router-dom";

const GenrePill: FC<{ name: string }> = ({ name }) => (
  <Link
    to={`/browse?genre=${encodeURIComponent(name)}`}
    className="bg-surface-raised hover:bg-accent-bg px-3 py-1 border border-border-active hover:border-accent-border rounded-full font-medium text-text-secondary hover:text-accent-text text-xs uppercase tracking-widest transition-colors"
  >
    {name}
  </Link>
);

export default GenrePill;
