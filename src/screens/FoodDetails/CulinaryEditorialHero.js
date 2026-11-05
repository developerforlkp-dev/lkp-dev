import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ChevronLeft, ChevronRight, Play, Eye, Sparkles, ChefHat,
  Leaf, Utensils, Award, Clock, Star, Share2, Phone, Navigation, DollarSign, Calendar
} from "lucide-react";
import Favorite from "../../components/Favorite";
import FullScreenImage from "../../components/FullScreenImage";
import Icon from "../../components/Icon";
import { getShareText } from "../../utils/shareUtils";
import { formatTimingsRange } from "../../utils/timeUtils";

const toDisplayString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.displayName || value.name || value.title || value.code || "";
  }
  return String(value);
};

export default function CulinaryEditorialHero({ food, galleryItems, tokens, theme, isMobile }) {
  const history = useHistory();
  const { A = "#0097B2", FG = "#0F0F0F", M = "#7A7A77", BG = "#FBFBF9", W = "#FFFFFF", B = "#E6E6E3", S = "#F3F3F1" } = tokens || {};
  const isDark = theme === "dark";

  const id = food?.id || food?.foodId || food?._id;
  const items = useMemo(() => {
    return galleryItems && galleryItems.length > 0
      ? galleryItems
      : ["https://picsum.photos/seed/culinary/1200/800"];
  }, [galleryItems]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = next, -1 = prev
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState({});
  const touchStartXRef = useRef(null);

  // Auto-advance slideshow if multiple images and not hovered
  useEffect(() => {
    if (items.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setSlideDirection(1);
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  const goToPrev = (e) => {
    e?.stopPropagation();
    setSlideDirection(-1);
    setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = (e) => {
    e?.stopPropagation();
    setSlideDirection(1);
    setActiveIdx((prev) => (prev + 1) % items.length);
  };

  const selectImage = (index, e) => {
    e?.stopPropagation();
    setSlideDirection(index > activeIdx ? 1 : -1);
    setActiveIdx(index);
  };

  const openModal = (index, e) => {
    e?.stopPropagation();
    setActivePhotoIndex(index);
    setIsGalleryOpen(true);
  };

  // Location resolution
  const locationString = useMemo(() => {
    const parts = [
      food?.meetingDistrict || food?.district || food?.city,
      food?.meetingState || food?.state
    ].filter(Boolean);

    if (parts.length > 0) return parts.join(", ");
    if (food?.meetingLocationName) return food.meetingLocationName;
    if (food?.meetingAddress || food?.address) return food.meetingAddress || food.address;
    if (food?.meetingCountry || food?.country) return food.meetingCountry || food.country;
    return null;
  }, [food]);

  // Title, description & cuisine
  const title = food?.menuName || food?.title || "Signature Dish";
  const rawDescription = food?.shortDescription || food?.detailedDescription || food?.description || "";
  const displayDescription = rawDescription.length > 220
    ? `${rawDescription.substring(0, 220).trim()}...`
    : rawDescription;

  // Timing & Price & Contact Data
  const timingDisplay = useMemo(() => {
    return formatTimingsRange(food?.openingTime, food?.closingTime, null, null);
  }, [food?.openingTime, food?.closingTime]);

  const priceDisplay = useMemo(() => {
    if (food?.averageCostForOne) return `₹${food.averageCostForOne}`;
    if (food?.costForTwo) return `₹${food.costForTwo} for two`;
    if (food?.price) return `₹${food.price}`;
    return null;
  }, [food]);

  const contactPhone = food?.contactPhone || food?.phone || food?.host?.phone;

  const handleInquiryScroll = (e) => {
    e?.preventDefault();
    const target = document.getElementById("reservation-inquiries") || document.querySelector(".reservation-section-wrapper") || document.querySelector(".narrative-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Story / Video link check
  const hasStory = useMemo(() => {
    if (food?.videoUrl || food?.youtubeUrl || food?.storyUrl) return true;
    const storyText = food?.chefOwnerStory || food?.chefStory || food?.story || food?.ownerStory;
    return typeof storyText === "string" && storyText.trim().length > 20;
  }, [food]);

  const handleWatchStory = (e) => {
    e?.preventDefault();
    if (food?.videoUrl) {
      window.open(food.videoUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (food?.youtubeUrl) {
      window.open(food.youtubeUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const narrativeSection = document.getElementById("the-philosophy") || document.querySelector(".narrative-section");
    if (narrativeSection) {
      narrativeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreDishes = (e) => {
    e?.preventDefault();
    const dishesSection = document.getElementById("signature-dishes-section") || document.querySelector(".signature-dishes-section") || document.querySelector(".narrative-section");
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Feature indicators
  const featurePills = useMemo(() => {
    const pills = [];

    // 1. Dietary / Veg status
    const isVeg = food?.isVeg === true;
    const dietaryNames = Array.isArray(food?.dietaryOptionNames) ? food.dietaryOptionNames.join(", ") : food?.dietaryOptionNames;
    if (dietaryNames) {
      pills.push({ icon: Leaf, label: dietaryNames, sub: "Dietary" });
    } else if (food?.isVeg !== undefined && food?.isVeg !== null) {
      pills.push({ icon: Leaf, label: isVeg ? "Pure Vegetarian" : "Non-Vegetarian", sub: "Dietary" });
    }

    // 2. Cuisine / Category
    const cuisine = Array.isArray(food?.cuisineTypeNames)
      ? food.cuisineTypeNames.join(", ")
      : (food?.cuisineTypeNames || food?.cuisineType?.displayName || "");
    const category = toDisplayString(food?.category);
    if (cuisine) {
      pills.push({ icon: Utensils, label: cuisine, sub: "Heritage Cuisine" });
    } else if (category) {
      pills.push({ icon: Utensils, label: category, sub: "Category" });
    }

    // 3. Chef / Source / Curation
    const source = food?.sourceType?.displayName || food?.sourceType?.code || food?.sourceType;
    if (source) {
      pills.push({ icon: ChefHat, label: source, sub: "Crafted By" });
    } else if (food?.managedBy || food?.chefOwnerStory) {
      pills.push({ icon: ChefHat, label: "Chef Curated", sub: "Signature Recipe" });
    } else if (food?.isFamilyFriendly) {
      pills.push({ icon: Award, label: "Family Friendly", sub: "Experience" });
    }

    return pills.slice(0, 3);
  }, [food]);

  // Handle Touch Swipe for mobile/tablet gallery
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartXRef.current = null;
  };

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: custom * 0.1 }
    })
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 1.03
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const activeImageSrc = imgErrorMap[activeIdx]
    ? "https://picsum.photos/seed/culinary/1200/800"
    : items[activeIdx];

  return (
    <section
      className="culinary-editorial-hero"
      aria-label="Food Details Hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        background: isDark
          ? "radial-gradient(ellipse 90% 70% at 85% 25%, rgba(0, 151, 178, 0.16) 0%, #080808 65%)"
          : "radial-gradient(ellipse 95% 75% at 88% 28%, #DFF4F8 0%, #EFF8FA 35%, #FBFBF9 75%)",
        color: FG,
        overflow: "hidden",
        width: "100%",
        paddingTop: isMobile ? 84 : 110,
        paddingBottom: isMobile ? 48 : 64,
        boxSizing: "border-box"
      }}
    >
      {/* ─── AMBIENT BACKDROP ARTWORK (KERALA BACKWATERS PANORAMA) ─── */}
      <div
        className="hero-ambient-scenery"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: isMobile ? "390px" : "660px",
          maxWidth: "80vw",
          height: "auto",
          pointerEvents: "none",
          zIndex: 1,
          opacity: isDark ? 0.38 : 0.88,
          transition: "opacity 0.4s ease"
        }}
      >
        <img
          src="/images/food/kerala-backwaters-panorama.png"
          alt=""
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            objectPosition: "left bottom",
            filter: isDark ? "brightness(0.85) contrast(1.15)" : "none"
          }}
        />
      </div>

      {/* Floating Organic Soft Ambient Gradient Orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(0, 151, 178, 0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 151, 178, 0.18) 0%, rgba(223, 244, 248, 0.6) 50%, transparent 75%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* ─── ACTION BAR (Back Button, Favorites, Share) ─── */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 18 : 28,
          left: 0,
          right: 0,
          padding: isMobile ? "0 16px" : "0 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 40,
          pointerEvents: "none"
        }}
      >
        <motion.button
          type="button"
          onClick={() => history.goBack()}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back"
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? 38 : 44,
            height: isMobile ? 38 : 44,
            borderRadius: "50%",
            background: isDark ? "rgba(25, 25, 25, 0.85)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${B}`,
            color: FG,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s"
          }}
        >
          <ChevronLeft size={isMobile ? 18 : 20} />
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          {/* Favorite heart button */}
          <Favorite itemType="food" itemId={id}>
            {({ saved, onClick }) => (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(e);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                style={{
                  width: isMobile ? 38 : 44,
                  height: isMobile ? 38 : 44,
                  borderRadius: "50%",
                  background: isDark ? "rgba(25, 25, 25, 0.85)" : "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${saved ? A : B}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: saved ? A : FG }}>
                  <Icon name={saved ? "heart-fill" : "heart"} size={isMobile ? 17 : 19} />
                </div>
              </motion.button>
            )}
          </Favorite>

          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (navigator.share) {
                  const shareText = getShareText(food, "food");
                  await navigator.share({
                    title: title,
                    text: shareText ? `${shareText}\n${window.location.href}` : window.location.href
                  });
                } else {
                  const fallbackText = `${getShareText(food, "food") || title}\n${window.location.href}`;
                  await navigator.clipboard.writeText(fallbackText);
                  alert("Link copied to clipboard!");
                }
              } catch (_) {}
            }}
            aria-label="Share listing"
            style={{
              width: isMobile ? 38 : 44,
              height: isMobile ? 38 : 44,
              borderRadius: "50%",
              background: isDark ? "rgba(25, 25, 25, 0.85)" : "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${B}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: FG,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              cursor: "pointer"
            }}
          >
            <Share2 size={isMobile ? 16 : 18} />
          </motion.button>
        </div>
      </div>

      {/* ─── MAIN HERO CONTAINER ─── */}
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: isMobile ? "0 18px" : "0 32px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10
        }}
      >
        <div
          className="hero-split-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(320px, 1.05fr) minmax(420px, 1.35fr)",
            gap: isMobile ? 36 : 48,
            alignItems: "center"
          }}
        >
          {/* ═════════ LEFT EDITORIAL COLUMN ═════════ */}
          <div
            className="hero-editorial-content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              zIndex: 2,
              order: isMobile ? 2 : 1
            }}
          >
            {/* 1. Location Indicator Pill */}
            {locationString && (
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: isDark ? "rgba(0, 151, 178, 0.18)" : "rgba(0, 151, 178, 0.09)",
                  border: `1px solid ${isDark ? "rgba(0, 151, 178, 0.35)" : "rgba(0, 151, 178, 0.22)"}`,
                  padding: "6px 14px 6px 11px",
                  borderRadius: 24,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: isDark ? "#38D7EF" : "#007A90",
                  letterSpacing: "0.02em",
                  marginBottom: 18
                }}
              >
                <MapPin size={14} color={isDark ? "#38D7EF" : "#008CA5"} />
                <span>{locationString}</span>
              </motion.div>
            )}

            {/* 2. Large Editorial Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              style={{
                fontFamily: '"Cormorant Garamond", "Fraunces", "Playfair Display", Georgia, serif',
                fontSize: isMobile
                  ? "clamp(2.1rem, 8.5vw, 2.75rem)"
                  : "clamp(2.8rem, 4.3vw, 4.2rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: FG,
                margin: "0 0 20px 0",
                textTransform: "capitalize",
                wordBreak: "break-word"
              }}
            >
              {title}
            </motion.h1>

            {/* 3. Short Dynamic Description */}
            {displayDescription && (
              <motion.p
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: isMobile ? 14.5 : 16.5,
                  lineHeight: 1.65,
                  color: M,
                  fontWeight: 400,
                  margin: "0 0 32px 0",
                  maxWidth: 520
                }}
              >
                {displayDescription}
              </motion.p>
            )}

            {/* 4. Refined Editorial Discovery Bar & Actions */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: featurePills.length > 0 ? 32 : 16,
                width: isMobile ? "100%" : "auto"
              }}
            >
              {/* Quick Status Pill Bar (Timings & Price when available) */}
              {(timingDisplay || priceDisplay) && (
                <div
                  style={{
                    display: "inline-flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: isMobile ? 8 : 16,
                    padding: "8px 14px",
                    borderRadius: 16,
                    background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
                    width: "fit-content"
                  }}
                >
                  {priceDisplay && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: M }}>Avg Cost</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: A }}>{priceDisplay}</span>
                    </div>
                  )}
                  {priceDisplay && timingDisplay && (
                    <span style={{ color: B, fontSize: 12 }}>•</span>
                  )}
                  {timingDisplay && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} color={A} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: FG }}>{timingDisplay}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons Row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  width: isMobile ? "100%" : "auto"
                }}
              >
                {/* Primary Action: Experience & Menu Details */}
                <motion.button
                  type="button"
                  onClick={handleExploreDishes}
                  whileHover={{ scale: 1.025, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    background: `linear-gradient(135deg, ${A} 0%, #007C92 100%)`,
                    color: "#FFFFFF",
                    border: "none",
                    padding: isMobile ? "13px 22px" : "14px 28px",
                    borderRadius: 30,
                    fontSize: 14.5,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    cursor: "pointer",
                    boxShadow: `0 8px 24px -4px rgba(0, 151, 178, 0.42)`,
                    transition: "box-shadow 0.25s ease",
                    flex: isMobile ? "1 1 auto" : "none"
                  }}
                >
                  <span>Explore Menu & Story</span>
                  <span style={{ fontSize: 16 }}>→</span>
                </motion.button>

                {/* Secondary Action: Contact / Reservation Inquiry (or Watch Story if video exists) */}
                {contactPhone ? (
                  <motion.a
                    href={`tel:${contactPhone}`}
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      color: FG,
                      border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.14)" : B}`,
                      padding: isMobile ? "12px 20px" : "13px 24px",
                      borderRadius: 30,
                      fontSize: 14.5,
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                      flex: isMobile ? "1 1 auto" : "none"
                    }}
                  >
                    <Phone size={15} color={A} />
                    <span>Inquire / Call</span>
                  </motion.a>
                ) : hasStory ? (
                  <motion.button
                    type="button"
                    onClick={handleWatchStory}
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      color: FG,
                      border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.14)" : B}`,
                      padding: isMobile ? "12px 20px" : "13px 24px",
                      borderRadius: 30,
                      fontSize: 14.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                      flex: isMobile ? "1 1 auto" : "none"
                    }}
                  >
                    <Play size={14} fill={A} color={A} />
                    <span>Philosophy & Story</span>
                  </motion.button>
                ) : null}
              </div>
            </motion.div>

            {/* 5. Feature Indicator Badges (Derived from backend data) */}
            {featurePills.length > 0 && (
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? 12 : 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  width: "100%",
                  maxWidth: 520
                }}
              >
                {featurePills.map((pill, pIdx) => {
                  const IconComponent = pill.icon;
                  return (
                    <div
                      key={pIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: isMobile ? "1 1 45%" : "none"
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: isDark ? "rgba(0, 151, 178, 0.16)" : "rgba(0, 151, 178, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: A,
                          flexShrink: 0
                        }}
                      >
                        <IconComponent size={17} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: FG,
                            lineHeight: 1.2
                          }}
                        >
                          {pill.label}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 500,
                            color: M,
                            lineHeight: 1.2
                          }}
                        >
                          {pill.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* ═════════ RIGHT ASYMMETRICAL EDITORIAL GALLERY ═════════ */}
          <div
            className="hero-editorial-gallery"
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              order: isMobile ? 1 : 2,
              width: "100%"
            }}
          >
            {/* Outer Decorative Brand Framing */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 680,
                boxSizing: "border-box"
              }}
            >
              {/* Subtle Layered Teal Accent Backing Card (asymmetrical offset) */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: isMobile ? "rotate(-1.2deg) scale(0.99)" : "rotate(-1.8deg) scale(1.01)",
                  borderRadius: isMobile ? 26 : 38,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(0, 151, 178, 0.35) 0%, rgba(0, 70, 85, 0.15) 100%)"
                    : "linear-gradient(135deg, rgba(0, 151, 178, 0.22) 0%, rgba(186, 237, 246, 0.45) 100%)",
                  filter: "blur(0.5px)",
                  zIndex: 0,
                  pointerEvents: "none"
                }}
              />

              {/* Main Featured Image Container */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => openModal(activeIdx, e)}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: isMobile ? "4 / 3" : "16 / 10",
                  minHeight: isMobile ? 250 : 380,
                  maxHeight: isMobile ? 360 : 490,
                  borderRadius: isMobile ? 24 : 36,
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 28px 60px -12px rgba(0, 0, 0, 0.7), 0 10px 24px -8px rgba(0, 151, 178, 0.25)"
                    : "0 24px 54px -14px rgba(10, 45, 55, 0.16), 0 8px 20px -6px rgba(0, 0, 0, 0.06)",
                  border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.95)"}`,
                  background: S,
                  cursor: "pointer",
                  zIndex: 1
                }}
              >
                {/* Framer-Motion Animated Slide Transition */}
                <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                  <motion.div
                    key={activeIdx}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <img
                      src={activeImageSrc}
                      alt={`${title} - view ${activeIdx + 1}`}
                      onError={() => {
                        setImgErrorMap((prev) => ({ ...prev, [activeIdx]: true }));
                      }}
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center center",
                        display: "block",
                        userSelect: "none"
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Ambient vignette gradient for button contrast */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)",
                    pointerEvents: "none",
                    zIndex: 2
                  }}
                />

                {/* Top-Right Badge: Dynamic Image Counter */}
                {items.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "5px 12px",
                      borderRadius: 20,
                      background: "rgba(10, 15, 20, 0.68)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span>{activeIdx + 1}</span>
                    <span style={{ opacity: 0.6 }}>/</span>
                    <span style={{ opacity: 0.85 }}>{items.length}</span>
                  </div>
                )}

                {/* Click to expand hint overlay icon */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(10, 15, 20, 0.55)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    opacity: isHovered || isMobile ? 0.9 : 0,
                    transition: "opacity 0.2s ease"
                  }}
                  title="Click to view full screen"
                >
                  <Eye size={15} />
                </div>

                {/* Left/Right Floating Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <motion.button
                      type="button"
                      onClick={goToPrev}
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.92 }}
                      aria-label="Previous image"
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: isMobile ? 36 : 42,
                        height: isMobile ? 36 : 42,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.92)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        color: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                        cursor: "pointer",
                        zIndex: 10
                      }}
                    >
                      <ChevronLeft size={isMobile ? 18 : 22} />
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={goToNext}
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.92 }}
                      aria-label="Next image"
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: isMobile ? 36 : 42,
                        height: isMobile ? 36 : 42,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.92)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        color: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                        cursor: "pointer",
                        zIndex: 10
                      }}
                    >
                      <ChevronRight size={isMobile ? 18 : 22} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

                        {/* ─── THUMBNAIL GALLERY ROW: AUTO MARQUEE (NO FADE, SAME EXACT POSITION) ─── */}
            {items.length > 1 && (
              <div
                className="hero-thumbnails-marquee-container"
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 680,
                  marginTop: 18,
                  overflow: "hidden",
                  padding: "6px 0 10px 0",
                  boxSizing: "border-box"
                }}
              >
                <style>{`
                  @keyframes heroThumbnailMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .hero-thumbnails-marquee-track {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    animation: heroThumbnailMarquee ${Math.max(items.length * 4, 16)}s linear infinite;
                  }
                  .hero-thumbnails-marquee-track:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="hero-thumbnails-marquee-track">
                  {[...items, ...items, ...items, ...items].map((thumbUrl, mIdx) => {
                    const originalIdx = mIdx % items.length;
                    const isSelected = originalIdx === activeIdx;
                    return (
                      <div
                        key={mIdx}
                        onClick={(e) => selectImage(originalIdx, e)}
                        style={{
                          flex: isMobile ? "0 0 64px" : "0 0 84px",
                          height: isMobile ? 48 : 60,
                          borderRadius: 14,
                          overflow: "hidden",
                          marginRight: isMobile ? 8 : 12,
                          cursor: "pointer",
                          border: isSelected
                            ? `2.5px solid ${A}`
                            : `1.5px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)"}`,
                          boxShadow: isSelected
                            ? "0 6px 16px -2px rgba(0, 151, 178, 0.45)"
                            : "0 2px 6px rgba(0,0,0,0.06)",
                          background: S,
                          opacity: isSelected ? 1 : 0.72,
                          transition: "transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease",
                          transform: isSelected ? "scale(1.04)" : "scale(1)"
                        }}
                      >
                        <img
                          src={thumbUrl}
                          alt={`thumbnail ${originalIdx + 1}`}
                          onError={(e) => {
                            e.currentTarget.src = "https://picsum.photos/seed/culinary/300/200";
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            userSelect: "none"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

{/* Gallery Progress Dash Line Indicator */}
            {items.length > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 6
                }}
              >
                {items.map((_, i) => (
                  <div
                    key={i}
                    onClick={(e) => selectImage(i, e)}
                    style={{
                      width: i === activeIdx ? 24 : 6,
                      height: 4,
                      borderRadius: 3,
                      background: i === activeIdx ? A : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"),
                      cursor: "pointer",
                      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── FULL-SCREEN IMAGE LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {isGalleryOpen && (
          <FullScreenImage
            src={items[activePhotoIndex]}
            items={items}
            currentIndex={activePhotoIndex}
            onNavigate={(newIdx) => setActivePhotoIndex(newIdx)}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

