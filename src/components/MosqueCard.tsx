import { useState, memo, useEffect } from "react";
import type { Mosque } from "@/types/mosque";
import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import { formatEstablishmentRange } from "@/lib/timeline-utils";
import { cn } from "@/lib/utils";

interface MosqueCardProps {
  mosque: Mosque;
  index: number;
  /** "grid" = card layout; "list" = row with image inline; "compact" = dense row; "swipe" = full-width for carousel */
  view?: "grid" | "list" | "compact" | "swipe";
  /** For swipe view: full list of image URLs (main + gallery). When set, image is clickable to cycle. */
  galleryImages?: string[];
  /** For swipe view: index into galleryImages to show. */
  galleryImageIndex?: number;
  /** For swipe view: called when image is tapped (cycle to next). */
  onGalleryImageClick?: () => void;
}

function formatCapacity(capacity: number) {
  if (capacity >= 1000000) return `${(capacity / 1000000).toFixed(1)}M`;
  return `${(capacity / 1000).toFixed(0)}K`;
}

export const MosqueCard = memo(function MosqueCard({
  mosque,
  index,
  view = "grid",
  galleryImages,
  galleryImageIndex = 0,
  onGalleryImageClick,
}: MosqueCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(mosque.id);
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
  const isListLayout = view === "list" || view === "compact";
  const isCompact = view === "compact";
  const isSwipe = view === "swipe";
  const { src: mainSrc, fallbackUrl: mainFallback } = getMosqueImageSrc(mosque);
  const useGallery = isSwipe && galleryImages && galleryImages.length > 0;
  const displaySrc = useGallery
    ? galleryImages[Math.min(galleryImageIndex, galleryImages.length - 1)] ?? mainSrc
    : mainSrc;
  const hasMultipleImages = useGallery && galleryImages!.length > 1;

  useEffect(() => {
    if (useGallery) setImageState("loading");
  }, [useGallery, galleryImageIndex, displaySrc]);

  // Determine loading strategy based on position
  const isEager = index < 6;

  const articleContent = (
    <article
        className={cn(
          "scrapbook-card group block h-full transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1 hover:border-primary/30",
          isListLayout && `flex flex-row gap-3 items-stretch ${isCompact ? "min-h-[72px]" : "gap-4"}`,
          isSwipe && "h-full"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
        itemScope
        itemType="https://schema.org/Place"
      >
        {!isListLayout && !isSwipe && <div className="tape-effect" aria-hidden="true" />}
        <div
          className={cn(
            "relative shrink-0 bg-muted",
            isCompact && "w-16 h-16 rounded-md overflow-hidden",
            !isCompact && isListLayout && "w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden",
            isSwipe && "h-52 sm:h-64 md:h-72",
            !isListLayout && !isSwipe && "h-48 md:h-56"
          )}
        >
          {/* Image container with rounded top */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              !isCompact && !isListLayout && "rounded-t-2xl",
              hasMultipleImages && "cursor-pointer"
            )}
            role={hasMultipleImages ? "button" : undefined}
            tabIndex={hasMultipleImages ? 0 : undefined}
            onClick={hasMultipleImages
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGalleryImageClick?.();
                }
              : undefined}
            onKeyDown={hasMultipleImages && onGalleryImageClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onGalleryImageClick();
                  }
                }
              : undefined}
            aria-label={hasMultipleImages ? "Next image" : undefined}
          >
            {/* Blur placeholder while image loads */}
            {imageState === "loading" && (
              <div className="absolute inset-0 bg-secondary animate-pulse" />
            )}
            <img
              src={displaySrc}
              alt={mosque.name}
              loading={isEager ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => setImageState("loaded")}
              onError={(e) => {
                setMosqueImageFallback(e.currentTarget, mainFallback);
                setImageState("loaded");
              }}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                "group-hover:scale-105",
                imageState === "loaded" ? "opacity-100" : "opacity-0"
              )}
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {mosque.isHolySite && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Holy Site
            </Badge>
          )}
          {!isListLayout && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(mosque.id);
              }}
              className="absolute top-3 right-3 w-11 h-11 min-w-[44px] min-h-[44px] bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={isLiked ? "Remove from list" : "Add to list"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? "fill-primary text-primary" : "text-foreground"
                }`}
              />
            </button>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-card">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">
              {mosque.location}, {mosque.country}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "flex-1 min-w-0 flex",
            isCompact && "py-1.5 flex-col justify-center gap-0",
            !isCompact && isListLayout && "py-2 flex-row items-start gap-3",
            !isListLayout && "flex-col space-y-3 p-4"
          )}
        >
          <div className={cn("min-w-0", isListLayout && "flex-1 flex flex-col justify-center space-y-3", !isListLayout && !isCompact && "space-y-3")}>
            <div>
              <h3
                className={cn(
                  "font-serif font-semibold text-foreground line-clamp-1 transition-colors group-hover:text-primary",
                  isCompact && "text-sm",
                  !isCompact && isListLayout && "text-lg",
                  !isListLayout && "text-xl"
                )}
                itemProp="name"
              >
                {mosque.name}
              </h3>
              {mosque.arabicName && !isCompact && (
                <p className="text-sm text-muted-foreground font-arabic" lang="ar" dir="rtl">
                  {mosque.arabicName}
                </p>
              )}
            </div>
            {!isCompact && (
              <p className={cn("text-sm text-muted-foreground", isListLayout ? "line-clamp-1" : "line-clamp-2")}>
                {mosque.description}
              </p>
            )}
            <div className={cn("flex items-center gap-4 text-sm", isCompact && "gap-2 text-xs")}>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
                <span>{formatCapacity(mosque.capacity)} capacity</span>
              </div>
              <div className="text-muted-foreground">
                Est. {formatEstablishmentRange(mosque.established) || "—"}
              </div>
            </div>
            {!isCompact && (
              <div className="flex flex-wrap gap-2">
                {mosque.touristFriendly && (
                  <Badge variant="secondary" className="text-xs">
                    Non-Muslims welcome
                  </Badge>
                )}
                {mosque.womenPrayerArea && (
                  <Badge variant="secondary" className="text-xs">
                    Women&apos;s area
                  </Badge>
                )}
                {mosque.facilities && mosque.facilities.length > 0 && (() => {
                  const hasGuided = mosque.facilities.some((f) => /guided|tour/i.test(f));
                  const hasWheelchair = mosque.facilities.some((f) => /wheelchair|accessible/i.test(f));
                  return (hasGuided || hasWheelchair) ? (
                    <Badge variant="outline" className="text-xs font-normal">
                      {[hasGuided && "Guided tours", hasWheelchair && "Wheelchair access"].filter(Boolean).join(" · ")}
                    </Badge>
                  ) : null;
                })()}
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "group/btn pointer-events-none",
                isCompact && "hidden",
                isListLayout && "w-auto mt-1 -ml-2",
                !isListLayout && "w-full mt-2"
              )}
            >
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          {isListLayout && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(mosque.id);
              }}
              className="min-w-[44px] min-h-[44px] w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
              aria-label={isLiked ? "Remove from list" : "Add to list"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
          )}
        </div>
      </article>
  );

  if (isSwipe) {
    return <div className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg">{articleContent}</div>;
  }
  return (
    <Link
      to={`/mosque/${mosque.id}`}
      className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg"
      aria-label={`View details for ${mosque.name} in ${mosque.location}, ${mosque.country}`}
    >
      {articleContent}
    </Link>
  );
});
