import { describe, it, expect } from "vitest";
import { establishedYear, applyMosqueFilters } from "./mosque-filters";
import type { Mosque } from "@/types/mosque";

describe("mosque-filters", () => {
  describe("establishedYear", () => {
    it("parses year from established string", () => {
      expect(establishedYear("622 CE")).toBe(622);
      expect(establishedYear("2007")).toBe(2007);
      expect(establishedYear("1616")).toBe(1616);
      expect(establishedYear("638 CE")).toBe(638);
    });

    it("parses century notation as start of range (same as timeline-utils)", () => {
      expect(establishedYear("14th century")).toBe(1300);
      expect(establishedYear("15th century")).toBe(1400);
      expect(establishedYear("16th century")).toBe(1500);
    });

    it("returns 0 for unparseable (e.g. Under construction)", () => {
      expect(establishedYear("Under construction")).toBe(0);
    });

    it("returns 0 for empty or invalid", () => {
      expect(establishedYear("")).toBe(0);
      expect(establishedYear("   ")).toBe(0);
      expect(establishedYear("unknown")).toBe(0);
    });

    it("returns 0 for null or undefined", () => {
      expect(establishedYear(null)).toBe(0);
      expect(establishedYear(undefined)).toBe(0);
    });
  });

  describe("applyMosqueFilters", () => {
    const mockMosques: Mosque[] = [
      {
        id: "a",
        name: "Mosque A",
        location: "City",
        country: "Turkey",
        capacity: 5000,
        established: "2020",
        area: 1000,
        annualVisitors: "1M",
        facilities: [],
        significance: "Test",
        description: "Test",
        imageUrl: "/a.jpg",
        isHolySite: false,
        womenPrayerArea: true,
        touristFriendly: true,
      },
      {
        id: "b",
        name: "Holy Mosque",
        location: "Mecca",
        country: "Saudi Arabia",
        capacity: 1_000_000,
        established: "622 CE",
        area: 10000,
        annualVisitors: "20M",
        facilities: [],
        significance: "Holy",
        description: "Holy",
        imageUrl: "/b.jpg",
        isHolySite: true,
        womenPrayerArea: true,
        touristFriendly: false,
      },
      {
        id: "kalon",
        name: "Kalon Mosque",
        location: "Bukhara",
        country: "Uzbekistan",
        capacity: 12000,
        established: "1514",
        area: 8000,
        annualVisitors: "500K",
        facilities: [],
        significance: "Silk Road",
        description: "Historic Bukhara mosque",
        imageUrl: "/kalon.jpg",
        isHolySite: false,
        womenPrayerArea: true,
        touristFriendly: true,
      },
      {
        id: "hazrat",
        name: "Hazrat Sultan Mosque",
        location: "Astana",
        country: "Kazakhstan",
        capacity: 10000,
        established: "2012",
        area: 17000,
        annualVisitors: "1M",
        facilities: [],
        significance: "National",
        description: "Kazakhstan's largest mosque",
        imageUrl: "/hazrat.jpg",
        isHolySite: false,
        womenPrayerArea: true,
        touristFriendly: true,
      },
    ];

    it("returns all when no filters", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "",
        filter: "all",
        country: "",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(4);
    });

    it("filters by holy filter", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "",
        filter: "holy",
        country: "",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("b");
    });

    it("filters by query", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "Holy",
        filter: "all",
        country: "",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Holy Mosque");
    });

    it("handles invalid numeric params gracefully", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "",
        filter: "all",
        country: "",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "not-a-number",
        capMax: "",
        areaMin: "",
        areaMax: "xyz",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(4);
    });

    it("filters by region (Central Asia)", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "",
        filter: "all",
        country: "",
        region: "Central Asia",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(2);
      expect(result.map((m) => m.country).sort()).toEqual(["Kazakhstan", "Uzbekistan"]);
    });

    it("filters by country (Uzbekistan)", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "",
        filter: "all",
        country: "Uzbekistan",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("kalon");
    });

    it("combines region filter with search query (Central Asia + bukhara)", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "bukhara",
        filter: "all",
        country: "",
        region: "Central Asia",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("kalon");
      expect(result[0].location).toBe("Bukhara");
    });

    it("combines country filter with search query", () => {
      const result = applyMosqueFilters(mockMosques, {
        query: "astana",
        filter: "all",
        country: "Kazakhstan",
        region: "",
        denomination: "",
        womenOnly: false,
        touristOnly: false,
        architecturalStyle: "",
        capMin: "",
        capMax: "",
        areaMin: "",
        areaMax: "",
        estMin: "",
        estMax: "",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("hazrat");
    });
  });
});
