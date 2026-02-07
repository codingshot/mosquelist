import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { MapPin, Calendar, Plane, Sun, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TravelGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Mosque Travel Guide - Plan Your Spiritual Journey | MosqueList"
        description="Plan your mosque visits with our travel guide. Best times to visit, popular routes, what to pack, and tips for visiting mosques around the world."
        path="/guides/travel"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-12 md:py-24">
        <article className="max-w-3xl mx-auto">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-6 border border-border">
              <Plane className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Travel Guide</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Mosque Travel Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Plan your spiritual journey to the world's most magnificent mosques.
              From the three holiest sites to architectural masterpieces, here's
              how to make the most of your visits.
            </p>
          </header>

          <div className="prose prose-lg max-w-none space-y-10 break-words">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Best Times to Visit
              </h2>
              <p className="text-muted-foreground mt-3">
                Ramadan and the Hajj season draw millions to Mecca and Medina.
                For quieter visits to other mosques, consider spring (March–May)
                or autumn (September–November) when weather is milder. Avoid
                midday heat in summer, especially in the Gulf and Middle East.
                Many mosques are busiest during Friday congregational prayers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Popular Routes
              </h2>
              <p className="text-muted-foreground mt-3">
                Classic Islamic heritage routes include Turkey (Istanbul's Blue
                Mosque, Süleymaniye), Morocco (Hassan II in Casablanca), Egypt
                (Al-Azhar in Cairo), and the UAE (Sheikh Zayed in Abu Dhabi).
                Southeast Asia offers Istiqlal in Jakarta and Malaysia's Putra
                Mosque. Pakistan's Faisal and Badshahi mosques are must-sees.
              </p>
              <Button asChild variant="outline" className="mt-4 gap-2">
                <Link to="/explore">
                  <MapPin className="w-4 h-4" />
                  Browse Mosques by Country
                </Link>
              </Button>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <Sun className="w-6 h-6 text-primary" />
                What to Pack
              </h2>
              <p className="text-muted-foreground mt-3">
                Modest clothing is essential: long sleeves, trousers or long
                skirts, and a headscarf for women. Many mosques provide abayas
                or robes. Bring slip-on shoes for easy removal. A lightweight
                bag for belongings during prayer, sunscreen, and a reusable
                water bottle are useful. Check visa requirements and prayer
                times before you go.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Planning Your List
              </h2>
              <p className="text-muted-foreground mt-3">
                Use MosqueList to create your personal bucket list. Filter by
                holy sites, country, or capacity. Add mosques you want to visit
                and track your progress. Our curated lists by country and size
                help you discover new destinations.
              </p>
              <Button asChild className="mt-4 gap-2">
                <Link to="/lists">Browse Curated Lists</Link>
              </Button>
            </section>
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
      </main>
      <Footer />
    </div>
  );
}
