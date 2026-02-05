import { MapPin, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="about" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">
                MosqueList
              </span>
            </div>
            <p className="text-background/70 max-w-md">
              Helping Muslims discover, explore, and plan visits to the world's
              most magnificent mosques. Start your spiritual journey today.
            </p>
            <p className="text-background/50 text-sm mt-4">
              A project by{" "}
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

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="#mosques" className="text-background/70 hover:text-primary transition-colors">
                  Browse Mosques
                </a>
              </li>
              <li>
                <a href="#timeline" className="text-background/70 hover:text-primary transition-colors">
                  Historical Timeline
                </a>
              </li>
              <li>
                <a href="#bucket-list" className="text-background/70 hover:text-primary transition-colors">
                  Create Bucket List
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
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
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Travel Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Visitor Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Islamic Heritage
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm text-center md:text-left">
            © 2025 MosqueList. Made with{" "}
            <Heart className="w-4 h-4 inline text-primary" /> for the Ummah.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hello@mosquelist.com"
              className="text-background/70 hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
