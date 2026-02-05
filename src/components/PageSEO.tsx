import { useEffect } from "react";

const SITE_URL = "https://mosquelist.com";
const DEFAULT_IMAGE = `${SITE_URL}/meta.png`;

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  canonical?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el) el.setAttribute(attr, value);
}

export function PageSEO({ title, description, path, canonical }: PageSEOProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const canonicalUrl = canonical ?? url;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", DEFAULT_IMAGE);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", DEFAULT_IMAGE);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);

    return () => {
      document.title = "MosqueList - Discover the World's Most Magnificent Mosques";
      setMeta('meta[name="description"]', "content", "Explore, plan, and track your spiritual journey to the world's most beautiful and significant mosques. From Mecca to Istanbul, create your personal prayer bucket list.");
      setMeta('meta[property="og:url"]', "content", SITE_URL);
      setMeta('link[rel="canonical"]', "href", SITE_URL);
    };
  }, [title, description, path, canonical]);

  return null;
}
