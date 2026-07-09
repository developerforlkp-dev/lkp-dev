import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { mapApiBlogToComponentFormat, staticPosts, getLayoutVariant } from "../../utils/blogData";
import { getBlogs, getBlogBySlug } from "../../utils/api";
import Layout1CinematicHero from "../../components/Blog/blog-layouts/Layout1CinematicHero";
import Layout2EditorialMagazine from "../../components/Blog/blog-layouts/Layout2EditorialMagazine";
import Layout3ImmersiveDark from "../../components/Blog/blog-layouts/Layout3ImmersiveDark";
import Layout4AsymmetricMosaic from "../../components/Blog/blog-layouts/Layout4AsymmetricMosaic";
import { blogTailwindCss } from "../../styles/blogTailwindString";

export default function BlogDetails() {
  const { slug } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch all posts for related posts section
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const rawBlogs = await getBlogs();
        if (rawBlogs && rawBlogs.length > 0) {
          setAllPosts(rawBlogs.map((b, i) => mapApiBlogToComponentFormat(b, i)));
        } else {
          setAllPosts(staticPosts);
        }
      } catch {
        setAllPosts(staticPosts);
      }
    };
    fetchAllPosts();
  }, []);

  // Fetch single blog by slug
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const rawBlog = await getBlogBySlug(slug);
        console.log(`🔥 [Blog Details] Raw API Data for slug "${slug}":`, rawBlog);
        if (!rawBlog) {
          // Try finding in static posts
          const staticMatch = staticPosts.find(p => p.slug === slug);
          if (staticMatch) {
            setPost(staticMatch);
          } else {
            history.push("/blog");
          }
        } else {
          const mapped = mapApiBlogToComponentFormat(rawBlog);
          console.log(`✨ [Blog Details] Mapped Data for UI:`, mapped);
          setPost(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        // Try finding in static posts as fallback
        const staticMatch = staticPosts.find(p => p.slug === slug);
        if (staticMatch) {
          setPost(staticMatch);
        } else {
          history.push("/blog");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, history]);

  if (loading) {
    return (
      <div className="blog-page-root min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand)]"></div>
      </div>
    );
  }

  if (!post) return null;

  // Use layoutId from post or compute from id
  const variant = post.layoutId ?? getLayoutVariant(post.id);

  let LayoutComponent;
  switch (variant) {
    case 1:
      LayoutComponent = Layout1CinematicHero;
      break;
    case 2:
      LayoutComponent = Layout2EditorialMagazine;
      break;
    case 3:
      LayoutComponent = Layout3ImmersiveDark;
      break;
    case 4:
      LayoutComponent = Layout4AsymmetricMosaic;
      break;
    default:
      LayoutComponent = Layout1CinematicHero;
      break;
  }

  return (
    <div className="blog-page-root">
      <LayoutComponent post={post} allPosts={allPosts} />
    </div>
  );
}
