import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { getListBySlug } from "@/data/lists";
import { getMosqueById } from "@/data/mosques";
import { useBucketList } from "@/hooks/useBucketList";
import {
  ArrowLeft,
  Plus,
  PlusCircle,
  CheckSquare,
  Square,
  MapPin,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [listFilter, setListFilter] = useState<ListFilter>("all");

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

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.name,
    description: list.description,
    numberOfItems: listMosques.length,
    url: `https://mosquelist.com/lists/${list.slug}`,
    itemListElement: listMosques.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Place",
        name: m.name,
        url: `https://mosquelist.com/mosque/${m.id}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={`${list.name} - MosqueList | Curated Mosque List`}
        description={list.description}
        path={`/lists/${list.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
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
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {list.name}
              </h1>
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
                    className={`flex items-center gap-3 sm:gap-4 rounded-xl border bg-card p-4 transition-colors ${
                      selected ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                    } ${inBucket ? "bg-primary/5 border-primary/20" : ""}`}
                  >
                    {canSelect ? (
                      <button
                        type="button"
                        onClick={() => toggleSelect(mosque.id)}
                        className={`shrink-0 w-9 h-9 min-w-9 min-h-9 rounded-md border-2 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation ${
                          selected ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary text-muted-foreground"
                        }`}
                        aria-label={selected ? `Deselect ${mosque.name}` : `Select ${mosque.name} to add to My List`}
                        aria-pressed={selected}
                      >
                        {selected ? (
                          <CheckSquare className="w-3.5 h-3.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </button>
                    ) : !inBucket && notInList.length <= 1 ? (
                      <span className="shrink-0 w-9 h-9 min-w-9 min-h-9" aria-hidden />
                    ) : inBucket ? (
                      <span className="shrink-0 w-9 h-9 min-w-9 min-h-9 flex items-center justify-center text-primary" aria-hidden>
                        <CheckSquare className="w-3.5 h-3.5" />
                      </span>
                    ) : null}
                    <Link
                      to={`/mosque/${mosque.id}`}
                      className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={getMosqueImageSrc(mosque).src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          setMosqueImageFallback(e.currentTarget, getMosqueImageSrc(mosque).fallbackUrl);
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 gap-y-1">
                        <Link
                          to={`/mosque/${mosque.id}`}
                          className="font-serif text-lg font-semibold text-foreground hover:text-primary hover:underline"
                        >
                          {mosque.name}
                        </Link>
                        {inBucket && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            <CheckSquare className="h-3 w-3" />
                            In your list
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3 shrink-0" />
                          <span className="truncate">{mosque.location}, {mosque.country}</span>
                        </span>
                        <span className="flex items-center gap-1">
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
                        className="shrink-0 gap-1 min-h-[44px] touch-manipulation"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    )}
                    {inBucket && (
                      <Button variant="secondary" size="sm" asChild className="gap-1.5 min-h-[44px] touch-manipulation">
                        <Link to="/bucket-list">
                          <CheckSquare className="h-4 w-4 shrink-0" />
                          In your list
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
