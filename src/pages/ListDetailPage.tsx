import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ListSEO } from "@/components/ListSEO";
import { getListBySlug } from "@/data/lists";
import { getMosqueById } from "@/data/mosques";
import { useBucketList } from "@/hooks/useBucketList";
import { useFavoriteLists } from "@/hooks/useFavoriteLists";
import {
  ArrowLeft,
  Plus,
  PlusCircle,
  CheckSquare,
  Square,
  MapPin,
  Users,
  Star,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import { ShareSheet } from "@/components/ShareSheet";

function formatCapacity(capacity: number) {
  if (capacity >= 1_000_000) return `${(capacity / 1_000_000).toFixed(1)}M`;
  if (capacity >= 1_000) return `${(capacity / 1_000).toFixed(0)}K`;
  return String(capacity);
}

type ListFilter = "all" | "in-list" | "not-in-list";

export default function ListDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToBucketList, bucketList } = useBucketList();
  const { isFavoriteList, toggleFavoriteList } = useFavoriteLists();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [shareOpen, setShareOpen] = useState(false);

  const list = slug ? getListBySlug(slug) : undefined;
  const listMosques = list
    ? list.mosqueIds
        .map((id) => getMosqueById(id))
        .filter((m): m is NonNullable<typeof m> => m != null)
    : [];
  const bucketSet = useMemo(
    () => new Set(bucketList.map((i) => i.mosqueId)),
    [bucketList]
  );
  const notInList = listMosques.filter((m) => !bucketSet.has(m.id));
  const allInList = notInList.length === 0 && listMosques.length > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(notInList.map((m) => m.id)));
  };

  const deselectAll = () => setSelectedIds(new Set());

  const addSelected = () => {
    if (selectedIds.size === 0) {
      toast.info("Select one or more mosques above first.");
      return;
    }
    let addedCount = 0;
    selectedIds.forEach((id) => {
      if (addToBucketList(id)) addedCount++;
    });
    setSelectedIds(new Set());
    if (addedCount > 0) {
      toast.success(
        `Added ${addedCount} mosque${addedCount > 1 ? "s" : ""} to your list`
      );
    } else {
      toast.info("Already in your list");
    }
  };

  const addAll = () => {
    let addedCount = 0;
    notInList.forEach((m) => {
      if (addToBucketList(m.id)) addedCount++;
    });
    if (addedCount > 0) {
      toast.success(
        `Added ${addedCount} mosque${addedCount > 1 ? "s" : ""} to your list`
      );
    } else {
      toast.info("Already in your list");
    }
  };

  const addAllAndGoToList = () => {
    let addedCount = 0;
    notInList.forEach((m) => {
      if (addToBucketList(m.id)) addedCount++;
    });
    if (addedCount > 0) {
      toast.success(
        `Added ${addedCount} mosque${addedCount > 1 ? "s" : ""} to your list`
      );
    } else {
      toast.info("Already in your list");
    }
    navigate("/bucket-list");
  };

  const filteredMosques = useMemo(() => {
    if (listFilter === "in-list")
      return listMosques.filter((m) => bucketSet.has(m.id));
    if (listFilter === "not-in-list")
      return listMosques.filter((m) => !bucketSet.has(m.id));
    return listMosques;
  }, [listMosques, bucketSet, listFilter]);

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main
          id="main-content"
          className="container mx-auto px-4 pt-16 pb-24 text-center"
        >
          <h1 className="font-serif text-2xl font-bold text-foreground">
            List not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            This list doesn&apos;t exist or may have been removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/lists">Browse Lists</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ListSEO list={list} mosques={listMosques} />
      <Navigation />
      <main id="main-content" className="pt-16">
        <section className="py-16 md:py-24 bg-paper-cream islamic-pattern">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="-ml-2 mb-6 gap-2">
              <Link to="/lists">
                <ArrowLeft className="h-4 w-4" />
                Back to Lists
              </Link>
            </Button>

            <div className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                      {list.name}
                    </h1>
                    {/* Favorite star */}
                    <button
                      type="button"
                      onClick={() => {
                        const wasFavorite = isFavoriteList(list.slug);
                        toggleFavoriteList(list.slug);
                        toast.success(wasFavorite ? `Removed from favorites` : `Added to favorites`);
                      }}
                      className={`p-2 rounded-full transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isFavoriteList(list.slug)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                      aria-label={isFavoriteList(list.slug) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`h-6 w-6 ${isFavoriteList(list.slug) ? "fill-primary" : ""}`} />
                    </button>
                  </div>
                  <p className="mt-2 text-muted-foreground text-lg">
                    {list.description}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {listMosques.length} mosque
                    {listMosques.length !== 1 ? "s" : ""} in this list
                    {listMosques.length > 0 && (() => {
                      const inCount = listMosques.filter((m) => bucketSet.has(m.id)).length;
                      if (inCount === 0) return null;
                      return (
                        <span className="ml-2 text-primary font-medium">
                          · {inCount} already in your list
                        </span>
                      );
                    })()}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 min-h-[44px] touch-manipulation shrink-0"
                  onClick={() => setShareOpen(true)}
                  aria-label="Share list"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
              <ShareSheet
                open={shareOpen}
                onOpenChange={setShareOpen}
                path={`/lists/${list.slug}`}
                title={`${list.name} – MosqueList`}
                shareMessage={`${list.name}: ${list.description.slice(0, 80)}${list.description.length > 80 ? "…" : ""} ${listMosques.length} mosques on MosqueList.`}
                context="list"
              />
            </div>

            {/* Add to My List — clear two-path flow */}
            <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-primary" />
                Add to My List
              </h2>

              {allInList ? (
                <p className="text-muted-foreground text-sm mb-3">
                  Every mosque in this list is already in your bucket list.
                </p>
              ) : notInList.length > 0 ? (
                <>
                  <p className="text-muted-foreground text-sm mb-4">
                    {notInList.length} mosque{notInList.length !== 1 ? "s" : ""} not yet in your list.
                    Add all at once, or pick specific ones below.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                    <Button
                      size="sm"
                      className="gradient-gold text-primary-foreground gap-2 min-h-[44px] touch-manipulation"
                      onClick={addAll}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add all {notInList.length} to My List
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-2 min-h-[44px] touch-manipulation"
                      onClick={addAllAndGoToList}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add all &amp; go to My List
                    </Button>
                  </div>
                  {notInList.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Or choose which to add: tick the boxes next to mosques below, then click &quot;Add selected to My List&quot;.
                      </p>
                      <div className="flex flex-col min-[400px]:flex-row flex-wrap items-stretch min-[400px]:items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAll}
                          className="gap-2 min-h-[44px] touch-manipulation"
                          aria-label={`Select all ${notInList.length} mosques not yet in your list`}
                        >
                          <CheckSquare className="h-4 w-4" />
                          Select all ({notInList.length})
                        </Button>
                        {selectedIds.size > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={deselectAll}
                            className="gap-2 min-h-[44px] touch-manipulation"
                            aria-label="Clear selection"
                          >
                            <Square className="h-4 w-4" />
                            Deselect all
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={addSelected}
                          disabled={selectedIds.size === 0}
                          className="gap-2 min-h-[44px] touch-manipulation gradient-gold text-primary-foreground disabled:opacity-60 disabled:pointer-events-none"
                          aria-label={selectedIds.size > 0 ? `Add ${selectedIds.size} selected mosques to your list` : "Select one or more mosques above first"}
                          title={selectedIds.size === 0 ? "Select one or more mosques above first" : undefined}
                        >
                          <Plus className="h-4 w-4" />
                          {selectedIds.size > 0
                            ? `Add ${selectedIds.size} selected to My List`
                            : "Add selected to My List"}
                        </Button>
                      </div>
                      {selectedIds.size === 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Select one or more mosques below, then add them here.
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : null}

              {allInList && (
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/bucket-list">View My List</Link>
                </Button>
              )}
            </div>

            {/* Filter — always show when list has mosques so users see how many are in/not in their list */}
            {listMosques.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="sr-only">Filter mosques:</span>
                {(["all", "in-list", "not-in-list"] as const).map((f) => (
                  <Button
                    key={f}
                    variant={listFilter === f ? "secondary" : "ghost"}
                    size="sm"
                    className="min-h-[44px] touch-manipulation"
                    onClick={() => setListFilter(f)}
                  >
                    {f === "all" && `All (${listMosques.length})`}
                    {f === "in-list" &&
                      `In My List (${listMosques.filter((m) => bucketSet.has(m.id)).length})`}
                    {f === "not-in-list" &&
                      `Not in My List (${notInList.length})`}
                  </Button>
                ))}
              </div>
            )}

            {/* Sticky bar when there are mosques to add — show even with 0 selected so "Add" is visible but disabled until selection */}
            {notInList.length > 1 && (
              <div className="sticky top-16 z-10 mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between rounded-xl border border-primary/30 bg-card px-4 py-3 shadow-md">
                <span className="text-sm font-medium text-foreground">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} mosque${selectedIds.size !== 1 ? "s" : ""} selected for My List`
                    : "Select mosques below to add to My List"}
                </span>
                <div className="flex flex-wrap items-center justify-end sm:justify-start gap-2">
                  {selectedIds.size > 0 && (
                    <Button variant="outline" size="sm" onClick={deselectAll} className="gap-1.5 min-h-[44px] touch-manipulation">
                      <Square className="h-4 w-4" />
                      Deselect all
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={addSelected}
                    disabled={selectedIds.size === 0}
                    className="gap-1.5 min-h-[44px] touch-manipulation gradient-gold text-primary-foreground disabled:opacity-60 disabled:pointer-events-none"
                    aria-label={selectedIds.size > 0 ? `Add ${selectedIds.size} selected to My List` : "Select mosques below first"}
                    title={selectedIds.size === 0 ? "Select one or more mosques below first" : undefined}
                  >
                    <Plus className="h-4 w-4" />
                    Add to My List
                  </Button>
                </div>
              </div>
            )}

            {/* Mosque list */}
            <ul className="space-y-4">
              {filteredMosques.map((mosque) => {
                const inBucket = bucketSet.has(mosque.id);
                const selected = selectedIds.has(mosque.id);
                const canSelect = !allInList && notInList.length > 1 && !inBucket;
                return (
                  <li
                    key={mosque.id}
                    className={`flex items-center gap-2 sm:gap-4 rounded-xl border bg-card p-3 sm:p-4 transition-colors ${
                      selected ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                    } ${inBucket ? "bg-primary/5 border-primary/20" : ""}`}
                  >
                    {/* Checkbox - smaller on mobile */}
                    {canSelect ? (
                      <button
                        type="button"
                        onClick={() => toggleSelect(mosque.id)}
                        className={`shrink-0 w-7 h-7 sm:w-9 sm:h-9 min-w-7 sm:min-w-9 min-h-7 sm:min-h-9 rounded-md border-2 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation ${
                          selected ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary text-muted-foreground"
                        }`}
                        aria-label={selected ? `Deselect ${mosque.name}` : `Select ${mosque.name} to add to My List`}
                        aria-pressed={selected}
                      >
                        {selected ? (
                          <CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        ) : (
                          <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </button>
                    ) : !inBucket && notInList.length <= 1 ? (
                      <span className="shrink-0 w-7 h-7 sm:w-9 sm:h-9 min-w-7 sm:min-w-9 min-h-7 sm:min-h-9" aria-hidden />
                    ) : inBucket ? (
                      <span className="shrink-0 w-7 h-7 sm:w-9 sm:h-9 min-w-7 sm:min-w-9 min-h-7 sm:min-h-9 flex items-center justify-center text-primary" aria-hidden>
                        <CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </span>
                    ) : null}
                    {/* Image - smaller on mobile */}
                    <Link
                      to={`/mosque/${mosque.id}`}
                      className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={getMosqueImageSrc(mosque).src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        // @ts-expect-error fetchpriority is valid HTML; React types use fetchPriority
                        fetchpriority="low"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          setMosqueImageFallback(e.currentTarget, getMosqueImageSrc(mosque).fallbackUrl);
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 gap-y-0.5 sm:gap-y-1">
                        <Link
                          to={`/mosque/${mosque.id}`}
                          className="font-serif text-sm sm:text-lg font-semibold text-foreground hover:text-primary hover:underline truncate"
                        >
                          {mosque.name}
                        </Link>
                        {inBucket && (
                          <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            <CheckSquare className="h-3 w-3" />
                            In your list
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{mosque.location}, {mosque.country}</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Users className="h-3.5 w-3 shrink-0" />
                          {formatCapacity(mosque.capacity)} capacity
                        </span>
                        {mosque.isHolySite && (
                          <span className="flex items-center gap-1 text-primary">
                            <Star className="h-3.5 w-3" />
                            Holy Site
                          </span>
                        )}
                      </div>
                    </div>
                    {!inBucket && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const added = addToBucketList(mosque.id);
                          if (added) toast.success(`Added ${mosque.name} to your list`);
                          else toast.info("Already in your list");
                        }}
                        className="shrink-0 gap-1 min-h-[36px] sm:min-h-[44px] px-2 sm:px-3 text-xs sm:text-sm touch-manipulation"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    )}
                    {inBucket && (
                      <Button variant="secondary" size="sm" asChild className="gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-[44px] px-2 sm:px-3 text-xs sm:text-sm touch-manipulation">
                        <Link to="/bucket-list" aria-label="In your list">
                          <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                          <span className="sr-only sm:not-sr-only">In list</span>
                        </Link>
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>

            {filteredMosques.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                {listMosques.length === 0
                  ? "No mosques in this list yet."
                  : "No mosques match this filter."}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
