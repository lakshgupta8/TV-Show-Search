import type { FC } from "react";
import { Link } from "react-router-dom";

export const Logo: FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`font-black text-text-primary tracking-tighter ${className}`}>
    TV<span className="text-brand">SHOWS</span>
  </span>
);

const Header: FC = () => (
  <header className="top-0 z-30 sticky bg-surface-base/80 backdrop-blur-md border-b border-border-base">
    <div className="flex justify-between items-center mx-auto px-4 max-w-6xl h-16">
      <Link to="/" aria-label="TV Shows home" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        <Logo className="text-2xl" />
      </Link>
      <a
        href="https://www.tvmaze.com/api"
        target="_blank"
        rel="noreferrer"
        className="text-text-muted hover:text-accent-text text-xs transition-colors"
      >
        Data by TVmaze
      </a>
    </div>
  </header>
);

export default Header;
