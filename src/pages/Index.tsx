import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MosqueGrid } from "@/components/MosqueGrid";
import { Timeline } from "@/components/Timeline";
import { BucketList } from "@/components/BucketList";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <MosqueGrid />
      <Timeline />
      <BucketList />
      <Footer />
    </div>
  );
};

export default Index;
