import { useRef, useMemo, memo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MosqueCard } from "./MosqueCard";
import type { Mosque } from "@/types/mosque";
import { useIsMobile } from "@/hooks/use-mobile";

interface VirtualizedMosqueGridProps {
  mosques: Mosque[];
  /** Number of columns: auto-calculated based on viewport if not provided */
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Virtualized mosque grid for large lists (100+ items)
 * Only renders visible rows for better performance
 */
export const VirtualizedMosqueGrid = memo(function VirtualizedMosqueGrid({
  mosques,
  columns: columnsProp,
}: VirtualizedMosqueGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-calculate columns based on viewport
  const columns = columnsProp ?? (isMobile ? 1 : 3);
  
  // Calculate row height (card height + gap)
  // Mobile: ~400px card, Desktop: ~380px card, plus 24px gap
  const rowHeight = isMobile ? 424 : 404;

  // Group mosques into rows
  const rows = useMemo(() => {
    const result: Mosque[][] = [];
    for (let i = 0; i < mosques.length; i += columns) {
      result.push(mosques.slice(i, i + columns));
    }
    return result;
  }, [mosques, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 2, // Render 2 extra rows above/below viewport
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-300px)] min-h-[400px] overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const rowMosques = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 right-0 grid gap-4 sm:gap-6"
              style={{
                top: `${virtualRow.start}px`,
                height: `${virtualRow.size}px`,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {rowMosques.map((mosque, colIndex) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  index={virtualRow.index * columns + colIndex}
                  view="grid"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default VirtualizedMosqueGrid;
