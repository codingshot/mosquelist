import type { Mosque } from "@/types/mosque";
import { formatEstablishmentRange } from "@/lib/timeline-utils";

function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build CSV string for mosque list (headers + rows).
 * Columns: Name, Location, Country, Capacity, Area (m²), Established, Style, Tourist-friendly, Holy site, ID.
 */
export function mosquesToCsv(mosques: Mosque[]): string {
  const headers = [
    "Name",
    "Location",
    "Country",
    "Capacity",
    "Area (m²)",
    "Established",
    "Architectural style",
    "Tourist-friendly",
    "Holy site",
    "ID",
  ];
  const rows = mosques.map((m) => [
    escapeCsvCell(m.name),
    escapeCsvCell(m.location),
    escapeCsvCell(m.country),
    escapeCsvCell(m.capacity),
    escapeCsvCell(m.area ?? ""),
    escapeCsvCell(m.established ? formatEstablishmentRange(m.established) : ""),
    escapeCsvCell(m.architecturalStyle ?? ""),
    escapeCsvCell(m.touristFriendly ? "Yes" : "No"),
    escapeCsvCell(m.isHolySite ? "Yes" : "No"),
    escapeCsvCell(m.id),
  ]);
  const headerLine = headers.join(",");
  const dataLines = rows.map((r) => r.join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

/**
 * Trigger download of CSV file in the browser.
 */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/[^a-z0-9._-]/gi, "_") + (filename.endsWith(".csv") ? "" : ".csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
