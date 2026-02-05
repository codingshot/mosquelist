import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MosqueGrid } from "@/components/MosqueGrid";
import { Timeline } from "@/components/Timeline";
import { BucketList } from "@/components/BucketList";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <MosqueGrid />
        <Timeline />
        <BucketList />
        <Footer />
      </main>
      <BackToTop />
    </div>
  );
};

export default Index;
