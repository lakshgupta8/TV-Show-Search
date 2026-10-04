import { useState, type FC } from "react";
import type { Image } from "../types";
import { initials } from "../utils";

interface AvatarProps {
  name: string;
  image: Image | null;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ name, image, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const src = image?.medium;

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`flex justify-center items-center bg-surface-raised rounded-full font-bold text-text-secondary text-sm shrink-0 ${className}`}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  );
};

export default Avatar;
