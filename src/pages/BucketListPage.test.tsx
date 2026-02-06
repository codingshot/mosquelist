import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import BucketListPage from "./BucketListPage";

function renderBucketListPage() {
  return render(
    <MemoryRouter initialEntries={["/bucket-list"]}>
      <BucketListProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/bucket-list" element={<BucketListPage />} />
          </Routes>
        </FavoritesProvider>
      </BucketListProvider>
    </MemoryRouter>
  );
}

describe("BucketListPage", () => {
  it("renders bucket list heading and main content", () => {
    renderBucketListPage();
    expect(screen.getByRole("heading", { level: 2, name: /my mosque bucket list/i })).toBeInTheDocument();
  });

  it("has main landmark for accessibility", () => {
    renderBucketListPage();
    expect(screen.getByRole("main", { name: undefined })).toBeInTheDocument();
  });
});
