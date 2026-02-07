import heroImage from "@/assets/hero-mosque.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Compass } from "lucide-react";
import { mosques, getUniqueCountries } from "@/data/mosques";

export const HeroSection = () => {
  const mosqueCount = mosques.length;
  const countryCount = getUniqueCountries().length;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Masjid al-Haram at sunset"
          // @ts-expect-error: fetchpriority is valid HTML but React types want fetchPriority
          fetchpriority="high"
          width={1920}
          height={1920}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 sm:pt-20 pb-12 sm:pb-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <Compass className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Discover the World's Most Magnificent Mosques
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,0.12)]">
            Your Journey to the{" "}
            <span className="hero-text-gold">Sacred Places</span>{" "}
            Begins Here
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-foreground/95 max-w-2xl mx-auto [text-shadow:_0_1px_3px_rgba(0,0,0,0.2)]">
            Explore, plan, and track your spiritual journey to the world's most
            beautiful and significant mosques. From Mecca to Istanbul, create
            your personal prayer bucket list.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="gradient-gold text-primary-foreground text-lg px-8 py-6 rounded-full hover:opacity-90 transition-all hover:scale-105"
              asChild
            >
              <Link to="/explore">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Mosques
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-full border-2 hover:bg-card"
              asChild
            >
              <Link to="/lists">
                <Users className="w-5 h-5 mr-2" />
                Start My List
              </Link>
            </Button>
          </div>

          {/* Stats - derived from live data */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {mosqueCount}+
              </p>
              <p className="text-sm text-muted-foreground">Mosques Listed</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                50M+
              </p>
              <p className="text-sm text-muted-foreground">Annual Visitors</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {countryCount}+
              </p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};
