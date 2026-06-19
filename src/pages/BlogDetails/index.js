import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { mapApiBlogToComponentFormat } from "../../utils/blogData";
import { getBlogBySlug } from "../../utils/api";
import {
  Layout1CinematicHero,
  Layout2EditorialMagazine,
  Layout3ImmersiveDark,
  Layout4AsymmetricMosaic
} from "../../components/Blog/BlogLayouts";
import "../../styles/blog-tailwind.css";

export default function BlogDetails() {
  const { slug } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const rawBlog = await getBlogBySlug(slug);
        if (!rawBlog) {
          history.push("/blog");
        } else {
          setPost(mapApiBlogToComponentFormat(rawBlog));
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        history.push("/blog");
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

  const variant = (String(post.id).charCodeAt(0) % 4) + 1;

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
  }

  return (
    <div className="blog-page-root">
      <LayoutComponent post={post} />
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

