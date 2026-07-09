import React, { useEffect, useState } from "react";
import { Hero } from "../../components/Blog/Hero";
import { Filters } from "../../components/Blog/Filters";
import { BlogGrid } from "../../components/Blog/BlogGrid";
import { getBlogs } from "../../utils/api";
import { mapApiBlogToComponentFormat, staticPosts } from "../../utils/blogData";
import { blogTailwindCss } from "../../styles/blogTailwindString";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  // Inject the Tailwind CSS string
  useEffect(() => {
    let style = document.getElementById('blog-tailwind-style-inline');
    if (!style) {
      style = document.createElement('style');
      style.id = 'blog-tailwind-style-inline';
      style.innerHTML = blogTailwindCss;
      document.head.appendChild(style);
    }
    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const rawBlogs = await getBlogs();
        console.log("🔥 [Blog Listing] Raw API Data from getBlogs():", rawBlogs);
        if (rawBlogs && rawBlogs.length > 0) {
          const mappedBlogs = rawBlogs.map((blog, idx) => mapApiBlogToComponentFormat(blog, idx));
          console.log("✨ [Blog Listing] Mapped Data for UI:", mappedBlogs);
          setPosts(mappedBlogs);
        } else {
          // Fallback to static data when API returns empty
          setPosts(staticPosts);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        // Fallback to static data on error
        setPosts(staticPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Compute filtered posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (post.title && post.title.toLowerCase().includes(query)) ||
      (post.description && post.description.toLowerCase().includes(query)) ||
      (post.category && post.category.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-page-root">
      <main className="flex min-h-screen flex-col items-center overflow-x-hidden pt-2">
        <Hero />
        <Filters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {loading ? (
          <div className="py-20 flex justify-center w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand)]"></div>
          </div>
        ) : (
          <BlogGrid posts={filteredPosts} />
        )}
      </main>
    </div>
  );
}
