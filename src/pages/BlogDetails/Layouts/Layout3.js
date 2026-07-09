import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

// Layout 3 — BOLD OVERLAY HERO
// (Originally Layout 1 CinematicHero from blogpage)
export default function Layout3({ post }) {
  // Ensure we have exactly 4 images for the grid
  const cardImages = [post.heroImage, ...(post.galleryImages || [])].slice(0, 4);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Full-viewport Hero ── */}
      <div className="relative w-full h-screen min-h-[600px] group">
        <img src={post.heroImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-black/40 to-black/20" />

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
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black text-[#001F3F] leading-[1] uppercase tracking-tight max-w-[1400px]"
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
            <span className="flex items-center gap-1.5 text-[#00A4C4] bg-[#00A4C4]/10 px-4 py-2 rounded-full">
              <Clock size={14} /> {post.readTime}
            </span>
            <span className="bg-gray-50 px-4 py-2 rounded-full">{post.date}</span>
          </div>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
            {post.description}
          </p>
        </motion.div>
      </div>

      {/* ── Image Cards Grid (Perfectly balanced) ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cardImages.map((img, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className={`relative h-[300px] md:h-[400px] overflow-hidden rounded-[32px] group shadow-sm`}
            >
              <img src={img} alt={`View ${i + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

        {post.content?.sections?.map((section, idx) => (
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
                <img src={section.image} alt={section.heading} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
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
          {post.tags?.map((tag) => (
            <span key={tag} className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-bold tracking-wider uppercase hover:bg-[#00A4C4] hover:text-white hover:border-[#00A4C4] transition-all cursor-pointer shadow-sm hover:shadow-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
