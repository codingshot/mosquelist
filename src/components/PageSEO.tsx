import { useEffect } from "react";

const SITE_URL = "https://mosquelist.com";
const DEFAULT_IMAGE = `${SITE_URL}/mosquelistmeta.jpeg`;

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  /** Optional absolute URL for social preview (og:image, twitter:image). Defaults to site meta image. */
  ogImage?: string;
  /** Optional alt text for og:image and twitter:image. Defaults to title. */
  ogImageAlt?: string;
  /** og:type — use "article" for blog posts. Default "website". */
  ogType?: "website" | "article";
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el) el.setAttribute(attr, value);
}

export function PageSEO({ title, description, path, canonical, ogImage, ogImageAlt, ogType = "website" }: PageSEOProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const canonicalUrl = canonical ?? url;
    const image = ogImage?.trim() && ogImage.startsWith("http") ? ogImage : DEFAULT_IMAGE;
    const imageAlt = (ogImageAlt ?? title).slice(0, 420);
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:image:alt"]', "content", imageAlt);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);
    setMeta('meta[name="twitter:image:alt"]', "content", imageAlt);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);

    return () => {
      document.title = "MosqueList - Discover the World's Most Magnificent Mosques";
      setMeta('meta[name="description"]', "content", "Explore, plan, and track your spiritual journey to the world's most beautiful and significant mosques. From Mecca to Istanbul, create your personal prayer bucket list.");
      setMeta('meta[property="og:title"]', "content", "MosqueList - Discover the World's Most Magnificent Mosques");
      setMeta('meta[property="og:description"]', "content", "Explore 199+ mosques in 50+ countries. From the three holiest sites in Islam to architectural masterpieces. Create your personal prayer bucket list.");
      setMeta('meta[property="og:url"]', "content", SITE_URL);
      setMeta('meta[property="og:image"]', "content", DEFAULT_IMAGE);
      setMeta('meta[property="og:image:alt"]', "content", "MosqueList - Discover mosques worldwide");
      setMeta('meta[name="twitter:title"]', "content", "MosqueList - Discover the World's Most Magnificent Mosques");
      setMeta('meta[name="twitter:description"]', "content", "Explore 199+ mosques in 50+ countries. Create your personal prayer bucket list.");
      setMeta('meta[name="twitter:image"]', "content", DEFAULT_IMAGE);
      setMeta('meta[name="twitter:image:alt"]', "content", "MosqueList - Discover mosques worldwide");
      setMeta('meta[property="og:type"]', "content", "website");
      setMeta('link[rel="canonical"]', "href", SITE_URL);
    };
  }, [title, description, path, canonical, ogImage, ogImageAlt, ogType]);

  return null;
}
