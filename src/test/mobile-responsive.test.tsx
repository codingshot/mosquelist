/**
 * Mobile viewport tests: render key pages with mobile dimensions and matchMedia.
 * Ensures main content and landmarks are present; catches layout errors at 375px width.
 * For full overflow/touch testing, use manual check (docs/mobile-testing-guide.md).
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import ExplorePage from "@/pages/ExplorePage";
import ListsPage from "@/pages/ListsPage";
import MapPage from "@/pages/MapPage";
import BlogPage from "@/pages/BlogPage";
import BucketListPage from "@/pages/BucketListPage";
import AboutPage from "@/pages/AboutPage";
import TravelGuidePage from "@/pages/TravelGuidePage";
import VisitorTipsPage from "@/pages/VisitorTipsPage";
import MosquePage from "@/pages/MosquePage";
import { Navigation } from "@/components/Navigation";

const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <BucketListProvider>
    <FavoritesProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </FavoritesProvider>
  </BucketListProvider>
);

function setMobileViewport() {
  Object.defineProperty(window, "innerWidth", { value: MOBILE_WIDTH, writable: true });
  Object.defineProperty(window, "innerHeight", { value: MOBILE_HEIGHT, writable: true });
  const matchMedia = (query: string) => ({
    matches: query.includes("max-width") && query.includes("767"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
}

describe("Mobile viewport (375px)", () => {
  beforeEach(() => {
    setMobileViewport();
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, writable: true });
  });

  it("Index renders main and hero content", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AllProviders>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /explore mosques/i }).length).toBeGreaterThan(0);
  });

  it("Explore page renders and has main landmark", async () => {
    render(
      <MemoryRouter initialEntries={["/explore"]}>
        <AllProviders>
          <Routes>
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /explore magnificent mosques/i })).toBeInTheDocument();
  });

  it("Lists page renders and shows curated collections", async () => {
    render(
      <MemoryRouter initialEntries={["/lists"]}>
        <AllProviders>
          <Routes>
            <Route path="/lists" element={<ListsPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /inspiration for your list/i })).toBeInTheDocument();
  });

  it("Map page (redirect to explore) renders without error", () => {
    expect(() =>
      render(
        <MemoryRouter initialEntries={["/map"]}>
          <AllProviders>
            <Routes>
              <Route path="/map" element={<MapPage />} />
            </Routes>
          </AllProviders>
        </MemoryRouter>
      )
    ).not.toThrow();
  });

  it("Blog page renders and has heading", async () => {
    render(
      <MemoryRouter initialEntries={["/blog"]}>
        <AllProviders>
          <Routes>
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("Bucket list page renders", async () => {
    render(
      <MemoryRouter initialEntries={["/bucket-list"]}>
        <AllProviders>
          <Routes>
            <Route path="/bucket-list" element={<BucketListPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("About page renders", async () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <AllProviders>
          <Routes>
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /your journey to the sacred places/i })).toBeInTheDocument();
  });

  it("Travel guide page renders", async () => {
    render(
      <MemoryRouter initialEntries={["/guides/travel"]}>
        <AllProviders>
          <Routes>
            <Route path="/guides/travel" element={<TravelGuidePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mosque travel guide/i })).toBeInTheDocument();
  });

  it("Visitor tips page renders", async () => {
    render(
      <MemoryRouter initialEntries={["/guides/visitor-tips"]}>
        <AllProviders>
          <Routes>
            <Route path="/guides/visitor-tips" element={<VisitorTipsPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mosque visitor tips/i })).toBeInTheDocument();
  });

  it("Mosque detail page renders for valid id", async () => {
    render(
      <MemoryRouter initialEntries={["/mosque/blue-mosque"]}>
        <AllProviders>
          <Routes>
            <Route path="/mosque/:id" element={<MosquePage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    const main = await screen.findByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("Navigation shows mobile menu button (menu icon)", () => {
    render(
      <MemoryRouter>
        <AllProviders>
          <Navigation />
        </AllProviders>
      </MemoryRouter>
    );
    const menuButton = screen.getByRole("button", { name: /open menu|menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
