import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Mosque } from "@/types/mosque";
import { MosqueCard } from "./MosqueCard";
import { getMosqueImageSrc } from "@/lib/mosque-image";
import { Button } from "./ui/button";
import { Heart, ChevronLeft, X } from "lucide-react";

const SWIPE_THRESHOLD = 80;
const SNAP_BACK_DURATION_MS = 220;
const LIKE_COLOR = "rgba(34, 197, 94, 0.85)";
const SKIP_COLOR = "rgba(148, 163, 184, 0.85)";

function hapticLight() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  } catch {
    // ignore
  }
}

/** Stronger haptic for swipe commit (like/skip) - works on supported mobile devices */
function hapticSwipe() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 50, 15]);
    }
  } catch {
    // ignore
  }
}

interface SwipeDeckProps {
  mosques: Mosque[];
  onLike: (mosque: Mosque) => void;
  isFavorite: (id: string) => boolean;
}

export function SwipeDeck({ mosques, onLike, isFavorite }: SwipeDeckProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isSnappingBack, setIsSnappingBack] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const justSwipedRef = useRef(false);
  const hasCommittedThisGestureRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const snapBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentMosque = mosques[index];
  const hasPrev = index > 0;
  const hasNext = index < mosques.length - 1;

  const galleryImages = useMemo(() => {
    if (!currentMosque) return [];
    const { src } = getMosqueImageSrc(currentMosque);
    const extras = (currentMosque.galleryUrls ?? []).filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of [src, ...extras]) {
      const url = u.trim();
      if (!seen.has(url)) {
        seen.add(url);
        out.push(url);
      }
    }
    return out;
  }, [currentMosque]);

  useEffect(() => {
    setGalleryImageIndex(0);
  }, [index]);

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    hapticLight();
    setIndex((i) => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    hapticLight();
    setIndex((i) => i + 1);
  }, [hasNext]);

  const handleLike = useCallback(() => {
    if (!currentMosque) return;
    hapticLight();
    onLike(currentMosque);
    if (hasNext) setIndex((i) => i + 1);
  }, [currentMosque, onLike, hasNext]);

  const handleSkip = useCallback(() => {
    if (!hasNext) return;
    hapticLight();
    setIndex((i) => i + 1);
  }, [hasNext]);

  const cycleGalleryImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    hapticLight();
    setGalleryImageIndex((i) => (i + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handleCardTap = useCallback(() => {
    if (hasDraggedRef.current || justSwipedRef.current || !currentMosque) return;
    navigate(`/mosque/${currentMosque.id}`);
  }, [currentMosque, navigate]);

  const triggerSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentMosque || hasCommittedThisGestureRef.current) return;
      hasCommittedThisGestureRef.current = true;
      justSwipedRef.current = true;
      hapticSwipe();
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 450);
      setIsExiting(true);
      const w = containerRef.current?.offsetWidth ?? 400;
      setDragX(direction === "right" ? w : -w);
      setTimeout(() => {
        if (direction === "right") onLike(currentMosque);
        setIndex((i) => (i < mosques.length - 1 ? i + 1 : i));
        setDragX(0);
        setIsExiting(false);
        hasCommittedThisGestureRef.current = false;
        pointerIdRef.current = null;
      }, 280);
    },
    [currentMosque, onLike, mosques.length],
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isExiting || isSnappingBack) return;
    if (snapBackTimeoutRef.current) {
      clearTimeout(snapBackTimeoutRef.current);
      snapBackTimeoutRef.current = null;
    }
    hasCommittedThisGestureRef.current = false;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    pointerIdRef.current = e.pointerId;
    e.preventDefault();
    const el = cardRef.current;
    if (el) {
      el.setPointerCapture(e.pointerId);
    }
  }, [isExiting, isSnappingBack]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isExiting || isSnappingBack) return;
      if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 5) {
        hasDraggedRef.current = true;
        e.preventDefault();
      }
      setDragX(dx);
    },
    [isExiting, isSnappingBack],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const el = cardRef.current;
      if (el && typeof el.releasePointerCapture === "function") {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // ignore if already released
        }
      }
      pointerIdRef.current = null;
      if (isExiting || hasCommittedThisGestureRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (dx > SWIPE_THRESHOLD) {
        triggerSwipe("right");
      } else if (dx < -SWIPE_THRESHOLD) {
        triggerSwipe("left");
      } else {
        if (hasDraggedRef.current) {
          justSwipedRef.current = true;
          setTimeout(() => { justSwipedRef.current = false; }, 400);
          setIsSnappingBack(true);
          setDragX(0);
          snapBackTimeoutRef.current = setTimeout(() => {
            setIsSnappingBack(false);
            snapBackTimeoutRef.current = null;
          }, SNAP_BACK_DURATION_MS);
        } else {
          setDragX(0);
        }
      }
    },
    [isExiting, triggerSwipe],
  );

  /** Only snap back on leave when not dragging (no pointer capture). Prevents double-fire on touch. */
  const handlePointerLeave = useCallback(() => {
    if (isExiting || hasCommittedThisGestureRef.current || pointerIdRef.current !== null) return;
    setDragX(0);
  }, [isExiting]);

  useEffect(() => {
    return () => {
      if (snapBackTimeoutRef.current) clearTimeout(snapBackTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (!currentMosque) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSkip();
      } else if (e.key === "l" || e.key === "L" || e.key === " ") {
        e.preventDefault();
        handleLike();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentMosque, goPrev, handleSkip, handleLike]);

  if (mosques.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        No mosques to swipe. Try adjusting your filters.
      </div>
    );
  }

  const likeOpacity = dragX > 0 ? Math.min(1, dragX / SWIPE_THRESHOLD) : 0;
  const skipOpacity = dragX < 0 ? Math.min(1, -dragX / SWIPE_THRESHOLD) : 0;
  const rotation = Math.min(15, Math.max(-15, (dragX / 20)));

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto px-2 sm:px-4">
      <p className="text-center text-sm text-muted-foreground mb-3">
        Tap card to open · Drag or swipe right to like, left to skip · ← → arrows · L or Space to like
      </p>

      <div
        className="relative min-h-[420px] rounded-xl overflow-hidden touch-none select-none"
        style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
      >
        <div
          ref={cardRef}
          className="absolute inset-0 cursor-grab select-none"
          style={{
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            transition: isExiting
              ? "transform 0.28s ease-out"
              : isSnappingBack
                ? `transform ${SNAP_BACK_DURATION_MS}ms ease-out`
                : "none",
            touchAction: "none",
            cursor: Math.abs(dragX) > 2 ? "grabbing" : "grab",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={() => {
            pointerIdRef.current = null;
            hasCommittedThisGestureRef.current = false;
            if (snapBackTimeoutRef.current) {
              clearTimeout(snapBackTimeoutRef.current);
              snapBackTimeoutRef.current = null;
            }
            setIsSnappingBack(false);
            setDragX(0);
          }}
          onClick={(e) => {
            if (justSwipedRef.current || hasCommittedThisGestureRef.current) return;
            if (!hasDraggedRef.current && currentMosque) {
              e.preventDefault();
              e.stopPropagation();
              handleCardTap();
            }
          }}
          onClickCapture={(e) => {
            if (justSwipedRef.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div
            className="h-full w-full rounded-xl overflow-hidden shadow-lg"
            style={{
              pointerEvents: Math.abs(dragX) > 5 || isExiting ? "none" : "auto",
              willChange: isExiting ? "transform" : undefined,
            }}
          >
            {/* Like stripe (right) */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-end pr-6 pointer-events-none rounded-xl"
              style={{
                opacity: likeOpacity,
                backgroundColor: LIKE_COLOR,
              }}
              aria-hidden
            >
              <span className="text-4xl font-bold text-white uppercase tracking-wider rotate-12">
                Like
              </span>
            </div>
            {/* Skip stripe (left) */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-start pl-6 pointer-events-none rounded-xl"
              style={{
                opacity: skipOpacity,
                backgroundColor: SKIP_COLOR,
              }}
              aria-hidden
            >
              <span className="text-4xl font-bold text-white uppercase tracking-wider -rotate-12">
                Skip
              </span>
            </div>
            <div className="h-full">
              <MosqueCard
                mosque={currentMosque}
                index={0}
                view="swipe"
                galleryImages={galleryImages}
                galleryImageIndex={galleryImageIndex}
                onGalleryImageClick={galleryImages.length > 1 ? cycleGalleryImage : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <p className="text-center text-sm text-muted-foreground mt-2">
        {index + 1} of {mosques.length}
      </p>

      {/* Controls - mobile friendly 44px+ touch targets */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 pb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 min-h-[44px] min-w-[44px] rounded-full shrink-0 touch-manipulation"
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous mosque"
        >
          <ChevronLeft className="h-7 w-7" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 min-h-[56px] min-w-[56px] rounded-full shrink-0 touch-manipulation border-2 border-slate-300 hover:border-slate-400"
          onClick={handleSkip}
          disabled={!hasNext}
          aria-label="Skip mosque"
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          size="icon"
          className="h-16 w-16 min-h-[56px] min-w-[56px] rounded-full shrink-0 touch-manipulation gradient-gold text-primary-foreground hover:opacity-90"
          onClick={handleLike}
          aria-label="Like mosque (add to favorites)"
        >
          <Heart className={`h-8 w-8 ${isFavorite(currentMosque.id) ? "fill-current" : ""}`} />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2">
        Keyboard: ← previous · → skip · L or Space like
      </p>
    </div>
  );
}
