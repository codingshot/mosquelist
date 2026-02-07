import { useState, useRef, useCallback, useEffect } from "react";
import type { Mosque } from "@/types/mosque";
import { MosqueCard } from "./MosqueCard";
import { Button } from "./ui/button";
import { Heart, ChevronLeft, X } from "lucide-react";

const SWIPE_THRESHOLD = 80;
const LIKE_COLOR = "rgba(34, 197, 94, 0.85)";
const SKIP_COLOR = "rgba(148, 163, 184, 0.85)";

interface SwipeDeckProps {
  mosques: Mosque[];
  onLike: (mosque: Mosque) => void;
  isFavorite: (id: string) => boolean;
}

export function SwipeDeck({ mosques, onLike, isFavorite }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const justSwipedRef = useRef(false);
  const hasCommittedThisGestureRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const currentMosque = mosques[index];
  const hasPrev = index > 0;
  const hasNext = index < mosques.length - 1;

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    setIndex((i) => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    setIndex((i) => i + 1);
  }, [hasNext]);

  const handleLike = useCallback(() => {
    if (!currentMosque) return;
    onLike(currentMosque);
    if (hasNext) setIndex((i) => i + 1);
  }, [currentMosque, onLike, hasNext]);

  const handleSkip = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1);
  }, [hasNext]);

  const triggerSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentMosque || hasCommittedThisGestureRef.current) return;
      hasCommittedThisGestureRef.current = true;
      justSwipedRef.current = true;
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
      }, 280);
    },
    [currentMosque, onLike, mosques.length],
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isExiting) return;
    hasCommittedThisGestureRef.current = false;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    e.preventDefault();
    cardRef.current?.setPointerCapture(e.pointerId);
  }, [isExiting]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isExiting) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 5) hasDraggedRef.current = true;
      setDragX(dx);
    },
    [isExiting],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      cardRef.current?.releasePointerCapture?.(e.pointerId);
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
        }
        setDragX(0);
      }
    },
    [isExiting, triggerSwipe],
  );

  /** Only snap back on leave; never commit swipe here. Prevents double-fire on touch (leave can fire after up). */
  const handlePointerLeave = useCallback(() => {
    if (isExiting || hasCommittedThisGestureRef.current) return;
    setDragX(0);
  }, [isExiting]);

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
        Swipe right to like, left to skip · ← → arrows · L or Space to like
      </p>

      <div className="relative min-h-[420px] rounded-xl overflow-hidden touch-none" style={{ touchAction: "none" }}>
        <div
          ref={cardRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            transition: isExiting ? "transform 0.28s ease-out" : "none",
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={() => {
            setDragX(0);
            hasCommittedThisGestureRef.current = false;
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
            style={{ pointerEvents: Math.abs(dragX) > 5 || isExiting ? "none" : "auto" }}
          >
            {/* Like stripe (right) */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-end pr-6 pointer-events-none rounded-xl border-4 border-green-500"
              style={{
                opacity: likeOpacity,
                backgroundColor: LIKE_COLOR,
              }}
            >
              <span className="text-4xl font-bold text-white uppercase tracking-wider rotate-12">
                Like
              </span>
            </div>
            {/* Skip stripe (left) */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-start pl-6 pointer-events-none rounded-xl border-4 border-slate-400"
              style={{
                opacity: skipOpacity,
                backgroundColor: SKIP_COLOR,
              }}
            >
              <span className="text-4xl font-bold text-white uppercase tracking-wider -rotate-12">
                Skip
              </span>
            </div>
            <div className="h-full">
              <MosqueCard mosque={currentMosque} index={0} view="swipe" />
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
