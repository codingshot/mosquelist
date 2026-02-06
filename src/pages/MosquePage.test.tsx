import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import MosquePage from "./MosquePage";

function renderMosquePage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BucketListProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/mosque/:id" element={<MosquePage />} />
          </Routes>
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("MosquePage", () => {
  it("renders mosque name and key content for valid id", () => {
    renderMosquePage("/mosque/blue-mosque");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Blue Mosque/i);
    expect(screen.getByRole("link", { name: /back to explore/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Turkey/).length).toBeGreaterThan(0);
  });

  it("shows Add to bucket list or In your bucket list", () => {
    renderMosquePage("/mosque/blue-mosque");
    const addButton = screen.queryByRole("button", { name: /add to bucket list/i });
    const inListLink = screen.queryByRole("link", { name: /in your bucket list/i });
    expect(addButton != null || inListLink != null).toBe(true);
  });

  it("shows Share button", () => {
    renderMosquePage("/mosque/blue-mosque");
    expect(screen.getByRole("button", { name: /share mosque/i })).toBeInTheDocument();
  });

  it("shows not found for invalid mosque id", () => {
    renderMosquePage("/mosque/nonexistent-mosque-id");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/not found/i);
    expect(screen.getByRole("link", { name: /back to explore/i })).toBeInTheDocument();
  });
});
