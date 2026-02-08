import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Map", to: "/map" },
  { label: "Timeline", to: "/timeline" },
  { label: "Bucket list", to: "/bucket-list" },
  { label: "Lists", to: "/lists" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn(
      "[MosqueList] 404 – Page not found. Path:",
      location.pathname,
      "| This route does not exist. User will see the 404 screen."
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main id="main-content" className="flex flex-1 min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-24 pb-20">
        <div className="text-center max-w-lg w-full">
          <div className="rounded-full bg-muted p-4 inline-flex mb-6" aria-hidden>
            <FileQuestion className="w-14 h-14 text-muted-foreground" />
          </div>
          <p className="text-6xl font-bold text-foreground tabular-nums tracking-tight">404</p>
          <h1 className="mt-2 text-2xl font-serif font-bold text-foreground">
            Page not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The page at <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</code> doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/">Go home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">Explore mosques</Link>
            </Button>
          </div>
          <p className="mt-10 text-sm font-medium text-foreground">Or try one of these</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {QUICK_LINKS.map(({ label, to }) => (
              <Button key={to} variant="secondary" size="sm" asChild>
                <Link to={to}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
