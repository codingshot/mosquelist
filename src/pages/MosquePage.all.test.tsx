import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import MosquePage from "@/pages/MosquePage";
import { mosques } from "@/data/mosques";
import { getRegionForCountry } from "@/data/regions";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BucketListProvider>
      <FavoritesProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </FavoritesProvider>
    </BucketListProvider>
  );
}

function renderMosque(id: string) {
  const router = createMemoryRouter(
    [{ path: "/mosque/:id", element: <MosquePage /> }],
    { initialEntries: [`/mosque/${id}`] },
  );
  return {
    router,
    ...render(
      <Providers>
        <RouterProvider router={router} />
      </Providers>,
    ),
  };
}

describe("every mosque page renders", () => {
  it("renders all mosques without crash", () => {
    const failures: string[] = [];
    for (const m of mosques) {
      try {
        const { unmount } = renderMosque(m.id);
        const h1 = screen.queryByRole("heading", { level: 1 });
        if (!h1) failures.push(`${m.id}: no h1`);
        else if (/not found/i.test(h1.textContent ?? "")) failures.push(`${m.id}: not found`);
        unmount();
      } catch (e) {
        failures.push(`${m.id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    expect(failures, failures.slice(0, 15).join("\n")).toEqual([]);
  });

  it("navigating between random mosques keeps working", async () => {
    const withGallery = mosques.find((m) => (m.galleryUrls?.length ?? 0) > 1) ?? mosques[0];
    const next =
      mosques.find((m) => m.id !== withGallery.id && !(m.galleryUrls?.length)) ??
      mosques.find((m) => m.id !== withGallery.id)!;

    const { router, unmount } = renderMosque(withGallery.id);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(withGallery.name);

    await act(async () => {
      await router.navigate(`/mosque/${next.id}`);
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(next.name);
    expect(screen.queryByText(/mosque not found/i)).not.toBeInTheDocument();

    await act(async () => {
      await router.navigate(`/mosque/${withGallery.id}`);
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(withGallery.name);
    unmount();
  });

  it("every mosque country maps to a region", () => {
    const missing = mosques
      .filter((m) => !getRegionForCountry(m.country))
      .map((m) => `${m.id} (${m.country})`);
    expect(missing).toEqual([]);
  });
});
