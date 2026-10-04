import { useEffect, useState, type FC } from "react";
import { BsXLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import type { CastMember } from "../types";
import Avatar from "./Avatar";

const castKey = (member: CastMember) => `${member.person.id}-${member.character.id}`;

interface CastStackProps {
  cast: CastMember[];
  max?: number;
}

// Overlapping avatars with hover tooltips; "+N" opens the full cast list.
const CastStack: FC<CastStackProps> = ({ cast, max = 6 }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (cast.length === 0) {
    return <p className="text-text-muted text-sm">No cast information available.</p>;
  }

  const visible = cast.slice(0, max);
  const remaining = cast.length - visible.length;

  return (
    <div className="relative">
      <ul className="flex items-center pl-3">
        {visible.map((member) => (
          <li
            key={castKey(member)}
            className="group relative hover:z-20 focus-within:z-20 -ml-3 transition-transform hover:-translate-y-1 focus-within:-translate-y-1"
          >
            <Link to={`/person/${member.person.id}`} className="block rounded-full focus:outline-none">
              <Avatar
                name={member.person.name}
                image={member.person.image}
                className="border-4 border-surface-base group-focus-within:border-brand w-14 h-14 transition-colors"
              />
            </Link>
            <div
              role="tooltip"
              className="bottom-full left-1/2 z-30 absolute bg-surface opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 shadow-black/40 shadow-lg mb-3 px-3 py-2 border border-border-hover rounded-lg whitespace-nowrap transition-opacity -translate-x-1/2 pointer-events-none"
            >
              <p className="font-bold text-text-primary text-sm leading-tight">{member.person.name}</p>
              <p className="text-text-muted text-xs">as {member.character.name}</p>
              <span className="top-full left-1/2 absolute border-8 border-transparent border-t-surface -translate-x-1/2" />
            </div>
          </li>
        ))}
        {remaining > 0 && (
          <li className="-ml-3">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={`Show all ${cast.length} cast members`}
              onClick={() => setIsOpen((open) => !open)}
              className="flex justify-center items-center bg-surface-raised hover:bg-surface-hover border-4 border-surface-base rounded-full w-14 h-14 font-bold text-text-secondary text-sm transition hover:-translate-y-1 cursor-pointer"
            >
              +{remaining}
            </button>
          </li>
        )}
      </ul>

      {isOpen && (
        <>
          <div className="z-40 fixed inset-0" onClick={() => setIsOpen(false)} />
          <div className="top-full left-0 z-50 absolute flex flex-col bg-surface-panel shadow-2xl shadow-black/60 mt-3 border border-border-hover/50 rounded-xl w-72 max-w-[calc(100vw-2rem)] max-h-96 animate-fade-in">
            <div className="flex justify-between items-center bg-surface-overlay/50 p-3 border-b border-border-hover/50">
              <span className="font-bold text-text-muted text-xs tracking-widest">
                FULL CAST ({cast.length})
              </span>
              <button
                type="button"
                aria-label="Close cast list"
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <BsXLg />
              </button>
            </div>
            <ul className="p-1 overflow-y-auto custom-scrollbar">
              {cast.map((member) => (
                <li key={castKey(member)}>
                  <Link
                    to={`/person/${member.person.id}`}
                    className="flex items-center gap-3 hover:bg-surface-hover/30 p-2 rounded-lg transition-colors"
                  >
                    <Avatar
                      name={member.person.name}
                      image={member.person.image}
                      className="border-2 border-border-active w-10 h-10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-text-primary text-sm truncate">{member.person.name}</span>
                      <span className="text-text-muted text-xs italic truncate">as {member.character.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CastStack;
