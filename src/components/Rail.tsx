import type { FC, ReactNode } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  link?: { to: string; label: string };
}

export const SectionHeading: FC<SectionHeadingProps> = ({ title, subtitle, link }) => (
  <div className="flex justify-between items-end gap-4 mb-4">
    <div>
      <h2 className="font-bold text-text-primary text-2xl tracking-tight">{title}</h2>
      {subtitle && <p className="mt-0.5 text-text-muted text-sm">{subtitle}</p>}
    </div>
    {link && (
      <Link
        to={link.to}
        className="inline-flex items-center gap-1.5 font-semibold text-accent-text/80 hover:text-accent-text text-sm whitespace-nowrap transition-colors"
      >
        {link.label} <BsArrowRight />
      </Link>
    )}
  </div>
);

// A horizontally scrolling row of cards.
const Rail: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="-mx-4 px-4 pb-3 overflow-x-auto custom-scrollbar-x snap-x snap-mandatory scroll-px-4">
    <div className="flex gap-4 w-max">{children}</div>
  </div>
);

export const RailItem: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="w-36 sm:w-44 snap-start shrink-0">{children}</div>
);

export default Rail;
