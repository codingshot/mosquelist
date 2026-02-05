import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteCount } = useFavorites();

  const navLinks = [
    { name: "Explore", href: "/#mosques" },
    { name: "Timeline", href: "/#timeline" },
    { name: "My List", href: "/#bucket-list" },
    { name: "About", href: "/#about" },
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
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link to="/#bucket-list">
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
              <Link to="/#mosques">Start Journey</Link>
            </Button>
          </div>

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

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-nav" className="md:hidden bg-background border-b border-border animate-fade-up" role="dialog" aria-label="Mobile menu">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full gradient-gold text-primary-foreground" asChild>
              <Link to="/#mosques" onClick={() => setIsOpen(false)}>
                Start Your Journey
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
