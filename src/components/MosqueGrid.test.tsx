import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
});
