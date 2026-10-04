import type { FC } from "react";
import { BsSearch } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";

export const Logo: FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`font-black text-text-primary tracking-tighter ${className}`}>
    TV<span className="text-brand">SHOWS</span>
  </span>
);

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
    isActive ? "bg-accent-bg text-accent-text" : "text-text-muted hover:text-text-primary hover:bg-surface-raised"
  }`;

const Header: FC = () => (
  <header className="top-0 z-30 sticky bg-surface-base/80 backdrop-blur-md border-b border-border-base">
    <div className="flex justify-between items-center gap-3 mx-auto px-4 max-w-6xl h-16">
      <Link
        to="/"
        aria-label="TV Shows home"
        className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
      >
        <Logo className="text-xl sm:text-2xl" />
      </Link>
      <nav className="flex items-center gap-1">
        <NavLink to="/browse" className={navClass}>
          Browse
        </NavLink>
        <NavLink to="/schedule" className={navClass}>
          Schedule
        </NavLink>
        <NavLink to="/search" aria-label="Search" className={navClass}>
          <span className="flex items-center gap-2">
            <BsSearch />
            <span className="hidden sm:inline">Search</span>
          </span>
        </NavLink>
      </nav>
    </div>
  </header>
);

export default Header;
