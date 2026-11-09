import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width) {
  let idealPx;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = (typeof window !== "undefined" ? window.innerHeight : 800) * 0.7;
  if (available >= idealPx) return 1;
  return Math.max(0.65, available / idealPx);
}

function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function SocialCards({
  cards = [],
  onCardClick,
  theme = "light",
  accentColor = "#0097B2",
  autoPlay = false,
  autoPlayInterval = 3200,
}) {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef(null);
  const prevVisible = useRef(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center) => {
    const map = new Map();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction) => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  // Optional auto-play
  useEffect(() => {
    if (!autoPlay || !needsPagination) return;
    const timer = setInterval(() => {
      cycle("right");
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, cycle, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      completedCount += 1;
      if (completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, {
            ...target,
            duration: 1.2,
            ease: "elastic.out(1.05,.78)",
            delay: 0.2 + slot * 0.06,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotation: direction === "right" ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          duration: 0.4,
          ease: "power2.in",
          zIndex: 0,
        });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot = null;
    let leaveTimer = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction) => (
    <svg style={{ position: "relative", zIndex: 2, width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  const isDark = theme === "dark";

  return (
    <div className="card-fan-carousel-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative", zIndex: 20 }}>
      <style>{`
        .card-fan-carousel-wrapper .fan-layout {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 80rem;
          height: clamp(240px, 40vh, 460px);
          user-select: none;
          touch-action: pan-y;
        }
        .card-fan-carousel-wrapper .fan-card {
          position: absolute;
          width: clamp(120px, 14vw, 200px);
          aspect-ratio: 4 / 5;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: ${isDark ? "#121212" : "#f4f4f2"};
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24), 0 2px 10px rgba(0, 0, 0, 0.12);
          border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"};
          transform-origin: center center;
          will-change: transform, opacity;
          transition: border-color 0.2s ease;
        }
        .card-fan-carousel-wrapper .fan-card:hover {
          border-color: ${accentColor};
        }
        .card-fan-carousel-wrapper .fan-card-image-box {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .card-fan-carousel-wrapper .fan-card-image-box img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
        .card-fan-carousel-wrapper .fan-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 40%, transparent 70%);
          pointer-events: none;
          z-index: 2;
        }
        .card-fan-carousel-wrapper .fan-card-meta {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          z-index: 3;
          pointer-events: none;
          color: #FFFFFF;
        }
        .card-fan-carousel-wrapper .fan-card-eyebrow {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #00E5FF;
          display: block;
          margin-bottom: 2px;
        }
        .card-fan-carousel-wrapper .fan-card-title {
          font-size: clamp(12px, 1.2vw, 14px);
          font-weight: 700;
          line-height: 1.2;
          color: #FFFFFF;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-fan-arrow-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)"};
          background: ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"};
          backdrop-filter: blur(16px);
          WebkitBackdropFilter: blur(16px);
          color: ${isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.75)"};
          cursor: pointer;
          flex-shrink: 0;
          z-index: 30;
          outline: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.25s ease;
        }
        .card-fan-arrow-btn:hover {
          border-color: ${accentColor};
          color: ${accentColor};
          transform: scale(1.05);
        }
        .card-fan-arrow-btn:active {
          transform: scale(0.95);
        }
        @media (max-width: 640px) {
          .card-fan-carousel-wrapper .fan-layout {
            height: clamp(230px, 36vh, 320px);
          }
          .card-fan-carousel-wrapper .fan-card {
            width: clamp(120px, 28vw, 150px);
            border-radius: 14px;
          }
          .card-fan-arrow-btn {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: "90rem" }}>
        <div ref={containerRef} className="fan-layout">
          {cards.map((card, index) => {
            const image = (
              <div className="fan-card-image-box">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || card.title || `Card ${index}`}
                />
                <div className="fan-card-overlay" />
                {(card.title || card.eyebrow) && (
                  <div className="fan-card-meta">
                    {card.eyebrow && <span className="fan-card-eyebrow">{card.eyebrow}</span>}
                    {card.title && <h4 className="fan-card-title">{card.title}</h4>}
                  </div>
                )}
              </div>
            );

            const handleClick = (e) => {
              if (onCardClick) {
                onCardClick(card, index, e);
              }
            };

            return card.linkUrl ? (
              <a
                key={index}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="fan-card"
                onClick={handleClick}
              >
                {image}
              </a>
            ) : (
              <div key={index} className="fan-card" onClick={handleClick}>
                {image}
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 12, zIndex: 30 }}>
          <button className="card-fan-arrow-btn" onClick={() => cycle("left")} aria-label="Previous">
            {chevron("left")}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {cards.map((_, i) => {
              const isActive = i === centerIndex;
              return (
                <span
                  key={i}
                  style={{
                    width: isActive ? 18 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: isActive
                      ? accentColor
                      : (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"),
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </div>
          <button className="card-fan-arrow-btn" onClick={() => cycle("right")} aria-label="Next">
            {chevron("right")}
          </button>
        </div>
      )}
    </div>
  );
}

