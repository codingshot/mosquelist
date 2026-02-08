import { useState, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  /** Index for determining eager vs lazy loading (< 6 = eager) */
  index?: number;
  /** Show blur placeholder during load */
  blurPlaceholder?: boolean;
  /** Dominant color for placeholder (HSL format without hsl()) */
  placeholderColor?: string;
}

/**
 * Optimized image component with:
 * - Blur placeholder during load
 * - Skeleton animation fallback
 * - Error handling with fallback image
 * - Proper lazy loading based on index
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  containerClassName,
  loading,
  index = 0,
  blurPlaceholder = true,
  placeholderColor = "35 20% 92%", // muted color
}: OptimizedImageProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
  const [currentSrc, setCurrentSrc] = useState(src);

  // Determine loading strategy
  const effectiveLoading = loading ?? (index < 6 ? "eager" : "lazy");

  const handleLoad = () => {
    setImageState("loaded");
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageState("loading");
    } else {
      setImageState("error");
    }
  };

  return (
    <div 
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ 
        backgroundColor: `hsl(${placeholderColor})`,
      }}
    >
      {/* Skeleton/blur placeholder */}
      {imageState === "loading" && blurPlaceholder && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ 
            backgroundColor: `hsl(${placeholderColor})`,
            backdropFilter: "blur(20px)",
          }}
        />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading={effectiveLoading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          imageState === "loaded" ? "opacity-100" : "opacity-0",
          className
        )}
      />

      {/* Error state */}
      {imageState === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">Image unavailable</span>
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;
