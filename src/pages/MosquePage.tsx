import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { getMosqueBySlug } from "@/data/mosques";
import { MosqueSEO } from "@/components/MosqueSEO";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBucketList } from "@/hooks/useBucketList";
import { MapPin, Users, Calendar, Star, Building2, ArrowLeft, Heart, Share2, ListPlus, Map, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGoogleMapsUrl, getAppleMapsUrl } from "@/lib/maps";
import { getExploreUrl } from "@/lib/explore-url";

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
  const address = `${mosque.name}, ${mosque.location}, ${mosque.country}`;
  const googleMapsUrl = getGoogleMapsUrl(mosque.coordinates ?? null, address);
  const appleMapsUrl = getAppleMapsUrl(mosque.coordinates ?? null, address);

  return (
    <div className="min-h-screen bg-background">
      <MosqueSEO mosque={mosque} />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pb-16 pt-24">
        <div className="print:hidden mb-6 flex flex-wrap items-center gap-2">
          <Button variant="ghost" asChild className="-ml-2 gap-2">
            <Link to="/explore">
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={async () => {
              const url = window.location.origin + "/mosque/" + mosque.id;
              const title = `${mosque.name} – MosqueList`;
              const text = `Discover ${mosque.name} in ${mosque.location}, ${mosque.country}`;
              if (typeof navigator.share === "function") {
                try {
                  await navigator.share({
                    title,
                    text,
                    url,
                  });
                  toast.success("Shared successfully");
                } catch (err) {
                  if ((err as Error).name !== "AbortError") {
                    await navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard");
                  }
                }
              } else {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard");
              }
            }}
            aria-label="Share mosque"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          {isInBucketList ? (
            <Button variant="secondary" size="sm" className="gap-2" asChild>
              <Link to="/bucket-list">In your bucket list</Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => {
                addToBucketList(mosque.id);
                toast.success(`Added ${mosque.name} to your bucket list`);
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
            <div className="relative h-56 sm:h-72 md:h-80">
              <img
                src={mosque.imageUrl}
                alt={mosque.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="print:hidden absolute top-4 right-4 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card"
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
                      Tourist Friendly
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
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {mosque.name}
              </h1>
              {mosque.arabicName && (
                <p className="mt-1 text-lg text-muted-foreground font-arabic">{mosque.arabicName}</p>
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
                </span>
                {mosque.architecturalStyle && (
                  <Link
                    to={getExploreUrl({ style: mosque.architecturalStyle })}
                    className="flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    <Building2 className="h-4 w-4 shrink-0" />
                    {mosque.architecturalStyle}
                  </Link>
                )}
              </div>
              <div className="print:hidden mt-3 flex flex-wrap gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                  aria-label="Open in Google Maps"
                >
                  <Map className="h-4 w-4" />
                  Google Maps
                </a>
                <span className="text-muted-foreground">·</span>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                  aria-label="Open in Apple Maps"
                >
                  <Map className="h-4 w-4" />
                  Apple Maps
                </a>
                {mosque.officialWebsite && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <a
                      href={mosque.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      aria-label="Official website"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Official site
                    </a>
                  </>
                )}
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
                    <p className="font-semibold">{mosque.established}</p>
                  </div>
                </div>
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

              {mosque.facilities && mosque.facilities.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Facilities</h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
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
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
