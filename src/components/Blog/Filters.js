import React from "react";
import { Search } from "lucide-react";

const categories = ["All Posts", "Experience", "Event", "Stay"];

export function Filters({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-[var(--color-brand)] text-sm transition-colors"
          style={{ backgroundColor: "#fff", color: "#374151" }}
        />
        <Search 
          size={18} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" 
        />
      </div>
    </section>
  );
}
