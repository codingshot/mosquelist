import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { curatedLists } from "@/data/lists";
import { List, MapPin, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBucketList } from "@/hooks/useBucketList";

export default function ListsPage() {
  const { bucketList } = useBucketList();
  const bucketSet = new Set(bucketList.map((i) => i.mosqueId));

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Curated Lists - MosqueList | Inspiration for Your Spiritual Journey"
        description="Browse curated mosque lists by holy sites, size, and country. Find inspiration for your bucket list."
        path="/lists"
      />
      <Navigation />
      <main id="main-content">
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
                Browse lists by holy sites, size, and country. Add entire lists
                or pick the mosques that call to you.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {curatedLists.map((list) => {
                const inListCount = list.mosqueIds.filter((id) =>
                  bucketSet.has(id)
                ).length;
                return (
                  <Link
                    key={list.slug}
                    to={`/lists/${list.slug}`}
                    className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-4">
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
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
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
