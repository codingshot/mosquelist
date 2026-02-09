import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

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

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Suggest likely cause from error type/message for console. */
function getSuggestedCause(error: Error): string {
  const msg = error.message?.toLowerCase() ?? "";
  const name = error.name ?? "";
  if (
    name === "ChunkLoadError" ||
    msg.includes("loading chunk") ||
    msg.includes("dynamic import") ||
    msg.includes("failed to fetch dynamically")
  ) {
    return "Page chunk failed to load. Possible causes: network error, or outdated cache (try hard refresh: Ctrl+Shift+R / Cmd+Shift+R).";
  }
  if (msg.includes("not a function") || msg.includes("undefined") || name === "TypeError") {
    return "Possible causes: runtime or data shape mismatch; check that the route and data are valid.";
  }
  if (msg.includes("module") && (msg.includes("find") || msg.includes("resolve"))) {
    return "Possible causes: build/deploy mismatch or missing module; try redeploying or clearing cache.";
  }
  return "Try reloading the page. If it persists, check the stack trace above.";
}

/** Catches render errors in children so we show a fallback instead of a white screen. */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "(unknown)";
    const suggestion = getSuggestedCause(error);

    console.error(
      "[MosqueList] Page failed to load\n" +
        "  Path: " +
        pathname +
        "\n" +
        "  Error: " +
        (error.name || "Error") +
        ": " +
        (error.message || String(error)) +
        "\n" +
        "  Suggestion: " +
        suggestion +
        "\n" +
        "  Component stack:\n" +
        (errorInfo.componentStack ?? "(none)")
    );
    console.error("[MosqueList] Full error object:", error);
    console.error("[MosqueList] ErrorInfo:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation />
          <main id="main-content" className="flex flex-1 min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-24 pb-20">
            <div className="flex flex-col items-center max-w-lg w-full text-center">
              <div className="rounded-full bg-destructive/10 p-4 mb-4" aria-hidden>
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="mt-2 text-muted-foreground">
                This page couldn&apos;t load. Go back home or pick somewhere else to continue.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link to="/">Go home</Link>
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
                  Reload page
                </Button>
              </div>
              <p className="mt-8 text-sm font-medium text-foreground">Quick links</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
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
    }
    return this.props.children;
  }
}
