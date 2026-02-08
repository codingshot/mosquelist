import { Link } from "react-router-dom";
import { Heart, Twitter, Linkedin } from "lucide-react";
import { getSuggestMosqueTweetUrl } from "@/lib/share-urls";

const UMMAH_BUILD_X = "https://x.com/ummahbuild";
const UMMAH_BUILD_LINKEDIN = "https://www.linkedin.com/company/ummah-build/";

export const Footer = () => {
  return (
    <footer id="footer" className="print:hidden bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/favicon.ico"
                alt="MosqueList"
                className="h-8 w-8 shrink-0 object-contain"
                width={32}
                height={32}
              />
              <span className="font-serif text-xl font-semibold">
                MosqueList
              </span>
            </div>
            <p className="text-background/80 max-w-md">
              Discover 100+ mosques in 50+ countries—from the three holiest sites
              to architectural masterpieces. Plan visits and build your bucket list.
            </p>
            <p className="text-background/80 text-sm mt-4 flex flex-wrap items-center gap-2">
              A project by{" "}
              <a
                href="https://ummah.build"
                className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ummah.build (opens in new tab)"
              >
                ummah.build
              </a>
              <span className="flex items-center gap-1.5">
                <a
                  href={UMMAH_BUILD_X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center touch-manipulation"
                  aria-label="ummah.build on X (opens in new tab)"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={UMMAH_BUILD_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center touch-manipulation"
                  aria-label="ummah.build on LinkedIn (opens in new tab)"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link to="/explore" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Browse Mosques
                </Link>
              </li>
              <li>
                <Link to="/map" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Map
                </Link>
              </li>
              <li>
                <Link to="/lists" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Curated Lists
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Historical Timeline
                </Link>
              </li>
              <li>
                <Link to="/bucket-list" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  My Bucket List
                </Link>
              </li>
              <li>
                <a
                  href="https://www.islamicfinder.org/prayer-times/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded"
                  aria-label="Prayer Times at Islamic Finder (opens in new tab)"
                >
                  Prayer Times
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/guides/travel" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link to="/guides/visitor-tips" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Visitor Tips
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Islamic Heritage
                </Link>
              </li>
              <li>
                <Link to="/blog" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href={getSuggestMosqueTweetUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 min-h-[44px] min-w-[44px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded"
                  aria-label="Suggest a mosque (opens X to tweet @ummahbuild)"
                >
                  Suggest a mosque
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <p className="text-background/80 text-sm text-center">
            © 2025 MosqueList. Made with{" "}
            <Heart className="w-4 h-4 inline text-primary" /> for the Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
};
