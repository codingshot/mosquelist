import { useEffect } from "react";
import type { Mosque } from "@/types/mosque";

const SITE_URL = "https://mosquelist.com";

interface MosqueSEOProps {
  mosque: Mosque;
}

const DEFAULT_TITLE = "MosqueList - Discover the World's Most Magnificent Mosques";
const DEFAULT_DESC = "Explore, plan, and track your spiritual journey to the world's most beautiful and significant mosques. From Mecca to Istanbul, create your personal prayer bucket list.";
const DEFAULT_URL = SITE_URL;
const DEFAULT_IMAGE = `${SITE_URL}/web-app-manifest-512x512.png`;

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el) el.setAttribute(attr, value);
}

export function MosqueSEO({ mosque }: MosqueSEOProps) {
  useEffect(() => {
    const title = `${mosque.name} - ${mosque.location}, ${mosque.country} | MosqueList`;
    const description =
      mosque.description.slice(0, 155) + (mosque.description.length > 155 ? "…" : "");
    const url = `${SITE_URL}/mosque/${mosque.id}`;
    const image = mosque.imageUrl.startsWith("http") ? mosque.imageUrl : `${SITE_URL}${mosque.imageUrl}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);
    setMeta('link[rel="canonical"]', "href", url);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "content", DEFAULT_DESC);
      setMeta('meta[property="og:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "content", DEFAULT_DESC);
      setMeta('meta[property="og:url"]', "content", DEFAULT_URL);
      setMeta('meta[property="og:image"]', "content", DEFAULT_IMAGE);
      setMeta('meta[name="twitter:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', "content", DEFAULT_DESC);
      setMeta('meta[name="twitter:image"]', "content", DEFAULT_IMAGE);
      setMeta('link[rel="canonical"]', "href", DEFAULT_URL);
    };
  }, [mosque]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: mosque.name,
    description: mosque.description,
    address: {
      "@type": "PostalAddress",
      ...(mosque.address && { streetAddress: mosque.address }),
      addressLocality: mosque.location,
      addressCountry: mosque.country,
    },
    ...(mosque.imageUrl && {
      image: mosque.imageUrl.startsWith("http") ? mosque.imageUrl : `${SITE_URL}${mosque.imageUrl}`,
    }),
    amenityFeature: mosque.facilities?.map((f) => ({ "@type": "LocationFeatureSpecification", name: f })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
