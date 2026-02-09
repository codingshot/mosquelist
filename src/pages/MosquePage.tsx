import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getMosqueBySlug } from "@/data/mosques";
import { MosqueSEO } from "@/components/MosqueSEO";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBucketList } from "@/hooks/useBucketList";
import { MapPin, Users, Calendar, Star, Building2, ArrowLeft, Heart, Share2, ListPlus, Map, ExternalLink, Copy, ChevronDown, Images, DoorOpen, Clock, Play } from "lucide-react";
import { toast } from "sonner";
import { ShareSheet } from "@/components/ShareSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGoogleMapsUrl, getAppleMapsUrl } from "@/lib/maps";
import { getLocationDisplay } from "@/lib/locationDisplay";
import { getExploreUrl } from "@/lib/explore-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRegionForCountry } from "@/data/regions";
import { getRelatedMosques } from "@/lib/related-mosques";
import { getListsContainingMosque } from "@/data/lists";
import { getArchitectureStyleDescription } from "@/data/architecture-styles";
import { ImageGallery } from "@/components/ImageGallery";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import { getPrayerTimesUrl } from "@/lib/prayer-times";
import { formatEstablishmentRange } from "@/lib/timeline-utils";

function formatCapacity(capacity: number) {
  if (capacity >= 1_000_000) return `${(capacity / 1_000_000).toFixed(1)}M`;
  if (capacity >= 1_000) return `${(capacity / 1_000).toFixed(0)}K`;
  return String(capacity);
}

export default function MosquePage() {
  const { id } = useParams<{ id: string }>();
  const mosque = id ? getMosqueBySlug(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { bucketList, addToBucketList } = useBucketList();

  const galleryImages = useMemo(() => {
    const mainSrc = mosque?.imageLocal?.trim() || mosque?.imageUrl?.trim();
    if (!mainSrc) return [];
    const main = mainSrc;
    const extras = (mosque?.galleryUrls ?? []).filter((u) => typeof u === "string" && u.trim().length > 0);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of [main, ...extras]) {
      const url = u.trim();
      if (!seen.has(url)) {
        seen.add(url);
        out.push(url);
      }
    }
    return out;
  }, [mosque]);
  const hasGallery = galleryImages.length > 1;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const openGallery = useCallback((startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setGalleryOpen(true);
  }, []);
  const closeGallery = useCallback(() => setGalleryOpen(false), []);
  const [failedThumbs, setFailedThumbs] = useState<Set<number>>(new Set());
  const relatedMosques = useMemo(
    () => (mosque ? getRelatedMosques(mosque, 6) : []),
    [mosque]
  );
  const listsContainingMosque = useMemo(
    () => (mosque ? getListsContainingMosque(mosque.id) : []),
    [mosque]
  );

  if (!mosque) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">Mosque not found</h1>
          <p className="mt-2 text-muted-foreground">The mosque you're looking for doesn't exist.</p>
          <Button asChild className="mt-6">
            <Link to="/explore">Back to Explore</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isLiked = isFavorite(mosque.id);
  const isInBucketList = bucketList.some((item) => item.mosqueId === mosque.id);
  const heroImageSrc = getMosqueImageSrc(mosque);

  const address = mosque.address
    ? `${mosque.address}, ${mosque.location}, ${mosque.country}`
    : `${mosque.name}, ${mosque.location}, ${mosque.country}`;
  const googleMapsUrl = getGoogleMapsUrl(mosque.coordinates ?? null, address);
  const appleMapsUrl = getAppleMapsUrl(mosque.coordinates ?? null, address);
  const locationDisplay = getLocationDisplay(mosque);

  return (
    <div className="min-h-screen bg-background">
      <MosqueSEO mosque={mosque} />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pb-12 md:pb-16 pt-20 md:pt-24">
        <div className="print:hidden mb-6 flex flex-wrap items-center gap-2 min-w-0">
          <Button variant="ghost" asChild className="-ml-2 gap-2 min-h-[44px] touch-manipulation">
            <Link to="/explore">
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 min-h-[44px] touch-manipulation"
            onClick={() => setShareOpen(true)}
            aria-label="Share mosque"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <ShareSheet
            open={shareOpen}
            onOpenChange={setShareOpen}
            path={`/mosque/${mosque.id}`}
            title={`${mosque.name} – MosqueList`}
            shareMessage={`Discover ${mosque.name} in ${mosque.location}, ${mosque.country}. Explore on MosqueList.`}
            context="mosque"
          />
          {isInBucketList ? (
            <Button variant="secondary" size="sm" className="gap-2 min-h-[44px] touch-manipulation" asChild>
              <Link to="/bucket-list">In your bucket list</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2 min-h-[44px] touch-manipulation"
              onClick={() => {
                const added = addToBucketList(mosque.id);
                if (added) toast.success(`Added ${mosque.name} to your list`);
                else toast.info("Already in your list");
              }}
              aria-label="Add to bucket list"
            >
              <ListPlus className="h-4 w-4" />
              Add to bucket list
            </Button>
          )}
        </div>

        <article className="max-w-4xl">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card mosque-card-shadow">
            <div
              className="relative h-56 sm:h-72 md:h-80 cursor-default"
              onDoubleClick={hasGallery ? () => openGallery(activeImageIndex) : undefined}
              role={hasGallery ? "button" : undefined}
              tabIndex={hasGallery ? 0 : undefined}
              onKeyDown={
                hasGallery
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openGallery(activeImageIndex);
                      }
                    }
                  : undefined
              }
              aria-label={hasGallery ? "Double-click or press Enter to open image gallery" : undefined}
            >
              <img
                src={galleryImages[activeImageIndex] || heroImageSrc.src}
                alt={mosque.name}
                loading="eager"
                decoding="async"
                // @ts-expect-error fetchpriority is valid HTML; React types use fetchPriority
                fetchpriority="high"
                className="h-full w-full object-cover pointer-events-none select-none"
                draggable={false}
                onError={(e) => {
                  setMosqueImageFallback(e.currentTarget, heroImageSrc.fallbackUrl);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              {hasGallery && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="print:hidden absolute top-4 left-4 gap-1.5 bg-card/90 backdrop-blur-sm hover:bg-card min-h-[44px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGallery();
                  }}
                  aria-label={`Open gallery (${galleryImages.length} images)`}
                >
                  <Images className="h-4 w-4" />
                  Gallery ({galleryImages.length})
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="print:hidden absolute top-4 right-4 h-11 w-11 min-h-[44px] min-w-[44px] rounded-full bg-card/90 backdrop-blur-sm hover:bg-card touch-manipulation"
                onClick={() => toggleFavorite(mosque.id)}
                aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`}
                />
              </Button>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                {mosque.isHolySite && (
                  <Badge className="bg-primary text-primary-foreground" asChild>
                    <Link
                      to={getExploreUrl({ filter: "holy" })}
                      className="hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md"
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Holy Site
                    </Link>
                  </Badge>
                )}
                {mosque.touristFriendly && (
                  <Badge variant="secondary" asChild>
                    <Link
                      to={getExploreUrl({ tourist: true })}
                      className="hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                    >
                      Non-Muslims welcome
                    </Link>
                  </Badge>
                )}
                {mosque.womenPrayerArea && (
                  <Badge variant="secondary" asChild>
                    <Link
                      to={getExploreUrl({ women: true })}
                      className="hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                    >
                      Women&apos;s Prayer Area
                    </Link>
                  </Badge>
                )}
                {mosque.denomination && (
                  <Badge variant="secondary" asChild>
                    <Link
                      to={getExploreUrl({ denomination: mosque.denomination })}
                      className="hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                    >
                      {mosque.denomination === "sunni" ? "Sunni" : "Shia"}
                    </Link>
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail strip for gallery preview */}
            {hasGallery && (
              <div className="px-4 py-3 bg-muted/50 border-t border-border">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {galleryImages.map((img, idx) => {
                    if (failedThumbs.has(idx)) return null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        onDoubleClick={() => openGallery(idx)}
                        className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          idx === activeImageIndex
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`View image ${idx + 1} of ${galleryImages.length}`}
                        aria-pressed={idx === activeImageIndex}
                      >
                        <img
                          src={img}
                          alt={`${mosque.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={() => {
                            setFailedThumbs(prev => new Set(prev).add(idx));
                          }}
                        />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Open full gallery"
                  >
                    <Images className="h-5 w-5" />
                    <span className="text-xs font-medium">All</span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {mosque.name}
              </h1>
              {mosque.arabicName && (
                <p className="mt-1 text-lg text-muted-foreground font-arabic">{mosque.arabicName}</p>
              )}
              {mosque.denomination && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Predominant tradition:{" "}
                  <Link
                    to={getExploreUrl({ denomination: mosque.denomination })}
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    {mosque.denomination === "sunni" ? "Sunni" : "Shia"}
                  </Link>
                  {" "}
                  (fact-checked; many mosques welcome all Muslims).
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {mosque.location},{" "}
                  <Link
                    to={getExploreUrl({ country: mosque.country })}
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    {mosque.country}
                  </Link>
                  {(() => {
                    const region = getRegionForCountry(mosque.country);
                    if (!region) return null;
                    return (
                      <>
                        <span className="text-muted-foreground/60">·</span>
                        <Link
                          to={getExploreUrl({ region })}
                          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                        >
                          {region}
                        </Link>
                      </>
                    );
                  })()}
                </span>
                {mosque.architecturalStyle && (
                  <Link
                    to={getExploreUrl({ style: mosque.architecturalStyle })}
                    title={getArchitectureStyleDescription(mosque.architecturalStyle) ?? undefined}
                    className="inline-flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded min-h-[44px] touch-manipulation"
                  >
                    <Building2 className="h-4 w-4 shrink-0" />
                    {mosque.architecturalStyle}
                  </Link>
                )}
              </div>
              <div className="print:hidden mt-3 flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded text-left max-w-full min-h-[44px] touch-manipulation"
                      aria-label="Address or coordinates – copy or open in maps"
                    >
                      <Map className="h-4 w-4 shrink-0" />
                      <span className="truncate">{locationDisplay}</span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem
                      onClick={async () => {
                        await navigator.clipboard.writeText(locationDisplay);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {mosque.coordinates && !mosque.address ? "Copy coordinates" : "Copy address"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Map className="h-4 w-4 mr-2" />
                        Open in Google Maps
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Map className="h-4 w-4 mr-2" />
                        Open in Apple Maps
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {mosque.officialWebsite && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <a
                      href={mosque.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      aria-label="Official website (opens in new tab)"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Official site
                    </a>
                  </>
                )}
                {(() => {
                  const prayerUrl = getPrayerTimesUrl(mosque.coordinates, mosque.location, mosque.country);
                  if (!prayerUrl) return null;
                  return (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <a
                        href={prayerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                        aria-label="Prayer times for this location (opens in new tab)"
                      >
                        <Clock className="h-4 w-4" />
                        Prayer times
                      </a>
                    </>
                  );
                })()}
              </div>

              <p className="mt-6 text-lg leading-relaxed text-foreground">{mosque.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">{formatCapacity(mosque.capacity)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="font-semibold">{formatEstablishmentRange(mosque.established) || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
                <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  Visitor access &amp; facilities
                </h2>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Non-Muslims can visit</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {mosque.touristFriendly ? (
                        <Link to={getExploreUrl({ tourist: true })} className="text-primary hover:underline">
                          Yes — open to visitors
                        </Link>
                      ) : (
                        "Restricted (Muslim worshippers only)"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Women&apos;s prayer area</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {mosque.womenPrayerArea ? (
                        <Link to={getExploreUrl({ women: true })} className="text-primary hover:underline">
                          Yes
                        </Link>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </dl>
                {mosque.facilities && mosque.facilities.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <dt className="text-sm text-muted-foreground mb-2">Facilities</dt>
                    <ul className="flex flex-wrap gap-2">
                      {mosque.facilities.map((f) => (
                        <li key={f}>
                          <Badge variant="outline" className="font-normal" asChild>
                            <Link
                              to={getExploreUrl({ q: f })}
                              className="hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                            >
                              {f}
                            </Link>
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Annual visitors:</span>{" "}
                {mosque.annualVisitors}
              </p>
              {mosque.area > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Area:</span>{" "}
                  {mosque.area.toLocaleString()} m²
                </p>
              )}

              <div className="mt-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">Significance</h2>
                <p className="mt-2 text-muted-foreground">{mosque.significance}</p>
              </div>

              {mosque.history && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">History</h2>
                  <p className="mt-2 text-muted-foreground">{mosque.history}</p>
                </div>
              )}

              {mosque.architectureNotes && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Architecture</h2>
                  <p className="mt-2 text-muted-foreground">{mosque.architectureNotes}</p>
                </div>
              )}

              {mosque.tourismNotes && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Visitor information</h2>
                  <p className="mt-2 text-muted-foreground">{mosque.tourismNotes}</p>
                </div>
              )}

              {mosque.youtubeVideoId && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Video Tour
                  </h2>
                  <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30">
                    <iframe
                      src={`https://www.youtube.com/embed/${mosque.youtubeVideoId}?rel=0`}
                      title={`${mosque.name} video tour`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Video sourced from YouTube. Content belongs to original creators.
                  </p>
                </div>
              )}

              {mosque.sources && mosque.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h2 className="font-serif text-lg font-semibold text-foreground">Sources</h2>
                  <ul className="mt-2 space-y-1">
                    {mosque.sources.map((source, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                        >
                          {source.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedMosques.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Related mosques
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Similar by location, style, or size
                  </p>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedMosques.map((related) => (
                      <li key={related.id}>
                        <Link
                          to={`/mosque/${related.id}`}
                          className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-xl"
                        >
                          {(() => {
                            const img = getMosqueImageSrc(related);
                            return (
                              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                                <img
                                  src={img.src}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    setMosqueImageFallback(e.currentTarget, img.fallbackUrl);
                                  }}
                                />
                              </div>
                            );
                          })()}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate group-hover:text-primary">
                              {related.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {related.location}, {related.country}
                            </p>
                            {related.isHolySite && (
                              <span className="mt-1 inline-flex items-center gap-0.5 text-xs text-primary">
                                <Star className="h-3 w-3" />
                                Holy site
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {listsContainingMosque.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Lists containing this mosque
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Curated collections that include {mosque.name}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {listsContainingMosque.map((list) => (
                      <li key={list.slug}>
                        <Link
                          to={`/lists/${list.slug}`}
                          className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-lg"
                        >
                          {list.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </article>

        {hasGallery && (
          <ImageGallery
            images={galleryImages}
            initialIndex={galleryStartIndex}
            open={galleryOpen}
            onClose={closeGallery}
            title={mosque.name}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
