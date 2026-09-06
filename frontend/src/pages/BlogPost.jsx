import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ExternalLink, Linkedin, Link2, Twitter } from "lucide-react";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import { fetchPostBySlug, fetchPublishedPosts, resolveImageUrl } from "../lib/api";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function readingTime(post) {
  const words = (post.sections || [])
    .map((s) => (s.text || "").replace(/<[^>]+>/g, " "))
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPost(null);
    setError("");
    setRelated([]);
    fetchPostBySlug(slug)
      .then((p) => {
        setPost(p);
        fetchPublishedPosts()
          .then((all) => setRelated(all.filter((o) => o.category === p.category && o.slug !== p.slug).slice(0, 3)))
          .catch(() => {});
      })
      .catch(() => setError("This post couldn't be found."));
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Layout>
      <section className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          {error && <p className="text-sm text-[var(--fg-muted)]">{error}</p>}
          {!error && !post && <p className="text-sm text-[var(--fg-muted)] font-mono uppercase tracking-wide">Loading…</p>}

          {post && (
            <Reveal>
              <div className="flex flex-wrap items-center gap-4 mb-5 font-mono text-[11px] uppercase tracking-wide text-[var(--fg-muted)]">
                <span
                  className="px-3 py-1 rounded-full font-semibold"
                  style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {readingTime(post)} min read
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b" style={{ borderColor: "var(--line)" }}>
                {post.authorName ? (
                  <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                    <span>
                      By <span className="font-medium text-[var(--fg)]">{post.authorName}</span>
                    </span>
                    {post.authorLinkedIn && (
                      <a
                        href={post.authorLinkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                      >
                        <ExternalLink size={14} />
                        LinkedIn
                      </a>
                    )}
                  </div>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-3 text-[var(--fg-muted)]">
                  <span className="font-mono text-[10px] uppercase tracking-wide">Share</span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                    aria-label="Share on X"
                  >
                    <Twitter size={16} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--accent)] transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <button onClick={copyLink} className="hover:text-[var(--accent)] transition-colors" aria-label="Copy link">
                    <Link2 size={16} />
                  </button>
                  {copied && <span className="text-xs" style={{ color: "var(--accent)" }}>Copied!</span>}
                </div>
              </div>

              {post.heroImage && (
                <div className="rounded-2xl overflow-hidden mb-10 border" style={{ borderColor: "var(--line)" }}>
                  <img src={resolveImageUrl(post.heroImage)} alt={post.title} className="w-full h-auto" />
                </div>
              )}

              <div className="prose-blog text-[var(--fg)]">
                {post.sections?.map((section, i) => (
                  <div key={i}>
                    {section.text && <div dangerouslySetInnerHTML={{ __html: section.text }} />}
                    {section.image && (
                      <div className="rounded-xl overflow-hidden my-6 border" style={{ borderColor: "var(--line)" }}>
                        <img src={resolveImageUrl(section.image)} alt="" className="w-full h-auto" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {related.length > 0 && (
                <div className="mt-16 pt-10 border-t" style={{ borderColor: "var(--line)" }}>
                  <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-6">More on {post.category}</h2>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        to={`/blog/${r.slug}`}
                        className="group block rounded-xl border p-4 hover:border-[var(--accent)] transition-colors"
                        style={{ borderColor: "var(--line)", background: "var(--card)" }}
                      >
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--fg-muted)] mb-2">
                          <Calendar size={11} />
                          {formatDate(r.date)}
                        </span>
                        <h3 className="font-display font-semibold text-sm leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {r.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          )}
        </div>
      </section>
    </Layout>
  );
}
