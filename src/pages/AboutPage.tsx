import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Compass, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="About MosqueList - Discover & Plan Your Spiritual Journey"
        description="MosqueList helps Muslims discover, explore, and plan visits to the world's most magnificent mosques. A project by ummah.build."
        path="/about"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-12 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-8 border border-border">
            <Compass className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">About MosqueList</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Journey to the Sacred Places
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            MosqueList helps Muslims discover, explore, and plan visits to the world's most
            magnificent mosques. From the three holiest sites in Islam to architectural
            masterpieces across the globe, we make it easy to create your personal prayer
            bucket list.
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
          <div className="flex flex-wrap gap-3 sm:gap-4">
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
      </main>
      <Footer />
    </div>
  );
}
