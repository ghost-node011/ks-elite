import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Link2 } from "lucide-react";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import { fetchPostBySlug, fetchPublishedPosts, resolveImageUrl } from "../lib/api";

// lucide-react dropped brand/logo icons — same workaround as Footer.jsx's LinkedinIcon.
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
        <div className="max-w-6xl mx-auto">
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
            <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
              <Reveal>
                <div className="max-w-3xl">
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

                  <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight mb-8">{post.title}</h1>

                  <div className="flex items-center justify-end gap-3 mb-8 pb-8 border-b text-[var(--fg-muted)]" style={{ borderColor: "var(--line)" }}>
                    <span className="font-mono text-[10px] uppercase tracking-wide">Share</span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--accent)] transition-colors"
                      aria-label="Share on X"
                    >
                      <XIcon width={16} height={16} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--accent)] transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <LinkedinIcon width={16} height={16} />
                    </a>
                    <button onClick={copyLink} className="hover:text-[var(--accent)] transition-colors" aria-label="Copy link">
                      <Link2 size={16} />
                    </button>
                    {copied && <span className="text-xs" style={{ color: "var(--accent)" }}>Copied!</span>}
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
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <aside className="flex flex-col gap-8 lg:sticky lg:top-28">
                  {post.authorName && (
                    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
                      <div className="flex items-center gap-3 mb-1">
                        {post.authorImage ? (
                          <img
                            src={resolveImageUrl(post.authorImage)}
                            alt={post.authorName}
                            className="w-14 h-14 rounded-full object-cover border shrink-0"
                            style={{ borderColor: "var(--line)" }}
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                            style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}
                          >
                            {post.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-display font-bold text-sm">{post.authorName}</p>
                          {post.authorLinkedIn && (
                            <a
                              href={post.authorLinkedIn}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs hover:text-[var(--accent)] transition-colors"
                              style={{ color: "var(--accent)" }}
                            >
                              <LinkedinIcon width={12} height={12} />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                      {post.authorDescription && (
                        <p className="text-sm text-[var(--fg-muted)] mt-3 leading-relaxed">{post.authorDescription}</p>
                      )}
                    </div>
                  )}

                  {related.length > 0 && (
                    <div>
                      <h2 className="font-mono text-xs uppercase tracking-wide text-[var(--fg-muted)] mb-4">More on {post.category}</h2>
                      <div className="flex flex-col gap-4">
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
                </aside>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
