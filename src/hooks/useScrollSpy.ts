import { useState, useEffect } from "react";

const SECTION_IDS = ["explore", "timeline", "bucket-list", "lists", "about", "travel-guide", "visitor-tips"];

/** Returns the id of the section currently in view (for scroll spy). */
export function useScrollSpy(enabled: boolean) {
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0] ?? "explore");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id && SECTION_IDS.includes(id)) {
              setActiveId(id);
            }
          }
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px", // Top: account for fixed nav; bottom: trigger when section enters upper half
        threshold: [0, 0.1, 0.5],
      },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [enabled]);

  return activeId;
}
