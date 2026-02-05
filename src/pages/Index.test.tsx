import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./Index";

function renderIndex() {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <Index />
      </FavoritesProvider>
    </MemoryRouter>
  );
}

describe("Index page", () => {
  it("renders main landmark with id main-content", () => {
    renderIndex();
    const main = document.getElementById("main-content");
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe("MAIN");
  });

  it("has main content target for skip link (accessibility)", () => {
    renderIndex();
    const main = document.getElementById("main-content");
    expect(main).toBeInTheDocument();
    expect(main?.getAttribute("id")).toBe("main-content");
  });

  it("renders Explore Mosques section with heading", () => {
    renderIndex();
    expect(screen.getByRole("heading", { name: /explore magnificent mosques/i })).toBeInTheDocument();
  });

  it("renders search input with accessible label", () => {
    renderIndex();
    const search = screen.getByRole("searchbox", {
      name: /search mosques/i,
    });
    expect(search).toBeInTheDocument();
  });

  it("renders mosque grid section", () => {
    renderIndex();
    const section = document.getElementById("mosques");
    expect(section).toBeInTheDocument();
  });

  it("renders bucket list section", () => {
    renderIndex();
    const section = document.getElementById("bucket-list");
    expect(section).toBeInTheDocument();
  });

  it("renders footer with about id", () => {
    renderIndex();
    const footer = document.querySelector("footer#about");
    expect(footer).toBeInTheDocument();
  });

  it("filter buttons are accessible", () => {
    renderIndex();
    expect(screen.getByRole("button", { name: /grid view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /list view/i })).toBeInTheDocument();
  });
});
