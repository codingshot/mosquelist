import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { getGoogleMapsUrl } from "@/lib/maps";
import { Users, Star, MapPin, ExternalLink, Focus } from "lucide-react";
import type { Mosque } from "@/types/mosque";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [20, 40];
const DEFAULT_ZOOM = 2;

type MosqueWithCoords = Mosque & { coordinates: { lat: number; lng: number } };

function formatCapacity(capacity: number) {
  if (capacity >= 1_000_000) return `${(capacity / 1_000_000).toFixed(1)}M`;
  if (capacity >= 1_000) return `${(capacity / 1_000).toFixed(0)}K`;
  return String(capacity);
}

function MosqueMapCardContent({ mosque, compact = false }: { mosque: MosqueWithCoords; compact?: boolean }) {
  const imgSrc = mosque.imageUrl?.trim() || "/placeholder.svg";
  if (compact) {
    return (
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
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
      </div>
    );
  }
  return (
    <div className="w-[220px] overflow-hidden rounded-lg bg-card border border-border shadow-lg">
      <div className="relative h-24 w-full flex-none overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        {mosque.isHolySite && (
          <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
            <Star className="h-2.5 w-2.5" />
            Holy
          </span>
        )}
      </div>
      <div className="p-2.5 space-y-1">
        <p className="font-semibold text-foreground text-sm leading-tight truncate" title={mosque.name}>
          {mosque.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {mosque.location}, {mosque.country}
        </p>
        <p className="text-xs text-muted-foreground">
          <Users className="h-3 w-3 inline mr-0.5" />
          {formatCapacity(mosque.capacity)} · {mosque.established}
        </p>
      </div>
    </div>
  );
}

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

export interface ExploreMapViewProps {
  /** Mosques with coordinates (already filtered by explore filters) */
  mosques: MosqueWithCoords[];
  /** Optional: show "Fit to markers" and call this when triggered */
  onFitToMarkers?: () => void;
}

export function ExploreMapView({ mosques, onFitToMarkers }: ExploreMapViewProps) {
  const [fitTrigger, setFitTrigger] = useState(0);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const boundsOrNull = useMemo((): LatLngBoundsExpression | null => {
    if (mosques.length === 0) return null;
    if (mosques.length === 1) {
      const m = mosques[0];
      return [[m.coordinates.lat, m.coordinates.lng], [m.coordinates.lat, m.coordinates.lng]] as LatLngBoundsExpression;
    }
    const lats = mosques.map((m) => m.coordinates.lat);
    const lngs = mosques.map((m) => m.coordinates.lng);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ] as LatLngBoundsExpression;
  }, [mosques]);

  const handleFitToMarkers = useCallback(() => {
    setFitTrigger((t) => t + 1);
    onFitToMarkers?.();
  }, [onFitToMarkers]);

  return (
    <div className="space-y-4">
      {mosques.length > 0 && onFitToMarkers && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 min-h-[44px] touch-manipulation"
            onClick={handleFitToMarkers}
            aria-label="Fit map to show all visible markers"
          >
            <Focus className="h-4 w-4" />
            Fit to markers
          </Button>
        </div>
      )}
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
          {mosques.map((mosque) => (
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
                className="map-marker-tooltip !border-0 !bg-transparent !shadow-none !p-0 !max-w-[220px]"
              >
                <MosqueMapCardContent mosque={mosque} />
              </Tooltip>
              <Popup className="map-popup" maxWidth={320}>
                <div className="w-[280px] overflow-hidden rounded-lg bg-card border border-border shadow-xl">
                  <div className="relative h-[130px] w-full flex-none overflow-hidden bg-muted">
                    <img
                      src={mosque.imageUrl?.trim() || "/placeholder.svg"}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    {mosque.isHolySite && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow">
                        <Star className="h-3 w-3" />
                        Holy site
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight text-base">
                        {mosque.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {mosque.location}, {mosque.country}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Users className="h-3 w-3 shrink-0" />
                        {formatCapacity(mosque.capacity)} · {mosque.established}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
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
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {mosques.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">
            No mosques with locations match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}
