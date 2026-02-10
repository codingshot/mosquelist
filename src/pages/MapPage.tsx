import { useSearchParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

/**
 * Map is now a view mode of Explore. Redirect to /explore?view=map
 * with all current search params so filters are preserved.
 * Using Navigate avoids showing a loading screen.
 */
export default function MapPage() {
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  next.set("view", "map");
  return <Navigate to={`/explore?${next.toString()}`} replace />;
}
