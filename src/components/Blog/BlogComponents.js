import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Search, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { posts } from "../../utils/blogData";

// ── Hero ──
export function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-12 flex flex-col lg:flex-row items-center gap-12">
      {/* Left Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 space-y-6 z-10"
      >
        <p className="text-[var(--color-brand)] font-semibold tracking-widest text-sm uppercase">
          Our Blog
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-[80px] font-bold text-[var(--color-brand-dark)] leading-[1.1] mb-6">
          Stories that <br />
          inspire <br className="lg:hidden" /><span className="text-[var(--color-brand)] italic font-light">journeys</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-md mb-8">
          Travel guides, hidden gems and real stories from around the world.
        </p>
        
        <button className="group flex items-center gap-4 bg-[var(--color-brand)] text-white px-8 py-4 rounded-full font-semibold hover:bg-cyan-600 transition-colors shadow-md">
          Explore All Posts
          <span className="bg-white text-[var(--color-brand)] rounded-full p-1.5 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </span>
        </button>
      </motion.div>

      {/* Right Content - Images */}
      <div className="flex-1 relative h-[380px] sm:h-[500px] lg:h-[600px] w-full flex items-center justify-center mt-8 lg:mt-0">
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 left-10 flex gap-2 rotate-12 opacity-40">
          <div className="w-4 h-8 bg-cyan-200 rounded-full"></div>
          <div className="w-4 h-8 bg-cyan-200 rounded-full mt-4"></div>
          <div className="w-4 h-8 bg-cyan-200 rounded-full mt-2"></div>
        </div>
        
        {/* Main Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 lg:top-10 left-[10%] lg:left-0 w-[80%] lg:w-[60%] h-[55%] lg:h-[80%] z-10 overflow-hidden rounded-[140px_140px_20px_20px] lg:rounded-[140px_40px_140px_40px]"
        >
          <img 
            src="/images/blog/landscape-fallback.webp" 
            alt="Overwater Bungalow" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        {/* Second Image (Circle) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-4 left-0 lg:left-auto lg:top-0 right-auto lg:right-4 w-[45%] h-[40%] lg:h-[45%] z-20 rounded-full overflow-hidden border-[4px] lg:border-[6px] border-white shadow-xl"
        >
          <img 
            src="/images/blog/landscape-fallback.webp" 
            alt="Woman in boat on lake" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        {/* Third Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 right-[5%] lg:right-0 w-[45%] lg:w-[55%] h-[45%] lg:h-[45%] z-20 overflow-hidden border-[4px] lg:border-[6px] border-white shadow-xl rounded-[60px_60px_40px_40px] lg:rounded-[60px_100px_40px_120px]"
        >
          <img 
            src="/images/blog/landscape-fallback.webp" 
            alt="Palm trees at sunset" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </section>
  );
}


// ── Filters ──
const categories = [
  "All Posts",
  "Experience",
  "Event",
  "Stay"
];

export function Filters() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              index === 0
                ? "bg-[var(--color-brand)] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-64 lg:w-80 flex-shrink-0">
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-[var(--color-brand)] text-sm transition-colors"
        />
        <Search 
          size={18} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" 
        />
      </div>
    </section>
  );
}


// ── BlogCard ──
export function BlogCard({
  slug,
  image,
  category,
  title,
  description,
  date,
  readTime,
  imageClassName = "h-64 rounded-3xl",
  badgeIcon
}) {
  return (
    <Link to={`/blog/${slug}`} className="flex flex-col group cursor-pointer" style={{ textDecoration: 'none' }}>
      <article>
        <div className={`relative w-full overflow-hidden mb-6 ${imageClassName}`}>
          <img
            src={image}
            alt={title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          />
          {badgeIcon && (
            <div className="absolute -bottom-4 left-6 bg-[var(--color-brand)] text-white p-3 rounded-full shadow-lg z-10 border-4 border-white">
              {badgeIcon}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-2">
          <span className="text-[var(--color-brand)] font-semibold text-xs tracking-wider uppercase mb-3">
            {category}
          </span>
          
          <h3 className="text-2xl font-bold text-[var(--color-brand-dark)] leading-snug mb-3 group-hover:text-[var(--color-brand)] transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-6 flex-1">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Clock size={14} className="text-gray-400" />
              <span>{date}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
              <span>{readTime}</span>
            </div>
            <div className="bg-[var(--color-brand)] text-white rounded-full p-2 group-hover:bg-[var(--color-brand-dark)] transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}


// ── BlogGrid ──
const badgeIcons = {
  5: <BookOpen size={20} />,
};

export function BlogGrid({ posts = [] }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">No posts found.</p>
      </section>
    );
  }

  // Create columns to stagger the cards like the original design
  const col1 = [];
  const col2 = [];
  const col3 = [];
  
  posts.forEach((post, i) => {
    if (i % 3 === 0) col1.push(post);
    else if (i % 3 === 1) col2.push(post);
    else col3.push(post);
  });

  const getImageClass = (index, colIndex) => {
    if (colIndex === 0) return index % 2 === 0 ? 'h-[340px] rounded-t-[100px] rounded-b-3xl' : 'h-48 rounded-3xl rounded-bl-[60px]';
    if (colIndex === 1) return index % 2 === 0 ? 'h-56 rounded-[40px]' : 'h-60 rounded-[40px]';
    return 'h-64 rounded-3xl';
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-16">
          {col1.map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx, 0)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-16">
          {col2.length > 0 && <BlogCard key={col2[0].id} {...col2[0]} imageClassName={getImageClass(0, 1)} badgeIcon={badgeIcons[col2[0].id] || null} />}
          
          {/* Quote Block */}
          <div className="relative py-16 px-10 flex items-center justify-center text-center my-6">
            <div className="absolute inset-0 bg-cyan-50 opacity-90 -z-10 transform scale-105" 
                 style={{ borderRadius: '120px 40px 120px 40px' }}></div>
            <Quote size={50} fill="currentColor" className="absolute top-6 left-8 text-cyan-200 opacity-60" />
            <Quote size={50} fill="currentColor" className="absolute bottom-6 right-8 text-cyan-200 opacity-60 transform rotate-180" />
            
            <h3 className="text-xl md:text-[28px] font-bold text-[var(--color-brand-dark)] leading-snug">
              The world is full of <br />
              beautiful places � <br />
              let's go <span className="text-[var(--color-brand)] italic">explore</span> them.
            </h3>
          </div>

          {col2.slice(1).map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx + 1, 1)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-16 mt-0 lg:mt-8">
          {col3.map((post, idx) => (
            <BlogCard key={post.id} {...post} imageClassName={getImageClass(idx, 2)} badgeIcon={badgeIcons[post.id] || null} />
          ))}
        </div>
      </div>
    </section>
  );
}


