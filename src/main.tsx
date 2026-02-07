import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/** Log why a page might not be loading when a promise rejects (e.g. chunk load). */
function onUnhandledRejection(event: PromiseRejectionEvent): void {
  const reason = event.reason;
  const msg = reason?.message ?? String(reason);
  const msgLower = msg.toLowerCase();
  if (
    msgLower.includes("loading chunk") ||
    msgLower.includes("chunk") ||
    msgLower.includes("dynamic import") ||
    msgLower.includes("failed to fetch")
  ) {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    console.error(
      "[MosqueList] Unhandled chunk/load failure. Path:",
      path || "(initial load)",
      "| Error:",
      msg,
      "| Try: hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or check network."
    );
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", onUnhandledRejection);
}

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);

const loadingEl = document.getElementById("app-loading");
if (loadingEl) loadingEl.remove();
