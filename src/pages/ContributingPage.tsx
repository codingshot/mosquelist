import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, FileJson, MapPin, Building2, Image, Copy, Check } from "lucide-react";
import {
  countriesWithoutMosques,
  citiesNeedingMoreMosques,
} from "@/data/contributing-gaps";

const GITHUB_REPO = "https://github.com/ummahbuild/mosquelist";
const GITHUB_ISSUES = "https://github.com/ummahbuild/mosquelist/issues";

const SCHEMA_EXAMPLE = `{
  "id": "my-mosque-slug",
  "name": "Full Mosque Name",
  "arabicName": "الاسم بالعربية",
  "location": "City Name",
  "country": "Country Name",
  "address": "Street address (optional)",
  "coordinates": { "lat": 40.7128, "lng": -74.0060 },
  "capacity": 5000,
  "established": "2007",
  "area": 12000,
  "annualVisitors": "~1 million",
  "facilities": ["Guided tours", "Wheelchair access", "Library"],
  "significance": "One sentence on religious or historical importance.",
  "description": "2–3 sentence overview for cards and detail page.",
  "imageUrl": "https://upload.wikimedia.org/.../image.jpg",
  "imageLocal": "/images/mosques/my-mosque-slug.jpg",
  "galleryUrls": [
    "https://upload.wikimedia.org/.../photo2.jpg",
    "https://upload.wikimedia.org/.../photo3.jpg"
  ],
  "isHolySite": false,
  "architecturalStyle": "Ottoman",
  "womenPrayerArea": true,
  "touristFriendly": true,
  "sources": ["https://en.wikipedia.org/wiki/...", "https://official-site.org"]
}`;

export default function ContributingPage() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    location: "",
    country: "",
    capacity: "",
    area: "",
    established: "",
    architecturalStyle: "",
    description: "",
    significance: "",
    imageUrl: "",
    galleryUrls: "",
    address: "",
    lat: "",
    lng: "",
    facilities: "",
    sources: "",
    womenPrayerArea: true,
    touristFriendly: false,
    isHolySite: false,
  });
  const [copied, setCopied] = useState(false);

  const generatedJson = useMemo(() => {
    const num = (v: string) => (v.trim() ? Number(v.trim()) : undefined);
    const arr = (v: string) =>
      v
        .trim()
        .split(/[\\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    const obj: Record<string, unknown> = {
      id: form.id.trim() || "my-mosque-slug",
      name: form.name.trim() || "Mosque Name",
      location: form.location.trim() || "City",
      country: form.country.trim() || "Country",
      capacity: num(form.capacity) ?? 0,
      established: form.established.trim() || "YYYY",
      area: num(form.area) ?? 0,
      annualVisitors: "—",
      facilities: arr(form.facilities).length ? arr(form.facilities) : ["—"],
      significance: form.significance.trim() || "—",
      description: form.description.trim() || "—",
      imageUrl: form.imageUrl.trim() || "https://...",
      isHolySite: form.isHolySite,
      architecturalStyle: form.architecturalStyle.trim() || undefined,
      womenPrayerArea: form.womenPrayerArea,
      touristFriendly: form.touristFriendly,
      sources: arr(form.sources).length ? arr(form.sources) : undefined,
    };
    if (form.address.trim()) obj.address = form.address.trim();
    if (form.galleryUrls.trim()) {
      obj.galleryUrls = arr(form.galleryUrls);
    }
    if (form.lat.trim() && form.lng.trim()) {
      const lat = Number(form.lat);
      const lng = Number(form.lng);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        obj.coordinates = { lat, lng };
      }
    }
    return JSON.stringify(obj, null, 2);
  }, [form]);

  const copyJson = () => {
    navigator.clipboard.writeText(generatedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Contribute - MosqueList | Add or Update Mosque Data"
        description="Contribute to MosqueList: add new mosques, update data, or report issues. JSON schema, form, and guidelines. GitHub: codingshot/mosquelist."
        path="/contributing"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Intro */}
          <section>
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-4 border border-border">
              <Github className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Contribute</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Add or update mosque data
            </h1>
            <p className="text-muted-foreground mb-4">
              Suggest new mosques, correct existing data, or open issues on GitHub. Use the form below to generate JSON, then add it to the codebase and open a Pull Request.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MosqueList on GitHub (opens in new tab)"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <a
                  href={GITHUB_ISSUES}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub issues (opens in new tab)"
                >
                  Report issue / Suggest mosque
                </a>
              </Button>
            </div>
          </section>

          {/* JSON schema example */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              JSON schema example
            </h2>
            <p className="text-sm text-muted-foreground">
              Each mosque is one object. Use <strong>imageUrl</strong> for the main image; <strong>galleryUrls</strong> for extra photos (multiple pictures). Include <strong>capacity</strong> (number) and <strong>architecturalStyle</strong> when known.
            </p>
            <pre className="bg-muted border border-border rounded-lg p-4 text-xs overflow-x-auto">
              <code>{SCHEMA_EXAMPLE}</code>
            </pre>
          </section>

          {/* Form */}
          <section className="space-y-6">
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Build your mosque entry
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">ID (slug, lowercase-hyphens)</Label>
                <Input
                  id="id"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="my-mosque-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full Mosque Name"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location (city)</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="Country"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  placeholder="12000"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="established">Established</Label>
                <Input
                  id="established"
                  value={form.established}
                  onChange={(e) => setForm((f) => ({ ...f, established: e.target.value }))}
                  placeholder="2007 or 638 CE"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="architecturalStyle">Architectural style</Label>
                <Input
                  id="architecturalStyle"
                  value={form.architecturalStyle}
                  onChange={(e) => setForm((f) => ({ ...f, architecturalStyle: e.target.value }))}
                  placeholder="Ottoman, Mughal, Modern"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="2–3 sentences for card and detail page."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="significance">Significance (one sentence)</Label>
              <Input
                id="significance"
                value={form.significance}
                onChange={(e) => setForm((f) => ({ ...f, significance: e.target.value }))}
                placeholder="Religious or historical importance."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-1">
                <Image className="w-4 h-4" /> Main image URL
              </Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://upload.wikimedia.org/.../image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="galleryUrls">Extra images (one URL per line)</Label>
              <Textarea
                id="galleryUrls"
                value={form.galleryUrls}
                onChange={(e) => setForm((f) => ({ ...f, galleryUrls: e.target.value }))}
                placeholder="https://...\nhttps://..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Street, city"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude (optional)</Label>
                <Input
                  id="lat"
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                  placeholder="40.7128"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude (optional)</Label>
                <Input
                  id="lng"
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                  placeholder="-74.0060"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (comma or newline)</Label>
              <Textarea
                id="facilities"
                value={form.facilities}
                onChange={(e) => setForm((f) => ({ ...f, facilities: e.target.value }))}
                placeholder="Guided tours, Wheelchair access, Library"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sources">Sources (one URL per line)</Label>
              <Textarea
                id="sources"
                value={form.sources}
                onChange={(e) => setForm((f) => ({ ...f, sources: e.target.value }))}
                placeholder="https://en.wikipedia.org/..."
                rows={2}
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.womenPrayerArea}
                  onChange={(e) => setForm((f) => ({ ...f, womenPrayerArea: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-sm">Women's prayer area</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.touristFriendly}
                  onChange={(e) => setForm((f) => ({ ...f, touristFriendly: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-sm">Non-Muslims can visit</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isHolySite}
                  onChange={(e) => setForm((f) => ({ ...f, isHolySite: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-sm">Holy site (Mecca, Medina, Al-Aqsa only)</span>
              </label>
            </div>
          </section>

          {/* Generated JSON + where to add */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Generated JSON
            </h2>
            <p className="text-sm text-muted-foreground">
              Copy this and add it to <code className="bg-muted px-1 rounded">src/data/mosques.json</code> inside the <code className="bg-muted px-1 rounded">mosques</code> array. Then open a Pull Request at{" "}
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                github.com/codingshot/mosquelist
              </a>.
            </p>
            <div className="relative">
              <pre className="bg-muted border border-border rounded-lg p-4 text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                <code>{generatedJson}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 gap-1"
                onClick={copyJson}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>File structure:</strong> In the repo, open <code className="bg-muted px-1 rounded">src/data/mosques.json</code>. Find the <code className="bg-muted px-1 rounded">"mosques"</code> array and add your new object (with a comma after the previous one). Run <code className="bg-muted px-1 rounded">npm run update-lists</code> after adding to refresh curated lists.
            </p>
          </section>

          {/* Gaps */}
          <section className="space-y-6">
            <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Where to add mosques
            </h2>
            <p className="text-muted-foreground">
              Major countries that don't have any mosque in the list yet, and cities/regions that already have some but could use more.
            </p>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Countries with no mosques yet</h3>
              <ul className="space-y-1 text-sm">
                {countriesWithoutMosques.map((c) => (
                  <li key={c.name} className="flex flex-wrap gap-x-2 gap-y-0">
                    <span className="font-medium text-foreground">{c.name}</span>
                    {c.region && <span className="text-muted-foreground">({c.region})</span>}
                    {c.note && <span className="text-muted-foreground">— {c.note}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Cities / regions that could have more mosques</h3>
              <ul className="space-y-1 text-sm">
                {citiesNeedingMoreMosques.map((c) => (
                  <li key={`${c.city}-${c.country}`} className="flex flex-wrap gap-x-2 gap-y-0">
                    <span className="font-medium text-foreground">{c.city}</span>
                    <span className="text-muted-foreground">({c.country})</span>
                    {c.note && <span className="text-muted-foreground">— {c.note}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              Full list and suggested mosques: see <code className="bg-muted px-1 rounded">docs/missing-countries-and-mosques.md</code> in the repo.
            </p>
          </section>

          <div className="pt-4">
            <Button asChild variant="outline">
              <Link to="/about">Back to About</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
