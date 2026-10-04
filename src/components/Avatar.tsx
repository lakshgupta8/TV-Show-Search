import { useState, type FC } from "react";
import type { CastMember } from "../types";
import { initials } from "../utils";

interface AvatarProps {
  person: CastMember["person"];
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ person, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const src = person.image?.medium;

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={person.name}
        className={`flex justify-center items-center bg-surface-raised rounded-full font-bold text-text-secondary text-sm shrink-0 ${className}`}
      >
        {initials(person.name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={person.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
};

export default Avatar;
