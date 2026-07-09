import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

export function BlogCard({
  slug,
  image,
  category,
  title,
  description,
  date,
  readTime,
  imageClassName = "h-64 rounded-3xl",
  badgeIcon
}) {
  return (
    <Link to={`/blog/${slug}`} className="flex flex-col group cursor-pointer" style={{ textDecoration: "none" }}>
      <article>
        <div className={`relative w-full overflow-hidden mb-6 ${imageClassName}`}>
          <img
            src={image}
            alt={title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            className="transition-transform duration-700 group-hover:scale-105"
          />
          {badgeIcon && (
            <div className="absolute -bottom-4 left-6 bg-[var(--color-brand)] text-white p-3 rounded-full shadow-lg z-10 border-4 border-white">
              {badgeIcon}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-2">
          <span className="text-[var(--color-brand)] font-semibold text-xs tracking-wider uppercase mb-3">
            {category}
          </span>
          
          <h3 className="text-2xl font-bold text-[var(--color-brand-dark)] leading-snug mb-3 group-hover:text-[var(--color-brand)] transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-6 flex-1">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Clock size={14} className="text-gray-400" />
              <span>{date}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
              <span>{readTime}</span>
            </div>
            <div className="bg-[var(--color-brand)] text-white rounded-full p-2 group-hover:bg-[var(--color-brand-dark)] transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
