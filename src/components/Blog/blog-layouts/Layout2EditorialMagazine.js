import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

// Layout 2 — FLOATING CARD HEADER
export default function Layout2EditorialMagazine({ post }) {
  return (
    <div className="min-h-screen bg-[#F8FCFD] pt-24 pb-20">

      {/* ── Floating Header Card ── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-[40px] lg:rounded-[60px] p-6 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,164,196,0.05)] border border-gray-100 flex flex-col lg:flex-row gap-10 items-center"
        >
          {/* Left Text */}
          <div className="flex-1 w-full pt-4 lg:pt-0">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[2px] bg-[#00A4C4]"></span>
              <span className="text-[#00A4C4] text-xs font-bold tracking-widest uppercase">{post.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-[#001F3F] leading-[1] uppercase tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
              <span>{post.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
              <span className="flex items-center gap-1.5 text-[#00A4C4]"><Clock size={14} />{post.readTime}</span>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="flex-1 w-full h-[400px] lg:h-[500px] relative rounded-[30px] lg:rounded-[40px] overflow-hidden">
            <img src={post.heroImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </motion.div>
      </div>

      {/* ── Summary & Intro (Two Column Layout) ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="text-[#00A4C4] font-bold uppercase tracking-widest text-sm pt-2">
            Summary
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#001F3F] leading-snug mb-8">
              {post.description}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {post.content?.intro}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Sections ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 mb-20">
        <h2 className="text-3xl lg:text-4xl font-black text-[#001F3F] uppercase tracking-tight mb-10">
          The Details
        </h2>
        
        <div className="space-y-12">
          {(post.content?.sections || []).map((section, idx) => (
            <div key={idx} className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-50 flex flex-col lg:flex-row gap-8 items-center">
              {section.image && (
                <div className="w-full lg:w-[45%] h-[300px] relative rounded-[24px] overflow-hidden flex-shrink-0">
                  <img src={section.image} alt={section.heading} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} className="hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center font-bold text-[#00A4C4]">
                    {idx + 1}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#001F3F] mb-4">{section.heading}</h3>
                <p className="text-gray-600 leading-relaxed">{section.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-50">
          <p className="text-xl text-gray-700 leading-relaxed font-medium text-center">
            {post.content?.conclusion}
          </p>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 mb-20">
        <div className="flex flex-wrap gap-3">
          {(post.tags || []).map((tag) => (
            <span key={tag} className="px-5 py-2 rounded-full border border-gray-200 text-gray-500 text-sm font-bold uppercase tracking-wider hover:bg-[#00A4C4] hover:text-white hover:border-[#00A4C4] transition-all cursor-pointer shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
