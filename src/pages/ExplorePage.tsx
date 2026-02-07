import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MosqueGrid } from "@/components/MosqueGrid";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Explore Mosques - MosqueList | 100+ Mosques in 50+ Countries"
        description="Explore 100+ mosques in 50+ countries. Search by name, location, capacity, and style. Filter by holy sites, region, or country. Map view, timelines, and curated lists."
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
