import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BucketList } from "@/components/BucketList";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";

export default function BucketListPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="My Bucket List - MosqueList | Plan Your Spiritual Journey"
        description="Create and track your mosque bucket list. Plan visits to the world's most magnificent mosques. Mark mosques as visited and discover new places to explore."
        path="/bucket-list"
      />
      <Navigation />
      <main id="main-content" className="pt-16 pb-8 md:pb-0">
        <BucketList />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
