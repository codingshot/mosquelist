import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { mosques } from "@/data/mosques";
import { getUniqueCountries, getUniqueArchitecturalStyles } from "@/data/mosques";
import { getRegionForCountry, REGIONS } from "@/data/regions";
import { getGoogleMapsUrl } from "@/lib/maps";
import { applyMosqueFilters } from "@/lib/mosque-filters";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, Users, Star, Focus, ExternalLink, Search, SlidersHorizontal, XCircle } from "lucide-react";
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
  fitTrigger,
}: {
  bounds: LatLngBoundsExpression | null;
  center: [number, number];
  zoom: number;
  fitTrigger?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { maxZoom: 14, padding: [40, 40] });
    } else {
      map.setView(center, zoom);
    }
  }, [map, bounds, center, zoom, fitTrigger]);
  return null;
}

function createMarkerIcon(isHoly: boolean): L.DivIcon {
  const size = 32;
  const bg = isHoly ? "#b8860b" : "rgba(184, 134, 11, 0.9)";
  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid #faf8f5;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center">${isHoly ? starSvg : pinSvg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const PARAM_QUERY = "q";
const PARAM_FILTER = "filter";
const PARAM_COUNTRY = "country";
const PARAM_REGION = "region";
const PARAM_WOMEN = "women";
const PARAM_TOURIST = "tourist";
const PARAM_CAP_MIN = "capMin";
const PARAM_CAP_MAX = "capMax";
const PARAM_AREA_MIN = "areaMin";
const PARAM_AREA_MAX = "areaMax";
const PARAM_EST_MIN = "estMin";
const PARAM_EST_MAX = "estMax";
const PARAM_STYLE = "style";
const PARAM_DENOMINATION = "denomination";

type FilterType = "all" | "holy" | "tourist" | "biggest";

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fitTrigger, setFitTrigger] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get(PARAM_QUERY) ?? "");
  const debounceRef = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

  const query = searchParams.get(PARAM_QUERY) ?? "";
  const filter = (searchParams.get(PARAM_FILTER) as FilterType) ?? "all";
  const country = searchParams.get(PARAM_COUNTRY) ?? "";
  const region = searchParams.get(PARAM_REGION) ?? "";
  const womenOnly = searchParams.get(PARAM_WOMEN) === "1";
  const touristOnly = searchParams.get(PARAM_TOURIST) === "1";
  const capMin = searchParams.get(PARAM_CAP_MIN) ?? "";
  const capMax = searchParams.get(PARAM_CAP_MAX) ?? "";
  const areaMin = searchParams.get(PARAM_AREA_MIN) ?? "";
  const areaMax = searchParams.get(PARAM_AREA_MAX) ?? "";
  const estMin = searchParams.get(PARAM_EST_MIN) ?? "";
  const estMax = searchParams.get(PARAM_EST_MAX) ?? "";
  const architecturalStyle = searchParams.get(PARAM_STYLE) ?? "";
  const denominationParam = searchParams.get(PARAM_DENOMINATION) ?? "";
  const denomination = denominationParam === "sunni" || denominationParam === "shia" ? denominationParam : "";

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === "" || value === "all") next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setQuery = useCallback((v: string) => setParam(PARAM_QUERY, v), [setParam]);
  const setFilter = useCallback((v: FilterType) => setParam(PARAM_FILTER, v), [setParam]);
  const setCountry = useCallback((v: string) => setParam(PARAM_COUNTRY, v === "all" ? "" : v), [setParam]);
  const setRegion = useCallback((v: string) => setParam(PARAM_REGION, v === "all" ? "" : v), [setParam]);
  const setWomenOnly = useCallback((v: boolean) => setParam(PARAM_WOMEN, v ? "1" : ""), [setParam]);
  const setTouristOnly = useCallback((v: boolean) => setParam(PARAM_TOURIST, v ? "1" : ""), [setParam]);
  const setCapMin = useCallback((v: string) => setParam(PARAM_CAP_MIN, v), [setParam]);
  const setCapMax = useCallback((v: string) => setParam(PARAM_CAP_MAX, v), [setParam]);
  const setAreaMin = useCallback((v: string) => setParam(PARAM_AREA_MIN, v), [setParam]);
  const setAreaMax = useCallback((v: string) => setParam(PARAM_AREA_MAX, v), [setParam]);
  const setEstMin = useCallback((v: string) => setParam(PARAM_EST_MIN, v), [setParam]);
  const setEstMax = useCallback((v: string) => setParam(PARAM_EST_MAX, v), [setParam]);
  const setArchitecturalStyle = useCallback((v: string) => setParam(PARAM_STYLE, v === "all" ? "" : v), [setParam]);
  const setDenomination = useCallback((v: string) => setParam(PARAM_DENOMINATION, v === "all" ? "" : v), [setParam]);

  useEffect(() => setSearchInput(query), [query]);

  const setQueryDebounced = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setQuery(value), 300);
    },
    [setQuery]
  );

  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => REGIONS.filter((r) => mosques.some((m) => getRegionForCountry(m.country) === r)), []);
  const styles = useMemo(() => getUniqueArchitecturalStyles(), []);

  const mosquesWithCoords = useMemo(
    () => mosques.filter((m): m is typeof m & { coordinates: { lat: number; lng: number } } => !!m.coordinates),
    [],
  );

  const filterParams = useMemo(
    () => ({
      query,
      filter,
      country,
      region,
      denomination,
      womenOnly,
      touristOnly,
      architecturalStyle,
      capMin,
      capMax,
      areaMin,
      areaMax,
      estMin,
      estMax,
    }),
    [query, filter, country, region, denomination, womenOnly, touristOnly, architecturalStyle, capMin, capMax, areaMin, areaMax, estMin, estMax]
  );

  const filteredMosques = useMemo(
    () => applyMosqueFilters(mosquesWithCoords, filterParams),
    [mosquesWithCoords, filterParams]
  );

  const boundsOrNull = useMemo((): LatLngBoundsExpression | null => {
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
  }, [filteredMosques]);

  const handleFitToMarkers = useCallback(() => setFitTrigger((t) => t + 1), []);
  const clearAllFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters =
    query !== "" ||
    filter !== "all" ||
    country !== "" ||
    region !== "" ||
    denomination !== "" ||
    womenOnly ||
    touristOnly ||
    capMin !== "" ||
    capMax !== "" ||
    areaMin !== "" ||
    areaMax !== "" ||
    estMin !== "" ||
    estMax !== "" ||
    architecturalStyle !== "";

  const activeFilterCount = [
    country,
    region,
    denomination,
    womenOnly,
    touristOnly,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    architecturalStyle,
  ].filter(Boolean).length;

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
            <div className="flex flex-col gap-4 mb-6">
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

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search mosques..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setQueryDebounced(e.target.value);
                  }}
                  className="pl-9 min-h-[44px] touch-manipulation"
                  aria-label="Search mosques"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(["all", "holy", "tourist", "biggest"] as const).map((f) => (
                  <Button
                    key={f}
                    type="button"
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    className="min-h-[44px] touch-manipulation capitalize"
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "All" : f === "holy" ? "Holy sites" : f === "tourist" ? "Tourist" : "Biggest"}
                  </Button>
                ))}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="gap-1.5 min-h-[44px] touch-manipulation">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 px-1">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      <div>
                        <Label>Region</Label>
                        <Select value={region || "all"} onValueChange={setRegion}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="All regions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All regions</SelectItem>
                            {regions.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Select value={country || "all"} onValueChange={setCountry}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="All countries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All countries</SelectItem>
                            {countries.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Denomination</Label>
                        <Select value={denomination || "all"} onValueChange={setDenomination}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="sunni">Sunni</SelectItem>
                            <SelectItem value="shia">Shia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Architectural style</Label>
                        <Select value={architecturalStyle || "all"} onValueChange={setArchitecturalStyle}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            {styles.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="map-women"
                          checked={womenOnly}
                          onCheckedChange={(c) => setWomenOnly(!!c)}
                        />
                        <Label htmlFor="map-women" className="font-normal cursor-pointer">Women&apos;s area only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="map-tourist"
                          checked={touristOnly}
                          onCheckedChange={(c) => setTouristOnly(!!c)}
                        />
                        <Label htmlFor="map-tourist" className="font-normal cursor-pointer">Tourist friendly only</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Capacity min</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Min"
                            value={capMin}
                            onChange={(e) => setCapMin(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Capacity max</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Max"
                            value={capMax}
                            onChange={(e) => setCapMax(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Area (m²) min</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Min"
                            value={areaMin}
                            onChange={(e) => setAreaMin(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Area (m²) max</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Max"
                            value={areaMax}
                            onChange={(e) => setAreaMax(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Est. year min</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Min"
                            value={estMin}
                            onChange={(e) => setEstMin(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Est. year max</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Max"
                            value={estMax}
                            onChange={(e) => setEstMax(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                {filteredMosques.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 min-h-[44px] touch-manipulation shrink-0"
                    onClick={handleFitToMarkers}
                    aria-label="Fit map to show all visible markers"
                  >
                    <Focus className="h-4 w-4" />
                    Fit to markers
                  </Button>
                )}
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 min-h-[44px] touch-manipulation shrink-0 text-muted-foreground"
                    onClick={clearAllFilters}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear all
                  </Button>
                )}
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
                  fitTrigger={fitTrigger}
                />
                {filteredMosques.map((mosque) => (
                  <Marker
                    key={mosque.id}
                    position={[mosque.coordinates.lat, mosque.coordinates.lng]}
                    icon={createMarkerIcon(mosque.isHolySite)}
                  >
                    <Tooltip
                      permanent={false}
                      direction="top"
                      offset={[0, -16]}
                      opacity={0.98}
                      className="map-marker-tooltip !border-border !bg-card !text-card-foreground !shadow-lg !rounded-lg !p-0 !max-w-[240px]"
                    >
                      <div className="p-2" style={{ width: 220 }}>
                        <MosqueMapCardContent mosque={mosque} />
                      </div>
                    </Tooltip>
                    <Popup className="map-popup" maxWidth={320}>
                      <div className="min-w-[200px] space-y-2">
                        {mosque.imageUrl && (
                          <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted -mx-1 -mt-1">
                            <img
                              src={mosque.imageUrl.trim()}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            {mosque.isHolySite && (
                              <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                                <Star className="h-3 w-3" />
                                Holy site
                              </span>
                            )}
                          </div>
                        )}
                        <p className="font-semibold text-foreground leading-tight">{mosque.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {mosque.location}, {mosque.country}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-0.5" />
                          {formatCapacity(mosque.capacity)} · {mosque.established}
                        </p>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <Button size="sm" className="w-full gap-1.5" asChild>
                            <Link to={`/mosque/${mosque.id}`}>
                              <MapPin className="w-3.5 h-3.5" />
                              View mosque
                            </Link>
                          </Button>
                          <a
                            href={getGoogleMapsUrl(mosque.coordinates, mosque.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Empty state when filters match nothing */}
            {filteredMosques.length === 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? "No mosques match your current filters."
                    : "No mosques with coordinates in the catalog."}
                </p>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-1.5"
                    onClick={clearAllFilters}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

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
