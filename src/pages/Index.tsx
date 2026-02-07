import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MosqueGrid } from "@/components/MosqueGrid";
import { Timeline } from "@/components/Timeline";
import { BucketList } from "@/components/BucketList";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Link } from "react-router-dom";
import { curatedLists } from "@/data/lists";
import {
  List,
  MapPin,
  Star,
  ChevronRight,
  Compass,
  Heart,
  Plane,
  Calendar,
  Sun,
  BookOpen,
  User,
  Camera,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content">
        <HeroSection />

        {/* Explore - preview: top 10 with image + See all link */}
        <section id="explore" aria-labelledby="explore-heading" className="scroll-mt-20">
          <MosqueGrid mode="preview" />
        </section>

        {/* Timeline - limited preview with "See All" link */}
        <Timeline limit={10} showFilters={false} />

        {/* Bucket List - component has id="bucket-list" */}
        <BucketList />

        {/* Lists */}
        <section id="lists" className="py-16 md:py-24 bg-paper-cream islamic-pattern scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-4 border border-border">
                <List className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Curated Collections
                </span>
              </div>
              <h2 id="lists-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Inspiration for Your List
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Browse lists by holy sites, size, and country. Add entire lists
                or pick the mosques that call to you.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {curatedLists.map((list) => (
                <Link
                  key={list.slug}
                  to={`/lists/${list.slug}`}
                  className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {list.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {list.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-primary">
                        {list.mosqueIds.length} mosque
                        {list.mosqueIds.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
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

        {/* About */}
        <section id="about" className="py-16 md:py-24 bg-background scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-8 border border-border">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">About MosqueList</span>
              </div>
              <h2 id="about-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Your Journey to the Sacred Places
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                MosqueList helps Muslims discover, explore, and plan visits to 100+ of the
                world's most magnificent mosques in 50+ countries. From the three holiest
                sites in Islam to architectural masterpieces, create your personal prayer
                bucket list and track your journey.
              </p>
              <p className="text-muted-foreground mb-8">
                A project by{" "}
                <a
                  href="https://ummah.build"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ummah.build (opens in new tab)"
                  className="text-primary hover:underline"
                >
                  ummah.build
                </a>
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="gap-2">
                  <Link to="/explore">
                    <MapPin className="w-4 h-4" />
                    Explore Mosques
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2">
                  <Link to="/bucket-list">
                    <Heart className="w-4 h-4" />
                    My Bucket List
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Guide */}
        <section id="travel-guide" className="py-16 md:py-24 bg-paper-cream islamic-pattern scroll-mt-20">
          <div className="container mx-auto px-4">
            <article className="max-w-3xl mx-auto">
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-6 border border-border">
                  <Plane className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Travel Guide</span>
                </div>
                <h2 id="travel-guide-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Mosque Travel Guide
                </h2>
                <p className="text-lg text-muted-foreground">
                  Plan your spiritual journey across 100+ mosques in 50+ countries.
                  From the three holiest sites to historic and modern masterpieces,
                  here's how to make the most of your visits.
                </p>
              </header>

              <div className="prose prose-lg max-w-none space-y-10 break-words">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Best Times to Visit
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Ramadan and the Hajj season draw millions to Mecca and Medina.
                    For quieter visits to other mosques, consider spring (March–May)
                    or autumn (September–November) when weather is milder. Avoid
                    midday heat in summer, especially in the Gulf and Middle East.
                    Many mosques are busiest during Friday congregational prayers.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    Popular Routes
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Classic routes include Turkey (Blue Mosque, Süleymaniye, Hagia Sophia),
                    Morocco (Hassan II in Casablanca), Egypt (Al-Azhar, Islamic Cultural Center),
                    and the UAE (Sheikh Zayed in Abu Dhabi). Southeast Asia: Istiqlal in Jakarta,
                    Putra Mosque in Malaysia, Sultan Mosque in Singapore. Pakistan's Faisal and
                    Badshahi; West Africa's Great Mosque of Djenné and Senegal's Massalikoul Djinane.
                    Explore by country on our map and lists.
                  </p>
                  <Button asChild variant="outline" className="mt-4 gap-2">
                    <Link to="/explore">
                      <MapPin className="w-4 h-4" />
                      Browse Mosques by Country
                    </Link>
                  </Button>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Sun className="w-6 h-6 text-primary" />
                    What to Pack
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Modest clothing is essential: long sleeves, trousers or long
                    skirts, and a headscarf for women. Many mosques provide abayas
                    or robes. Bring slip-on shoes for easy removal. A lightweight
                    bag for belongings during prayer, sunscreen, and a reusable
                    water bottle are useful. Check visa requirements and prayer
                    times before you go.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Planning Your List
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Use MosqueList to create your personal bucket list from 100+ mosques.
                    Filter by holy sites, country, region, or capacity. Add places you want
                    to visit and track your progress. Curated lists—Holy Sites, Biggest Mosques,
                    and by country—help you discover new destinations.
                  </p>
                  <Button asChild className="mt-4 gap-2">
                    <Link to="/lists">Browse Curated Lists</Link>
                  </Button>
                </div>
              </div>

              <footer className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  For visitor etiquette and dress code tips, see our{" "}
                  <Link to="/guides/visitor-tips" className="text-primary hover:underline">
                    Visitor Tips guide
                  </Link>
                  .
                </p>
              </footer>
            </article>
          </div>
        </section>

        {/* Visitor Tips */}
        <section id="visitor-tips" className="py-16 md:py-24 bg-background scroll-mt-20">
          <div className="container mx-auto px-4">
            <article className="max-w-3xl mx-auto">
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-6 border border-border">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Visitor Guide</span>
                </div>
                <h2 id="visitor-tips-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Mosque Visitor Tips
                </h2>
                <p className="text-lg text-muted-foreground">
                  Essential etiquette, dress code, and practical tips for visiting
                  mosques. Whether you're Muslim or a respectful tourist, these
                  guidelines help you experience these sacred spaces properly.
                </p>
              </header>

              <div className="prose prose-lg max-w-none space-y-10 break-words">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Dress Code
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Modest dress is required: long sleeves, trousers or long skirts
                    (ankle-length), and covered shoulders. Women should bring or wear
                    a headscarf. Many mosques provide abayas, robes, or scarves at
                    the entrance. Remove shoes before entering the prayer area—use
                    provided shelves or carry a bag for them.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Heart className="w-6 h-6 text-primary" />
                    Etiquette
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Be quiet and respectful. Avoid walking in front of someone
                    praying. Don't touch the Qur'an or religious texts without
                    ablution. Turn off phone ringers. Some mosques restrict
                    non-Muslim visitors to certain areas or hours—check before
                    visiting. Mecca, Medina, and parts of Al-Aqsa are not open to
                    non-Muslims.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-6 h-6 text-primary" />
                    Photography
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Many mosques allow photography, but rules vary. Avoid photographing
                    worshippers without permission. Flash is usually discouraged.
                    Some areas (e.g., women's sections, certain shrines) prohibit
                    photography entirely. When in doubt, ask. Tourism-friendly
                    mosques like Sheikh Zayed and Hassan II often permit photos in
                    designated areas.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Best Times to Visit
                  </h3>
                  <p className="text-muted-foreground mt-3">
                    Visit outside the five daily prayer times for a quieter experience.
                    Mosques often close to non-Muslims 30 minutes before and during
                    prayer. Friday midday prayer is the busiest—avoid if you want a
                    calmer visit. Early morning or late afternoon are generally good.
                    Check each mosque's visitor hours before you go.
                  </p>
                </div>
              </div>

              <footer className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  For travel planning and popular routes, see our{" "}
                  <Link to="/guides/travel" className="text-primary hover:underline">
                    Travel Guide
                  </Link>
                  . Explore our{" "}
                  <Link to="/explore" className="text-primary hover:underline">
                    mosque list
                  </Link>{" "}
                  to find visitor-friendly mosques.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/explore">Browse Mosques</Link>
                </Button>
              </footer>
            </article>
          </div>
        </section>

        <Footer />
      </main>
      <BackToTop />
    </div>
  );
};

export default Index;
