import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
          className="absolute top-0 lg:top-10 left-[10%] lg:left-0 w-[80%] lg:w-[60%] h-[55%] lg:h-[80%] z-10 overflow-hidden"
          style={{ borderRadius: "140px 140px 20px 20px" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80" 
            alt="Overwater Bungalow" 
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
            src="https://images.unsplash.com/photo-1506501139174-099022df5260?auto=format&fit=crop&w=600&q=80" 
            alt="Woman in boat on lake" 
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.div>

        {/* Third Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 right-[5%] lg:right-0 w-[45%] lg:w-[55%] h-[45%] lg:h-[45%] z-20 overflow-hidden border-[4px] lg:border-[6px] border-white shadow-xl"
          style={{ borderRadius: "60px 60px 40px 40px" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80" 
            alt="Palm trees at sunset" 
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
