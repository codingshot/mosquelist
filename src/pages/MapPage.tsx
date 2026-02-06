import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { mosques } from "@/data/mosques";
import { getUniqueCountries } from "@/data/mosques";
import { getRegionForCountry, REGIONS } from "@/data/regions";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, ArrowLeft, Users, Star } from "lucide-react";
import type { Mosque } from "@/types/mosque";

import "leaflet/dist/leaflet.css";

function formatCapacity(capacity: number) {
  if (capacity >= 1_000_000) return `${(capacity / 1_000_000).toFixed(1)}M`;
  if (capacity >= 1_000) return `${(capacity / 1_000).toFixed(0)}K`;
  return String(capacity);
}

/** Hover card content for a mosque (used in map tooltip and list cards) */
function MosqueMapCardContent({ mosque, compact = false }: { mosque: Mosque; compact?: boolean }) {
  const imgSrc = mosque.imageUrl?.trim() || "/placeholder.svg";
  return (
    <div className={compact ? "flex gap-3" : "space-y-2"}>
      {!compact && (
        <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted">
          <img
            src={imgSrc}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
      <div className={compact ? "min-w-0 flex-1" : ""}>
        <p className="font-semibold text-foreground leading-tight">{mosque.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mosque.location}, {mosque.country}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <Users className="h-3 w-3 inline mr-0.5" />
          {formatCapacity(mosque.capacity)} · {mosque.established}
        </p>
        {mosque.isHolySite && (
          <span className="inline-flex items-center gap-0.5 text-xs text-primary mt-1">
            <Star className="h-3 w-3" />
            Holy site
          </span>
        )}
      </div>
      {compact && (
        <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
    </div>
  );
}

const DEFAULT_CENTER: [number, number] = [20, 40];
const DEFAULT_ZOOM = 2;

function fixLeafletIcon() {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

function MapFlyTo({
  bounds,
  center,
  zoom,
}: {
  bounds: LatLngBoundsExpression | null;
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { maxZoom: 14, padding: [40, 40] });
    } else {
      map.setView(center, zoom);
    }
  }, [map, bounds, center, zoom]);
  return null;
}

export default function MapPage() {
  const [country, setCountry] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => REGIONS.filter((r) => mosques.some((m) => getRegionForCountry(m.country) === r)), []);

  const mosquesWithCoords = useMemo(
    () => mosques.filter((m): m is typeof m & { coordinates: { lat: number; lng: number } } => !!m.coordinates),
    [],
  );

  const filteredMosques = useMemo(() => {
    let list = mosquesWithCoords;
    if (region) {
      list = list.filter((m) => getRegionForCountry(m.country) === region);
    }
    if (country) {
      list = list.filter((m) => m.country === country);
    }
    return list;
  }, [mosquesWithCoords, country, region]);

  const boundsOrNull = useMemo((): LatLngBoundsExpression | null => {
    if (!country && !region) return null;
    if (filteredMosques.length === 0) return null;
    if (filteredMosques.length === 1) {
      const m = filteredMosques[0];
      return [[m.coordinates.lat, m.coordinates.lng], [m.coordinates.lat, m.coordinates.lng]] as LatLngBoundsExpression;
    }
    const lats = filteredMosques.map((m) => m.coordinates.lat);
    const lngs = filteredMosques.map((m) => m.coordinates.lng);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ] as LatLngBoundsExpression;
  }, [country, region, filteredMosques]);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Map - MosqueList | Explore Mosques Worldwide"
        description="Explore mosques on an interactive map. Filter by country and region. OpenStreetMap."
        path="/map"
      />
      <Navigation />
      <main id="main-content" className="pt-16">
        <section className="py-8 md:py-12 bg-paper-cream islamic-pattern">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="-ml-2 mb-4 gap-2">
              <Link to="/explore">
                <ArrowLeft className="h-4 w-4" />
                Back to Explore
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
              <div className="min-w-0">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Mosque Map
                </h1>
                <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                  {filteredMosques.length} mosque{filteredMosques.length !== 1 ? "s" : ""} with locations
                  {mosquesWithCoords.length < mosques.length &&
                    ` (${mosques.length - mosquesWithCoords.length} without coordinates)`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
                <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full sm:w-[180px] min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full sm:w-[180px] min-h-[44px] touch-manipulation">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All countries</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg min-h-[400px] sm:min-h-[500px] h-[50vh] sm:h-[60vh] max-h-[800px] touch-none sm:touch-auto">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapFlyTo
                  bounds={boundsOrNull}
                  center={DEFAULT_CENTER}
                  zoom={DEFAULT_ZOOM}
                />
                {filteredMosques.map((mosque) => (
                  <Marker
                    key={mosque.id}
                    position={[mosque.coordinates.lat, mosque.coordinates.lng]}
                  >
                    <Tooltip
                      permanent={false}
                      direction="top"
                      offset={[0, -8]}
                      opacity={0.98}
                      className="map-marker-tooltip !border-border !bg-card !text-card-foreground !shadow-lg !rounded-lg !p-0 !max-w-[240px]"
                    >
                      <div className="p-2" style={{ width: 220 }}>
                        <MosqueMapCardContent mosque={mosque} />
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="min-w-[200px]">
                        <p className="font-semibold text-foreground">{mosque.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {mosque.location}, {mosque.country}
                        </p>
                        <Button size="sm" className="mt-2 w-full" asChild>
                          <Link to={`/mosque/${mosque.id}`}>
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            View mosque
                          </Link>
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Cards for all mosques currently shown on the map */}
            {filteredMosques.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  Mosques on this map ({filteredMosques.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMosques.map((mosque) => (
                    <Link
                      key={mosque.id}
                      to={`/mosque/${mosque.id}`}
                      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-xl"
                    >
                      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg group-hover:border-primary/30">
                        <CardContent className="p-0">
                          <div className="relative h-36 overflow-hidden bg-muted">
                            <img
                              src={mosque.imageUrl?.trim() || "/placeholder.svg"}
                              alt=""
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                              {mosque.isHolySite && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                                  <Star className="h-3 w-3" />
                                  Holy site
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-semibold text-foreground truncate group-hover:text-primary">
                              {mosque.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {mosque.location}, {mosque.country}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <Users className="h-3 w-3 inline mr-0.5" />
                              {formatCapacity(mosque.capacity)} · {mosque.established}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="py-2 px-3 border-t border-border">
                          <span className="text-xs font-medium text-primary flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            View mosque
                          </span>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
