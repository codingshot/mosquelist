import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Timeline } from "@/components/Timeline";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Mosque Timeline - MosqueList | Islamic Heritage & History"
        description="Explore the historical timeline of the world's most significant mosques. From 622 CE to today, discover key dates and events in Islamic architectural heritage."
        path="/timeline"
      />
      <Navigation />
      <main id="main-content">
        <Timeline />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
