import { mosques } from "@/data/mosques";
import { MosqueCard } from "./MosqueCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, LayoutGrid, List } from "lucide-react";

export const MosqueGrid = () => {
  const [filter, setFilter] = useState<"all" | "holy" | "tourist">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredMosques = mosques.filter((mosque) => {
    if (filter === "holy") return mosque.isHolySite;
    if (filter === "tourist") return mosque.touristFriendly;
    return true;
  });

  return (
    <section id="mosques" className="py-16 md:py-24 bg-paper-cream islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Magnificent Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From the three holiest sites in Islam to architectural masterpieces
            around the world, discover mosques that have inspired millions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "gradient-gold text-primary-foreground" : ""}
              >
                All Mosques
              </Button>
              <Button
                variant={filter === "holy" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("holy")}
                className={filter === "holy" ? "gradient-gold text-primary-foreground" : ""}
              >
                Holy Sites
              </Button>
              <Button
                variant={filter === "tourist" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("tourist")}
                className={filter === "tourist" ? "gradient-gold text-primary-foreground" : ""}
              >
                Tourist Friendly
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-secondary" : ""}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-secondary" : ""}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 max-w-3xl mx-auto"
          }`}
        >
          {filteredMosques.map((mosque, index) => (
            <MosqueCard key={mosque.id} mosque={mosque} index={index} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Mosques
          </Button>
        </div>
      </div>
    </section>
  );
};
