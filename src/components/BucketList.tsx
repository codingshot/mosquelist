import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mosques } from "@/data/mosques";
import { Check, Plus, MapPin, Plane, X, GripVertical, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBucketList } from "@/hooks/useBucketList";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BucketListItem } from "@/lib/storage";

function BucketListItemRow({
  item,
  mosque,
  toggleVisited,
  removeFromBucketList,
}: {
  item: BucketListItem;
  mosque: (typeof mosques)[number];
  toggleVisited: (id: string) => void;
  removeFromBucketList: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.mosqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`px-6 py-4 flex items-center gap-3 transition-colors ${
        item.visited ? "bg-primary/5" : "hover:bg-secondary/30"
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <button
        type="button"
        className="touch-manipulation p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <button
        onClick={() => toggleVisited(item.mosqueId)}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
          item.visited
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
        aria-label={item.visited ? "Mark as not visited" : "Mark as visited"}
      >
        {item.visited && (
          <Check className="w-4 h-4 text-primary-foreground" />
        )}
      </button>
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
      <div className="flex gap-2 shrink-0">
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
}

type BucketFilter = "all" | "unvisited" | "visited";
type BucketSort =
  | "list-order"
  | "name"
  | "country"
  | "visited-first"
  | "unvisited-first";

export const BucketList = () => {
  const {
    bucketList,
    toggleVisited,
    addToBucketList,
    removeFromBucketList,
    reorderBucketList,
    visitedCount,
    mosquesNotInList,
  } = useBucketList();
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [filter, setFilter] = useState<BucketFilter>("all");
  const [sort, setSort] = useState<BucketSort>("list-order");

  const displayedItems = useMemo(() => {
    let items = bucketList
      .map((item) => {
        const mosque = mosques.find((m) => m.id === item.mosqueId);
        return mosque ? { item, mosque } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    if (filter === "visited") items = items.filter((x) => x.item.visited);
    else if (filter === "unvisited") items = items.filter((x) => !x.item.visited);

    if (sort === "name")
      items = [...items].sort((a, b) =>
        a.mosque.name.localeCompare(b.mosque.name)
      );
    else if (sort === "country")
      items = [...items].sort((a, b) =>
        a.mosque.country.localeCompare(b.mosque.country)
      );
    else if (sort === "visited-first")
      items = [...items].sort((a, b) =>
        a.item.visited === b.item.visited ? 0 : a.item.visited ? -1 : 1
      );
    else if (sort === "unvisited-first")
      items = [...items].sort((a, b) =>
        a.item.visited === b.item.visited ? 0 : !a.item.visited ? -1 : 1
      );

    return items;
  }, [bucketList, filter, sort]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

          {/* Filter & Sort */}
          {bucketList.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(["all", "unvisited", "visited"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" && `All (${bucketList.length})`}
                    {f === "unvisited" &&
                      `Unvisited (${bucketList.length - visitedCount})`}
                    {f === "visited" && `Visited (${visitedCount})`}
                  </button>
                ))}
              </div>
              <Select
                value={sort}
                onValueChange={(v) => setSort(v as BucketSort)}
              >
                <SelectTrigger className="w-[180px] gap-2">
                  <ArrowUpDown className="h-4 w-4 shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list-order">List order</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="visited-first">Visited first</SelectItem>
                  <SelectItem value="unvisited-first">Unvisited first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  const fromIndex = bucketList.findIndex(
                    (i) => i.mosqueId === active.id
                  );
                  const toIndex = bucketList.findIndex(
                    (i) => i.mosqueId === over.id
                  );
                  if (fromIndex !== -1 && toIndex !== -1) {
                    reorderBucketList(fromIndex, toIndex);
                  }
                }
              }}
            >
              <SortableContext
                items={displayedItems.map((x) => x.item.mosqueId)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="divide-y divide-dashed divide-border">
                  {displayedItems.length === 0 ? (
                    <li className="px-6 py-8 text-center text-muted-foreground">
                      {filter === "visited"
                        ? "No visited mosques yet. Mark some as visited when you go!"
                        : filter === "unvisited"
                          ? "All mosques visited! Alhamdulillah! 🎉"
                          : "No items to show."}
                    </li>
                  ) : (
                    displayedItems.map(({ item, mosque }) => (
                      <BucketListItemRow
                        key={item.mosqueId}
                        item={item}
                        mosque={mosque}
                        toggleVisited={toggleVisited}
                        removeFromBucketList={removeFromBucketList}
                      />
                    ))
                  )}
                </ul>
              </SortableContext>
            </DndContext>
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
