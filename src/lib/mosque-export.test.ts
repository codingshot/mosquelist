import { describe, it, expect } from "vitest";
import type { Mosque } from "@/types/mosque";
import {
  mosquesToJson,
  mosquesToMarkdown,
  mosquesToCsv,
  createMosqueDataZip,
} from "./mosque-export";

const mockMosque: Mosque = {
  id: "test-mosque",
  name: "Test Mosque",
  location: "Test City",
  country: "Test Country",
  capacity: 5000,
  established: "1400",
  area: 1200,
  annualVisitors: "100K",
  facilities: ["Parking", "Wudu"],
  significance: "Historic",
  description: "A test mosque.",
  imageUrl: "https://example.com/img.jpg",
  isHolySite: false,
  architecturalStyle: "Ottoman",
  womenPrayerArea: true,
  touristFriendly: true,
};

describe("mosque-export", () => {
  describe("mosquesToJson", () => {
    it("returns valid JSON string", () => {
      const json = mosquesToJson([mockMosque]);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("returns array of mosque objects with expected keys", () => {
      const json = mosquesToJson([mockMosque]);
      const parsed = JSON.parse(json) as Mosque[];
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toHaveProperty("id", "test-mosque");
      expect(parsed[0]).toHaveProperty("name", "Test Mosque");
      expect(parsed[0]).toHaveProperty("location", "Test City");
      expect(parsed[0]).toHaveProperty("country", "Test Country");
      expect(parsed[0]).toHaveProperty("capacity", 5000);
      expect(parsed[0]).toHaveProperty("established", "1400");
    });

    it("returns pretty-printed JSON (indented)", () => {
      const json = mosquesToJson([mockMosque]);
      expect(json).toContain("\n  ");
    });

    it("returns empty array for empty input", () => {
      const json = mosquesToJson([]);
      expect(JSON.parse(json)).toEqual([]);
    });
  });

  describe("mosquesToCsv", () => {
    it("includes header row with expected columns", () => {
      const csv = mosquesToCsv([mockMosque]);
      const firstLine = csv.split("\r\n")[0];
      expect(firstLine).toContain("Name");
      expect(firstLine).toContain("Location");
      expect(firstLine).toContain("Country");
      expect(firstLine).toContain("Capacity");
      expect(firstLine).toContain("Established");
      expect(firstLine).toContain("Architectural style");
      expect(firstLine).toContain("Tourist-friendly");
      expect(firstLine).toContain("Holy site");
      expect(firstLine).toContain("ID");
    });

    it("includes one data row per mosque", () => {
      const csv = mosquesToCsv([mockMosque]);
      const lines = csv.split("\r\n");
      expect(lines.length).toBeGreaterThanOrEqual(2);
      expect(lines[1]).toContain("Test Mosque");
      expect(lines[1]).toContain("Test City");
      expect(lines[1]).toContain("Test Country");
      expect(lines[1]).toContain("5000");
      expect(lines[1]).toContain("test-mosque");
    });

    it("escapes quoted fields", () => {
      const mosqueWithComma: Mosque = {
        ...mockMosque,
        name: "Mosque, The Great",
      };
      const csv = mosquesToCsv([mosqueWithComma]);
      expect(csv).toContain('"Mosque, The Great"');
    });

    it("returns only header for empty input", () => {
      const csv = mosquesToCsv([]);
      const lines = csv.split("\r\n");
      expect(lines).toHaveLength(1);
      expect(lines[0]).toContain("Name");
    });
  });

  describe("mosquesToMarkdown", () => {
    it("starts with title and table header", () => {
      const md = mosquesToMarkdown([mockMosque]);
      expect(md).toMatch(/^# Mosque list/);
      expect(md).toContain("| Name |");
      expect(md).toContain("| Location |");
      expect(md).toContain("| Country |");
      expect(md).toContain("| Capacity |");
      expect(md).toContain("---");
    });

    it("includes mosque data in table rows", () => {
      const md = mosquesToMarkdown([mockMosque]);
      expect(md).toContain("Test Mosque");
      expect(md).toContain("Test City");
      expect(md).toContain("Test Country");
      expect(md).toContain("5000");
      expect(md).toContain("Ottoman");
      expect(md).toContain("Yes");
    });

    it("escapes pipe in cells", () => {
      const mosqueWithPipe: Mosque = {
        ...mockMosque,
        name: "Mosque | Historic",
      };
      const md = mosquesToMarkdown([mosqueWithPipe]);
      expect(md).toContain("\\|");
    });

    it("returns title and header only for empty input", () => {
      const md = mosquesToMarkdown([]);
      expect(md).toMatch(/^# Mosque list/);
      const lines = md.split("\n");
      expect(lines.length).toBeLessThanOrEqual(5);
    });
  });

  describe("createMosqueDataZip", () => {
    it("returns a blob", async () => {
      const blob = await createMosqueDataZip([mockMosque], "test-export");
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
      expect(blob.type).toMatch(/zip|octet-stream/);
    });

    it("zip contains json, csv, and md files", async () => {
      const JSZip = (await import("jszip")).default;
      const blob = await createMosqueDataZip([mockMosque], "mosquelist");
      const zip = await JSZip.loadAsync(blob);
      const names = Object.keys(zip.files);
      expect(names.some((n) => n.endsWith(".json"))).toBe(true);
      expect(names.some((n) => n.endsWith(".csv"))).toBe(true);
      expect(names.some((n) => n.endsWith(".md"))).toBe(true);
    });

    it("zip json file content parses to mosque array", async () => {
      const JSZip = (await import("jszip")).default;
      const blob = await createMosqueDataZip([mockMosque], "mosquelist");
      const zip = await JSZip.loadAsync(blob);
      const jsonEntry = Object.entries(zip.files).find(([name]) => name.endsWith(".json"));
      expect(jsonEntry).toBeDefined();
      const content = await jsonEntry![1].async("string");
      const parsed = JSON.parse(content) as Mosque[];
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe("Test Mosque");
    });
  });
});
