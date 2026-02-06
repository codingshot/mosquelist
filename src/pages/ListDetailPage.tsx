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
  const bucketSet = new Set(bucketList.map((i) => i.mosqueId));
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
    if (selectedIds.size === 0) return;
    selectedIds.forEach((id) => addToBucketList(id));
    toast.success(
      `Added ${selectedIds.size} mosque${selectedIds.size > 1 ? "s" : ""} to your list`
    );
    setSelectedIds(new Set());
  };

  const addAll = () => {
    notInList.forEach((m) => addToBucketList(m.id));
    toast.success(
      `Added all ${notInList.length} mosque${notInList.length > 1 ? "s" : ""} to your list`
    );
  };

  const addAllAndGoToList = () => {
    notInList.forEach((m) => addToBucketList(m.id));
    toast.success(
      `Added all ${notInList.length} mosque${notInList.length > 1 ? "s" : ""} to your list`
    );
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
      <PageSEO
        title={`${list.name} - MosqueList | Curated Mosque List`}
        description={list.description}
        path={`/lists/${list.slug}`}
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
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {!allInList && notInList.length > 0 && (
                <>
                  <Button
                    size="sm"
                    className="gradient-gold text-primary-foreground gap-2"
                    onClick={addAll}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add All to My List
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    onClick={addAllAndGoToList}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add All &amp; Go to My List
                  </Button>
                </>
              )}
              {allInList && (
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/bucket-list">All in My List · View</Link>
                </Button>
              )}
              {notInList.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="gap-2"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Select All
                  </Button>
                  {selectedIds.size > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAll}
                        className="gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Deselect
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={addSelected}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add {selectedIds.size} Selected
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Filter */}
            {(notInList.length > 0 && listMosques.some((m) => bucketSet.has(m.id))) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(["all", "in-list", "not-in-list"] as const).map((f) => (
                  <Button
                    key={f}
                    variant={listFilter === f ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setListFilter(f)}
                  >
                    {f === "all" && `All (${listMosques.length})`}
                    {f === "in-list" &&
                      `In my list (${listMosques.filter((m) => bucketSet.has(m.id)).length})`}
                    {f === "not-in-list" &&
                      `Not in list (${notInList.length})`}
                  </Button>
                ))}
              </div>
            )}

            {/* Mosque list */}
            <ul className="space-y-4">
              {filteredMosques.map((mosque) => {
                const inBucket = bucketSet.has(mosque.id);
                const selected = selectedIds.has(mosque.id);
                return (
                  <li
                    key={mosque.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                  >
                    {!allInList && notInList.length > 1 && !inBucket && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(mosque.id)}
                        className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          selected ? "bg-primary border-primary" : "border-border hover:border-primary"
                        }`}
                        aria-label={selected ? "Deselect" : "Select to add"}
                      >
                        {selected ? (
                          <CheckSquare className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                    {mosque.imageUrl && (
                      <Link
                        to={`/mosque/${mosque.id}`}
                        className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={mosque.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/mosque/${mosque.id}`}
                        className="font-serif text-lg font-semibold text-foreground hover:text-primary hover:underline"
                      >
                        {mosque.name}
                      </Link>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3" />
                          {mosque.location}, {mosque.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3" />
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
                          addToBucketList(mosque.id);
                          toast.success(`Added ${mosque.name} to your list`);
                        }}
                        className="shrink-0 gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    )}
                    {inBucket && (
                      <Button variant="secondary" size="sm" asChild>
                        <Link to="/bucket-list">In List</Link>
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
