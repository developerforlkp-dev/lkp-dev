// Blog data helpers — static fallback data, API-to-component mapper, layout variant logic.
// Mirrors the interface from the Next.js blogpage project.

// Static fallback posts (used when API returns no data)
export const staticPosts = [
  {
    id: 1,
    slug: "island-hopping-greece",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    category: "Experience",
    title: "Island Hopping in Greece: A Dream Itinerary",
    description: "Sun-kissed islands, crystal-clear waters and timeless beauty — perfect for your Greek adventure.",
    date: "June 9, 2026",
    readTime: "5 min read",
    imageClassName: "h-[340px] rounded-t-[100px] rounded-b-3xl",
    author: "Elena Roussos",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    authorBio: "Elena is a travel writer and photographer who has explored over 60 countries.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "Greece is not just a destination — it's a feeling. The moment you step off the ferry onto a white-washed island, the Aegean breeze carrying the scent of wild thyme, you understand why this archipelago has captivated travellers for millennia.",
      sections: [
        { heading: "Starting in Santorini — Where Drama Meets Beauty", body: "Begin your odyssey in Santorini, the crown jewel of the Cyclades. Oia's famous blue-domed churches and sugar-cube houses clinging to volcanic cliffs are exactly as breathtaking as every photograph promises.", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80" },
        { heading: "Mykonos — Energy, Art and Hidden Coves", body: "A short ferry ride brings you to Mykonos, where the energy shifts. Wander through Little Venice's waterfront bars, discover the iconic windmills at dawn, and explore Matogianni Street's boutiques and galleries." },
        { heading: "Naxos — The Hidden Heart of the Cyclades", body: "Often overlooked in favour of its flashier neighbours, Naxos rewards the curious traveller generously. It's the largest Cycladic island, lush with olive groves, marble quarries and Byzantine mountain villages.", image: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "The sea is the same sea that Odysseus sailed, and the islands rise from it unchanged by time.",
      conclusion: "Island hopping in Greece is not about ticking off a list — it's about surrendering to the rhythm of the Aegean.",
    },
    tags: ["Greece", "Islands", "Mediterranean", "Travel Guide", "Summer"],
    relatedIds: [2, 4, 6],
  },
  {
    id: 2,
    slug: "italy-romantic-lakes",
    image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=800&q=80",
    category: "Experience",
    title: "A Guide to Italy's Most Romantic Lakes",
    description: "Explore the charm, culture and cuisine around Italy's hidden lake towns.",
    date: "June 8, 2026",
    readTime: "6 min read",
    imageClassName: "h-56 rounded-[40px]",
    author: "Marco Bellini",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    authorBio: "Marco is an Italian travel journalist and culinary writer.",
    heroImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-87f346e20fa9?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "There is a reason Italy's lake district has inspired poets, composers and painters for centuries.",
      sections: [
        { heading: "Lake Como — Aristocratic Elegance", body: "Lake Como is perhaps the most famous of Italy's lakes, and for good reason. Its forked shape cuts deep into the pre-Alpine foothills, creating dramatic scenery at every bend.", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1000&q=80" },
        { heading: "Lake Maggiore — Gardens and Grand Hotels", body: "Straddling the Italian-Swiss border, Lake Maggiore exudes a patrician grandeur." },
        { heading: "Lake Garda — Where Wine Country Meets the Water", body: "Italy's largest lake, Garda has a different energy — more animated, more varied.", image: "https://images.unsplash.com/photo-1544735716-87f346e20fa9?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "The Italian lakes are not simply beautiful — they are beautiful in the way that a great aria is beautiful.",
      conclusion: "The Italian lakes reward slow travel above all things.",
    },
    tags: ["Italy", "Lakes", "Romance", "Food & Wine", "Culture"],
    relatedIds: [1, 3, 5],
  },
  {
    id: 3,
    slug: "unforgettable-evenings-by-the-sea",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
    category: "Event",
    title: "Unforgettable Evenings by the Sea",
    description: "How we create magical seaside events that leave lasting memories.",
    date: "June 7, 2026",
    readTime: "4 min read",
    imageClassName: "h-64 rounded-3xl",
    author: "Priya Nair",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    authorBio: "Priya is an event designer and storyteller.",
    heroImage: "https://images.unsplash.com/photo-1414609245224-aea2f68f93a3?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "There is something elemental about gathering by the sea as night falls.",
      sections: [
        { heading: "Choosing Your Moment: The Golden Hour", body: "The most magical seaside events begin as the sun descends.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80" },
        { heading: "The Art of Barefoot Dining", body: "The most memorable seaside events abandon the formality of indoor dining." },
        { heading: "Sound, Light and the Architecture of Memory", body: "Music at seaside events requires careful calibration.", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "The ocean reminds us that beauty needs no embellishment.",
      conclusion: "A seaside event done well stays with guests in the way few experiences do.",
    },
    tags: ["Events", "Seaside", "Design", "Hospitality", "Experiences"],
    relatedIds: [1, 5, 6],
  },
  {
    id: 4,
    slug: "wander-off-beaten-path",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    category: "Experience",
    title: "Wander Off the Beaten Path: Hidden Gems",
    description: "Explore lesser-known places that offer incredible experiences and memories.",
    date: "June 8, 2026",
    readTime: "6 min read",
    imageClassName: "h-48 rounded-3xl rounded-bl-[60px]",
    author: "James Okafor",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    authorBio: "James is an adventure travel writer and documentary filmmaker.",
    heroImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "The most extraordinary travel experiences I have had were never in guidebooks.",
      sections: [
        { heading: "Faroe Islands — Vertical Cliffs and Grass-Roofed Villages", body: "Halfway between Norway and Iceland, the Faroe Islands remain remarkably untouched by mass tourism.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80" },
        { heading: "Socotra Island — The Galápagos of the Indian Ocean", body: "Off the coast of Yemen, Socotra is one of the most alien landscapes on Earth." },
        { heading: "Matera, Italy — The Ancient Cave City", body: "While Italy's lakes and coastlines draw millions, Matera remains visited by the few.", image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "The beaten path is beaten because it is good — but the unbeaten path is extraordinary.",
      conclusion: "Wandering off the beaten path is, ultimately, a form of attention.",
    },
    tags: ["Adventure", "Off-Beat", "Hidden Gems", "Exploration", "Culture"],
    relatedIds: [1, 3, 5],
  },
  {
    id: 5,
    slug: "private-villas-bali",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    category: "Stay",
    title: "The Ultimate Escape: Private Villas in Bali",
    description: "Discover handpicked private villas in Bali that offer luxury, privacy and breathtaking views.",
    date: "June 9, 2026",
    readTime: "5 min read",
    imageClassName: "h-60 rounded-[40px]",
    author: "Sarah Tanaka",
    authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=150&q=80",
    authorBio: "Sarah is a luxury travel editor and interior design enthusiast.",
    heroImage: "https://images.unsplash.com/photo-1582610116397-edb72c4ab861?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "Bali has long held a special place in the imagination of travellers seeking beauty, spirituality and sensual pleasure.",
      sections: [
        { heading: "Ubud — Art, Rice Terraces and Spiritual Sanctuaries", body: "Ubud's villa culture is inseparable from its landscape.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80" },
        { heading: "Seminyak — Luxury Meets the Indian Ocean", body: "For those who want proximity to the island's celebrated beach culture without sacrificing privacy." },
        { heading: "Canggu — The New Creative Frontier", body: "Canggu has emerged as Bali's most creative district.", image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "In Bali, luxury is not about possessing more — it is about experiencing more deeply.",
      conclusion: "A private villa stay in Bali is not merely accommodation — it is a philosophy of travel.",
    },
    tags: ["Bali", "Luxury", "Villas", "Wellness", "Tropical"],
    relatedIds: [2, 3, 6],
  },
  {
    id: 6,
    slug: "8-travel-tips-stress-free-vacation",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    category: "Event",
    title: "8 Travel Tips for a Stress-Free Vacation",
    description: "Simple tips to help you plan better, travel smarter and enjoy more.",
    date: "June 4, 2026",
    readTime: "7 min read",
    imageClassName: "h-64 rounded-3xl",
    author: "Aisha Mensah",
    authorImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
    authorBio: "Aisha is a travel strategist, podcast host and author.",
    heroImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
    ],
    content: {
      intro: "Travel should be one of life's great pleasures — and yet for many people, the reality involves missed connections and overpacked luggage.",
      sections: [
        { heading: "Tips 1–3: Before You Leave", body: "Pack half of what you think you need. Build buffer time into every connection. Research your destination's unwritten rules.", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1000&q=80" },
        { heading: "Tips 4–6: While You're There", body: "Protect your mornings. Leave deliberate gaps in your itinerary. Spend money on experiences, not objects." },
        { heading: "Tips 7–8: Travel Mindset", body: "Accept that things will go wrong. Return to places you have loved.", image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1000&q=80" },
      ],
      pullQuote: "The best-planned journey is not the one with the most packed in — it's the one with enough space left over for the unexpected.",
      conclusion: "Stress-free travel is not the result of perfect planning — it is the result of the right relationship with uncertainty.",
    },
    tags: ["Travel Tips", "Planning", "Mindful Travel", "Adventure", "Guide"],
    relatedIds: [1, 4, 5],
  },
];

/**
 * Map a raw API blog response to the component format.
 * Handles both the list response (getBlogs) and single response (getBlogBySlug).
 */
export function mapApiBlogToComponentFormat(raw, index = 0) {
  if (!raw) return null;

  // Build gallery images from API fields
  const galleryImages = [];
  if (raw.galleryImages && Array.isArray(raw.galleryImages)) {
    galleryImages.push(...raw.galleryImages);
  } else if (raw.contentImageUrls && Array.isArray(raw.contentImageUrls)) {
    galleryImages.push(...raw.contentImageUrls);
  } else {
    // Try to build from individual image fields
    if (raw.image1) galleryImages.push(raw.image1);
    if (raw.image2) galleryImages.push(raw.image2);
    if (raw.image3) galleryImages.push(raw.image3);
    if (raw.image4) galleryImages.push(raw.image4);
    if (raw.image5) galleryImages.push(raw.image5);
  }

  // Build content sections from API fields
  let contentSections = [];
  if (raw.content && raw.content.sections) {
    contentSections = raw.content.sections;
  } else if (raw.sections && Array.isArray(raw.sections)) {
    contentSections = raw.sections;
  } else if (raw.body || raw.content || raw.content_body || raw.htmlContent) {
    // If API returns a single body string, split it into a section
    // Handle the case where raw.content is just a string
    const bodyText = (typeof raw.content === 'string' ? raw.content : null) || raw.body || raw.content_body || raw.htmlContent || "";
    contentSections = [{ heading: raw.title || "Article", body: bodyText }];
  }

  // Build tags
  let tags = [];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags;
  } else if (typeof raw.tags === "string") {
    tags = raw.tags.split(",").map((t) => t.trim()).filter(Boolean);
  } else if (raw.category) {
    tags = [raw.category];
  }

  // Build related IDs
  let relatedIds = [];
  if (Array.isArray(raw.relatedIds)) {
    relatedIds = raw.relatedIds;
  } else if (Array.isArray(raw.related_posts)) {
    relatedIds = raw.related_posts.map((r) => (typeof r === "object" ? r.id : r));
  }

  // Format date
  let dateStr = raw.date || raw.publishedAt || raw.createdAt || raw.created_at || "";
  if (dateStr && !isNaN(Date.parse(dateStr))) {
    const d = new Date(dateStr);
    dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  const mainImage =
    raw.coverImageUrl || raw.image || raw.imageUrl || raw.image_url || raw.mediaUrl || raw.thumbnail || raw.coverImage || raw.cover_image || raw.featuredImage ||
    (galleryImages.length > 0 ? galleryImages[0] : "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80");

  const heroImage =
    raw.heroImage || raw.hero_image || raw.bannerImage || raw.banner_image || mainImage;

  return {
    id: raw.blogPostId || raw.id || index + 1,
    slug: raw.slug || raw.url_slug || `post-${raw.blogPostId || raw.id || index + 1}`,
    image: mainImage,
    category: raw.category || raw.categoryName || raw.category_name || "Experience",
    title: raw.title || raw.name || "Untitled",
    description: raw.description || raw.summary || raw.excerpt || raw.subtitle || "",
    date: dateStr,
    readTime: raw.readTime || raw.read_time || raw.readingTime || "5 min read",
    author: raw.authorName || raw.author || raw.author_name || "Staff Writer",
    authorImage: raw.authorImage || raw.author_image || raw.authorAvatar || "",
    authorBio: raw.authorBio || raw.author_bio || "",
    heroImage: heroImage,
    galleryImages: galleryImages.length > 0 ? galleryImages : [mainImage, mainImage, mainImage].filter(Boolean),
    content: {
      intro: raw.content?.intro || raw.intro || raw.description || "",
      sections: contentSections,
      pullQuote: raw.content?.pullQuote || raw.pullQuote || raw.quote || "",
      conclusion: raw.content?.conclusion || raw.conclusion || "",
    },
    tags: tags,
    relatedIds: relatedIds,
    layoutId: raw.layoutId ?? ((raw.id || index) % 4) + 1,
  };
}

/**
 * Get a post by slug from a list of posts
 */
export function getPostBySlug(posts, slug) {
  return posts.find((p) => p.slug === slug);
}

/**
 * Get a post by id from a list of posts
 */
export function getPostById(posts, id) {
  return posts.find((p) => p.id === id);
}

/**
 * Assign layout variant 1-4 based on post id
 */
export function getLayoutVariant(id) {
  const variants = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 3, 6: 4 };
  return variants[id] ?? ((id % 4) + 1);
}
