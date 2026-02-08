import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { curatedLists } from "@/data/lists";
import { List, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBucketList } from "@/hooks/useBucketList";
import { useFavoriteLists } from "@/hooks/useFavoriteLists";
import { toast } from "sonner";

type ListFilter = "all" | "favorites";

export default function ListsPage() {
  const { bucketList } = useBucketList();
  const { favoriteLists, isFavoriteList, toggleFavoriteList } = useFavoriteLists();
  const [filter, setFilter] = useState<ListFilter>("all");
  
  const bucketSet = useMemo(
    () => new Set(bucketList.map((i) => i.mosqueId)),
    [bucketList]
  );

  const filteredLists = useMemo(() => {
    if (filter === "favorites") {
      return curatedLists.filter((list) => isFavoriteList(list.slug));
    }
    return curatedLists;
  }, [filter, isFavoriteList]);

  const handleToggleFavorite = (slug: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorite = isFavoriteList(slug);
    toggleFavoriteList(slug);
    if (wasFavorite) {
      toast.success(`Removed "${name}" from favorites`);
    } else {
      toast.success(`Added "${name}" to favorites`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Curated Lists - MosqueList | Holy Sites, Biggest Mosques & More"
        description="Browse curated mosque lists: Holy Sites (Mecca, Medina, Jerusalem), Biggest Mosques, and by country. 100+ mosques. Add to your bucket list."
        path="/lists"
      />
      <Navigation />
      <main id="main-content" className="pt-16 pb-8 md:pb-0">
        <section className="py-16 md:py-24 bg-paper-cream islamic-pattern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-4 border border-border">
                <List className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Curated Collections
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Inspiration for Your List
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Holy Sites, Biggest Mosques, and lists by country—from Saudi Arabia
                and Turkey to Indonesia and Pakistan. Add entire lists or pick the
                mosques that call to you.
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3 mb-6 justify-center">
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`min-h-[44px] px-4 py-2 text-sm font-medium transition-colors touch-manipulation ${
                    filter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Lists ({curatedLists.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("favorites")}
                  className={`min-h-[44px] px-4 py-2 text-sm font-medium transition-colors touch-manipulation flex items-center gap-2 ${
                    filter === "favorites"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Favorites ({favoriteLists.length})
                </button>
              </div>
            </div>

            {filteredLists.length === 0 && filter === "favorites" && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No favorite lists yet. Star lists to save them here!</p>
                <Button variant="outline" onClick={() => setFilter("all")}>
                  Browse All Lists
                </Button>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLists.map((list) => {
                const inListCount = list.mosqueIds.filter((id) =>
                  bucketSet.has(id)
                ).length;
                const isFavorite = isFavoriteList(list.slug);
                return (
                  <div
                    key={list.slug}
                    className="group relative block rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    {/* Favorite star button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(list.slug, list.name, e)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isFavorite
                          ? "bg-primary/10 text-primary"
                          : "bg-card/80 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                      aria-label={isFavorite ? `Remove ${list.name} from favorites` : `Add ${list.name} to favorites`}
                    >
                      <Star className={`h-5 w-5 ${isFavorite ? "fill-primary" : ""}`} />
                    </button>
                    
                    <Link
                      to={`/lists/${list.slug}`}
                      className="block p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-4 pr-8">
                        <div className="min-w-0 flex-1">
                          <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {list.name}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {list.description}
                          </p>
                          <p className="mt-3 text-sm font-medium text-primary">
                            {list.mosqueIds.length} mosque
                            {list.mosqueIds.length !== 1 ? "s" : ""}
                          </p>
                          {inListCount > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {inListCount} of {list.mosqueIds.length} in your list
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/bucket-list" className="gap-2">
                  <Star className="h-4 w-4" />
                  View My List
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
