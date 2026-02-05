import { Mosque } from "@/data/mosques";
import { Heart, MapPin, Users, Star, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MosqueCardProps {
  mosque: Mosque;
  index: number;
}

export const MosqueCard = ({ mosque, index }: MosqueCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatCapacity = (capacity: number) => {
    if (capacity >= 1000000) {
      return `${(capacity / 1000000).toFixed(1)}M`;
    }
    return `${(capacity / 1000).toFixed(0)}K`;
  };

  return (
    <article
      className="scrapbook-card group"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Tape Effect */}
      <div className="tape-effect" />

      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={mosque.imageUrl}
          alt={mosque.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

        {/* Holy Site Badge */}
        {mosque.isHolySite && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Star className="w-3 h-3 mr-1" />
            Holy Site
          </Badge>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
          aria-label={isLiked ? "Remove from list" : "Add to list"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-card">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">
            {mosque.location}, {mosque.country}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
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

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {mosque.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{formatCapacity(mosque.capacity)} capacity</span>
          </div>
          <div className="text-muted-foreground">
            Est. {mosque.established}
          </div>
        </div>

        {/* Tags */}
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

        {/* CTA */}
        <Button variant="ghost" className="w-full mt-2 group/btn">
          <span>View Details</span>
          <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </article>
  );
};
