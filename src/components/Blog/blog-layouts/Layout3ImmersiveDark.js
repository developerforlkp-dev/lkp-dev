import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

// Layout 3 — VISA TRAVELS STYLE
export default function Layout3ImmersiveDark({ post }) {
  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ── Huge Hero Image ── */}
      <div className="relative w-full" style={{ height: "60vh", minHeight: 450 }}>
        <img src={post.heroImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── Floating Meta Bar ── */}
      <div className="w-full max-w-[1000px] mx-auto px-6 relative z-10 -mt-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-6"
          style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
        >
          <div className="flex-1 min-w-[150px]">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Category</p>
            <p className="text-[#00A4C4] font-bold">{post.category}</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-100"></div>
          <div className="flex-1 min-w-[150px]">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
            <p className="text-[#001F3F] font-bold">{post.date}</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-100"></div>
          <div className="flex-1 min-w-[150px]">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Duration</p>
            <p className="text-[#001F3F] font-bold flex items-center gap-1.5"><Clock size={14} className="text-[#00A4C4]"/> {post.readTime}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Center Bold Title & Summary ── */}
      <div className="w-full max-w-[900px] mx-auto px-6 text-center mb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-[72px] font-black text-[#001F3F] leading-[1.05] tracking-tight mb-8"
        >
          {post.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl mx-auto"
        >
          {post.description}
        </motion.p>
      </div>

      {/* ── Staggered Content Sections ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 mb-20">
        <div className="mb-16">
          <p className="text-xl md:text-2xl text-[#001F3F] leading-relaxed font-medium max-w-3xl border-l-4 border-[#00A4C4] pl-6">
            {post.content?.intro}
          </p>
        </div>

        <div className="space-y-32">
          {(post.content?.sections || []).map((section, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                
                {/* Text Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-10 h-10 rounded-full border-2 border-[#00A4C4] flex items-center justify-center text-[#00A4C4] font-black">
                      {idx + 1}
                    </span>
                    <h2 className="text-3xl font-bold text-[#001F3F]">{section.heading}</h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {section.body}
                  </p>
                </div>

                {/* Image Side (Staggered styling) */}
                {section.image && (
                  <div className="flex-1 w-full flex justify-center">
                    <div className="relative w-full max-w-[400px] h-[500px]">
                      <img src={section.image} alt={section.heading} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 40 }} className="shadow-2xl hover:scale-105 transition-transform duration-700" />
                      {/* Decorative offset block */}
                      <div className={`absolute -z-10 w-full h-full rounded-[40px] bg-[#00A4C4]/10 ${isEven ? '-bottom-6 -right-6' : '-top-6 -left-6'}`} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            {post.content?.conclusion}
          </p>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 pt-12 border-t border-gray-100">
          {(post.tags || []).map((tag) => (
            <span key={tag} className="px-5 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-[#00A4C4] hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
