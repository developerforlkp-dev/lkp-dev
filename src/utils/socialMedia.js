export function parseSocialItems(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export function getInstagramReelUrls(...sources) {
  return sources.flatMap((source) => [source, source?.data].flatMap((data) =>
    parseSocialItems(data?.instagramReelUrls)
  ));
}

export function getSocialProfileLinks(...sources) {
  const unique = new Map();
  sources.forEach((source) => [source, source?.data].forEach((data) => {
    parseSocialItems(data?.socialMediaLinks || data?.social_media_links).forEach((item) => {
      const value = typeof item === "string" ? item : item?.url || item?.link || item?.href;
      if (typeof value !== "string") return;
      try {
        const url = new URL(value.trim());
        if (!["https:", "http:"].includes(url.protocol)) return;
        const host = url.hostname.toLowerCase();
        const matches = (domain) => host === domain || host.endsWith(`.${domain}`);
        const platform = matches("instagram.com") ? "Instagram"
          : matches("facebook.com") || matches("fb.watch") ? "Facebook"
          : matches("youtube.com") || matches("youtu.be") ? "YouTube"
          : matches("twitter.com") || matches("x.com") ? "X"
          : matches("linkedin.com") ? "LinkedIn" : "Website";
        if (!unique.has(url.href)) unique.set(url.href, { href: url.href, platform });
      } catch {
        // Ignore missing or malformed profile links.
      }
    });
  }));
  return Array.from(unique.values());
}
