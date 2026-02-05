import { describe, it, expect } from "vitest";
import { mosques, getMosqueById, getUniqueCountries, getUniqueArchitecturalStyles } from "./mosques";

describe("mosques data", () => {
  it("exports non-empty mosques array", () => {
    expect(Array.isArray(mosques)).toBe(true);
    expect(mosques.length).toBeGreaterThan(0);
  });

  it("each mosque has required fields", () => {
    mosques.forEach((m) => {
      expect(m).toHaveProperty("id");
      expect(m).toHaveProperty("name");
      expect(m).toHaveProperty("location");
      expect(m).toHaveProperty("country");
      expect(m).toHaveProperty("capacity");
      expect(m).toHaveProperty("established");
      expect(m).toHaveProperty("description");
      expect(m).toHaveProperty("significance");
      expect(m).toHaveProperty("imageUrl");
      expect(typeof m.isHolySite).toBe("boolean");
      expect(typeof m.womenPrayerArea).toBe("boolean");
      expect(typeof m.touristFriendly).toBe("boolean");
    });
  });

  it("getMosqueById returns mosque for valid id", () => {
    const first = mosques[0];
    expect(getMosqueById(first.id)).toEqual(first);
  });

  it("getMosqueById returns undefined for invalid id", () => {
    expect(getMosqueById("nonexistent-id")).toBeUndefined();
  });

  it("getUniqueCountries returns sorted unique countries", () => {
    const countries = getUniqueCountries();
    expect(Array.isArray(countries)).toBe(true);
    const unique = [...new Set(countries)];
    expect(countries).toEqual(unique);
    const sorted = [...countries].sort();
    expect(countries).toEqual(sorted);
  });

  it("getUniqueArchitecturalStyles returns sorted unique styles", () => {
    const styles = getUniqueArchitecturalStyles();
    expect(Array.isArray(styles)).toBe(true);
    const unique = [...new Set(styles)];
    expect(styles).toEqual(unique);
    const sorted = [...styles].sort();
    expect(styles).toEqual(sorted);
  });
});
