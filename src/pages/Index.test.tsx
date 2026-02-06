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
    const headings = await screen.findAllByRole("heading", { name: /your journey to the sacred places/i }, { timeout: 8000 });
    expect(headings.length).toBeGreaterThan(0);
  }, 10000);

  it(
    "has link to explore mosques",
    () => {
      renderIndex();
      const links = screen.getAllByRole("link", { name: /explore mosques/i });
      expect(links.length).toBeGreaterThan(0);
    },
    10000
  );

  it("renders footer", () => {
    renderIndex();
    const footer = document.querySelector("footer#footer");
    expect(footer).toBeInTheDocument();
  });

});
