import { useState } from "react";
import { Link } from "react-router-dom";
import { mosques } from "@/data/mosques";
import { Check, Plus, MapPin, Plane, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useBucketList } from "@/hooks/useBucketList";

export const BucketList = () => {
  const {
    bucketList,
    toggleVisited,
    addToBucketList,
    removeFromBucketList,
    visitedCount,
    mosquesNotInList,
  } = useBucketList();
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  return (
    <section id="bucket-list" className="py-16 md:py-24 bg-paper-cream scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-4 border border-border">
              <Plane className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Plan Your Spiritual Journey
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              My Mosque Bucket List
            </h2>
            <p className="text-muted-foreground text-lg">
              Track the mosques you've visited and plan your next destination.
            </p>
          </div>

          {/* Progress */}
          <div className="bg-card rounded-xl p-6 border border-border mb-6 mosque-card-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground">Your Progress</span>
              <span className="font-handwriting text-xl text-primary">
                {visitedCount}/{bucketList.length} visited
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-gold transition-all duration-500"
                style={{
                  width: `${bucketList.length ? (visitedCount / bucketList.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-card rounded-xl border border-border overflow-hidden paper-texture mosque-card-shadow">
            {/* Header */}
            <div className="bg-secondary/50 px-6 py-4 border-b border-border">
              <h3 className="font-handwriting text-2xl text-foreground">
                ✨ Places to Pray
              </h3>
            </div>

            {/* Items */}
            {bucketList.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Your list is empty</p>
                <p className="text-sm mb-4">Browse curated lists or the full mosque list and add places to track your spiritual journey.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/lists">Curated Lists</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/explore">Browse All Mosques</Link>
                  </Button>
                </div>
              </div>
            ) : (
            <ul className="divide-y divide-dashed divide-border">
              {bucketList.map((item) => {
                const mosque = mosques.find((m) => m.id === item.mosqueId);
                if (!mosque) return null;

                return (
                  <li
                    key={item.mosqueId}
                    className={`px-6 py-4 flex items-center gap-4 transition-colors ${
                      item.visited ? "bg-primary/5" : "hover:bg-secondary/30"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleVisited(item.mosqueId)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                        item.visited
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary"
                      }`}
                      aria-label={
                        item.visited ? "Mark as not visited" : "Mark as visited"
                      }
                    >
                      {item.visited && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </button>

                    {/* Mosque image inline */}
                    {mosque.imageUrl && (
                      <Link
                        to={`/mosque/${mosque.id}`}
                        className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={mosque.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </Link>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium transition-all ${
                          item.visited
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        <Link
                          to={`/mosque/${mosque.id}`}
                          className="hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                        >
                          {mosque.name}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>
                          {mosque.location}, {mosque.country}
                        </span>
                      </div>
                    </div>

                    {/* Status / Remove */}
                    <div className="flex items-center gap-2">
                      {item.visited && (
                        <span className="font-handwriting text-primary text-sm">
                          Alhamdulillah! ✓
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromBucketList(item.mosqueId)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={`Remove ${mosque.name} from list`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            )}

            {/* Add More */}
            <div className="print:hidden px-6 py-4 border-t border-border">
              <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add More Mosques
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] overflow-hidden flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Add a mosque to your list</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto py-4">
                    {mosquesNotInList.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">
                        All {mosques.length} mosques are already in your list.{" "}
                        <Link
                          to="/explore"
                          className="text-primary hover:underline"
                          onClick={() => setAddSheetOpen(false)}
                        >
                          Browse the full mosque list
                        </Link>
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {mosquesNotInList.map((mosque) => (
                          <li key={mosque.id}>
                            <div className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-secondary/50">
                              {mosque.imageUrl && (
                                <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden border border-border bg-muted">
                                  <img
                                    src={mosque.imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/placeholder.svg";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {mosque.name}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  {mosque.location}, {mosque.country}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="shrink-0"
                                onClick={() => addToBucketList(mosque.id)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 text-center">
            <p className="font-handwriting text-lg text-muted-foreground">
              "The best of places are the mosques, and the worst of places are
              the markets."
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              — Prophet Muhammad ﷺ (Sahih Muslim)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
