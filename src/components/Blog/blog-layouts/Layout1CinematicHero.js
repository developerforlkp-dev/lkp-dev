import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Layout 1 — BOLD OVERLAY HERO
export default function Layout1CinematicHero({ post, allPosts }) {
  const relatedPosts = (allPosts || []).filter((p) => post.relatedIds?.includes(p.id));

  // Ensure we have exactly 4 images for the grid
  const cardImages = [post.heroImage, ...(post.galleryImages || [])].filter(Boolean).slice(0, 4);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Full-viewport Hero ── */}
      <div className="relative w-full h-screen min-h-[600px] group">
        <img src={post.heroImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-[20s] group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #ffffff, rgba(0,0,0,0.4), rgba(0,0,0,0.2))" }} />

        <div className="absolute top-8 right-8 z-20">
          <span className="bg-[#00A4C4] text-white text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full shadow-lg">
            {post.category}
          </span>
        </div>

        {/* Centered Bold Title */}
        <div className="absolute bottom-10 left-0 right-0 z-10 px-6 md:px-12 flex justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black text-[#001F3F] leading-[1] uppercase tracking-tight"
            style={{ maxWidth: 1400 }}
          >
            {post.title}
          </motion.h1>
        </div>
      </div>

      {/* ── Meta strip ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 py-12 border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5 text-[#00A4C4]" style={{ backgroundColor: "rgba(0,164,196,0.1)", padding: "0.5rem 1rem", borderRadius: "9999px" }}>
              <Clock size={14} /> {post.readTime}
            </span>
            <span className="bg-gray-50 px-4 py-2 rounded-full">{post.date}</span>
          </div>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            {post.description}
          </p>
        </motion.div>
      </div>

      {/* ── Image Cards Grid ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cardImages.map((img, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="relative h-[300px] md:h-[400px] overflow-hidden rounded-[32px] group shadow-sm"
            >
              <img src={img} alt={`View ${i + 1}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              {i === 0 && (
                <div className="absolute bottom-5 left-5">
                  <span className="bg-white/90 backdrop-blur-sm text-[#00A4C4] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Centered Article Content ── */}
      <div className="w-full max-w-[900px] mx-auto px-6 pb-16">
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-16 font-light text-center">
          {post.content?.intro}
        </p>

        {(post.content?.sections || []).map((section, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            key={idx} 
            className="mb-20"
          >
            <div className="flex flex-col items-center text-center mb-10">
              <span className="text-[#00A4C4] font-black text-6xl opacity-20 mb-2 leading-none">0{idx + 1}</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#001F3F] leading-tight uppercase tracking-tight">
                {section.heading}
              </h2>
            </div>
            
            {section.image && (
              <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-[40px] mb-10 group shadow-lg">
                <img src={section.image} alt={section.heading} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-1000 group-hover:scale-105" />
              </div>
            )}
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-center max-w-[800px] mx-auto">
              {section.body}
            </p>
          </motion.div>
        ))}

        <div className="bg-gray-50 rounded-[40px] p-10 md:p-14 border border-gray-100 text-center mt-12 shadow-inner">
          <p className="text-gray-700 text-xl leading-relaxed font-medium">
            {post.content?.conclusion}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 pt-16">
          {(post.tags || []).map((tag) => (
            <span key={tag} className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-bold tracking-wider uppercase hover:bg-[#00A4C4] hover:text-white hover:border-[#00A4C4] transition-all cursor-pointer shadow-sm hover:shadow-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Related ── */}
      {relatedPosts.length > 0 && (
        <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-[#001F3F] uppercase tracking-tight">More to explore</h3>
              <Link to="/blog" className="text-sm text-[#00A4C4] font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all" style={{ textDecoration: "none" }}>
                All stories <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="group block bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100" style={{ textDecoration: "none" }}>
                  <div className="relative h-[240px] overflow-hidden">
                    <img src={r.image} alt={r.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#00A4C4] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {r.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-bold text-[#001F3F] leading-snug group-hover:text-[#00A4C4] transition-colors mb-4">{r.title}</h4>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                      <p className="text-gray-400 text-xs font-medium">{r.date}</p>
                      <p className="text-[#00A4C4] text-xs font-bold flex items-center gap-1"><Clock size={12} /> {r.readTime}</p>
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
