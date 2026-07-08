import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Icon from "../Icon";

// ════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════
export function Hero({ posts = [] }) {
  const heroImages =
    posts && posts.length >= 3
      ? [posts[0].image, posts[1].image, posts[2].image]
      : [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518182170546-076616fd6aa5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1414609245224-aea2f68f93a3?auto=format&fit=crop&w=800&q=80",
        ];

  return (
    <section className="hero-mobile-container relative w-full max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden lg:overflow-visible">
      <style>{`
        .hero-mobile-container { min-height: 85vh; }
        .hero-mobile-bg { border-radius: 0 0 40px 40px; overflow: hidden; }
        .hero-gradient {
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.1) 100%);
        }
        .hero-text-mobile-white { color: white !important; text-shadow: 0 4px 16px rgba(0,0,0,0.4); }
        .hero-text-container {
          padding-left: 24px; padding-right: 24px;
          margin-top: auto; padding-top: 8rem; padding-bottom: 2rem; text-align: center;
        }
        .hero-button-wrapper { display: flex; justify-content: center; width: 100%; }
        .hero-desktop-images { display: none; }
        .hero-pill-mobile {
          background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.25);
          color: white !important; padding: 6px 16px; border-radius: 9999px;
          display: inline-block; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        @media (min-width: 1024px) {
          .hero-mobile-container { min-height: auto; }
          .hero-mobile-bg { display: none; }
          .hero-text-container { padding-left: 0; padding-right: 0; margin-top: 0; padding-top: 0; padding-bottom: 0; text-align: left; }
          .hero-button-wrapper { justify-content: flex-start; }
          .hero-desktop-images { display: flex; }
          .hero-text-mobile-white.title { color: var(--blog-title-color) !important; text-shadow: none; }
          .hero-text-mobile-white.desc { color: var(--blog-desc-color) !important; text-shadow: none; }
          .hero-pill-mobile { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border: none; color: #00a4c4 !important; padding: 0; display: block; box-shadow: none; }
        }
      `}</style>

      {/* Mobile background */}
      <div className="absolute inset-0 z-0 hero-mobile-bg">
        <img src={heroImages[0]} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Left — Typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hero-text-container flex-1 z-10 w-full"
      >
        <div style={{ marginBottom: "32px" }}>
          <p className="hero-pill-mobile font-semibold tracking-widest text-sm uppercase">
            Our Blog
          </p>
        </div>

        {/* FIX: Added "journeys" italic word matching reference design */}
        <h1 className="hero-text-mobile-white title text-4xl md:text-6xl lg:text-[80px] font-bold leading-[1.1] mb-6">
          Stories that{" "}
          <br className="hidden md:block" />
          inspire{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--color-brand)",
            }}
          >
            journeys
          </span>
        </h1>

        {/* FIX: Corrected description text to match reference */}
        <p
          className="hero-text-mobile-white desc text-lg md:text-xl max-w-md mx-auto lg:mx-0 mb-8"
          style={{ marginTop: "40px", marginBottom: "48px" }}
        >
          Travel guides, hidden gems and real stories from around the world.
        </p>

        <div className="hero-button-wrapper">
          <button
            className="group flex items-center gap-4 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-md"
            style={{ backgroundColor: "#00a4c4" }}
          >
            Explore All Posts
            <span
              className="bg-white rounded-full p-1.5 group-hover:translate-x-1 transition-transform"
              style={{ color: "#00a4c4" }}
            >
              <ArrowRight size={20} />
            </span>
          </button>
        </div>
      </motion.div>

      {/* Right — Images */}
      <div className="hero-desktop-images flex-1 relative h-[380px] sm:h-[500px] lg:h-[600px] w-full items-center justify-center mt-8 lg:mt-0">
        <div className="absolute top-10 left-10 flex gap-2 rotate-12 opacity-40">
          <div className="w-4 h-8 bg-cyan-200 rounded-full" />
          <div className="w-4 h-8 bg-cyan-200 rounded-full mt-4" />
          <div className="w-4 h-8 bg-cyan-200 rounded-full mt-2" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 lg:top-10 left-[10%] lg:left-0 w-[80%] lg:w-[60%] h-[55%] lg:h-[80%] z-10 overflow-hidden rounded-[140px_140px_20px_20px] lg:rounded-[140px_40px_140px_40px]"
        >
          <img
            src={heroImages[0]}
            alt="Hero blog post 1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-4 left-0 lg:left-auto lg:top-0 right-auto lg:right-4 w-[45%] h-[40%] lg:h-[45%] z-20 rounded-full overflow-hidden border-[4px] lg:border-[6px] border-white shadow-xl"
        >
          <img
            src={heroImages[1]}
            alt="Hero blog post 2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 right-[5%] lg:right-0 w-[45%] lg:w-[55%] h-[45%] lg:h-[45%] z-20 overflow-hidden border-[4px] lg:border-[6px] border-white shadow-xl rounded-[60px_60px_40px_40px] lg:rounded-[60px_100px_40px_120px]"
        >
          <img
            src={heroImages[2]}
            alt="Hero blog post 3"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════
// FILTERS
// FIX: max-width 1280px, inactive pill = bg-white
// ════════════════════════════════════════════
const categories = ["All Posts", "Experience", "Event", "Stay"];

export function Filters({
  searchQuery = "",
  setSearchQuery = () => {},
  selectedCategory = "All Posts",
  setSelectedCategory = () => {},
}) {
  return (
    <section
      className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between"
      style={{
        maxWidth: "1280px",
        marginTop: "32px",
        marginBottom: "64px",
        gap: "24px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .filter-search-wrap { max-width: 100%; }
        .filter-pill { font-size: 13px !important; padding: 8px 16px !important; }
        @media (min-width: 768px) {
          .filter-search-wrap { max-width: 300px; }
          .filter-pill { font-size: 14px !important; padding: 10px 22px !important; }
        }
      `}</style>

      {/* Category Pills — FIX: inactive uses bg-white instead of transparent */}
      <div
        className="flex items-center w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0"
        style={{ gap: "12px", flexWrap: "nowrap", WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="filter-pill rounded-full font-medium transition-all flex-shrink-0"
              style={{
                color: isActive ? "#ffffff" : "#374151",
                backgroundColor: isActive ? "#00a4c4" : "#ffffff",
                border: isActive ? "1px solid #00a4c4" : "1px solid #e5e7eb",
                boxShadow: isActive
                  ? "0 4px 12px rgba(0,164,196,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div
        className="filter-search-wrap flex items-center rounded-full shadow-sm transition-all w-full"
        style={{
          padding: "4px 4px 4px 20px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 font-medium"
          style={{ fontSize: "15px", color: "var(--blog-title-color)" }}
        />
        <button
          className="text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-2 shadow-sm hover:opacity-90"
          style={{ width: "40px", height: "40px", backgroundColor: "#00a4c4" }}
        >
          <Icon name="search" size={18} className="fill-current" />
        </button>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════
// BLOG CARD
// ════════════════════════════════════════════
export function BlogCard({
  slug,
  image,
  category,
  title,
  description,
  date,
  readTime,
  imageClassName = "h-56 rounded-3xl",
  badgeIcon,
}) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="flex flex-col group cursor-pointer"
      style={{ textDecoration: "none" }}
    >
      <article className="flex flex-col h-full">
        <div className={`relative w-full overflow-hidden mb-5 ${imageClassName}`}>
          <img
            src={image}
            alt={title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          {badgeIcon && (
            <div
              className="absolute -bottom-4 left-6 text-white p-2.5 rounded-full shadow-lg z-10 border-[3px] border-white"
              style={{ backgroundColor: "#00a4c4" }}
            >
              {badgeIcon}
            </div>
          )}
        </div>

        <div
          className="flex flex-col flex-1"
          style={{ padding: "0 12px", marginTop: badgeIcon ? "28px" : "8px" }}
        >
          <span
            className="font-bold tracking-widest uppercase mb-2"
            style={{ color: "#00a4c4", fontSize: "11px" }}
          >
            {category}
          </span>

          {/* FIX: hover color via group-hover handled with transition */}
          <h3
            className="font-bold mb-3 transition-colors duration-200 group-hover:text-[#00a4c4]"
            style={{ color: "var(--blog-title-color)", fontSize: "20px", lineHeight: 1.3 }}
          >
            {title}
          </h3>

          <p
            className="leading-relaxed mb-6 flex-1"
            style={{ color: "var(--blog-desc-color)", fontSize: "13px" }}
          >
            {description}
          </p>

          <div
            className="flex items-center justify-between mt-auto"
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
              marginTop: "20px",
            }}
          >
            <div
              className="flex items-center text-gray-500 font-medium"
              style={{ gap: "6px", fontSize: "12px" }}
            >
              <Clock size={13} className="text-gray-400" />
              <span>{date}</span>
              <span
                className="bg-gray-300 rounded-full mx-1"
                style={{ width: "4px", height: "4px" }}
              />
              <span>{readTime}</span>
            </div>
            <div
              className="text-white rounded-full flex items-center justify-center transition-all shadow-sm group-hover:shadow-md"
              style={{
                backgroundColor: "#00a4c4",
                width: "32px",
                height: "32px",
                transition: "background-color 0.2s, transform 0.2s",
              }}
            >
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ════════════════════════════════════════════
// BLOG GRID
// FIX: 3-column layout, organic image shapes,
//      correct quote border-radius, load more button
// ════════════════════════════════════════════
const badgeIcons = {
  5: <BookOpen size={18} />,
};

// Organic image shapes per column + position in column
const COL1_SHAPES = [
  "h-[340px] rounded-t-[100px] rounded-b-3xl",
  "h-48 rounded-3xl rounded-bl-[60px]",
];
const COL2_SHAPES = [
  "h-56 rounded-[40px]",
  "h-60 rounded-[40px]",
];
const COL3_SHAPES = [
  "h-64 rounded-3xl",
  "h-64 rounded-3xl",
];

export function BlogGrid({ posts = [] }) {
  const [showAll, setShowAll] = React.useState(false);

  if (!posts || posts.length === 0) {
    return (
      <section
        className="w-full mx-auto px-6 py-20 text-center"
        style={{ maxWidth: "1280px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            color: "#9ca3af",
          }}
        >
          <Quote size={40} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: "18px", fontWeight: 500 }}>No posts found.</p>
          <p style={{ fontSize: "14px" }}>Try adjusting your search or filter.</p>
        </div>
      </section>
    );
  }

  // Split into 3 columns (index % 3)
  const col1 = posts.filter((_, i) => i % 3 === 0);
  const col2 = posts.filter((_, i) => i % 3 === 1);
  const col3 = posts.filter((_, i) => i % 3 === 2);

  // On mobile show limited posts unless showAll
  const MOBILE_LIMIT = 4;
  const mobilePosts = showAll ? posts : posts.slice(0, MOBILE_LIMIT);

  return (
    <section
      className="w-full mx-auto overflow-hidden"
      style={{
        maxWidth: "1280px",
        paddingBottom: "96px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <style>{`
        /* 3-column grid — hidden on mobile, shown on lg */
        .blog-3col { display: none; }
        /* Mobile single column */
        .blog-mobile-grid {
          display: flex; flex-direction: column; gap: 48px;
        }
        @media (min-width: 1024px) {
          .blog-3col {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0 32px;
            align-items: start;
          }
          .blog-mobile-grid { display: none; }
          .blog-load-more { display: none !important; }
        }
        /* Each column */
        .blog-col-wrap { display: flex; flex-direction: column; gap: 56px; }
        .blog-col-3 { margin-top: 32px; }

        /* Quote block */
        .blog-quote-block {
          position: relative;
          display: flex; align-items: center; justify-content: center; text-align: center;
          padding: 48px 24px;
        }
        .blog-quote-bg {
          position: absolute; inset: 0;
          background: #ecfeff;
          border-radius: 120px 40px 120px 40px;
          z-index: 0;
        }
        .blog-quote-icon-tl { position: absolute; top: 16px; left: 16px; z-index: 1; }
        .blog-quote-icon-br { position: absolute; bottom: 16px; right: 16px; z-index: 1; transform: rotate(180deg); }
        .blog-quote-text {
          position: relative; z-index: 10;
          font-size: clamp(18px, 2.5vw, 26px);
          font-weight: 800;
          line-height: 1.4;
          color: #001F3F !important;
        }
        .blog-quote-accent { color: #00a4c4 !important; font-style: italic; }

        /* Load more */
        .blog-load-more {
          display: flex; justify-content: center; margin-top: 48px;
        }
        .blog-load-btn {
          padding: 14px 32px; border-radius: 999px;
          border: 2px solid #00a4c4; background: transparent;
          color: #00a4c4 !important; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
        }
        .blog-load-btn:hover { background: #00a4c4; color: #fff !important; box-shadow: 0 4px 14px rgba(0,164,196,0.3); }
      `}</style>

      {/* ── DESKTOP: 3-column layout ── */}
      <div className="blog-3col">
        {/* Column 1 */}
        <div className="blog-col-wrap">
          {col1.map((post, i) => (
            <div key={post.id || i}>
              <BlogCard
                {...post}
                imageClassName={COL1_SHAPES[i % COL1_SHAPES.length]}
                badgeIcon={badgeIcons[post.id] || null}
              />
            </div>
          ))}
        </div>

        {/* Column 2 — with quote block between pos 0 and pos 1 */}
        <div className="blog-col-wrap">
          {col2.map((post, i) => (
            <React.Fragment key={post.id || i}>
              {i === 1 && (
                <div className="blog-quote-block">
                  <div className="blog-quote-bg" />
                  <Quote
                    size={28}
                    fill="currentColor"
                    style={{ color: "#a5f3fc", opacity: 0.6 }}
                    className="blog-quote-icon-tl"
                  />
                  <Quote
                    size={28}
                    fill="currentColor"
                    style={{ color: "#a5f3fc", opacity: 0.6 }}
                    className="blog-quote-icon-br"
                  />
                  <h3 className="blog-quote-text">
                    The world is full of
                    <br />
                    beautiful places —
                    <br />
                    let's go{" "}
                    <span className="blog-quote-accent">explore</span> them.
                  </h3>
                </div>
              )}
              <BlogCard
                {...post}
                imageClassName={COL2_SHAPES[i % COL2_SHAPES.length]}
                badgeIcon={badgeIcons[post.id] || null}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Column 3 — offset by margin-top */}
        <div className="blog-col-wrap blog-col-3">
          {col3.map((post, i) => (
            <div key={post.id || i}>
              <BlogCard
                {...post}
                imageClassName={COL3_SHAPES[i % COL3_SHAPES.length]}
                badgeIcon={badgeIcons[post.id] || null}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE: single column with limited posts ── */}
      <div className="blog-mobile-grid">
        {mobilePosts.map((post, i) => (
          <React.Fragment key={post.id || i}>
            {i === 2 && (
              <div className="blog-quote-block">
                <div className="blog-quote-bg" />
                <Quote
                  size={24}
                  fill="currentColor"
                  style={{ color: "#a5f3fc", opacity: 0.6 }}
                  className="blog-quote-icon-tl"
                />
                <Quote
                  size={24}
                  fill="currentColor"
                  style={{ color: "#a5f3fc", opacity: 0.6 }}
                  className="blog-quote-icon-br"
                />
                <h3 className="blog-quote-text" style={{ fontSize: "20px" }}>
                  The world is full of beautiful places — let's go{" "}
                  <span className="blog-quote-accent">explore</span> them.
                </h3>
              </div>
            )}
            <BlogCard
              {...post}
              imageClassName="h-[260px] rounded-[40px]"
              badgeIcon={badgeIcons[post.id] || null}
            />
          </React.Fragment>
        ))}
      </div>

      {/* ── MOBILE Load More button (hidden on desktop via CSS) ── */}
      {!showAll && posts.length > MOBILE_LIMIT && (
        <div className="blog-load-more">
          <button
            className="blog-load-btn"
            onClick={() => setShowAll(true)}
          >
            Load more posts
          </button>
        </div>
      )}
    </section>
  );
}
