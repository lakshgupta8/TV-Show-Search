import type { FC } from "react";

const GenrePill: FC<{ name: string }> = ({ name }) => (
  <span className="bg-surface-raised px-3 py-1 border border-border-active rounded-full font-medium text-text-secondary text-xs uppercase tracking-widest">
    {name}
  </span>
);

export default GenrePill;
