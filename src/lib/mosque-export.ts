import type { Mosque } from "@/types/mosque";
import { formatEstablishmentRange } from "@/lib/timeline-utils";
import { mosquesToCsv } from "@/lib/csv-export";
import JSZip from "jszip";

export { mosquesToCsv, downloadCsv } from "@/lib/csv-export";

/**
 * Export mosque list as JSON (full objects, pretty-printed).
 */
export function mosquesToJson(mosques: Mosque[]): string {
  return JSON.stringify(mosques, null, 2);
}

/**
 * Export mosque list as Markdown table.
 * Columns: Name, Location, Country, Capacity, Area, Established, Style, Tourist-friendly, Holy site.
 */
export function mosquesToMarkdown(mosques: Mosque[]): string {
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
  ];
  const escapeMdCell = (v: string | number | undefined | null): string => {
    if (v === undefined || v === null) return "";
    const s = String(v).replace(/\|/g, "\\|").replace(/\n/g, " ");
    return s;
  };
  const headerRow = "| " + headers.join(" | ") + " |";
  const separator = "| " + headers.map(() => "---").join(" | ") + " |";
  const rows = mosques.map((m) =>
    [
      escapeMdCell(m.name),
      escapeMdCell(m.location),
      escapeMdCell(m.country),
      escapeMdCell(m.capacity),
      escapeMdCell(m.area ?? ""),
      escapeMdCell(m.established ? formatEstablishmentRange(m.established) : ""),
      escapeMdCell(m.architecturalStyle ?? ""),
      escapeMdCell(m.touristFriendly ? "Yes" : "No"),
      escapeMdCell(m.isHolySite ? "Yes" : "No"),
    ].join(" | "),
  );
  return ["# Mosque list", "", headerRow, separator, ...rows.map((r) => "| " + r + " |")].join("\n");
}

function safeFilename(name: string, ext: string): string {
  return name.replace(/[^a-z0-9._-]/gi, "_") + (name.endsWith(ext) ? "" : ext);
}

/**
 * Trigger download of a blob (e.g. JSON, Markdown, or ZIP).
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download mosque data as JSON file.
 */
export function downloadJson(mosques: Mosque[], filenameBase: string): void {
  const json = mosquesToJson(mosques);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, safeFilename(filenameBase, ".json"));
}

/**
 * Download mosque data as Markdown file.
 */
export function downloadMarkdown(mosques: Mosque[], filenameBase: string): void {
  const md = mosquesToMarkdown(mosques);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, safeFilename(filenameBase, ".md"));
}

/**
 * Create a ZIP containing mosque data as JSON, CSV, and Markdown.
 * Returns a Promise that resolves to the ZIP blob.
 */
export async function createMosqueDataZip(mosques: Mosque[], baseName: string): Promise<Blob> {
  const zip = new JSZip();
  zip.file(
    safeFilename(baseName, ".json"),
    mosquesToJson(mosques),
    { createFolders: false },
  );
  zip.file(
    safeFilename(baseName, ".csv"),
    "\uFEFF" + mosquesToCsv(mosques),
    { createFolders: false },
  );
  zip.file(
    safeFilename(baseName, ".md"),
    mosquesToMarkdown(mosques),
    { createFolders: false },
  );
  return zip.generateAsync({ type: "blob" });
}

/**
 * Download mosque data as a ZIP containing JSON, CSV, and Markdown.
 */
export async function downloadMosqueDataZip(mosques: Mosque[], filenameBase: string): Promise<void> {
  const blob = await createMosqueDataZip(mosques, filenameBase);
  downloadBlob(blob, safeFilename(filenameBase, ".zip"));
}
