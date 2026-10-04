import type { FC } from "react";

export const ShowCardSkeleton: FC<{ compact?: boolean }> = ({ compact }) => (
  <div className="flex flex-col bg-surface border border-border-base rounded-xl h-full overflow-hidden animate-pulse">
    <div className="bg-surface-raised aspect-2/3" />
    <div className={`space-y-2 ${compact ? "p-3" : "p-4"}`}>
      <div className="bg-surface-raised rounded w-3/4 h-4" />
      <div className="bg-surface-raised rounded w-1/2 h-3" />
      {!compact && (
        <>
          <div className="bg-surface-raised rounded w-full h-3" />
          <div className="bg-surface-raised rounded w-5/6 h-3" />
        </>
      )}
    </div>
  </div>
);

export const CardGridSkeleton: FC<{ count?: number; className: string }> = ({ count = 8, className }) => (
  <div className={className}>
    {Array.from({ length: count }, (_, i) => (
      <ShowCardSkeleton key={i} />
    ))}
  </div>
);

export const RowsSkeleton: FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-surface-raised rounded-xl h-20" />
    ))}
  </div>
);

export const HeroSkeleton: FC = () => (
  <div className="flex md:flex-row flex-col gap-8 md:gap-12 animate-pulse">
    <div className="bg-surface-raised mx-auto md:mx-0 rounded-xl w-56 md:w-72 aspect-2/3 shrink-0" />
    <div className="flex-1 space-y-5 pt-2">
      <div className="bg-surface-raised rounded w-2/3 h-10" />
      <div className="bg-surface-raised rounded w-1/3 h-4" />
      <div className="flex gap-2">
        <div className="bg-surface-raised rounded-full w-20 h-6" />
        <div className="bg-surface-raised rounded-full w-20 h-6" />
      </div>
      <div className="space-y-2 pt-4">
        <div className="bg-surface-raised rounded w-full h-4" />
        <div className="bg-surface-raised rounded w-full h-4" />
        <div className="bg-surface-raised rounded w-4/5 h-4" />
      </div>
    </div>
  </div>
);
