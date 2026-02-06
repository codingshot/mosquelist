import { useMemo } from "react";
import { Link } from "react-router-dom";
import { timelineEvents, mosques } from "@/data/mosques";
import { Calendar } from "lucide-react";

/** Parse numeric year from established string (e.g. "537 CE" -> 537, "2019" -> 2019). */
function parseYear(yearStr: string): number {
  const match = String(yearStr).match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

export const Timeline = () => {
  const mosqueById = useMemo(() => new Map(mosques.map((m) => [m.id, m])), []);

  const sortedEvents = useMemo(
    () => [...timelineEvents].sort((a, b) => parseYear(a.year) - parseYear(b.year)),
    []
  );

  return (
    <section id="timeline" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              1400+ Years of History
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Timeline of Major Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Journey through history and discover when the world's most
            significant mosques were built.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

          {/* Events (sorted by year) */}
          <div className="space-y-8">
            {sortedEvents.map((event, index) => {
              const mosque = mosqueById.get(event.mosqueId);
              const imageUrl = mosque?.imageUrl?.trim();
              const hasImage = !!imageUrl;

              return (
                <div
                  key={`${event.mosqueId}-${event.year}-${index}`}
                  className={`relative flex items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 md:-translate-x-1/2" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-card rounded-lg shadow-lg border border-border mosque-card-shadow overflow-hidden">
                      <div className={`flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} ${hasImage ? "flex-row" : ""}`}>
                        {hasImage && (
                          <div className="shrink-0 w-24 sm:w-28 md:w-32 self-stretch min-h-0 overflow-hidden bg-muted">
                            <Link to={`/mosque/${event.mosqueId}`} className="block h-full w-full">
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </Link>
                          </div>
                        )}
                        <div className="p-4 sm:p-5 min-w-0 flex-1">
                          <span className="font-handwriting text-xl sm:text-2xl text-primary font-semibold">
                            {event.year}{event.year.match(/^\d+$/) ? " CE" : ""}
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
                            <Link
                              to={`/mosque/${event.mosqueId}`}
                              className="hover:text-primary hover:underline focus:outline-none focus:underline"
                            >
                              {event.mosque}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base mt-2">{event.event}</p>
                          {mosque?.location && mosque?.country && (
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {mosque.location}, {mosque.country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
