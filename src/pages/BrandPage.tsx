import { useState, useCallback } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Check } from "lucide-react";
import JSZip from "jszip";

/** Brand colors with HEX and RGB for copy/download. Values match CSS --primary, --accent, etc. */
const BRAND_COLORS = [
  { name: "Primary (Gold)", role: "primary", hex: "#C9A227", rgb: "201, 162, 39", hsl: "38, 70%, 45%" },
  { name: "Primary foreground", role: "on-primary", hex: "#FDFBF7", rgb: "253, 251, 247", hsl: "40, 40%, 99%" },
  { name: "Background (Paper)", role: "background", hex: "#FAF8F5", rgb: "250, 248, 245", hsl: "40, 30%, 97%" },
  { name: "Foreground (Ink)", role: "foreground", hex: "#2D2922", rgb: "45, 41, 34", hsl: "25, 25%, 15%" },
  { name: "Secondary (Warm Beige)", role: "secondary", hex: "#E8E2D9", rgb: "232, 226, 217", hsl: "35, 30%, 90%" },
  { name: "Secondary foreground", role: "on-secondary", hex: "#3D3832", rgb: "61, 56, 50", hsl: "25, 25%, 20%" },
  { name: "Accent (Teal)", role: "accent", hex: "#247D6A", rgb: "36, 125, 106", hsl: "175, 50%, 30%" },
  { name: "Accent foreground", role: "on-accent", hex: "#FDFBF7", rgb: "253, 251, 247", hsl: "40, 40%, 99%" },
  { name: "Muted", role: "muted", hex: "#EBE8E3", rgb: "235, 232, 227", hsl: "35, 20%, 92%" },
  { name: "Muted foreground", role: "muted-foreground", hex: "#4A4540", rgb: "74, 69, 64", hsl: "25, 22%, 30%" },
  { name: "Gold light", role: "gold-light", hex: "#D4A84B", rgb: "212, 168, 75", hsl: "40, 65%, 65%" },
  { name: "Gold dark", role: "gold-dark", hex: "#8B6914", rgb: "139, 105, 20", hsl: "35, 75%, 35%" },
  { name: "Teal light", role: "teal-light", hex: "#3DA892", rgb: "61, 168, 146", hsl: "175, 45%, 45%" },
  { name: "Destructive", role: "destructive", hex: "#E03C3C", rgb: "224, 60, 60", hsl: "0, 72%, 51%" },
  { name: "Border", role: "border", hex: "#D9D3CB", rgb: "217, 211, 203", hsl: "35, 25%, 85%" },
];

const FONTS = [
  { name: "Playfair Display", usage: "Headings (serif)", fallback: "Georgia, serif", url: "https://fonts.google.com/specimen/Playfair+Display" },
  { name: "Inter", usage: "Body, UI (sans-serif)", fallback: "system-ui, sans-serif", url: "https://fonts.google.com/specimen/Inter" },
  { name: "Caveat", usage: "Handwriting, accents", fallback: "cursive", url: "https://fonts.google.com/specimen/Caveat" },
];

const TAGLINES = [
  "Your journey to the sacred places.",
  "Discover. Save. Visit.",
  "Your mosque bucket list starts here.",
  "From the three holiest sites to the world's most magnificent mosques.",
  "199+ mosques. One place to discover and plan.",
];

const PERSONAS = [
  { name: "Ummah-focused Muslim", need: "Sacred journey, accuracy, spiritual bucket list", message: "Your journey to the sacred places" },
  { name: "Muslim traveler & diaspora", need: "Discovery + planning", message: "Find and plan—filter by country & access" },
  { name: "Cultural traveler", need: "Can I visit? + context", message: "Iconic mosques + visitor tips" },
];

const VOICE_TRAITS = ["Reverent", "Accurate", "Welcoming", "Calm and clear"];

export default function BrandPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zipLoading, setZipLoading] = useState(false);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const downloadBrandZip = useCallback(async () => {
    setZipLoading(true);
    try {
      const zip = new JSZip();
      const colorsJson = JSON.stringify(
        BRAND_COLORS.map((c) => ({ name: c.name, hex: c.hex, rgb: `rgb(${c.rgb})`, hsl: c.hsl })),
        null,
        2
      );
      zip.file("colors.json", colorsJson);
      zip.file(
        "fonts.txt",
        FONTS.map((f) => `${f.name}\n  Usage: ${f.usage}\n  Fallback: ${f.fallback}\n  URL: ${f.url}`).join("\n\n")
      );
      zip.file(
        "copy-taglines.txt",
        TAGLINES.join("\n")
      );
      zip.file(
        "README.txt",
        `MosqueList Brand Assets\n\nColors: see colors.json (HEX, RGB, HSL)\nFonts: see fonts.txt (Playfair Display, Inter, Caveat)\nTaglines: see copy-taglines.txt\n\nLogo & Favicon (download from site):\n  Favicon ICO: /favicon.ico\n  Favicon SVG: /favicon.svg\n  Apple Touch: /apple-touch-icon.png\n  96x96: /favicon-96x96.png\n  PWA 192: /web-app-manifest-192x192.png\n  PWA 512: /web-app-manifest-512x512.png\n\nCanonical base URL: https://mosquelist.com`
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mosquelist-brand-assets.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipLoading(false);
    }
  }, []);

  return (
    <>
      <PageSEO
        title="Brand Guide — MosqueList | Colors, Fonts, Voice & Assets"
        description="MosqueList brand guide: primary and secondary colors (HEX, RGB), typography (Playfair Display, Inter, Caveat), voice and tone, personas, logo and favicon, and downloadable brand assets."
        path="/brand"
        canonical="https://mosquelist.com/brand"
      />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-background to-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              MosqueList Brand Guide
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Colors, typography, voice, personas, and assets for consistent use across product and marketing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={downloadBrandZip} disabled={zipLoading} className="gap-2">
                <Download className="h-4 w-4" aria-hidden />
                {zipLoading ? "Preparing…" : "Download brand ZIP"}
              </Button>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="py-12 md:py-16" aria-labelledby="colors-heading">
          <div className="container mx-auto px-4">
            <h2 id="colors-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Color palette
            </h2>
            <p className="mt-2 text-muted-foreground">
              Primary (gold) and secondary (warm beige, teal). Copy HEX or RGB below; all values are in the downloadable ZIP.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BRAND_COLORS.map((color) => (
                <Card key={color.role} className="overflow-hidden">
                  <div
                    className="h-24 w-full border-b border-border"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{color.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <code className="rounded bg-muted px-2 py-1 font-mono text-foreground">{color.hex}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copyToClipboard(color.hex, `hex-${color.role}`)}
                        aria-label={`Copy ${color.hex}`}
                      >
                        {copiedId === `hex-${color.role}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="rounded bg-muted px-2 py-1 font-mono text-foreground">rgb({color.rgb})</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copyToClipboard(`rgb(${color.rgb})`, `rgb-${color.role}`)}
                        aria-label={`Copy rgb(${color.rgb})`}
                      >
                        {copiedId === `rgb-${color.role}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-muted-foreground">HSL: {color.hsl}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fonts */}
        <section className="border-t border-border bg-muted/20 py-12 md:py-16" aria-labelledby="fonts-heading">
          <div className="container mx-auto px-4">
            <h2 id="fonts-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Typography
            </h2>
            <p className="mt-2 text-muted-foreground">
              Google Fonts: Playfair Display (headings), Inter (body/UI), Caveat (handwriting). Load via CSS or Google Fonts.
            </p>
            <div className="mt-8 space-y-8">
              {FONTS.map((font) => (
                <Card key={font.name}>
                  <CardHeader>
                    <CardTitle className="text-xl" style={{ fontFamily: font.name === "Playfair Display" ? "Playfair Display, Georgia, serif" : font.name === "Caveat" ? "Caveat, cursive" : "Inter, system-ui, sans-serif" }}>
                      {font.name}
                    </CardTitle>
                    <CardDescription>{font.usage} · Fallback: {font.fallback}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground" style={{ fontFamily: font.name === "Playfair Display" ? "Playfair Display, Georgia, serif" : font.name === "Caveat" ? "Caveat, cursive" : "Inter, system-ui, sans-serif" }}>
                      The quick brown fox jumps over the lazy dog. 0123456789. MosqueList — Discover, Save, Visit.
                    </p>
                    <a href={font.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
                      View on Google Fonts →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Voice & tone + blurbs */}
        <section className="border-t border-border py-12 md:py-16" aria-labelledby="voice-heading">
          <div className="container mx-auto px-4">
            <h2 id="voice-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Voice and tone
            </h2>
            <p className="mt-2 text-muted-foreground">
              Reverent, accurate, welcoming, calm. Use in marketing and product copy.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {VOICE_TRAITS.map((t) => (
                <Badge key={t} variant="secondary" className="text-sm">
                  {t}
                </Badge>
              ))}
            </ul>
            <h3 className="mt-10 font-serif text-xl font-semibold text-foreground">Taglines (copy)</h3>
            <ul className="mt-4 space-y-2">
              {TAGLINES.map((line, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground">{line}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => copyToClipboard(line, `tagline-${i}`)}
                    aria-label={`Copy tagline`}
                  >
                    {copiedId === `tagline-${i}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Personas */}
        <section className="border-t border-border bg-muted/20 py-12 md:py-16" aria-labelledby="personas-heading">
          <div className="container mx-auto px-4">
            <h2 id="personas-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Audience personas
            </h2>
            <p className="mt-2 text-muted-foreground">
              Use to shape campaigns, ad copy, and content. From marketing/customer-personas.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {PERSONAS.map((p) => (
                <Card key={p.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <CardDescription>Primary need: {p.need}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-foreground">Key message: &ldquo;{p.message}&rdquo;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Logo & favicon */}
        <section className="border-t border-border py-12 md:py-16" aria-labelledby="logo-heading">
          <div className="container mx-auto px-4">
            <h2 id="logo-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Logo and favicon
            </h2>
            <p className="mt-2 text-muted-foreground">
              Wordmark is &ldquo;MosqueList&rdquo; in Playfair Display with favicon. Assets available in public.
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <img src="/favicon.ico" alt="Favicon ICO" className="h-16 w-16 object-contain" width={64} height={64} />
                <span className="text-xs text-muted-foreground">favicon.ico</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/favicon.svg" alt="Favicon SVG" className="h-16 w-16 object-contain" width={64} height={64} />
                <span className="text-xs text-muted-foreground">favicon.svg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/apple-touch-icon.png" alt="Apple Touch Icon" className="h-16 w-16 object-contain" width={64} height={64} />
                <span className="text-xs text-muted-foreground">apple-touch-icon.png</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src="/favicon-96x96.png" alt="Favicon 96x96" className="h-16 w-16 object-contain" width={64} height={64} />
                <span className="text-xs text-muted-foreground">favicon-96x96.png</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-4">
                <img src="/favicon.ico" alt="" className="h-8 w-8" width={32} height={32} aria-hidden />
                <span className="font-serif text-xl font-semibold text-foreground">MosqueList</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons & components (Storybook-like) */}
        <section className="border-t border-border bg-muted/20 py-12 md:py-16" aria-labelledby="components-heading">
          <div className="container mx-auto px-4">
            <h2 id="components-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Buttons and components
            </h2>
            <p className="mt-2 text-muted-foreground">
              Primary UI building blocks. Use shadcn/ui with theme variables.
            </p>
            <div className="mt-8 space-y-10">
              <div>
                <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Input</h3>
                <Input placeholder="Placeholder text" className="max-w-xs" />
              </div>
              <div>
                <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Card</h3>
                <Card className="max-w-sm">
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Card description or supporting text.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Body content. Use for mosque cards, list previews, and feature blocks.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Background variants */}
        <section className="border-t border-border py-12 md:py-16" aria-labelledby="backgrounds-heading">
          <div className="container mx-auto px-4">
            <h2 id="backgrounds-heading" className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Background variants
            </h2>
            <p className="mt-2 text-muted-foreground">
              Use for sections and contrast. All are mobile-friendly.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-6">
                <p className="font-medium text-foreground">Default (background)</p>
                <p className="mt-1 text-sm text-muted-foreground">Paper-like warm white. Main page background.</p>
              </div>
              <div className="rounded-lg border border-border bg-muted p-6">
                <p className="font-medium text-foreground">Muted</p>
                <p className="mt-1 text-sm text-muted-foreground">Subtle sections and cards.</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="font-medium text-foreground">Card</p>
                <p className="mt-1 text-sm text-muted-foreground">Cards and elevated surfaces.</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-6">
                <p className="font-medium text-foreground">Primary tint</p>
                <p className="mt-1 text-sm text-muted-foreground">Highlights and CTAs.</p>
              </div>
              <div className="rounded-lg border border-accent/30 bg-accent/10 p-6">
                <p className="font-medium text-foreground">Accent tint</p>
                <p className="mt-1 text-sm text-muted-foreground">Teal accent for variety.</p>
              </div>
              <div className="rounded-lg border border-border bg-gradient-to-br from-background via-muted/30 to-primary/5 p-6">
                <p className="font-medium text-foreground">Gradient</p>
                <p className="mt-1 text-sm text-muted-foreground">Hero or feature sections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download again + footer */}
        <section className="border-t border-border bg-muted/20 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground">Download brand assets</h2>
            <p className="mt-2 text-muted-foreground">
              ZIP includes colors.json, fonts.txt, copy-taglines.txt, and README with favicon URLs.
            </p>
            <Button onClick={downloadBrandZip} disabled={zipLoading} className="mt-6 gap-2">
              <Download className="h-4 w-4" aria-hidden />
              {zipLoading ? "Preparing…" : "Download mosquelist-brand-assets.zip"}
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
