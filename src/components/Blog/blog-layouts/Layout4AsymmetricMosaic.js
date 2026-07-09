import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

// Layout 4 — EDITORIAL TIMELINE STYLE
export default function Layout4AsymmetricMosaic({ post }) {
  // Combine hero and gallery for the overlapping cards
  const cardImages = [...(post.galleryImages || [])].filter(Boolean).slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#001F3F] pb-20">

      {/* ── Massive Hero Background ── */}
      <div className="relative w-full flex flex-col justify-center items-center overflow-hidden" style={{ height: "85vh", minHeight: 600 }}>
        <img src={post.heroImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #ffffff, transparent, transparent)" }} />

        {/* Giant Title Overlay */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-[clamp(3rem,10vw,9rem)] font-black text-white/90 uppercase tracking-tighter leading-none text-center px-4"
          style={{ textShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
        >
          {post.title}
        </motion.h1>

        {/* Overlapping Vertical Cards */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[30%] z-20 px-6 lg:px-12 overflow-x-auto">
          <div className="flex justify-center gap-4 min-w-max pb-4">
            {cardImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                className="w-[180px] h-[260px] md:w-[220px] md:h-[320px] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white flex-shrink-0 group"
              >
                <img src={img} alt={`Highlight ${i+1}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent, transparent)" }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-xs font-bold uppercase tracking-wider line-clamp-2">
                    {(post.tags || [])[i] || `Highlight 0${i+1}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer to account for overlapping cards */}
      <div className="h-[100px] md:h-[140px]"></div>

      {/* ── Summary / Intro ── */}
      <div className="w-full max-w-[1000px] mx-auto px-6 mb-24 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-[#001F3F] leading-snug mb-6">
          {post.description}
        </h3>
        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
          {post.content?.intro}
        </p>
        <div className="flex justify-center gap-4 mt-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00A4C4]"/> {post.readTime}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>

      {/* ── Timeline Sections ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 mb-24">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <div className="h-px bg-gray-200 flex-1"></div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#001F3F]">The Details</h2>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 hidden lg:block"></div>

          <div className="space-y-16">
            {(post.content?.sections || []).map((section, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col lg:flex-row gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Timeline Dot (Desktop only) */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#00A4C4] rounded-full hidden lg:block border-4 border-white shadow-sm z-10"></div>

                  {/* Text Side */}
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:text-left'}`}>
                    <span className="text-[#00A4C4] font-black text-4xl opacity-20 mb-2 block">0{idx + 1}</span>
                    <h3 className="text-2xl font-bold mb-4">{section.heading}</h3>
                    <p className="text-gray-600 leading-relaxed">{section.body}</p>
                  </div>

                  {/* Image Side */}
                  <div className={`w-full lg:w-1/2 flex ${isEven ? 'justify-start' : 'justify-end'} ${isEven ? 'lg:pl-16' : 'lg:pr-16'}`}>
                    {section.image ? (
                      <div className="w-full max-w-[360px] h-[280px] relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                        <img src={section.image} alt={section.heading} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="w-full max-w-[360px] h-[280px] rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                        <span className="text-gray-300 font-bold tracking-widest uppercase text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Conclusion & Tags ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="h-px bg-gray-200 flex-1"></div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#001F3F]">Summary</h2>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conclusion Box */}
          <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100">
            <h4 className="text-[#00A4C4] font-bold uppercase tracking-widest text-xs mb-4">Conclusion</h4>
            <p className="text-gray-700 leading-relaxed">{post.content?.conclusion}</p>
          </div>

          {/* Tags Box */}
          <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100">
            <h4 className="text-[#00A4C4] font-bold uppercase tracking-widest text-xs mb-4">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map(tag => (
                <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 uppercase tracking-wider">
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
