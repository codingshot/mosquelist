import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import Index from "./Index";

function renderIndex() {
  return render(
    <MemoryRouter>
      <BucketListProvider>
        <FavoritesProvider>
          <Index />
        </FavoritesProvider>
      </BucketListProvider>
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

  it("renders hero section with headline", async () => {
    renderIndex();
    const heroHeading = await screen.findByRole("heading", { level: 1, name: /pray in the most beautiful mosques around the world/i }, { timeout: 12000 });
    expect(heroHeading).toBeInTheDocument();
  }, 15000);

  it("has link to explore", () => {
    renderIndex();
    const exploreLinks = screen.getAllByRole("link", { name: /explore/i });
    const toExplore = exploreLinks.filter((el) => el.getAttribute("href") === "/explore");
    expect(toExplore.length).toBeGreaterThan(0);
  });

  it("renders footer", () => {
    renderIndex();
    const footer = document.querySelector("footer#footer");
    expect(footer).toBeInTheDocument();
  });

});
