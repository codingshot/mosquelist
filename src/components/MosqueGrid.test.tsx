import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { MosqueGrid } from "./MosqueGrid";

function renderGrid(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <BucketListProvider>
        <FavoritesProvider>
          <MosqueGrid />
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("MosqueGrid", () => {
  it("shows all mosques when no filters", () => {
    renderGrid("/");
    const section = document.getElementById("mosques");
    expect(section).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search mosques/i })).toBeInTheDocument();
    const status = screen.getByRole("status", { hidden: true });
    expect(status).toHaveTextContent(/\d+ mosque(s)? found/);
  });

  it("filters by search query when q param is set", () => {
    renderGrid("/?q=Blue Mosque Istanbul");
    expect(screen.getByRole("status", { hidden: true })).toHaveTextContent(/mosque(s)? found/);
    expect(screen.getByRole("link", { name: /Blue Mosque/i })).toBeInTheDocument();
  });

  it("filters by country when country param is set", async () => {
    renderGrid("/explore?country=Turkey");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/mosque(s)? found/);
    expect(await screen.findByRole("link", { name: /Blue Mosque/i }, { timeout: 8000 })).toBeInTheDocument();
  }, 20000);

  it("shows sort dropdown and filter buttons", async () => {
    renderGrid("/explore");
    expect(await screen.findByRole("combobox", { name: /sort by/i }, { timeout: 12000 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grid view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /swipe mode/i })).toBeInTheDocument();
  }, 20000);

  it("defaults to All filter on /explore (no params)", async () => {
    renderGrid("/explore");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/\d+ mosques? found/);
    // With "all", we show many more than just holy sites (3)
    const match = status.textContent?.match(/(\d+)\s+mosques?\s+found/);
    const count = match ? parseInt(match[1], 10) : 0;
    expect(count).toBeGreaterThan(10);
    expect(screen.getByRole("button", { name: /^All$/ })).toBeInTheDocument();
  }, 20000);

  it("filter=holy shows only holy sites and Holy Sites pill is selected", async () => {
    renderGrid("/explore?filter=holy");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/3 mosques found/);
    expect(screen.getByRole("button", { name: /holy sites/i })).toBeInTheDocument();
  }, 20000);

  it("invalid filter param defaults to all", async () => {
    renderGrid("/explore?filter=invalid");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/\d+ mosques? found/);
    const match = status.textContent?.match(/(\d+)\s+mosques?\s+found/);
    const count = match ? parseInt(match[1], 10) : 0;
    expect(count).toBeGreaterThan(10);
  }, 20000);

  it("search and filter combine: q and filter=holy", async () => {
    renderGrid("/explore?q=Mecca&filter=holy");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/mosques? found/);
    expect(screen.getByRole("link", { name: /Masjid al-Haram|al-Haram/i })).toBeInTheDocument();
  }, 20000);

  it("clicking All when filter=holy shows all mosques", async () => {
    renderGrid("/explore?filter=holy");
    const status = await screen.findByRole("status", { hidden: true }, { timeout: 12000 });
    expect(status).toHaveTextContent(/3 mosques found/);
    const allButton = screen.getByRole("button", { name: /^All$/ });
    fireEvent.click(allButton);
    const statusAfter = await screen.findByRole("status", { hidden: true }, { timeout: 3000 });
    expect(statusAfter).toHaveTextContent(/\d+ mosques? found/);
    const match = statusAfter.textContent?.match(/(\d+)\s+mosques?\s+found/);
    const count = match ? parseInt(match[1], 10) : 0;
    expect(count).toBeGreaterThan(10);
  }, 20000);
});
