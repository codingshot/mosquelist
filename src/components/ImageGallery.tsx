import { useEffect, useCallback, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SITE_URL = typeof window !== "undefined" ? "" : "https://mosquelist.com";

function resolveUrl(url: string): string {
  if (!url?.trim()) return "";
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url}`;
}

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  /** e.g. mosque name for aria */
  title?: string;
}

const SWIPE_THRESHOLD_PX = 50;

export function ImageGallery({
  images,
  initialIndex = 0,
  open,
  onClose,
  title = "Gallery",
}: ImageGalleryProps) {
  // Track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [index, setIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Filter out failed images
  const validImages = images.map((img, i) => ({ img, originalIndex: i }))
    .filter(({ originalIndex }) => !failedImages.has(originalIndex));
  
  const count = validImages.length;
  const safeIndex = count > 0 ? Math.min(Math.max(0, index), count - 1) : 0;
  const currentImage = validImages[safeIndex];
  const currentUrl = currentImage ? resolveUrl(currentImage.img) : "";
  const hasMultiple = count > 1;

  const handleImageError = useCallback((originalIndex: number) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(originalIndex);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [hasMultiple, count]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    setIndex((i) => (i + 1) % count);
  }, [hasMultiple, count]);

  // Reset state when gallery opens
  useEffect(() => {
    if (!open) return;
    setFailedImages(new Set());
    const safeInitial = images.length > 0 ? Math.min(Math.max(0, initialIndex), images.length - 1) : 0;
    setIndex(safeInitial);
  }, [open, initialIndex, images.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goPrev, goNext]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!open) return null;

  // If all images failed, show message with close button
  if (count === 0) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} image gallery`}
      >
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-12 w-12 rounded-full text-white hover:bg-white/20 z-20"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </Button>
        <p className="text-white text-lg">No images available</p>
        <Button
          variant="outline"
          className="mt-4 text-white border-white/30 hover:bg-white/10"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image gallery`}
    >
      {/* Close button - always visible at top right with high z-index */}
      <div className="absolute top-0 right-0 z-20 p-2 sm:p-4">
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full text-white bg-black/50 hover:bg-white/20 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        {/* Click left area = prev */}
        {hasMultiple && (
          <button
            type="button"
            className="absolute left-0 top-0 bottom-0 w-1/4 max-w-[120px] z-10 flex items-center justify-start pl-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <span className="rounded-full bg-white/20 p-2 hover:bg-white/30">
              <ChevronLeft className="h-8 w-8 text-white" />
            </span>
          </button>
        )}

        {/* Center: image (click or tap center = next when multiple) */}
        <div
          className="flex-1 flex items-center justify-center min-w-0 min-h-0 p-4 pt-16"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (!hasMultiple) return;
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            if (x > width * 0.6) goNext();
            else if (x < width * 0.4) goPrev();
          }}
        >
          {currentUrl ? (
            <img
              key={currentImage?.originalIndex}
              src={currentUrl}
              alt={count > 0 ? `Gallery image ${safeIndex + 1} of ${count}` : "Gallery image"}
              className="max-h-full max-w-full w-auto h-auto object-contain select-none"
              draggable={false}
              onError={() => {
                if (currentImage) {
                  handleImageError(currentImage.originalIndex);
                }
              }}
            />
          ) : (
            <div className="text-white text-center">
              <p>Image failed to load</p>
            </div>
          )}
        </div>

        {/* Click right area = next */}
        {hasMultiple && (
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 w-1/4 max-w-[120px] z-10 flex items-center justify-end pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
            onClick={goNext}
            aria-label="Next image"
          >
            <span className="rounded-full bg-white/20 p-2 hover:bg-white/30">
              <ChevronRight className="h-8 w-8 text-white" />
            </span>
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-3 py-4 text-white">
          <span className="text-sm font-medium tabular-nums">
            {safeIndex + 1} / {count}
          </span>
          <div className="flex gap-1.5" aria-hidden>
            {validImages.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-2 rounded-full transition-all ${
                  i === safeIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1} of ${count}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}