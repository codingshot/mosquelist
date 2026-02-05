import type { Mosque } from "@/types/mosque";
import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MosqueCardProps {
  mosque: Mosque;
  index: number;
}

function formatCapacity(capacity: number) {
  if (capacity >= 1000000) return `${(capacity / 1000000).toFixed(1)}M`;
  return `${(capacity / 1000).toFixed(0)}K`;
}

export const MosqueCard = ({ mosque, index }: MosqueCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(mosque.id);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link to={`/mosque/${mosque.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg">
          <article
            className="scrapbook-card group block h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="tape-effect" />
            <div className="relative h-48 md:h-56 overflow-hidden">
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
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-card">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">
                  {mosque.location}, {mosque.country}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-1">
                  {mosque.name}
                </h3>
                {mosque.arabicName && (
                  <p className="text-sm text-muted-foreground font-arabic">
                    {mosque.arabicName}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mosque.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{formatCapacity(mosque.capacity)} capacity</span>
                </div>
                <div className="text-muted-foreground">
                  Est. {mosque.established}
                </div>
              </div>
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
              <Button variant="ghost" className="w-full mt-2 group/btn pointer-events-none">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </article>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="center" className="w-72 sm:w-80">
        <div className="space-y-2">
          <h4 className="font-serif font-semibold text-foreground">{mosque.name}</h4>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3 shrink-0" />
            {mosque.location}, {mosque.country}
          </p>
          <p className="text-xs text-muted-foreground">
            Capacity: {formatCapacity(mosque.capacity)} · Est. {mosque.established}
          </p>
          <p className="text-sm text-foreground line-clamp-2">{mosque.significance}</p>
          <p className="text-xs text-primary font-medium">Click to open full page</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
