import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MosqueGrid } from "./MosqueGrid";

function renderGrid(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <FavoritesProvider>
        <MosqueGrid />
      </FavoritesProvider>
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
    renderGrid("/?q=Blue");
    expect(screen.getByRole("status", { hidden: true })).toHaveTextContent(/1 mosque found|1 mosques found/);
    expect(screen.getByRole("link", { name: /Blue Mosque/i })).toBeInTheDocument();
  });

  it("filters by country when country param is set", () => {
    renderGrid("/?country=Turkey");
    const status = screen.getByRole("status", { hidden: true });
    expect(status).toHaveTextContent(/mosque(s)? found/);
    expect(screen.getByRole("link", { name: /Blue Mosque/i })).toBeInTheDocument();
  });

  it("shows sort dropdown and filter buttons", () => {
    renderGrid("/");
    expect(screen.getByRole("combobox", { name: /sort by/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /grid view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /list view/i })).toBeInTheDocument();
  });
});
