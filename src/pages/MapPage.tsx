import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { mosques } from "@/data/mosques";
import { getUniqueCountries } from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry, REGIONS } from "@/data/regions";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
import { MapPin, ArrowLeft } from "lucide-react";

import "leaflet/dist/leaflet.css";

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
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Mosque Map
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {filteredMosques.length} mosque{filteredMosques.length !== 1 ? "s" : ""} with locations
                  {mosquesWithCoords.length < mosques.length &&
                    ` (${mosques.length - mosquesWithCoords.length} without coordinates)`}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-[180px]">
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
                  <SelectTrigger className="w-[180px]">
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

            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg min-h-[500px] h-[60vh] max-h-[800px]">
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
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
