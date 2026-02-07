import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import NotFound from "./NotFound";

function renderNotFound() {
  return render(
    <MemoryRouter>
      <BucketListProvider>
        <FavoritesProvider>
          <NotFound />
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("NotFound", () => {
  it("renders 404 heading and message", () => {
    renderNotFound();
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/oops! this page doesn't exist/i)).toBeInTheDocument();
  });

  it("has link to home and explore in main content", () => {
    renderNotFound();
    const main = screen.getByRole("main");
    const mainLinks = within(main).getAllByRole("link");
    const hrefs = mainLinks.map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/explore");
  });
});
