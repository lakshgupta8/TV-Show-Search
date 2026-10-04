import { useEffect, useRef, type FC } from "react";
import { BsSearch, BsXLg } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange, loading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere on the page to jump to the search box.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <BsSearch className="top-1/2 left-5 absolute text-text-muted -translate-y-1/2 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        autoFocus
        aria-label="Search TV shows"
        placeholder="Search for a TV show…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onChange("")}
        className="bg-surface shadow-lg shadow-black/30 py-4 pr-24 pl-12 border border-border-active focus:border-brand rounded-full focus:outline-none focus:ring-4 focus:ring-brand/25 w-full text-text-primary text-lg placeholder-text-muted/60 transition"
      />
      <div className="top-1/2 right-4 absolute flex items-center gap-3 -translate-y-1/2">
        {loading && <ImSpinner2 aria-label="Loading" className="text-brand animate-spin" />}
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="hover:bg-surface-hover p-2 rounded-full text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <BsXLg />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block bg-surface-raised px-2 py-0.5 border border-border-hover rounded font-mono text-text-muted text-xs">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
