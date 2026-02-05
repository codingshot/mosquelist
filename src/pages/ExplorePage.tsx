import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MosqueGrid } from "@/components/MosqueGrid";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Explore Mosques - MosqueList | Discover the World's Most Magnificent Mosques"
        description="Explore and discover the world's most magnificent mosques. Search by name, location, capacity, and style. From Mecca to Istanbul, plan your spiritual journey."
        path="/explore"
      />
      <Navigation />
      <main id="main-content">
        <MosqueGrid />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
