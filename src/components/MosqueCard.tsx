import { useState } from "react";
import type { Mosque } from "@/types/mosque";
import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Star, ChevronRight, Map, Copy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getGoogleMapsUrl, getAppleMapsUrl } from "@/lib/maps";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MosqueCardProps {
  mosque: Mosque;
  index: number;
  /** "grid" = card layout; "list" = row with image inline; "compact" = dense row; "swipe" = full-width for carousel */
  view?: "grid" | "list" | "compact" | "swipe";
}

function formatCapacity(capacity: number) {
  if (capacity >= 1000000) return `${(capacity / 1000000).toFixed(1)}M`;
  return `${(capacity / 1000).toFixed(0)}K`;
}

export const MosqueCard = ({ mosque, index, view = "grid" }: MosqueCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(mosque.id);
  const [popupImageError, setPopupImageError] = useState(false);
  const isListLayout = view === "list" || view === "compact";
  const isCompact = view === "compact";
  const isSwipe = view === "swipe";

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link to={`/mosque/${mosque.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg">
          <article
            className={`scrapbook-card group block h-full ${
              isListLayout ? `flex flex-row gap-3 items-stretch ${isCompact ? "min-h-[72px]" : "gap-4"}` : ""
            } ${isSwipe ? "h-full" : ""}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {!isListLayout && !isSwipe && <div className="tape-effect" />}
            <div
              className={`relative overflow-hidden shrink-0 ${
                isCompact
                  ? "w-16 h-16 rounded-md"
                  : isListLayout
                    ? "w-28 h-28 md:w-32 md:h-32 rounded-lg"
                    : isSwipe
                      ? "h-52 sm:h-64 md:h-72"
                      : "h-48 md:h-56"
              }`}
            >
              <img
                src={mosque.imageUrl}
                alt={mosque.name}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.svg";
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
              className={`flex-1 min-w-0 flex ${
                isCompact ? "py-1.5 flex-col justify-center gap-0" : isListLayout ? "py-2 flex-row items-start gap-3" : "flex-col space-y-3 p-4"
              }`}
            >
              <div className={`min-w-0 ${isListLayout ? "flex-1 flex flex-col justify-center space-y-3" : isCompact ? "" : "space-y-3"}`}>
                <div>
                  <h3
                    className={`font-serif font-semibold text-foreground line-clamp-1 ${
                      isCompact ? "text-sm" : isListLayout ? "text-lg" : "text-xl"
                    }`}
                  >
                    {mosque.name}
                  </h3>
                  {mosque.arabicName && !isCompact && (
                    <p className="text-sm text-muted-foreground font-arabic">
                      {mosque.arabicName}
                    </p>
                  )}
                </div>
                {!isCompact && (
                  <p className={`text-sm text-muted-foreground ${isListLayout ? "line-clamp-1" : "line-clamp-2"}`}>
                    {mosque.description}
                  </p>
                )}
                <div className={`flex items-center gap-4 text-sm ${isCompact ? "gap-2 text-xs" : ""}`}>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
                    <span>{formatCapacity(mosque.capacity)} capacity</span>
                  </div>
                  <div className="text-muted-foreground">
                    Est. {mosque.established}
                  </div>
                </div>
                {!isCompact && (
                  <div className="flex flex-wrap gap-2">
                    {mosque.touristFriendly && (
                      <Badge variant="secondary" className="text-xs">
                        Tourist Friendly
                      </Badge>
                    )}
                    {mosque.womenPrayerArea && (
                      <Badge variant="secondary" className="text-xs">
                        Women's Area
                      </Badge>
                    )}
                  </div>
                )}
                <Button
                  variant="ghost"
                  className={`group/btn pointer-events-none ${
                    isCompact ? "hidden" : isListLayout ? "w-auto mt-1 -ml-2" : "w-full mt-2"
                  }`}
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
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
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="center" className="w-72 sm:w-80 p-0 overflow-hidden">
        <div className="flex">
          {mosque.imageUrl && !popupImageError && (
            <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-l-md">
              <img
                src={mosque.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setPopupImageError(true)}
              />
            </div>
          )}
          <div className="flex-1 min-w-0 p-4 space-y-2">
          <h4 className="font-serif font-semibold text-foreground">{mosque.name}</h4>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3 shrink-0" />
            {mosque.location}, {mosque.country}
          </p>
          <p className="text-xs text-muted-foreground">
            Capacity: {formatCapacity(mosque.capacity)} · Est. {mosque.established}
          </p>
          <p className="text-sm text-foreground line-clamp-2">{mosque.significance}</p>
          {(mosque.coordinates || mosque.address || mosque.location) && (() => {
            const addressStr = mosque.address
              ? `${mosque.address}, ${mosque.location}, ${mosque.country}`
              : `${mosque.name}, ${mosque.location}, ${mosque.country}`;
            const locationDisplay = mosque.address
              ? `${mosque.address}, ${mosque.location}, ${mosque.country}`
              : mosque.coordinates
                ? `${mosque.coordinates.lat}, ${mosque.coordinates.lng}`
                : `${mosque.location}, ${mosque.country}`;
            const googleUrl = getGoogleMapsUrl(mosque.coordinates ?? null, addressStr);
            const appleUrl = getAppleMapsUrl(mosque.coordinates ?? null, addressStr);
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline text-left max-w-full"
                    aria-label="Address or coordinates – copy or open in maps"
                  >
                    <Map className="h-3 w-3 shrink-0" />
                    <span className="truncate">{locationDisplay}</span>
                    <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator.clipboard.writeText(locationDisplay);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    {mosque.coordinates && !mosque.address ? "Copy coordinates" : "Copy address"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Map className="h-3.5 w-3.5 mr-2" />
                      Google Maps
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={appleUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Map className="h-3.5 w-3.5 mr-2" />
                      Apple Maps
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })()}
          <p className="text-xs text-primary font-medium">Click to open full page</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
