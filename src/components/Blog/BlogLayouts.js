import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { posts } from "../../utils/blogData";
import { motion } from "framer-motion";

// ════════════════════════════════════════════════════════════════════
// LAYOUT 1 — CINEMATIC HERO  (Post IDs: 1)
// Full-bleed hero + 4-img grid + numbered sections + related posts
// ════════════════════════════════════════════════════════════════════
export function Layout1ModernMinimalist({ post }) {
  const relatedPosts = posts.filter((p) => post.relatedIds?.includes(p.id));
  const cardImages = [post.heroImage, ...(post.galleryImages || [])].slice(
    0,
    4
  );

  return (
    <div className="l1ch-root">
      <style>{`
        .l1ch-root {
          min-height: 100vh;
          background: #fff;
          overflow-x: hidden;
          font-family: "Inter", "Poppins", sans-serif;
        }

        /* ─── HERO ─── */
        .l1ch-hero {
          position: relative;
          width: 100%;
          height: 80vh;
          min-height: 500px;
          overflow: hidden;
        }
        .l1ch-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 18s ease;
        }
        .l1ch-hero:hover .l1ch-hero-img { transform: scale(1.06); }
        .l1ch-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.12) 100%);
        }
        .l1ch-cat-badge {
          position: absolute;
          top: 28px;
          right: 28px;
          z-index: 20;
          background: #00A4C4;
          color: #fff !important;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,164,196,0.35);
        }
        .l1ch-title-wrap {
          position: absolute;
          bottom: 36px;
          left: 0;
          right: 0;
          z-index: 10;
          padding: 0 24px;
          display: flex;
          justify-content: center;
          text-align: center;
        }
        .l1ch-title {
          font-size: clamp(2rem, 7vw, 5.5rem);
          font-weight: 900;
          color: #001F3F !important;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -2px;
          max-width: 1300px;
        }

        /* ─── META ─── */
        .l1ch-meta {
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .l1ch-meta-badges { display: flex; align-items: center; gap: 12px; }
        .l1ch-badge-read {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,164,196,0.1); color: #00A4C4 !important;
          padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600;
        }
        .l1ch-badge-date {
          background: #f9fafb; color: #9ca3af !important;
          padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 500;
        }
        .l1ch-desc {
          color: #4b5563 !important; font-size: 17px !important;
          line-height: 1.7; max-width: 660px; font-weight: 300;
        }

        /* ─── 4-IMAGE GRID ─── */
        .l1ch-img-grid {
          max-width: 1200px; margin: 0 auto; padding: 56px 24px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
        }
        @media(max-width: 1024px) { .l1ch-img-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 600px) { .l1ch-img-grid { grid-template-columns: 1fr; } }
        .l1ch-img-card {
          position: relative; height: 280px; overflow: hidden;
          border-radius: 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.07); cursor: pointer;
        }
        .l1ch-img-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms ease; }
        .l1ch-img-card:hover img { transform: scale(1.09); }
        .l1ch-img-dim { position: absolute; inset: 0; background: rgba(0,0,0,0.07); transition: background 500ms; }
        .l1ch-img-card:hover .l1ch-img-dim { background: rgba(0,0,0,0); }
        .l1ch-img-cat {
          position: absolute; bottom: 14px; left: 14px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(4px);
          color: #00A4C4 !important; font-size: 10px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 12px; border-radius: 999px;
        }

        /* ─── ARTICLE ─── */
        .l1ch-article { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }
        .l1ch-intro {
          font-size: 19px !important; color: #374151 !important;
          line-height: 1.8; margin-bottom: 60px; font-weight: 300; text-align: center;
        }
        .l1ch-section { margin-bottom: 72px; }
        .l1ch-sec-header {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; margin-bottom: 32px;
        }
        .l1ch-sec-num { font-size: 60px; font-weight: 900; color: #00A4C4; opacity: 0.14; line-height: 1; margin-bottom: 4px; }
        .l1ch-sec-heading { font-size: clamp(20px, 3vw, 30px); font-weight: 900; color: #001F3F !important; line-height: 1.2; text-transform: uppercase; letter-spacing: -0.5px; }
        .l1ch-sec-img {
          width: 100%; height: 340px; overflow: hidden; border-radius: 36px;
          margin-bottom: 32px; box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }
        .l1ch-sec-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ease; }
        .l1ch-sec-img:hover img { transform: scale(1.04); }
        .l1ch-sec-body { color: #4b5563 !important; font-size: 17px !important; line-height: 1.8; text-align: center; max-width: 760px; margin: 0 auto; }
        .l1ch-conclusion {
          background: #f9fafb; border-radius: 36px; padding: 44px;
          border: 1px solid #f3f4f6; text-align: center; margin-top: 44px;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.02);
        }
        .l1ch-conclusion p { color: #374151 !important; font-size: 17px !important; line-height: 1.8; font-weight: 500; }

        /* ─── TAGS ─── */
        .l1ch-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding-top: 52px; }
        .l1ch-tag {
          padding: 9px 18px; border-radius: 999px; border: 1px solid #e5e7eb;
          color: #6b7280 !important; font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; transition: all 0.2s; display: inline-block; text-decoration: none;
        }
        .l1ch-tag:hover { background: #00A4C4; color: #fff !important; border-color: #00A4C4; box-shadow: 0 4px 12px rgba(0,164,196,0.3); }

        /* ─── RELATED ─── */
        .l1ch-related { background: #f9fafb; padding: 64px 24px; }
        .l1ch-related-inner { max-width: 1200px; margin: 0 auto; }
        .l1ch-related-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; }
        .l1ch-related-heading { font-size: 24px !important; font-weight: 900; color: #001F3F !important; text-transform: uppercase; letter-spacing: -0.5px; }
        .l1ch-all-link { color: #00A4C4 !important; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 6px; text-decoration: none; transition: gap 0.2s; }
        .l1ch-all-link:hover { gap: 12px; }
        .l1ch-related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        .l1ch-r-card { background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #f3f4f6; text-decoration: none; display: block; transition: box-shadow 0.3s, transform 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .l1ch-r-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.10); transform: translateY(-4px); }
        .l1ch-r-imgwrap { position: relative; height: 200px; overflow: hidden; }
        .l1ch-r-imgwrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms; }
        .l1ch-r-card:hover .l1ch-r-imgwrap img { transform: scale(1.08); }
        .l1ch-r-catbadge { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.92); color: #00A4C4 !important; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 10px; border-radius: 999px; }
        .l1ch-r-body { padding: 20px; }
        .l1ch-r-title { font-size: 15px !important; font-weight: 700; color: #001F3F !important; line-height: 1.45; margin-bottom: 12px; transition: color 0.2s; }
        .l1ch-r-card:hover .l1ch-r-title { color: #00A4C4 !important; }
        .l1ch-r-meta { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f9fafb; padding-top: 12px; }
        .l1ch-r-date { color: #9ca3af !important; font-size: 11px; font-weight: 500; }
        .l1ch-r-read { color: #00A4C4 !important; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
      `}</style>

      {/* ── Hero ── */}
      <div className="l1ch-hero">
        <img src={post.heroImage} alt={post.title} className="l1ch-hero-img" />
        <div className="l1ch-hero-overlay" />
        <div className="l1ch-cat-badge">{post.category}</div>
        <div className="l1ch-title-wrap">
          <motion.h1
            className="l1ch-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {post.title}
          </motion.h1>
        </div>
      </div>

      {/* ── Meta strip ── */}
      <motion.div
        className="l1ch-meta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="l1ch-meta-badges">
          <span className="l1ch-badge-read">
            <Clock size={14} /> {post.readTime}
          </span>
          <span className="l1ch-badge-date">{post.date}</span>
        </div>
        <p className="l1ch-desc">{post.description}</p>
      </motion.div>

      {/* ── 4-Image Grid ── */}
      <div className="l1ch-img-grid">
        {cardImages.map((img, i) => (
          <motion.div
            key={i}
            className="l1ch-img-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <img src={img} alt={`View ${i + 1}`} />
            <div className="l1ch-img-dim" />
            {i === 0 && <div className="l1ch-img-cat">{post.category}</div>}
          </motion.div>
        ))}
      </div>

      {/* ── Article ── */}
      <div className="l1ch-article">
        <p className="l1ch-intro">{post.content?.intro}</p>
        {post.content?.sections?.map((section, idx) => (
          <motion.div
            key={idx}
            className="l1ch-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="l1ch-sec-header">
              <span className="l1ch-sec-num">0{idx + 1}</span>
              <h2 className="l1ch-sec-heading">{section.heading}</h2>
            </div>
            {section.image && (
              <div className="l1ch-sec-img">
                <img src={section.image} alt={section.heading} />
              </div>
            )}
            {(section.body || section.paragraph) && (
              <p className="l1ch-sec-body">{section.body || section.paragraph}</p>
            )}
          </motion.div>
        ))}
        {post.content?.conclusion && (
          <div className="l1ch-conclusion">
            <p>{post.content.conclusion}</p>
          </div>
        )}
        <div className="l1ch-tags">
          {post.tags?.map((tag) => (
            <span key={tag} className="l1ch-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Related ── */}
      {relatedPosts.length > 0 && (
        <section className="l1ch-related">
          <div className="l1ch-related-inner">
            <div className="l1ch-related-top">
              <h3 className="l1ch-related-heading">More to explore</h3>
              <Link to="/blog" className="l1ch-all-link">
                All stories <ArrowRight size={13} />
              </Link>
            </div>
            <div className="l1ch-related-grid">
              {relatedPosts.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="l1ch-r-card">
                  <div className="l1ch-r-imgwrap">
                    <img src={r.image} alt={r.title} />
                    <div className="l1ch-r-catbadge">{r.category}</div>
                  </div>
                  <div className="l1ch-r-body">
                    <h4 className="l1ch-r-title">{r.title}</h4>
                    <div className="l1ch-r-meta">
                      <p className="l1ch-r-date">{r.date}</p>
                      <p className="l1ch-r-read">
                        <Clock size={11} /> {r.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LAYOUT 2 — EDITORIAL MAGAZINE  (Post IDs: 2)
// Floating hero card (rounded-[60px]) + section cards + sidebar
// ════════════════════════════════════════════════════════════════════
export function Layout2EditorialMagazine({ post }) {
  return (
    <div className="l2em-root">
      <style>{`
        .l2em-root { min-height: 100vh; background: #F8FCFD; padding: 72px 0 80px; font-family: "Inter","Poppins",sans-serif; }

        /* ─── HERO CARD ─── */
        .l2em-hero-wrap { max-width: 1380px; margin: 0 auto 72px; padding: 0 24px; }
        .l2em-hero-card {
          background: #fff; border-radius: 60px; padding: 48px;
          box-shadow: 0 20px 60px rgba(0,164,196,0.05); border: 1px solid #f3f4f6;
          display: flex; flex-direction: column; gap: 36px; align-items: center;
        }
        @media(min-width: 1024px) { .l2em-hero-card { flex-direction: row; gap: 56px; padding: 56px; } }
        .l2em-hero-text { flex: 1; }
        .l2em-cat { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
        .l2em-cat-line { width: 40px; height: 2px; background: #00A4C4; display: block; flex-shrink: 0; }
        .l2em-cat-label { color: #00A4C4 !important; font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; }
        .l2em-title { font-size: clamp(26px, 4vw, 50px); font-weight: 900; color: #001F3F !important; line-height: 1.05; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 24px; }
        .l2em-meta { display: flex; align-items: center; gap: 14px; font-size: 13px; font-weight: 500; }
        .l2em-meta-date { color: #9ca3af !important; }
        .l2em-meta-dot { width: 5px; height: 5px; border-radius: 50%; background: #e5e7eb; display: inline-block; flex-shrink: 0; }
        .l2em-meta-read { color: #00A4C4 !important; display: flex; align-items: center; gap: 6px; }
        .l2em-hero-img-wrap { flex: 1; width: 100%; height: 400px; border-radius: 40px; overflow: hidden; flex-shrink: 0; }
        @media(min-width: 1024px) { .l2em-hero-img-wrap { height: 460px; } }
        .l2em-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s ease; }
        .l2em-hero-img-wrap:hover img { transform: scale(1.04); }

        /* ─── CONTENT GRID ─── */
        .l2em-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr; gap: 48px; }
        @media(min-width: 1024px) { .l2em-content { grid-template-columns: 260px 1fr; } }

        /* sidebar */
        .l2em-sidebar-label { color: #00A4C4 !important; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin-bottom: 16px; }
        .l2em-sidebar-desc { color: #6b7280 !important; font-size: 15px !important; line-height: 1.7; margin-bottom: 36px; }
        .l2em-tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .l2em-tag {
          background: #fff; border: 1px solid #e5e7eb; padding: 6px 16px;
          border-radius: 999px; font-size: 12px; color: #4b5563 !important; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: inline-block;
        }
        .l2em-tag:hover { background: #00A4C4; color: #fff !important; border-color: #00A4C4; }

        /* main */
        .l2em-intro { font-size: 20px !important; color: #001F3F !important; font-weight: 700; line-height: 1.55; margin-bottom: 36px; }
        .l2em-sections { display: flex; flex-direction: column; gap: 32px; }
        .l2em-sec-card {
          background: #fff; border-radius: 32px; padding: 36px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f3f4f6;
          display: flex; flex-direction: column; gap: 28px;
        }
        @media(min-width: 768px) { .l2em-sec-card { flex-direction: row; align-items: flex-start; } }
        .l2em-sec-img-wrap {
          width: 100%; height: 240px; border-radius: 20px; overflow: hidden;
          flex-shrink: 0; position: relative; box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        @media(min-width: 768px) { .l2em-sec-img-wrap { width: 44%; } }
        .l2em-sec-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms; }
        .l2em-sec-img-wrap:hover img { transform: scale(1.05); }
        .l2em-sec-num-badge {
          position: absolute; top: 12px; left: 12px;
          width: 32px; height: 32px; background: rgba(255,255,255,0.92);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #00A4C4 !important; font-weight: 800; font-size: 13px; backdrop-filter: blur(4px);
        }
        .l2em-sec-text { flex: 1; }
        .l2em-sec-heading { font-size: 20px !important; font-weight: 800; color: #001F3F !important; margin-bottom: 14px; line-height: 1.3; }
        .l2em-sec-body { color: #4b5563 !important; font-size: 16px !important; line-height: 1.8; }
        .l2em-conclusion {
          background: #fff; border-radius: 28px; padding: 36px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; margin-top: 32px;
        }
        .l2em-conclusion p { color: #374151 !important; font-size: 17px !important; line-height: 1.8; font-weight: 500; text-align: center; }
      `}</style>

      {/* ── Hero Card ── */}
      <div className="l2em-hero-wrap">
        <motion.div
          className="l2em-hero-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="l2em-hero-text">
            <div className="l2em-cat">
              <span className="l2em-cat-line" />
              <span className="l2em-cat-label">{post.category}</span>
            </div>
            <h1 className="l2em-title">{post.title}</h1>
            <div className="l2em-meta">
              <span className="l2em-meta-date">{post.date}</span>
              <span className="l2em-meta-dot" />
              <span className="l2em-meta-read">
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>
          </div>
          <div className="l2em-hero-img-wrap">
            <img src={post.heroImage} alt={post.title} />
          </div>
        </motion.div>
      </div>

      {/* ── Content Grid ── */}
      <div className="l2em-content">
        {/* Sidebar */}
        <div>
          <div className="l2em-sidebar-label">Summary</div>
          <p className="l2em-sidebar-desc">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <>
              <div className="l2em-sidebar-label">Topics</div>
              <div className="l2em-tags-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="l2em-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main */}
        <div>
          {post.content?.intro && (
            <p className="l2em-intro">{post.content.intro}</p>
          )}
          <div className="l2em-sections">
            {post.content?.sections?.map((section, idx) => (
              <motion.div
                key={idx}
                className="l2em-sec-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                {section.image && (
                  <div className="l2em-sec-img-wrap">
                    <img src={section.image} alt={section.heading} />
                    <div className="l2em-sec-num-badge">{idx + 1}</div>
                  </div>
                )}
                <div className="l2em-sec-text">
                  {section.heading && (
                    <h3 className="l2em-sec-heading">{section.heading}</h3>
                  )}
                  {(section.body || section.paragraph) && (
                    <p className="l2em-sec-body">
                      {section.body || section.paragraph}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {post.content?.conclusion && (
            <div className="l2em-conclusion">
              <p>{post.content.conclusion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LAYOUT 3 — IMMERSIVE WHITE  (Post IDs: 3, 5)
// White bg + floating meta bar + alternating sections + offset decor
// ════════════════════════════════════════════════════════════════════
export function Layout3ImmersiveDark({ post }) {
  return (
    <div className="l3iw-root">
      <style>{`
        .l3iw-root { min-height: 100vh; background: #fff; overflow-x: hidden; font-family: "Inter","Poppins",sans-serif; }

        /* ─── HERO ─── */
        .l3iw-hero { position: relative; width: 100%; height: 58vh; min-height: 380px; overflow: hidden; }
        .l3iw-hero img { width: 100%; height: 100%; object-fit: cover; }
        .l3iw-hero-dim { position: absolute; inset: 0; background: rgba(0,0,0,0.14); }

        /* ─── FLOATING META BAR ─── */
        .l3iw-meta-outer { max-width: 960px; margin: -44px auto 72px; padding: 0 24px; position: relative; z-index: 10; }
        .l3iw-meta-card {
          background: #fff; border-radius: 20px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.09); padding: 22px 32px;
          border: 1px solid #f3f4f6; display: flex; flex-wrap: wrap;
          align-items: center; justify-content: space-between; gap: 20px;
        }
        .l3iw-meta-col { min-width: 110px; }
        .l3iw-meta-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af !important; font-weight: 700; margin-bottom: 4px; }
        .l3iw-meta-cat { color: #00A4C4 !important; font-weight: 700; font-size: 14px; }
        .l3iw-meta-date { color: #001F3F !important; font-weight: 700; font-size: 14px; }
        .l3iw-meta-read { color: #001F3F !important; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 6px; }
        .l3iw-meta-read svg { color: #00A4C4; }
        .l3iw-meta-div { width: 1px; height: 36px; background: #f3f4f6; display: none; }
        @media(min-width: 640px) { .l3iw-meta-div { display: block; } }

        /* ─── TITLE ─── */
        .l3iw-title-area { max-width: 860px; margin: 0 auto 72px; padding: 0 24px; text-align: center; }
        .l3iw-title { font-size: clamp(32px, 6vw, 64px); font-weight: 900; color: #001F3F !important; line-height: 1.05; letter-spacing: -1px; margin-bottom: 20px; }
        .l3iw-subtitle { font-size: 18px !important; color: #6b7280 !important; font-weight: 300; line-height: 1.7; max-width: 620px; margin: 0 auto; }

        /* ─── CONTENT ─── */
        .l3iw-content { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
        .l3iw-intro-wrap { margin-bottom: 72px; }
        .l3iw-intro {
          font-size: 19px !important; color: #001F3F !important; line-height: 1.75; font-weight: 500;
          max-width: 760px; border-left: 4px solid #00A4C4; padding-left: 24px;
        }
        .l3iw-sections { display: flex; flex-direction: column; gap: 72px; }
        .l3iw-sec-row { display: flex; flex-direction: column; gap: 36px; align-items: center; }
        @media(min-width: 768px) {
          .l3iw-sec-row-even { flex-direction: row; }
          .l3iw-sec-row-odd { flex-direction: row-reverse; }
        }
        .l3iw-sec-text { flex: 1; }
        .l3iw-sec-num-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .l3iw-sec-circle {
          width: 36px; height: 36px; border-radius: 50%; border: 2px solid #00A4C4;
          display: flex; align-items: center; justify-content: center;
          color: #00A4C4 !important; font-weight: 900; font-size: 13px; flex-shrink: 0;
        }
        .l3iw-sec-heading { font-size: 22px !important; font-weight: 800; color: #001F3F !important; }
        .l3iw-sec-body { color: #4b5563 !important; font-size: 17px !important; line-height: 1.8; margin-top: 14px; }

        .l3iw-sec-img-side { flex: 1; width: 100%; display: flex; justify-content: center; }
        .l3iw-sec-img-inner { position: relative; width: 100%; max-width: 380px; height: 440px; }
        .l3iw-sec-img-inner img { width: 100%; height: 100%; object-fit: cover; border-radius: 36px; box-shadow: 0 20px 56px rgba(0,0,0,0.10); }
        .l3iw-sec-decor-even {
          position: absolute; width: 100%; height: 100%; border-radius: 36px;
          background: rgba(0,164,196,0.09); bottom: -20px; right: -20px; z-index: -1;
        }
        .l3iw-sec-decor-odd {
          position: absolute; width: 100%; height: 100%; border-radius: 36px;
          background: rgba(0,164,196,0.09); top: -20px; left: -20px; z-index: -1;
        }

        .l3iw-conclusion { margin-top: 72px; text-align: center; max-width: 720px; margin-left: auto; margin-right: auto; padding-bottom: 16px; }
        .l3iw-conclusion p { color: #374151 !important; font-size: 17px !important; line-height: 1.8; font-weight: 500; }

        /* ─── TAGS ─── */
        .l3iw-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 52px 24px 72px; border-top: 1px solid #f3f4f6; max-width: 1160px; margin: 0 auto; }
        .l3iw-tag { padding: 8px 18px; border-radius: 999px; background: #f9fafb; color: #4b5563 !important; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .l3iw-tag:hover { background: #00A4C4; color: #fff !important; }
      `}</style>

      {/* ── Hero ── */}
      <div className="l3iw-hero">
        <img src={post.heroImage} alt={post.title} />
        <div className="l3iw-hero-dim" />
      </div>

      {/* ── Floating Meta Bar ── */}
      <div className="l3iw-meta-outer">
        <motion.div
          className="l3iw-meta-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="l3iw-meta-col">
            <p className="l3iw-meta-label">Category</p>
            <p className="l3iw-meta-cat">{post.category}</p>
          </div>
          <div className="l3iw-meta-div" />
          <div className="l3iw-meta-col">
            <p className="l3iw-meta-label">Published</p>
            <p className="l3iw-meta-date">{post.date}</p>
          </div>
          <div className="l3iw-meta-div" />
          <div className="l3iw-meta-col">
            <p className="l3iw-meta-label">Read Time</p>
            <p className="l3iw-meta-read">
              <Clock size={13} /> {post.readTime}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Title ── */}
      <div className="l3iw-title-area">
        <motion.h1
          className="l3iw-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {post.title}
        </motion.h1>
        <motion.p
          className="l3iw-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {post.description}
        </motion.p>
      </div>

      {/* ── Content ── */}
      <div className="l3iw-content">
        {post.content?.intro && (
          <div className="l3iw-intro-wrap">
            <p className="l3iw-intro">{post.content.intro}</p>
          </div>
        )}

        <div className="l3iw-sections">
          {post.content?.sections?.map((section, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                className={`l3iw-sec-row ${isEven ? "l3iw-sec-row-even" : "l3iw-sec-row-odd"}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="l3iw-sec-text">
                  <div className="l3iw-sec-num-row">
                    <span className="l3iw-sec-circle">{idx + 1}</span>
                    <h2 className="l3iw-sec-heading">{section.heading}</h2>
                  </div>
                  <p className="l3iw-sec-body">
                    {section.body || section.paragraph}
                  </p>
                </div>
                {section.image && (
                  <div className="l3iw-sec-img-side">
                    <div className="l3iw-sec-img-inner">
                      <img src={section.image} alt={section.heading} />
                      <div
                        className={
                          isEven ? "l3iw-sec-decor-even" : "l3iw-sec-decor-odd"
                        }
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {post.content?.conclusion && (
          <div className="l3iw-conclusion">
            <p>{post.content.conclusion}</p>
          </div>
        )}
      </div>

      {/* ── Tags ── */}
      <div className="l3iw-tags">
        {post.tags?.map((tag) => (
          <span key={tag} className="l3iw-tag">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LAYOUT 4 — ASYMMETRIC MOSAIC / TIMELINE  (Post IDs: 4, 6)
// Tall hero + overlapping gallery cards + vertical timeline + summary
// ════════════════════════════════════════════════════════════════════
export function Layout4AsymmetricMosaic({ post }) {
  const cardImages = [post.heroImage, ...(post.galleryImages || [])].slice(
    0,
    4
  );

  return (
    <div className="l4am-root">
      <style>{`
        .l4am-root { min-height: 100vh; background: #fff; font-family: "Inter","Poppins",sans-serif; overflow-x: hidden; }

        /* ─── HERO ─── */
        .l4am-hero { position: relative; width: 100%; height: 72vh; min-height: 480px; overflow: hidden; }
        .l4am-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .l4am-hero-ov1 { position: absolute; inset: 0; background: rgba(0,0,0,0.44); }
        .l4am-hero-ov2 { position: absolute; inset: 0; background: linear-gradient(to top, #fff 0%, transparent 42%); }
        .l4am-hero-title {
          position: absolute; bottom: 30%; left: 0; right: 0; z-index: 10;
          font-size: clamp(2.2rem, 9vw, 8rem); font-weight: 900;
          color: rgba(255,255,255,0.92) !important; text-transform: uppercase;
          letter-spacing: -3px; line-height: 0.95; text-align: center;
          padding: 0 20px; text-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        /* ─── GALLERY CARDS (overlapping) ─── */
        .l4am-gallery { position: absolute; bottom: -20%; left: 0; right: 0; z-index: 20; display: flex; justify-content: center; padding: 0 24px; }
        .l4am-gallery-inner { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .l4am-gallery-inner::-webkit-scrollbar { display: none; }
        .l4am-gcard {
          width: 140px; height: 220px; flex-shrink: 0; border-radius: 18px;
          overflow: hidden; box-shadow: 0 20px 48px rgba(0,0,0,0.20);
          border: 4px solid #fff; position: relative;
        }
        @media(min-width: 768px) { .l4am-gcard { width: 180px; height: 280px; } }
        .l4am-gcard img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms; }
        .l4am-gcard:hover img { transform: scale(1.08); }
        .l4am-gcard-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 52%); }
        .l4am-gcard-tag { position: absolute; bottom: 12px; left: 12px; right: 12px; color: #fff !important; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3; }

        /* ─── SPACER after gallery ─── */
        .l4am-spacer { height: 140px; }
        @media(min-width: 768px) { .l4am-spacer { height: 180px; } }

        /* ─── INTRO ─── */
        .l4am-intro { max-width: 920px; margin: 0 auto 72px; padding: 0 24px; text-align: center; }
        .l4am-intro-desc { font-size: 22px !important; font-weight: 700; color: #001F3F !important; line-height: 1.5; margin-bottom: 20px; }
        .l4am-intro-body { font-size: 17px !important; color: #6b7280 !important; line-height: 1.8; font-weight: 300; }
        .l4am-intro-meta { display: flex; justify-content: center; gap: 20px; margin-top: 28px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af !important; }
        .l4am-intro-read { display: flex; align-items: center; gap: 6px; color: #9ca3af !important; }
        .l4am-intro-read svg { color: #00A4C4; }

        /* ─── TIMELINE DIVIDER ─── */
        .l4am-divider { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 20px; margin-bottom: 56px; }
        .l4am-div-line { flex: 1; height: 1px; background: #e5e7eb; }
        .l4am-div-label { font-size: 22px !important; font-weight: 900; color: #001F3F !important; text-transform: uppercase; letter-spacing: -0.5px; white-space: nowrap; }

        /* ─── TIMELINE ─── */
        .l4am-timeline { max-width: 1200px; margin: 0 auto; padding: 0 24px 72px; position: relative; }
        .l4am-tline-vline { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: #f3f4f6; transform: translateX(-50%); display: none; }
        @media(min-width: 1024px) { .l4am-tline-vline { display: block; } }
        .l4am-tline-items { display: flex; flex-direction: column; gap: 56px; }

        .l4am-titem { display: flex; flex-direction: column; gap: 28px; align-items: center; position: relative; }
        @media(min-width: 1024px) {
          .l4am-titem-even { flex-direction: row; }
          .l4am-titem-odd { flex-direction: row-reverse; }
        }
        .l4am-titem-dot { display: none; }
        @media(min-width: 1024px) {
          .l4am-titem-dot {
            display: block; position: absolute; left: 50%; top: 50%;
            width: 14px; height: 14px; background: #00A4C4; border-radius: 50%;
            transform: translate(-50%,-50%); border: 4px solid #fff;
            box-shadow: 0 0 0 2px #e5e7eb; z-index: 10;
          }
        }
        .l4am-titem-text { flex: 1; width: 100%; }
        @media(min-width: 1024px) {
          .l4am-titem-even .l4am-titem-text { padding-right: 56px; text-align: right; }
          .l4am-titem-odd .l4am-titem-text { padding-left: 56px; }
        }
        .l4am-titem-num { font-size: 36px; font-weight: 900; color: #00A4C4; opacity: 0.16; line-height: 1; display: block; margin-bottom: 2px; }
        .l4am-titem-heading { font-size: 20px !important; font-weight: 800; color: #001F3F !important; margin-bottom: 10px; line-height: 1.3; }
        .l4am-titem-body { color: #4b5563 !important; font-size: 16px !important; line-height: 1.8; }
        .l4am-titem-imgwrap { flex: 1; width: 100%; }
        @media(min-width: 1024px) {
          .l4am-titem-even .l4am-titem-imgwrap { padding-left: 56px; }
          .l4am-titem-odd .l4am-titem-imgwrap { padding-right: 56px; }
        }
        .l4am-titem-img { width: 100%; max-width: 360px; height: 260px; overflow: hidden; border-radius: 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid #f3f4f6; margin: 0 auto; }
        .l4am-titem-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms; }
        .l4am-titem-img:hover img { transform: scale(1.05); }
        .l4am-titem-noimg { width: 100%; max-width: 360px; height: 260px; border-radius: 18px; background: #f9fafb; border: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .l4am-titem-noimg span { color: #d1d5db !important; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

        /* ─── SUMMARY ─── */
        .l4am-summary { max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }
        .l4am-summary-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media(min-width: 768px) { .l4am-summary-grid { grid-template-columns: 1fr 1fr; } }
        .l4am-sum-card { background: #f9fafb; border-radius: 28px; padding: 32px; border: 1px solid #f3f4f6; }
        .l4am-sum-label { color: #00A4C4 !important; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-bottom: 14px; }
        .l4am-sum-text { color: #374151 !important; font-size: 15px !important; line-height: 1.8; }
        .l4am-sum-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .l4am-sum-tag { padding: 7px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 12px; font-weight: 700; color: #4b5563 !important; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>

      {/* ── Hero ── */}
      <div className="l4am-hero">
        <img src={post.heroImage} alt={post.title} className="l4am-hero-bg" />
        <div className="l4am-hero-ov1" />
        <div className="l4am-hero-ov2" />
        <motion.h1
          className="l4am-hero-title"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {post.title}
        </motion.h1>

        {/* Gallery cards overlapping hero bottom */}
        <div className="l4am-gallery">
          <div className="l4am-gallery-inner">
            {cardImages.map((img, i) => (
              <motion.div
                key={i}
                className="l4am-gcard"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              >
                <img src={img} alt={`Highlight ${i + 1}`} />
                <div className="l4am-gcard-ov" />
                <div className="l4am-gcard-tag">
                  {post.tags?.[i] || `View 0${i + 1}`}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="l4am-spacer" />

      {/* ── Intro ── */}
      <div className="l4am-intro">
        <h2 className="l4am-intro-desc">{post.description}</h2>
        <p className="l4am-intro-body">{post.content?.intro}</p>
        <div className="l4am-intro-meta">
          <span className="l4am-intro-read">
            <Clock size={13} /> {post.readTime}
          </span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="l4am-divider">
        <div className="l4am-div-line" />
        <h2 className="l4am-div-label">The Story</h2>
        <div className="l4am-div-line" />
      </div>

      <div className="l4am-timeline">
        <div className="l4am-tline-vline" />
        <div className="l4am-tline-items">
          {post.content?.sections?.map((section, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                className={`l4am-titem ${isEven ? "l4am-titem-even" : "l4am-titem-odd"}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="l4am-titem-dot" />
                <div className="l4am-titem-text">
                  <span className="l4am-titem-num">0{idx + 1}</span>
                  <h3 className="l4am-titem-heading">{section.heading}</h3>
                  <p className="l4am-titem-body">
                    {section.body || section.paragraph}
                  </p>
                </div>
                <div className="l4am-titem-imgwrap">
                  {section.image ? (
                    <div className="l4am-titem-img">
                      <img src={section.image} alt={section.heading} />
                    </div>
                  ) : (
                    <div className="l4am-titem-noimg">
                      <span>Continued story</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="l4am-divider">
        <div className="l4am-div-line" />
        <h2 className="l4am-div-label">Wrap Up</h2>
        <div className="l4am-div-line" />
      </div>
      <div className="l4am-summary">
        <div className="l4am-summary-grid">
          <div className="l4am-sum-card">
            <p className="l4am-sum-label">Takeaway</p>
            <p className="l4am-sum-text">{post.content?.conclusion}</p>
          </div>
          <div className="l4am-sum-card">
            <p className="l4am-sum-label">Topics</p>
            <div className="l4am-sum-tags">
              {post.tags?.map((tag) => (
                <span key={tag} className="l4am-sum-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
