import { useEffect } from "react";
import type { CuratedList } from "@/types/list";
import type { Mosque } from "@/types/mosque";

const SITE_URL = "https://mosquelist.com";
const DEFAULT_IMAGE = `${SITE_URL}/mosquelistmeta1.png`;

interface ListSEOProps {
  list: CuratedList;
  mosques: Mosque[];
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el) el.setAttribute(attr, value);
}

/**
 * SEO component for curated list pages with JSON-LD structured data
 */
export function ListSEO({ list, mosques }: ListSEOProps) {
  const title = `${list.name} - MosqueList | ${mosques.length} Curated Mosques`;
  const description = `${list.description} Explore ${mosques.length} mosques in this curated collection on MosqueList.`;
  const url = `${SITE_URL}/lists/${list.slug}`;
  
  // Use first mosque image or default
  const firstMosqueWithImage = mosques.find(m => m.imageLocal || m.imageUrl);
  const image = firstMosqueWithImage?.imageLocal 
    ? `${SITE_URL}${firstMosqueWithImage.imageLocal}`
    : firstMosqueWithImage?.imageUrl || DEFAULT_IMAGE;

  useEffect(() => {
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
      document.title = "MosqueList - Discover the World's Most Magnificent Mosques";
      setMeta('meta[name="description"]', "content", "Explore 100+ mosques in 50+ countries—from the three holiest sites in Islam to architectural masterpieces.");
      setMeta('meta[property="og:url"]', "content", SITE_URL);
      setMeta('link[rel="canonical"]', "href", SITE_URL);
    };
  }, [title, description, url, image]);

  // ItemList structured data for SEO
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.name,
    description: list.description,
    numberOfItems: mosques.length,
    url,
    itemListElement: mosques.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Place",
        name: m.name,
        description: m.description?.slice(0, 160),
        url: `${SITE_URL}/mosque/${m.id}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: m.location,
          addressCountry: m.country,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
    />
  );
}
