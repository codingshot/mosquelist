import { Link, useNavigate } from "react-router-dom";
import { Heart, Twitter, Linkedin, Github, Shuffle } from "lucide-react";
import { getSuggestMosqueTweetUrl } from "@/lib/share-urls";
import { mosques } from "@/data/mosques";
import { Button } from "@/components/ui/button";

const UMMAH_BUILD_X = "https://x.com/ummahbuild";
const UMMAH_BUILD_LINKEDIN = "https://www.linkedin.com/company/ummah-build/";
const GITHUB_REPO = "https://github.com/codingshot/mosquelist";

export const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const goToRandomMosque = () => {
    if (mosques.length === 0) return;
    const randomIndex = Math.floor(Math.random() * mosques.length);
    const randomMosque = mosques[randomIndex];
    if (!randomMosque) return;
    navigate(`/mosque/${randomMosque.id}`);
  };

  return (
    <footer id="footer" className="print:hidden bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
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
            <p className="text-background/80 max-w-md text-sm">
              Discover 199+ mosques in 50+ countries—from the three holiest sites
              to architectural masterpieces. Plan visits and build your bucket list.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 gap-2"
              onClick={goToRandomMosque}
            >
              <Shuffle className="h-4 w-4" />
              Random Mosque
            </Button>
            <p className="text-background/80 text-sm mt-3 flex flex-wrap items-center gap-2">
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
                  className="text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded p-1.5 min-h-[40px] min-w-[40px] inline-flex items-center justify-center touch-manipulation"
                  aria-label="ummah.build on X (opens in new tab)"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={UMMAH_BUILD_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded p-1.5 min-h-[40px] min-w-[40px] inline-flex items-center justify-center touch-manipulation"
                  aria-label="ummah.build on LinkedIn (opens in new tab)"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded p-1.5 min-h-[40px] min-w-[40px] inline-flex items-center justify-center touch-manipulation"
                  aria-label="MosqueList on GitHub (opens in new tab)"
                >
                  <Github className="h-4 w-4" />
                </a>
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-3">Explore</h4>
            <ul className="space-y-0.5">
              <li>
                <Link to="/explore" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Browse Mosques
                </Link>
              </li>
              <li>
                <Link to="/map" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Map
                </Link>
              </li>
              <li>
                <Link to="/lists" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Curated Lists
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Historical Timeline
                </Link>
              </li>
              <li>
                <Link to="/bucket-list" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  My Bucket List
                </Link>
              </li>
              <li>
                <a
                  href="https://www.islamicfinder.org/prayer-times/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm"
                  aria-label="Prayer Times at Islamic Finder (opens in new tab)"
                >
                  Prayer Times
                </a>
              </li>
              <li>
                <a
                  href="https://praysap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm"
                  aria-label="PRAYSAP (opens in new tab)"
                >
                  PRAYSAP
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-3">Resources</h4>
            <ul className="space-y-0.5">
              <li>
                <Link to="/guides/travel" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link to="/guides/visitor-tips" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Visitor Tips
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Glossary
                </Link>
              </li>
              <li>
                <Link to="/blog" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contributing" className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href={getSuggestMosqueTweetUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 min-h-[40px] touch-manipulation text-background/80 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:rounded text-sm"
                  aria-label="Suggest a mosque (opens X to tweet @ummahbuild)"
                >
                  Suggest a mosque
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 mt-6 pt-6">
          <p className="text-background/80 text-sm text-center">
            © {currentYear} MosqueList. Made with{" "}
            <Heart className="w-4 h-4 inline text-primary" /> by{" "}
            <a
              href="https://ummah.build"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ummah.build
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
