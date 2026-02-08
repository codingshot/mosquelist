import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Blog - MosqueList | Guides to Visiting Mosques & Spiritual Journey"
        description="Fact-checked articles on planning mosque visits, visitor etiquette, best times to travel, Islamic architecture, and building your spiritual bucket list."
        path="/blog"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-16 md:py-24">
        <header className="max-w-3xl mb-12 md:mb-16">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Guides and articles to help you plan mosque visits, understand etiquette,
            and make the most of your spiritual journey. Fact-checked and practical.
          </p>
        </header>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-xl"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
