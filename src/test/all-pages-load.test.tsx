import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import ExplorePage from "@/pages/ExplorePage";
import TimelinePage from "@/pages/TimelinePage";
import IslamicHistoryPage from "@/pages/IslamicHistoryPage";
import BucketListPage from "@/pages/BucketListPage";
import ListsPage from "@/pages/ListsPage";
import ListDetailPage from "@/pages/ListDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContributingPage from "@/pages/ContributingPage";
import TravelGuidePage from "@/pages/TravelGuidePage";
import VisitorTipsPage from "@/pages/VisitorTipsPage";
import MapPage from "@/pages/MapPage";
import MosquePage from "@/pages/MosquePage";
import BrandPage from "@/pages/BrandPage";
import NotFound from "@/pages/NotFound";

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <BucketListProvider>
    <FavoritesProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </FavoritesProvider>
  </BucketListProvider>
);

describe("All pages load", () => {
  it("Index (/) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AllProviders>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("Explore (/explore) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/explore"]}>
        <AllProviders>
          <Routes>
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /explore magnificent mosques/i })).toBeInTheDocument();
  });

  it("Timeline (/timeline) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/timeline"]}>
        <AllProviders>
          <Routes>
            <Route path="/timeline" element={<TimelinePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /timeline of major mosques/i })).toBeInTheDocument();
  });

  it("Islamic History (/islamic-history) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/islamic-history"]}>
        <AllProviders>
          <Routes>
            <Route path="/islamic-history" element={<IslamicHistoryPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /islamic history timeline/i })).toBeInTheDocument();
  });

  it("Bucket list (/bucket-list) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/bucket-list"]}>
        <AllProviders>
          <Routes>
            <Route path="/bucket-list" element={<BucketListPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /bucket list/i })).toBeInTheDocument();
  });

  it("Lists (/lists) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/lists"]}>
        <AllProviders>
          <Routes>
            <Route path="/lists" element={<ListsPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /inspiration for your list/i })).toBeInTheDocument();
  });

  it("List detail (/lists/holy-sites) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/lists/holy-sites"]}>
        <AllProviders>
          <Routes>
            <Route path="/lists/:slug" element={<ListDetailPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /holy sites/i })).toBeInTheDocument();
  });

  it("About (/about) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <AllProviders>
          <Routes>
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /your journey to the sacred places/i })).toBeInTheDocument();
  });

  it("Contributing (/contributing) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/contributing"]}>
        <AllProviders>
          <Routes>
            <Route path="/contributing" element={<ContributingPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /add or update mosque data/i })).toBeInTheDocument();
  });

  it("Travel guide (/guides/travel) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/guides/travel"]}>
        <AllProviders>
          <Routes>
            <Route path="/guides/travel" element={<TravelGuidePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /mosque travel guide/i })).toBeInTheDocument();
  });

  it("Visitor tips (/guides/visitor-tips) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/guides/visitor-tips"]}>
        <AllProviders>
          <Routes>
            <Route path="/guides/visitor-tips" element={<VisitorTipsPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /mosque visitor tips/i })).toBeInTheDocument();
  });

  it("Map (/map) redirects to Explore with view=map and loads", async () => {
    render(
      <MemoryRouter initialEntries={["/map"]}>
        <AllProviders>
          <Routes>
            <Route path="/map" element={<MapPage />} />
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /explore magnificent mosques/i })).toBeInTheDocument();
  });

  it("Mosque detail (/mosque/blue-mosque) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/mosque/blue-mosque"]}>
        <AllProviders>
          <Routes>
            <Route path="/mosque/:id" element={<MosquePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /blue mosque/i })).toBeInTheDocument();
  });

  it("Brand (/brand) loads", async () => {
    render(
      <MemoryRouter initialEntries={["/brand"]}>
        <AllProviders>
          <Routes>
            <Route path="/brand" element={<BrandPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    await screen.findByRole("main");
    expect(screen.getByRole("heading", { name: /mosquelist brand guide/i })).toBeInTheDocument();
  });

  it("NotFound (*) loads for unknown path", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-page-xyz"]}>
        <AllProviders>
          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});
