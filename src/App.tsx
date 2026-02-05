import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { BucketListProvider } from "@/contexts/BucketListContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";

const MosquePage = lazy(() => import("./pages/MosquePage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const BucketListPage = lazy(() => import("./pages/BucketListPage"));
const ListsPage = lazy(() => import("./pages/ListsPage"));
const ListDetailPage = lazy(() => import("./pages/ListDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TravelGuidePage = lazy(() => import("./pages/TravelGuidePage"));
const VisitorTipsPage = lazy(() => import("./pages/VisitorTipsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    Skip to main content
  </a>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <BucketListProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SkipLink />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/bucket-list" element={<BucketListPage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/lists/:slug" element={<ListDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/guides/travel" element={<TravelGuidePage />} />
              <Route path="/guides/visitor-tips" element={<VisitorTipsPage />} />
              <Route path="/mosque/:id" element={<MosquePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </BucketListProvider>
    </FavoritesProvider>
  </QueryClientProvider>
);

export default App;
