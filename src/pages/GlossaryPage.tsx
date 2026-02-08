import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { BackToTop } from "@/components/BackToTop";
import { glossaryTerms, getGlossaryCategories, type GlossaryTerm } from "@/data/glossary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Volume2, BookOpen, Building2, Sparkles, Moon, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<GlossaryTerm["category"], React.ReactNode> = {
  architecture: <Building2 className="h-4 w-4" />,
  prayer: <Moon className="h-4 w-4" />,
  ritual: <Hand className="h-4 w-4" />,
  decoration: <Sparkles className="h-4 w-4" />,
  general: <BookOpen className="h-4 w-4" />,
};

const categoryLabels: Record<GlossaryTerm["category"], string> = {
  architecture: "Architecture",
  prayer: "Prayer",
  ritual: "Rituals",
  decoration: "Decoration",
  general: "General",
};

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryTerm["category"] | "all">("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = getGlossaryCategories();

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      searchQuery === "" ||
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (term.arabic && term.arabic.includes(searchQuery));

    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group terms by category for display
  const groupedTerms = categories.reduce(
    (acc, category) => {
      const terms = filteredTerms.filter((t) => t.category === category);
      if (terms.length > 0) {
        acc[category] = terms;
      }
      return acc;
    },
    {} as Record<GlossaryTerm["category"], GlossaryTerm[]>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Islamic Glossary - MosqueList | Architecture & Religious Terms"
        description="Learn Islamic architectural and religious terms with Arabic translations and pronunciation guides. From mihrab to muqarnas, understand the vocabulary of mosque architecture."
        path="/glossary"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Islamic Glossary
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Essential terms for understanding mosque architecture, Islamic rituals, and religious practices. Each term includes Arabic script and pronunciation guide.
            </p>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer min-h-[36px] px-3",
                  selectedCategory === "all" && "gradient-gold"
                )}
                onClick={() => setSelectedCategory("all")}
              >
                All Terms
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer gap-1.5 min-h-[36px] px-3",
                    selectedCategory === category && "gradient-gold"
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Terms Display */}
          <div className="space-y-8">
            {Object.entries(groupedTerms).map(([category, terms]) => (
              <section key={category}>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  {categoryIcons[category as GlossaryTerm["category"]]}
                  {categoryLabels[category as GlossaryTerm["category"]]}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({terms.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {terms.map((term) => (
                    <article
                      key={term.term}
                      className="rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {term.term}
                          </h3>
                          {term.arabic && (
                            <p className="text-xl font-arabic text-primary mt-0.5">
                              {term.arabic}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {categoryLabels[term.category]}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                        <Volume2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="italic">{term.pronunciation}</span>
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {term.definition}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            {filteredTerms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No terms found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
