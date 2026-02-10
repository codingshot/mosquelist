import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";

/** Lazy-load a page and log a clear console message if the chunk fails to load. */
function lazyWithChunkErrorLogging(
  importFn: () => Promise<{ default: ComponentType<unknown> }>,
  pageName: string
) {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      const pathHint =
        pageName === "NotFound" ? " (unknown route)" : ` (route that uses "${pageName}")`;
      console.error(
        "[MosqueList] Page chunk failed to load" +
          pathHint +
          "\n  Page: " +
          pageName +
          "\n  Error: " +
          (error.name || "Error") +
          ": " +
          (error.message || String(error)) +
          "\n  Possible causes: network error, ad-blocker blocking the chunk, or outdated cache. Try: hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or check network tab."
      );
      throw error;
    }
  });
}

const MosquePage = lazyWithChunkErrorLogging(() => import("./pages/MosquePage"), "MosquePage");
const ExplorePage = lazyWithChunkErrorLogging(() => import("./pages/ExplorePage"), "ExplorePage");
const TimelinePage = lazyWithChunkErrorLogging(() => import("./pages/TimelinePage"), "TimelinePage");
const IslamicHistoryPage = lazyWithChunkErrorLogging(
  () => import("./pages/IslamicHistoryPage"),
  "IslamicHistoryPage"
);
const BucketListPage = lazyWithChunkErrorLogging(
  () => import("./pages/BucketListPage"),
  "BucketListPage"
);
const AboutPage = lazyWithChunkErrorLogging(() => import("./pages/AboutPage"), "AboutPage");
const ContributingPage = lazyWithChunkErrorLogging(
  () => import("./pages/ContributingPage"),
  "ContributingPage"
);
const TravelGuidePage = lazyWithChunkErrorLogging(
  () => import("./pages/TravelGuidePage"),
  "TravelGuidePage"
);
const VisitorTipsPage = lazyWithChunkErrorLogging(
  () => import("./pages/VisitorTipsPage"),
  "VisitorTipsPage"
);
const GlossaryPage = lazyWithChunkErrorLogging(
  () => import("./pages/GlossaryPage"),
  "GlossaryPage"
);
const MapPage = lazyWithChunkErrorLogging(() => import("./pages/MapPage"), "MapPage");
const BlogPage = lazyWithChunkErrorLogging(() => import("./pages/BlogPage"), "BlogPage");
const BlogPostPage = lazyWithChunkErrorLogging(() => import("./pages/BlogPostPage"), "BlogPostPage");
const BrandPage = lazyWithChunkErrorLogging(() => import("./pages/BrandPage"), "BrandPage");
const ListsPage = lazyWithChunkErrorLogging(() => import("./pages/ListsPage"), "ListsPage");
const ListDetailPage = lazyWithChunkErrorLogging(
  () => import("./pages/ListDetailPage"),
  "ListDetailPage"
);
const NotFound = lazyWithChunkErrorLogging(() => import("./pages/NotFound"), "NotFound");

const queryClient = new QueryClient();

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    Skip to main content
  </a>
);

/** Remove the initial HTML loading overlay as soon as the app has mounted (first paint). */
function RemoveInitialLoader() {
  useEffect(() => {
    const el = document.getElementById("app-loading");
    if (el?.parentNode) el.remove();
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BucketListProvider>
      <FavoritesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RemoveInitialLoader />
          <SkipLink />
          <InstallPrompt />
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/islamic-history" element={<IslamicHistoryPage />} />
              <Route path="/bucket-list" element={<BucketListPage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/lists/:slug" element={<ListDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contributing" element={<ContributingPage />} />
              <Route path="/guides/travel" element={<TravelGuidePage />} />
              <Route path="/guides/visitor-tips" element={<VisitorTipsPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/brand" element={<BrandPage />} />
              <Route path="/mosque/:id" element={<MosquePage />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
      </FavoritesProvider>
    </BucketListProvider>
  </QueryClientProvider>
);

export default App;
