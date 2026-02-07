import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const related = post ? getRelatedPosts(post) : [];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
            Article not found
          </h1>
          <Button asChild variant="outline">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={`${post.title} | MosqueList Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-16 md:py-24">
        <article className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>

          <header className="mb-8">
            <time
              className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4"
              dateTime={post.date}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </time>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              {post.description}
            </p>
          </header>

          <div className="rounded-xl overflow-hidden border border-border bg-card mb-10">
            <img
              src={post.imageUrl}
              alt={post.imageAlt}
              className="w-full aspect-video object-cover"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            {post.paragraphs.map((para, i) => (
              <p key={i} className="text-muted-foreground mb-6 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {related.length > 0 && (
            <aside className="mt-16 pt-12 border-t border-border">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Related articles
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={`/blog/${r.slug}`}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 hover:bg-card/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
                        <img
                          src={r.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {r.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-sm text-primary mt-1">
                          Read more
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
