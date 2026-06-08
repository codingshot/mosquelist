import { describe, it, expect } from "vitest";
import {
  mosques,
  timelineEvents,
  timelineContextEvents,
  getMosqueById,
  getUniqueCountries,
  getUniqueArchitecturalStyles,
} from "./mosques";

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

  it("sources (when present) are valid HTTP/HTTPS URLs", () => {
    const urlPattern = /^https?:\/\/[^\s]+$/i;
    mosques.forEach((m) => {
      if (m.sources?.length) {
        m.sources.forEach((url, i) => {
          expect(typeof url).toBe("string");
          expect(url.trim(), `${m.name} (${m.id}) sources[${i}]`).toMatch(urlPattern);
        });
      }
    });
  });

  it("capacity is a positive number", () => {
    mosques.forEach((m) => {
      expect(typeof m.capacity).toBe("number");
      expect(m.capacity).toBeGreaterThan(0);
    });
  });

  it("coordinates (when present) are valid lat/lng", () => {
    mosques.forEach((m) => {
      if (m.coordinates) {
        const { lat, lng } = m.coordinates;
        expect(typeof lat, `${m.name} (${m.id}) coordinates.lat`).toBe("number");
        expect(typeof lng, `${m.name} (${m.id}) coordinates.lng`).toBe("number");
        expect(Number.isNaN(lat), `${m.name} (${m.id}) coordinates.lat`).toBe(false);
        expect(Number.isNaN(lng), `${m.name} (${m.id}) coordinates.lng`).toBe(false);
        expect(lat, `${m.name} (${m.id}) coordinates.lat`).toBeGreaterThanOrEqual(-90);
        expect(lat, `${m.name} (${m.id}) coordinates.lat`).toBeLessThanOrEqual(90);
        expect(lng, `${m.name} (${m.id}) coordinates.lng`).toBeGreaterThanOrEqual(-180);
        expect(lng, `${m.name} (${m.id}) coordinates.lng`).toBeLessThanOrEqual(180);
      }
    });
  });

  const validUrlPattern = /^https?:\/\/[^\s"'<>]+$/i;
  it("officialWebsite (when present) is valid http(s) URL", () => {
    mosques.forEach((m) => {
      if (m.officialWebsite != null && m.officialWebsite !== "") {
        expect(typeof m.officialWebsite, `${m.name} (${m.id}) officialWebsite`).toBe("string");
        expect(m.officialWebsite!.trim(), `${m.name} (${m.id}) officialWebsite`).toMatch(validUrlPattern);
      }
    });
  });

  it("address (when present) is non-empty string", () => {
    mosques.forEach((m) => {
      if (m.address !== undefined && m.address !== null) {
        expect(typeof m.address, `${m.name} (${m.id}) address`).toBe("string");
        expect(m.address.trim().length, `${m.name} (${m.id}) address`).toBeGreaterThan(0);
      }
    });
  });

  it("timelineEvents resolve to existing mosques", () => {
    const ids = new Set(mosques.map((m) => m.id));
    timelineEvents.forEach((e) => {
      expect(ids.has(e.mosqueId), `orphan timeline event: ${e.mosqueId}`).toBe(true);
    });
  });

  it("loads context events separately from mosque events", () => {
    expect(timelineContextEvents.length).toBeGreaterThan(50);
    timelineContextEvents.forEach((e) => {
      expect(e.isContextEvent).toBe(true);
      expect(e.mosque).toBeTruthy();
      expect(e.event).toBeTruthy();
    });
  });
});
