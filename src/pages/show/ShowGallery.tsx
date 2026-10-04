import { useState, type FC } from "react";
import Lightbox from "../../components/Lightbox";
import StatusMessage from "../../components/StatusMessage";
import { groupBy } from "../../utils";
import { useShowDetails } from "./ShowLayout";

const TYPE_LABELS: Record<string, string> = {
  poster: "Posters",
  background: "Backgrounds",
  banner: "Banners",
  typography: "Logos",
};

const ShowGallery: FC = () => {
  const { images } = useShowDetails();
  const [type, setType] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return <StatusMessage title="No images yet" description="TVmaze doesn't have any artwork for this show." />;
  }

  const groups = groupBy(images, (image) => image.type ?? "other");
  const filtered = type === "all" ? images : images.filter((image) => (image.type ?? "other") === type);
  const filters = [["all", images.length] as const, ...groups.map(([t, items]) => [t, items.length] as const)];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-2">
        {filters.map(([t, count]) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-4 py-2 border rounded-full font-semibold text-sm transition-colors cursor-pointer ${
              t === type
                ? "bg-accent-bg border-accent-border text-accent-text"
                : "bg-surface border-border-hover text-text-secondary hover:bg-surface-raised"
            }`}
          >
            {t === "all" ? "All" : (TYPE_LABELS[t] ?? "Other")} <span className="opacity-60 ml-1">{count}</span>
          </button>
        ))}
      </div>

      <div className="gap-4 columns-2 sm:columns-3 lg:columns-4">
        {filtered.map((image, index) => {
          const { original, medium } = image.resolutions;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block bg-surface-raised mb-4 border border-border-base hover:border-accent-border rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand w-full overflow-hidden break-inside-avoid transition-colors cursor-zoom-in"
              style={{ aspectRatio: `${original.width} / ${original.height}` }}
            >
              <img
                src={(medium ?? original).url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox images={filtered} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
};

export default ShowGallery;
