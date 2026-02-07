import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteCount } = useFavorites();
  const location = useLocation();

  const navLinks = [
    { name: "Explore", to: "/explore" },
    { name: "Map", to: "/map" },
    { name: "Lists", to: "/lists" },
    { name: "Timeline", to: "/timeline" },
    { name: "About", to: "/about" },
  ];

  return (
    <nav className="print:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md">
            <img
              src="/favicon.ico"
              alt="MosqueList"
              className="h-8 w-8 shrink-0 object-contain"
              width={32}
              height={32}
            />
            <span className="font-serif text-xl font-semibold text-foreground truncate">
              MosqueList
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded ${
                  location.pathname === link.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/bucket-list">
                <Heart className="w-4 h-4" />
                <span>My List</span>
                {favoriteCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0 text-xs font-medium text-primary-foreground">
                    {favoriteCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button size="sm" className="gradient-gold text-primary-foreground hover:opacity-90" asChild>
              <Link to="/explore">Start Journey</Link>
            </Button>
          </div>

          {/* Mobile: heart link to My List (bucket list) with count */}
          <Link
            to="/bucket-list"
            className="md:hidden relative min-h-[44px] min-w-[44px] p-3 flex items-center justify-center rounded-md hover:bg-secondary text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`My list${favoriteCount > 0 ? `, ${favoriteCount} saved` : ""}`}
          >
            <Heart className="w-6 h-6" />
            {favoriteCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary px-1 flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
                {favoriteCount > 99 ? "99+" : favoriteCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button - min 44px touch target */}
          <button
            type="button"
            className="md:hidden min-h-[44px] min-w-[44px] p-3 flex items-center justify-center rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - My List is accessed via heart icon in navbar, not in dropdown */}
      {isOpen && (
        <div id="mobile-nav" className="md:hidden bg-background border-b border-border animate-fade-up" role="dialog" aria-label="Mobile menu">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.filter((link) => link.to !== "/bucket-list").map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center touch-manipulation"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button className="w-full gradient-gold text-primary-foreground" asChild>
              <Link to="/explore" onClick={() => setIsOpen(false)}>
                Start Your Journey
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
