import { useState, type FC } from "react";
import type { IconType } from "react-icons";
import { BsTv } from "react-icons/bs";

interface PosterProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  icon?: IconType;
}

const Poster: FC<PosterProps> = ({ src, alt, className = "", loading = "lazy", icon: Icon = BsTv }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col justify-center items-center gap-3 bg-surface-raised p-4 text-text-muted ${className}`}
      >
        <Icon className="text-brand text-4xl" />
        <span className="font-semibold text-sm text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

export default Poster;
