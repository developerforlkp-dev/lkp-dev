import React from "react";
import { Instagram, Facebook, Youtube, Twitter, Linkedin, Globe } from "lucide-react";
import { getSocialProfileLinks } from "../../utils/socialMedia";

const icons = { Instagram, Facebook, YouTube: Youtube, X: Twitter, LinkedIn: Linkedin, Website: Globe };

export default function SocialProfileLinks({ sources = [], theme = "light", tokens = {} }) {
  const links = getSocialProfileLinks(...sources);
  if (!links.length) return null;
  return (
    <nav aria-label="Social media profiles" style={{ width: "calc(100% - 32px)", maxWidth: 1200, margin: "24px auto", display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
      {links.map(({ href, platform }) => {
        const Logo = icons[platform];
        return (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${platform} profile`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: tokens.FG || (theme === "dark" ? "#f8fafc" : "#0f172a"), fontSize: 14, padding: "8px 0", maxWidth: "100%" }}>
            <Logo size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span style={{ overflowWrap: "anywhere" }}>{href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
          </a>
        );
      })}
    </nav>
  );
}
