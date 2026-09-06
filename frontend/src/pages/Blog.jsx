import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { fetchPublishedPosts, resolveImageUrl } from "../lib/api";
import NewsletterSubscribe from "../components/NewsletterSubscribe";

const CATEGORY_IMAGES = {
  Technology: "/images/blog/technology.jpg",
  "Inter-State Dispute": "/images/blog/inter-state-dispute.jpg",
  Courts: "/images/blog/courts.jpg",
  Laws: "/images/blog/laws.jpg",
  Divorce: "/images/blog/divorce.jpg",
  Casteism: "/images/blog/laws.jpg",
  "Minority Educational Institutions": "/images/blog/laws.jpg",
  Writs: "/images/blog/courts.jpg",
  "Intellectual Property": "/images/blog/technology.jpg",
};

function coverImage(post) {
  return resolveImageUrl(post.heroImage) || CATEGORY_IMAGES[post.category] || "/images/blog/laws.jpg";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const listTopRef = useRef(null);

  useEffect(() => {
    fetchPublishedPosts()
      .then(setPosts)
      .catch(() => setError("Couldn't load posts right now — please check back shortly."));
  }, []);

  const selectCategory = (cat) => {
    setActiveCategory(cat);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredPosts = activeCategory ? (posts || []).filter((p) => p.category === activeCategory) : posts || [];
  const [featured, ...rest] = filteredPosts;

  const categoryCounts = (posts || []).reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const mostRead = [...(posts || [])].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  return (
    <Layout>
      <PageHeader
        kicker="Insights"
        title="From the Blog"
        note="Commentary on courts, technology, and the law — written by the K.S. Elite Attorneys team."
        image="/images/practice-areas/property-law.jpg"
      />

      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {error && <p className="text-sm text-[var(--fg-muted)] text-center">{error}</p>}

          {!error && posts === null && (
            <p className="text-sm text-[var(--fg-muted)] text-center font-mono uppercase tracking-wide">Loading…</p>
          )}

          {!error && posts?.length === 0 && (
            <p className="text-sm text-[var(--fg-muted)] text-center">No posts published yet — check back soon.</p>
          )}

          {posts?.length > 0 && (
            <>
              <div ref={listTopRef} className="flex items-center justify-between mb-8 scroll-mt-28">
                <h2 className="font-display font-bold text-xl uppercase tracking-wide">Latest Articles</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => selectCategory(null)}
                  className="rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wide border transition-colors"
                  style={
                    !activeCategory
                      ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--color-navy)" }
                      : { borderColor: "var(--line)", color: "var(--fg-muted)" }
                  }
                >
                  All ({posts.length})
                </button>
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <button
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className="rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wide border transition-colors"
                    style={
                      activeCategory === cat
                        ? { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--color-navy)" }
                        : { borderColor: "var(--line)", color: "var(--fg-muted)" }
                    }
                  >
                    {cat} ({count})
                  </button>
                ))}
              </div>
            </>
          )}

          {!featured && activeCategory && (
            <p className="text-sm text-[var(--fg-muted)] mb-16">No posts in this category yet.</p>
          )}

          {featured && (
            <>
              {/* Featured post */}
              <Reveal>
                <Link to={`/blog/${featured.slug}`}>
                  <article className="hover-pop group relative block overflow-hidden rounded-3xl aspect-[16/9] sm:aspect-[21/9] mb-16">
                    <img
                      src={coverImage(featured)}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(0deg, rgba(6,10,19,0.95) 0%, rgba(6,10,19,0.5) 55%, rgba(6,10,19,0.15) 100%)" }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-12">
                      <div className="flex items-center gap-4 mb-4 font-mono text-[11px] uppercase tracking-wide" style={{ color: "rgba(247,244,236,0.75)" }}>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {formatDate(featured.date)}
                        </span>
                        <span className="flex items-center gap-1.5" style={{ color: "var(--color-gold-soft)" }}>
                          <Tag size={13} />
                          {featured.category}
                        </span>
                      </div>
                      <h2
                        className="font-display font-bold text-2xl sm:text-4xl leading-snug max-w-3xl"
                        style={{ color: "var(--color-ivory)" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed" style={{ color: "rgba(247,244,236,0.72)" }}>
                        {featured.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              </Reveal>

              {/* Remaining posts */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 0.06} y={20}>
                    <Link to={`/blog/${post.slug}`}>
                      <article
                        className="hover-pop group relative block h-full rounded-2xl border overflow-hidden flex flex-col"
                        style={{ borderColor: "var(--line)", background: "var(--card)" }}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={coverImage(post)}
                            alt={post.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                          <span
                            className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{ background: "var(--color-navy)", color: "var(--color-gold-soft)" }}
                          >
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--fg-muted)] mb-2">
                            <Calendar size={12} />
                            {formatDate(post.date)}
                          </span>
                          <h3 className="font-display font-bold text-lg leading-snug flex-1">{post.title}</h3>
                          <p className="text-[var(--fg-muted)] text-sm mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {posts?.length > 0 && (
            <div className="grid lg:grid-cols-[1fr_320px] gap-16 mt-24 pt-16 border-t" style={{ borderColor: "var(--line)" }}>
              <div>
                <h2 className="font-display font-bold text-xl uppercase tracking-wide mb-8">Most Read</h2>
                <div className="flex flex-col gap-6">
                  {mostRead.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group flex gap-5 items-start">
                      <div className="w-28 sm:w-36 aspect-[4/3] shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={coverImage(post)}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--fg-muted)]">
                          <span style={{ color: "var(--accent)" }}>{post.category}</span>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <h3 className="font-display font-semibold text-base leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display font-bold text-xl uppercase tracking-wide mb-8">Categories</h2>
                <div className="flex flex-col">
                  {Object.entries(categoryCounts).map(([cat, count]) => (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className="flex items-center justify-between py-3 border-b text-left hover:text-[var(--accent)] transition-colors"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wide">{cat}</span>
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-mono shrink-0"
                        style={{ background: "var(--color-navy)", color: "var(--color-gold-soft)" }}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <NewsletterSubscribe />
        </div>
      </section>
    </Layout>
  );
}
