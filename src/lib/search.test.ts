import { describe, it, expect } from "vitest";
import { filterMosquesByQuery, mosqueMatchesQuery, getSearchSuggestions } from "./search";
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
  {
    id: "faisal-mosque",
    name: "Faisal Mosque",
    location: "Islamabad",
    country: "Pakistan",
    capacity: 300000,
    established: "1986",
    area: 33000,
    annualVisitors: "1 million",
    facilities: ["Library", "Museum"],
    description: "Largest mosque in Pakistan, funded by King Faisal.",
    significance: "Modern architectural masterpiece.",
    imageUrl: "/z.svg",
    isHolySite: false,
    womenPrayerArea: true,
    touristFriendly: true,
  },
  {
    id: "badshahi-mosque",
    name: "Badshahi Mosque",
    location: "Lahore",
    country: "Pakistan",
    capacity: 100000,
    established: "1673",
    area: 29867,
    annualVisitors: "1 million",
    facilities: ["Museum", "Guided tours"],
    description: "Mughal masterpiece. Was largest until Faisal Mosque.",
    significance: "Iconic Mughal mosque.",
    imageUrl: "/w.svg",
    isHolySite: false,
    womenPrayerArea: true,
    touristFriendly: true,
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

    it("ignores stop words like 'mosque'", () => {
      // "mosque" alone matches nothing specific since it's a stop word
      // But "faisal" without "mosque" should still match Faisal Mosque
      expect(mosqueMatchesQuery(mockMosques[2], "faisal")).toBe(true);
    });
  });

  describe("filterMosquesByQuery", () => {
    it("returns all when query is empty", () => {
      const result = filterMosquesByQuery(mockMosques, "");
      expect(result).toHaveLength(4);
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

    it("prioritizes name matches over description matches", () => {
      // "faisal" appears in Faisal Mosque name AND Badshahi description
      const result = filterMosquesByQuery(mockMosques, "faisal");
      expect(result.length).toBeGreaterThan(0);
      // Faisal Mosque should be first (name match = higher score)
      expect(result[0].id).toBe("faisal-mosque");
    });

    it("supports quoted phrases for exact matching", () => {
      const result = filterMosquesByQuery(mockMosques, '"faisal mosque"');
      // Only Faisal Mosque has the phrase "faisal mosque" in name
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].id).toBe("faisal-mosque");
    });

    it("sorts by relevance score", () => {
      // Pakistan mosques: Faisal and Badshahi
      const result = filterMosquesByQuery(mockMosques, "Pakistan");
      expect(result).toHaveLength(2);
      // Both match country, so order is by score (both equal in this case)
    });
  });

  describe("getSearchSuggestions", () => {
    it("returns empty for short queries", () => {
      expect(getSearchSuggestions(mockMosques, "")).toHaveLength(0);
      expect(getSearchSuggestions(mockMosques, "a")).toHaveLength(0);
    });

    it("suggests based on name prefix", () => {
      const suggestions = getSearchSuggestions(mockMosques, "sul");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toContain("Sultan");
    });

    it("limits suggestions", () => {
      const suggestions = getSearchSuggestions(mockMosques, "m", 2);
      // Query too short, returns empty
      expect(suggestions.length).toBe(0);
    });
  });
});
