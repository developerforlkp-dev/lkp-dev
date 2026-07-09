import React from "react";
import { BookOpen, Quote } from "lucide-react";
import { BlogCard } from "./BlogCard";

// Map legacy badgeIcon to posts
const badgeIcons = {
  5: <BookOpen size={20} />,
};

const imageClassNames = [
  "h-[340px] rounded-t-[100px] rounded-b-3xl", // 0
  "h-56 rounded-[40px]",                       // 1
  "h-64 rounded-3xl",                          // 2
  "h-48 rounded-3xl rounded-bl-[60px]",        // 3
  "h-60 rounded-[40px]",                       // 4
  "h-64 rounded-3xl"                           // 5
];

export function BlogGrid({ posts }) {
  const p = posts || [];
  if (p.length === 0) return null;

  // Split into 3 columns for Masonry layout
  const col1 = [];
  const col2 = [];
  const col3 = [];

  p.forEach((post, i) => {
    const colIndex = i % 3;
    const styleIndex = i % 6;
    
    const cardNode = (
      <BlogCard 
        key={post.id || i} 
        {...post} 
        imageClassName={imageClassNames[styleIndex]} 
        badgeIcon={badgeIcons[post.id]} 
      />
    );

    if (colIndex === 0) col1.push(cardNode);
    else if (colIndex === 1) col2.push(cardNode);
    else col3.push(cardNode);
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-16">
          {col1}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-16">
          {col2.length > 0 && col2[0]}
          
          {/* Quote Block always appears after the first item in column 2 */}
          <div className="relative py-16 px-10 flex items-center justify-center text-center my-6">
            <div className="absolute inset-0 bg-cyan-50 opacity-90 -z-10 transform scale-105" 
                 style={{ borderRadius: '120px 40px 120px 40px' }}></div>
            <Quote size={50} fill="currentColor" className="absolute top-6 left-8 text-cyan-200 opacity-60" />
            <Quote size={50} fill="currentColor" className="absolute bottom-6 right-8 text-cyan-200 opacity-60 rotate-180" />
            
            <h3 className="text-xl md:text-[28px] font-bold text-[var(--color-brand-dark)] leading-snug">
              The world is full of <br />
              beautiful places — <br />
              let&apos;s go <span className="text-[var(--color-brand)] italic">explore</span> them.
            </h3>
          </div>

          {col2.slice(1)}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-16 mt-0 lg:mt-8">
          {col3}
        </div>
      </div>

      <div className="mt-16 flex justify-center w-full lg:hidden">
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 rounded-full px-8 py-3 text-sm font-semibold hover:border-gray-300 hover:text-[var(--color-brand-dark)] transition-colors">
          Load more posts
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
    </section>
  );
}
