import { memo, type FC, type ReactNode } from "react";
import { BsPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import type { Person } from "../types";
import Poster from "./Poster";

interface PersonCardProps {
  person: Person;
  subtitle?: ReactNode;
}

const PersonCard: FC<PersonCardProps> = ({ person, subtitle }) => {
  const meta = subtitle ?? [person.country?.name, person.birthday?.slice(0, 4) && `b. ${person.birthday.slice(0, 4)}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      to={`/person/${person.id}`}
      className="group flex flex-col bg-surface border border-border-base hover:border-accent-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand h-full overflow-hidden transition duration-300 hover:-translate-y-1"
    >
      <div className="bg-surface-raised aspect-3/4 overflow-hidden">
        <Poster
          src={person.image?.medium}
          alt={person.name}
          icon={BsPersonFill}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-bold text-text-primary group-hover:text-accent-text text-sm leading-tight transition-colors line-clamp-1">
          {person.name}
        </h3>
        {meta && <div className="text-text-muted text-xs line-clamp-2">{meta}</div>}
      </div>
    </Link>
  );
};

export default memo(PersonCard);
