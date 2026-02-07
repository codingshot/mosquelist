import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            This page couldn&apos;t load. Try going back or starting from the home page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
