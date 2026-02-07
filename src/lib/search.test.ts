import { describe, it, expect } from "vitest";
import { filterMosquesByQuery, mosqueMatchesQuery } from "./search";
import type { Mosque } from "@/types/mosque";

const mockMosques: Mosque[] = [
  {
    id: "blue-mosque",
    name: "Sultan Ahmed Mosque",
    location: "Istanbul",
    country: "Turkey",
    capacity: 10000,
    established: "1616",
    area: 4608,
    annualVisitors: "3.5 million",
    facilities: ["Tourist entrance", "Multilingual guides"],
    description: "The Blue Mosque with six minarets.",
    significance: "Iconic Ottoman mosque.",
    imageUrl: "/x.svg",
    isHolySite: false,
    womenPrayerArea: true,
    touristFriendly: true,
  },
  {
    id: "masjid-al-haram",
    name: "Masjid al-Haram",
    arabicName: "المسجد الحرام",
    location: "Mecca",
    country: "Saudi Arabia",
    capacity: 4000000,
    established: "638 CE",
    area: 400800,
    annualVisitors: "8-10 million",
    facilities: ["Hotels", "Restaurants", "Medical centers"],
    description: "The holiest mosque.",
    significance: "Home to the Kaaba.",
    imageUrl: "/y.svg",
    isHolySite: true,
    womenPrayerArea: true,
    touristFriendly: false,
  },
];

describe("search", () => {
  describe("mosqueMatchesQuery", () => {
    it("returns true for empty query", () => {
      expect(mosqueMatchesQuery(mockMosques[0], "")).toBe(true);
      expect(mosqueMatchesQuery(mockMosques[0], "   ")).toBe(true);
    });

    it("matches single term in name", () => {
      expect(mosqueMatchesQuery(mockMosques[0], "Sultan")).toBe(true);
      expect(mosqueMatchesQuery(mockMosques[0], "blue")).toBe(true);
    });

    it("matches single term in country", () => {
      expect(mosqueMatchesQuery(mockMosques[0], "Turkey")).toBe(true);
      expect(mosqueMatchesQuery(mockMosques[1], "Saudi")).toBe(true);
    });

    it("requires all terms (multi-term)", () => {
      expect(mosqueMatchesQuery(mockMosques[0], "blue istanbul")).toBe(true);
      expect(mosqueMatchesQuery(mockMosques[0], "blue paris")).toBe(false);
    });

    it("is case-insensitive", () => {
      expect(mosqueMatchesQuery(mockMosques[0], "BLUE")).toBe(true);
      expect(mosqueMatchesQuery(mockMosques[1], "mecca")).toBe(true);
    });
  });

  describe("filterMosquesByQuery", () => {
    it("returns all when query is empty", () => {
      const result = filterMosquesByQuery(mockMosques, "");
      expect(result).toHaveLength(2);
    });

    it("filters by single term", () => {
      const result = filterMosquesByQuery(mockMosques, "Blue");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("blue-mosque");
    });

    it("filters by multiple terms", () => {
      const result = filterMosquesByQuery(mockMosques, "Mecca Saudi");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("masjid-al-haram");
    });

    it("returns empty when no match", () => {
      const result = filterMosquesByQuery(mockMosques, "Tokyo");
      expect(result).toHaveLength(0);
    });
  });
});
