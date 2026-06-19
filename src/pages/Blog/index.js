import React, { useEffect, useState } from "react";
import { Hero, Filters, BlogGrid as Grid } from "../../components/Blog/BlogComponents";
import "../../styles/blog-tailwind.css";
import { getBlogs } from "../../utils/api";
import { mapApiBlogToComponentFormat } from "../../utils/blogData";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const rawBlogs = await getBlogs();
        const mappedBlogs = rawBlogs.map(mapApiBlogToComponentFormat);
        setPosts(mappedBlogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="blog-page-root">
      <main className="flex min-h-screen flex-col items-center pt-2">
        <Hero />
        <Filters />
        {loading ? (
          <div className="py-20 flex justify-center w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand)]"></div>
          </div>
        ) : (
          <Grid posts={posts} />
        )}
      </main>
      <style>{`
        .blog-page-root {
          overflow-x: clip;
          --color-brand: #00A4C4;
          --color-brand-dark: #001F3F;
        }
        .blog-page-root img {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}

