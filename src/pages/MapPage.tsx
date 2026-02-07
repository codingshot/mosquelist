import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

/**
 * Map is now a view mode of Explore. Redirect to /explore?view=map
 * with all current search params so filters are preserved.
 */
export default function MapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("view", "map");
    navigate(`/explore?${next.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return <LoadingScreen />;
}
