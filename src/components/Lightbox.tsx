import { useEffect, type FC } from "react";
import { BsChevronLeft, BsChevronRight, BsXLg } from "react-icons/bs";
import type { ShowImage } from "../types";

interface LightboxProps {
  images: ShowImage[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

const navButton =
  "top-1/2 absolute bg-surface-raised/80 hover:bg-accent-bg p-3 border border-border-hover hover:border-accent-border rounded-full text-text-primary transition-colors -translate-y-1/2 cursor-pointer";

const Lightbox: FC<LightboxProps> = ({ images, index, onChange, onClose }) => {
  const image = images[index];
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      className="z-50 fixed inset-0 flex justify-center items-center bg-surface-base/95 backdrop-blur-sm p-4 sm:p-12 animate-fade-in"
    >
      <img
        src={image.resolutions.original.url}
        alt=""
        onClick={(event) => event.stopPropagation()}
        className="shadow-2xl rounded-lg max-w-full max-h-full object-contain"
      />
      <button type="button" aria-label="Close" onClick={onClose} className={`${navButton} top-6 right-4 translate-y-0`}>
        <BsXLg />
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            className={`${navButton} left-4`}
          >
            <BsChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            className={`${navButton} right-4`}
          >
            <BsChevronRight />
          </button>
        </>
      )}
      <p className="bottom-4 left-1/2 absolute text-text-muted text-sm -translate-x-1/2">
        {index + 1} / {images.length} · {image.resolutions.original.width}×{image.resolutions.original.height}
      </p>
    </div>
  );
};

export default Lightbox;
