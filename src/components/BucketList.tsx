import { useState } from "react";
import { mosques } from "@/data/mosques";
import { Check, Plus, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BucketListItem {
  mosqueId: string;
  visited: boolean;
}

export const BucketList = () => {
  const [bucketList, setBucketList] = useState<BucketListItem[]>(
    mosques.slice(0, 5).map((m) => ({
      mosqueId: m.id,
      visited: false,
    }))
  );

  const toggleVisited = (mosqueId: string) => {
    setBucketList((prev) =>
      prev.map((item) =>
        item.mosqueId === mosqueId
          ? { ...item, visited: !item.visited }
          : item
      )
    );
  };

  const visitedCount = bucketList.filter((item) => item.visited).length;

  return (
    <section id="bucket-list" className="py-16 md:py-24 bg-paper-cream">
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
                  width: `${(visitedCount / bucketList.length) * 100}%`,
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
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium transition-all ${
                          item.visited
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {mosque.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {mosque.location}, {mosque.country}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    {item.visited && (
                      <span className="font-handwriting text-primary text-sm">
                        Alhamdulillah! ✓
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Add More */}
            <div className="px-6 py-4 border-t border-border">
              <Button variant="ghost" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add More Mosques
              </Button>
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
