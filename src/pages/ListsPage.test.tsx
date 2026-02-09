import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import ListsPage from "./ListsPage";

function renderListsPage() {
  return render(
    <MemoryRouter initialEntries={["/lists"]}>
      <BucketListProvider>
        <FavoritesProvider>
          <ListsPage />
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("ListsPage", () => {
  it("renders curated lists heading", () => {
    renderListsPage();
    expect(screen.getByRole("heading", { level: 1, name: /inspiration for your list/i })).toBeInTheDocument();
  });

  it(
    "shows holy sites list",
    { timeout: 15000 },
    async () => {
      renderListsPage();
      const holySitesLinks = await screen.findAllByRole("link", { name: /holy sites/i }, { timeout: 12000 });
      expect(holySitesLinks.length).toBeGreaterThan(0);
      expect(holySitesLinks[0]).toHaveAttribute("href", "/lists/holy-sites");
    }
  );

  it("shows biggest mosques list", () => {
    renderListsPage();
    expect(screen.getByRole("link", { name: /biggest mosques/i })).toBeInTheDocument();
  });

  it("has link to bucket list", () => {
    renderListsPage();
    expect(screen.getByRole("link", { name: /view my list/i })).toHaveAttribute("href", "/bucket-list");
  });
});
