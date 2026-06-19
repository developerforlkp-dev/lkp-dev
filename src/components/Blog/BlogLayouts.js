import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { posts } from "../../utils/blogData";
import { motion } from "framer-motion";


// ── Layout 1 Cinematic Hero ──
export function Layout1CinematicHero({ post }) {
  const relatedPosts = posts.filter((p) => post.relatedIds.includes(p.id));
  const cardImages = [post.heroImage, ...post.galleryImages].slice(0, 4);

  return (
    <div className="min-h-screen bg-white blog-page-root">
      {/* ── Full-viewport Hero ── */}
      <div className="relative w-full h-screen min-h-[600px] group">
        <img src={post.heroImage} alt={post.title} className="object-cover transition-transform duration-[20s] group-hover:scale-110" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
              <img src={img} alt={`View ${i + 1}`} className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
          {post.content.intro}
        </p>

        {post.content.sections.map((section, idx) => (
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
                <img src={section.image} alt={section.heading} className="object-cover transition-transform duration-1000 group-hover:scale-105" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
              </div>
            )}
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-center max-w-[800px] mx-auto">
              {section.body}
            </p>
          </motion.div>
        ))}

        <div className="bg-gray-50 rounded-[40px] p-10 md:p-14 border border-gray-100 text-center mt-12 shadow-inner">
          <p className="text-gray-700 text-xl leading-relaxed font-medium">
            {post.content.conclusion}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 pt-16">
          {post.tags.map((tag) => (
            <span key={tag} className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-bold tracking-wider uppercase hover:bg-[#00A4C4] hover:text-white hover:border-[#00A4C4] transition-all cursor-pointer shadow-sm hover:shadow-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Related ── */}
      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black text-[#001F3F] uppercase tracking-tight">More to explore</h3>
            <Link to="/blog" className="text-sm text-[#00A4C4] font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all" style={{ textDecoration: 'none' }}>
              All stories <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="group block bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100" style={{ textDecoration: 'none' }}>
                <div className="relative h-[240px] overflow-hidden">
                  <img src={r.image} alt={r.title} className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
    </div>
  );
}


// ── Layout 2 Editorial Magazine ──
export function Layout2EditorialMagazine({ post }) {
  const relatedPosts = posts.filter((p) => post.relatedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8FCFD] pt-24 pb-20 blog-page-root">

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
            <img src={post.heroImage} alt={post.title} className="object-cover" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
              {post.content.intro}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Sections (Styled like "WHAT WE DO" cards) ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 mb-20">
        <h2 className="text-3xl lg:text-4xl font-black text-[#001F3F] uppercase tracking-tight mb-10">
          The Details
        </h2>
        
        <div className="space-y-12">
          {post.content.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-[32px] p-6 lg:p-10 shadow-sm border border-gray-50 flex flex-col lg:flex-row gap-8 items-center">
              {section.image && (
                <div className="w-full lg:w-[45%] h-[300px] relative rounded-[24px] overflow-hidden flex-shrink-0">
                  <img src={section.image} alt={section.heading} className="object-cover hover:scale-105 transition-transform duration-700" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
            {post.content.conclusion}
          </p>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 mb-20">
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span key={tag} className="px-5 py-2 rounded-full border border-gray-200 text-gray-500 text-sm font-bold uppercase tracking-wider hover:bg-[#00A4C4] hover:text-white hover:border-[#00A4C4] transition-all cursor-pointer shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}


// ── Layout 3 Immersive Dark ──
export function Layout3ImmersiveDark({ post }) {
  return (
    <div className="min-h-screen bg-white pb-20 blog-page-root">

      {/* ── Huge Hero Image ── */}
      <div className="relative w-full h-[60vh] min-h-[450px]">
        <img src={post.heroImage} alt={post.title} className="object-cover" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── Floating Meta Bar ── */}
      <div className="w-full max-w-[1000px] mx-auto px-6 relative z-10 -mt-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl shadow-black/5 p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-6"
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

      {/* ── Staggered Content Sections (like the "Not Your Boring Travel Agent" area) ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 mb-20">
        <div className="mb-16">
          <p className="text-xl md:text-2xl text-[#001F3F] leading-relaxed font-medium max-w-3xl border-l-4 border-[#00A4C4] pl-6">
            {post.content.intro}
          </p>
        </div>

        <div className="space-y-32">
          {post.content.sections.map((section, idx) => {
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
                      <img src={section.image} alt={section.heading} className="object-cover rounded-[40px] shadow-2xl shadow-black/10 hover:scale-105 transition-transform duration-700" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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
            {post.content.conclusion}
          </p>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 pt-12 border-t border-gray-100">
          {post.tags.map((tag) => (
            <span key={tag} className="px-5 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-[#00A4C4] hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}


// ── Layout 4 Asymmetric Mosaic ──
export function Layout4AsymmetricMosaic({ post }) {
  const cardImages = [post.heroImage, ...post.galleryImages].slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-[#001F3F] pb-20 blog-page-root">

      {/* ── Massive Hero Background ── */}
      <div className="relative w-full h-[85vh] min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
        <img src={post.heroImage} alt={post.title} className="object-cover" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

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
                <img src={img} alt={`Highlight ${i+1}`} className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-xs font-bold uppercase tracking-wider line-clamp-2">
                    {post.tags[i] || `Highlight 0${i+1}`}
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
          {post.content.intro}
        </p>
        <div className="flex justify-center gap-4 mt-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00A4C4]"/> {post.readTime}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>

      {/* ── Timeline Sections (Inspired by "About the Tour") ── */}
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
            {post.content.sections.map((section, idx) => {
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
                        <img src={section.image} alt={section.heading} className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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

      {/* ── Conclusion & Tags (Styled like info cards) ── */}
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
            <p className="text-gray-700 leading-relaxed">{post.content.conclusion}</p>
          </div>

          {/* Tags Box */}
          <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100">
            <h4 className="text-[#00A4C4] font-bold uppercase tracking-widest text-xs mb-4">Topics Covered</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
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
