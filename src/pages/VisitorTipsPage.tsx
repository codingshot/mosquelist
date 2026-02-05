import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { User, Camera, Clock, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VisitorTipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Mosque Visitor Tips - Etiquette, Dress Code & Photography | MosqueList"
        description="Essential visitor tips for mosques: dress code, etiquette, photography rules, and best times. A respectful guide for non-Muslim and Muslim visitors alike."
        path="/guides/visitor-tips"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-16 md:py-24">
        <article className="max-w-3xl mx-auto">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-6 border border-border">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Visitor Guide</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Mosque Visitor Tips
            </h1>
            <p className="text-lg text-muted-foreground">
              Essential etiquette, dress code, and practical tips for visiting
              mosques. Whether you're Muslim or a respectful tourist, these
              guidelines help you experience these sacred spaces properly.
            </p>
          </header>

          <div className="prose prose-lg max-w-none space-y-10">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Dress Code
              </h2>
              <p className="text-muted-foreground mt-3">
                Modest dress is required: long sleeves, trousers or long skirts
                (ankle-length), and covered shoulders. Women should bring or wear
                a headscarf. Many mosques provide abayas, robes, or scarves at
                the entrance. Remove shoes before entering the prayer area—use
                provided shelves or carry a bag for them.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Etiquette
              </h2>
              <p className="text-muted-foreground mt-3">
                Be quiet and respectful. Avoid walking in front of someone
                praying. Don't touch the Qur'an or religious texts without
                ablution. Turn off phone ringers. Some mosques restrict
                non-Muslim visitors to certain areas or hours—check before
                visiting. Mecca, Medina, and parts of Al-Aqsa are not open to
                non-Muslims.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                Photography
              </h2>
              <p className="text-muted-foreground mt-3">
                Many mosques allow photography, but rules vary. Avoid photographing
                worshippers without permission. Flash is usually discouraged.
                Some areas (e.g., women's sections, certain shrines) prohibit
                photography entirely. When in doubt, ask. Tourism-friendly
                mosques like Sheikh Zayed and Hassan II often permit photos in
                designated areas.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Best Times to Visit
              </h2>
              <p className="text-muted-foreground mt-3">
                Visit outside the five daily prayer times for a quieter experience.
                Mosques often close to non-Muslims 30 minutes before and during
                prayer. Friday midday prayer is the busiest—avoid if you want a
                calmer visit. Early morning or late afternoon are generally good.
                Check each mosque's visitor hours before you go.
              </p>
            </section>
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
      </main>
      <Footer />
    </div>
  );
}
