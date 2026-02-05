import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import Index from "./Index";

function renderIndex() {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <BucketListProvider>
          <Index />
        </BucketListProvider>
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

  it("renders hero section with headline", () => {
    renderIndex();
    expect(screen.getByRole("heading", { name: /your journey to the sacred places/i })).toBeInTheDocument();
  });

  it("has link to explore mosques", () => {
    renderIndex();
    expect(screen.getByRole("link", { name: /explore mosques/i })).toBeInTheDocument();
  });

  it("renders footer with about id", () => {
    renderIndex();
    const footer = document.querySelector("footer#about");
    expect(footer).toBeInTheDocument();
  });

});
