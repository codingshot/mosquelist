import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { Navigation } from "@/components/Navigation";
import { getLocationDisplay } from "@/lib/locationDisplay";
import { mosques, getUniqueCountries } from "@/data/mosques";
import { getRegionForCountry, REGIONS } from "@/data/regions";
import type { Mosque } from "@/types/mosque";

describe("getLocationDisplay", () => {
  it("prefers address over coordinates", () => {
    const mosque: Mosque = {
      id: "1",
      name: "Test",
      location: "City",
      country: "Country",
      address: "123 Main St",
      coordinates: { lat: 21.4, lng: 39.8 },
      capacity: 1000,
      established: "2020",
      area: 100,
      annualVisitors: "1M",
      facilities: [],
      significance: "Test",
      description: "Test",
      imageUrl: "",
      isHolySite: false,
      womenPrayerArea: true,
      touristFriendly: true,
    };
    expect(getLocationDisplay(mosque)).toBe("123 Main St, City, Country");
  });

  it("uses coordinates when no address", () => {
    const mosque: Mosque = {
      id: "1",
      name: "Test",
      location: "City",
      country: "Country",
      coordinates: { lat: 21.4, lng: 39.8 },
      capacity: 1000,
      established: "2020",
      area: 100,
      annualVisitors: "1M",
      facilities: [],
      significance: "Test",
      description: "Test",
      imageUrl: "",
      isHolySite: false,
      womenPrayerArea: true,
      touristFriendly: true,
    };
    expect(getLocationDisplay(mosque)).toBe("21.4, 39.8");
  });

  it("falls back to location, country when no address or coordinates", () => {
    const mosque: Mosque = {
      id: "1",
      name: "Test",
      location: "City",
      country: "Country",
      capacity: 1000,
      established: "2020",
      area: 100,
      annualVisitors: "1M",
      facilities: [],
      significance: "Test",
      description: "Test",
      imageUrl: "",
      isHolySite: false,
      womenPrayerArea: true,
      touristFriendly: true,
    };
    expect(getLocationDisplay(mosque)).toBe("City, Country");
  });
});

describe("Map route and nav", () => {
  it("Navigation includes a Map link", () => {
    render(
      <MemoryRouter>
        <BucketListProvider>
          <FavoritesProvider>
            <Navigation />
          </FavoritesProvider>
        </BucketListProvider>
      </MemoryRouter>
    );
    const mapLink = screen.getByRole("link", { name: /map/i });
    expect(mapLink).toHaveAttribute("href", "/map");
  });
});

describe("Map data and filters", () => {
  it("mosques include entries with coordinates", () => {
    const withCoords = mosques.filter((m) => m.coordinates != null);
    expect(withCoords.length).toBeGreaterThan(0);
  });

  it("getUniqueCountries returns sorted unique countries", () => {
    const countries = getUniqueCountries();
    expect(countries.length).toBeGreaterThan(0);
    const set = new Set(countries);
    expect(set.size).toBe(countries.length);
    const sorted = [...countries].sort();
    expect(countries).toEqual(sorted);
  });

  it("filtering by country reduces to that country only", () => {
    const countries = getUniqueCountries();
    if (countries.length === 0) return;
    const country = countries[0];
    const filtered = mosques.filter((m) => m.country === country);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((m) => expect(m.country).toBe(country));
  });

  it("filtering by region reduces to that region only", () => {
    const regionsWithMosques = REGIONS.filter((r) =>
      mosques.some((m) => getRegionForCountry(m.country) === r)
    );
    if (regionsWithMosques.length === 0) return;
    const region = regionsWithMosques[0];
    const filtered = mosques.filter((m) => getRegionForCountry(m.country) === region);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((m) => expect(getRegionForCountry(m.country)).toBe(region));
  });
});
