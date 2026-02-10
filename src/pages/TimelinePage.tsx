import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Timeline } from "@/components/Timeline";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";

export default function TimelinePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Mosque Timeline - MosqueList | Islamic Heritage & History"
        description="Explore the historical timeline of 199+ significant mosques. From 622 CE (Prophet's Mosque) to today, discover key dates and events in Islamic architectural heritage."
        path="/timeline"
      />
      <Navigation />
      <main id="main-content" className="pt-16 pb-8 md:pb-0">
        <Timeline />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
