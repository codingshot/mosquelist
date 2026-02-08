import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import ListDetailPage from "./ListDetailPage";

function renderListDetail(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BucketListProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/lists/:slug" element={<ListDetailPage />} />
          </Routes>
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("ListDetailPage", () => {
  it("renders holy sites list with mosques", () => {
    renderListDetail("/lists/holy-sites");
    expect(screen.getByRole("heading", { level: 1, name: /holy sites/i })).toBeInTheDocument();
    expect(screen.getByText(/masjid al-haram/i)).toBeInTheDocument();
    expect(screen.getByText(/al-masjid an-nabawi/i)).toBeInTheDocument();
  });

  it("has Add All and Add buttons when list has mosques not in bucket list", () => {
    renderListDetail("/lists/turkey");
    expect(screen.getByRole("button", { name: /add all \d+ to my list/i })).toBeInTheDocument();
    const addButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("shows not found for invalid slug", () => {
    renderListDetail("/lists/invalid-slug-xyz");
    expect(screen.getByRole("heading", { level: 1, name: /not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse lists/i })).toHaveAttribute("href", "/lists");
  });

  it("add to list: clicking Add adds mosque and shows In List", async () => {
    renderListDetail("/lists/turkey");
    const addButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(addButtons.length).toBeGreaterThan(0);
    fireEvent.click(addButtons[0]);
    // After adding, the button should be replaced with an "In list" link
    const inListLink = await screen.findByRole("link", { name: /in.*list/i }, { timeout: 3000 });
    expect(inListLink).toHaveAttribute("href", "/bucket-list");
  });

  it("Add All to My List adds every mosque and shows View My List", () => {
    renderListDetail("/lists/turkey");
    const addAllBtn = screen.getByRole("button", { name: /add all \d+ to my list/i });
    fireEvent.click(addAllBtn);
    expect(screen.getByRole("link", { name: /view my list/i })).toHaveAttribute("href", "/bucket-list");
  });
});
