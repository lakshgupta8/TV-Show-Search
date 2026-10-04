import type { FC } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import PersonCard from "../../components/PersonCard";
import { SectionHeading } from "../../components/Rail";
import type { CastMember, CrewMember } from "../../types";
import { groupBy } from "../../utils";
import { useShowDetails } from "./ShowLayout";

export const characterLabel = ({ character, voice, self }: Pick<CastMember, "character" | "voice" | "self">) =>
  self ? "Self" : `as ${character.name}${voice ? " (voice)" : ""}`;

export const CastGrid: FC<{ cast: CastMember[] }> = ({ cast }) => (
  <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
    {cast.map((member) => (
      <PersonCard
        key={`${member.person.id}-${member.character.id}`}
        person={member.person}
        subtitle={characterLabel(member)}
      />
    ))}
  </div>
);

export const CrewList: FC<{ crew: CrewMember[] }> = ({ crew }) => (
  <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
    {groupBy(crew, (member) => member.type).map(([type, members]) => (
      <div key={type} className="bg-surface p-4 border border-border-base rounded-xl">
        <h3 className="mb-3 font-semibold text-text-muted text-xs uppercase tracking-widest">{type}</h3>
        <ul className="space-y-2">
          {members.map(({ person }) => (
            <li key={person.id}>
              <Link to={`/person/${person.id}`} className="group flex items-center gap-3">
                <Avatar name={person.name} image={person.image} className="w-9 h-9" />
                <span className="font-medium text-text-primary group-hover:text-accent-text text-sm transition-colors">
                  {person.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ShowCast: FC = () => {
  const { cast, crew } = useShowDetails();

  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <SectionHeading title={`Cast · ${cast.length}`} />
        {cast.length > 0 ? <CastGrid cast={cast} /> : <p className="text-text-muted text-sm">No cast information available.</p>}
      </section>
      <section>
        <SectionHeading title={`Crew · ${crew.length}`} />
        {crew.length > 0 ? <CrewList crew={crew} /> : <p className="text-text-muted text-sm">No crew information available.</p>}
      </section>
    </div>
  );
};

export default ShowCast;
