import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);

const loadingEl = document.getElementById("app-loading");
if (loadingEl) loadingEl.remove();
