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
      expect(result).toHaveLength(2);
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
      expect(result).toHaveLength(2);
    });
  });
});
