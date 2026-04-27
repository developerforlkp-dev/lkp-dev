import React, { useEffect, useState, useMemo, createContext, useContext, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView, animate, useAnimationFrame } from "framer-motion";
import {
  Wifi, Waves, Sparkles, Dumbbell, Umbrella, Plane, GlassWater, Utensils,
  Phone, Clock, FileText, MapPin, ChevronDown, CheckCircle, Info, Building, 
  ArrowRight, ShieldCheck, Mail, Globe, Map, Navigation, ArrowDown, Car, AirVent,
  Users, DoorOpen, Bed, Bath, Maximize
} from "lucide-react";
import cn from "classnames";
import Loader from "../../components/Loader";
import Icon from "../../components/Icon";
import RoomCards from "./RoomCards";
import { getStayDetails, getHost } from "../../utils/api";

/* ─── TOKENS & THEME ─────────── */
const THEMES = {
  light: {
    A: "#0097B2", AH: "#008CA5", AL: "rgba(0, 151, 178, 0.08)",
    BG: "#FBFBF9", FG: "#0F0F0F", M: "#7A7A77",
    S: "#F3F3F1", B: "#E6E6E3", W: "#FFFFFF"
  },
  dark: {
    A: "#0097B2", AH: "#0AADCA", AL: "rgba(0, 151, 178, 0.15)",
    BG: "#080808", FG: "#EBEBE6", M: "#8C8C88",
    S: "#111111", B: "#1F1F1F", W: "#000000"
  }
};

const ThemeContext = createContext({ theme: "light", toggleTheme: () => { }, tokens: THEMES.light });
const useTheme = () => useContext(ThemeContext);

function ScopedThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const tokens = THEMES[theme];
      Object.entries(tokens).forEach(([key, value]) => {
        wrapperRef.current.style.setProperty(`--${key}`, value);
      });
      wrapperRef.current.style.background = tokens.BG;
      wrapperRef.current.style.color = tokens.FG;
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, tokens: THEMES[theme] }}>
      <div ref={wrapperRef} className="stay-details-premium" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

const E = [0.22, 1, 0.36, 1];

const ScopedStyles = () => (
  <style>{`
    .stay-details-premium {
      font-family: var(--font-inter, system-ui, sans-serif);
      overflow-x: hidden;
      cursor: none;
      transition: background 0.6s cubic-bezier(0.22, 1, 0.36, 1), color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
    }
    .stay-details-premium a, .stay-details-premium button { cursor: none; }
    @keyframes marquee-l { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes marquee-r { from{transform:translateX(-50%)} to{transform:translateX(0)} }
    @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(1deg)} }
    
    .stay-details-premium .font-display { font-family: var(--font-fraunces, Georgia, serif); }
    .stay-details-premium .mq-l { display: flex; white-space: nowrap; animation: marquee-l 30s linear infinite; }
    .stay-details-premium .mq-r { display: flex; white-space: nowrap; animation: marquee-r 34s linear infinite; }
    
    #cur-dot { position: fixed; width: 6px; height: 6px; background: var(--A); border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%, -50%); }
    #cur-ring { position: fixed; width: 38px; height: 38px; border: 1.5px solid var(--AL); border-radius: 50%; pointer-events: none; z-index: 99998; transform: translate(-50%, -50%); }
    
    .shimmer-cta {
      position: relative;
      overflow: hidden;
      background: var(--FG);
      color: var(--BG);
      font-weight: 700;
      border-radius: 12px;
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .shimmer-cta::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(to bottom right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
      transform: rotate(45deg);
      animation: shimmer 3s infinite linear;
    }
    @keyframes shimmer { from { transform: translate(-50%,-50%) rotate(45deg); } to { transform: translate(50%,50%) rotate(45deg); } }

    @media(max-width:768px){
      .stay-details-premium .desk-only { display: none !important; }
      .pol-contact-grid, .amenities-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    }
  `}</style>
);

/* ─── UTILS ─────────── */
const toDisplayString = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.displayName || value.name || value.title || value.code || "";
  }
  return String(value);
};

/* ─── UI COMPONENTS ─────────── */
function Cursor() {
  const { tokens: { A, AL } } = useTheme();
  const x = useMotionValue(-200), y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  useEffect(() => {
    const fn = (e) => { x.set(e.clientX); y.set(e.clientY) };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [x, y]);
  return (
    <>
      <motion.div id="cur-dot" style={{ left: x, top: y, background: A }} />
      <motion.div id="cur-ring" style={{ left: sx, top: sy, borderColor: AL }} />
    </>
  );
}

function ProgressBar() {
  const { tokens: { A } } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div style={{ scaleX, transformOrigin: "left", position: "fixed", top: 0, left: 0, right: 0, height: 2, background: A, zIndex: 9996 }} />
  );
}

function Rev({ children, delay = 0, style = {}, className = "" }) {
  const r = useRef(null);
  const v = useInView(r, { once: true, margin: "-60px" });
  return (
    <motion.div ref={r} initial={{ opacity: 0, y: 44 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: E, delay }} style={style} className={className}>
      {children}
    </motion.div>
  );
}

function Chars({ text, cls = "", style = {}, delay = 0 }) {
  const r = useRef(null);
  const v = useInView(r, { once: true, margin: "-40px" });
  return (
    <div ref={r} className={cls} style={style}>
      {text?.split("").map((c, i) => (
        <motion.span key={i} initial={{ y: "105%", opacity: 0 }} animate={v ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.7, ease: E, delay: delay + i * 0.028 }} style={{ display: "inline-block", whiteSpace: c === " " ? "pre" : "normal" }}>
          {c}
        </motion.span>
      ))}
    </div>
  );
}

function Soul({ children, y = 80, s = 0.05, r = 0, delay = 0, style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const moveY = useTransform(scrollYProgress, [0, 0.5, 1], [y, 0, -y]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - s, 1, 1 - s]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  return (
    <motion.div ref={ref} style={{ ...style, y: moveY, scale, opacity }} transition={{ ease: E, delay }}>
      {children}
    </motion.div>
  );
}

function Mq({ items, dir = "l", size = "sm", bg, accent = false }) {
  const { tokens: { A, BG, M, B } } = useTheme();
  const bgColor = bg ?? BG;
  const sep = "  ·  ";
  const fsMap = { sm: "0.65rem", lg: "clamp(2.2rem,5vw,4rem)", xl: "clamp(3.5rem,9vw,7.5rem)" };
  const fs = fsMap[size];
  const col = accent ? A : M;
  const padV = size === "xl" ? "28px 0" : size === "lg" ? "20px 0" : "11px 0";
  const speed = size === "sm" ? 0.04 : 0.06;

  // Duplicate items enough to always overflow
  const CLONES = 8;
  const allItems = Array(CLONES).fill(items).flat();
  const singleSet = items.join(sep) + sep;

  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [setW, setSetW] = useState(0);

  // Measure the width of one full set
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        const child = trackRef.current.firstElementChild;
        if (child) {
          // One "set" = the rendered width of items.length children
          const allChildren = Array.from(trackRef.current.children);
          const oneSetCount = items.length;
          const width = allChildren.slice(0, oneSetCount).reduce((sum, el) => sum + el.offsetWidth, 0);
          if (width > 0) setSetW(width);
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (setW <= 0) return;
    const move = (delta || 16) * speed;
    const current = x.get();
    if (dir === "l") {
      const next = current - move;
      x.set(next <= -setW ? next + setW : next);
    } else {
      const next = current + move;
      x.set(next >= 0 ? next - setW : next);
    }
  });

  return (
    <div style={{ overflow: "hidden", background: bgColor, borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, padding: padV }}>
      <motion.div ref={trackRef} style={{ x, display: "flex", whiteSpace: "nowrap", willChange: "transform" }}>
        {allItems.map((item, i) => (
          <span
            key={i}
            className={size !== "sm" ? "font-display" : ""}
            style={{
              fontSize: fs,
              fontWeight: size !== "sm" ? 700 : 500,
              color: col,
              whiteSpace: "nowrap",
              letterSpacing: size === "sm" ? "0.28em" : "-0.01em",
              textTransform: size === "sm" ? "uppercase" : "none",
              paddingRight: size === "sm" ? 32 : 56,
              flexShrink: 0,
            }}
          >
            {item}{sep}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SHdr({ idx, label }) {
  const { tokens: { A, B } } = useTheme();
  return (
    <Rev style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }}>
      <span style={{ fontSize: 10, letterSpacing: "0.35em", fontWeight: 600, textTransform: "uppercase", color: A, whiteSpace: "nowrap" }}>{idx} — {label}</span>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} style={{ flex: 1, height: 1, background: B, transformOrigin: "left" }} />
    </Rev>
  );
}

/* ─── STAY SECTIONS ─────────── */
function StayHeroCarousel({ stay, galleryItems }) {
  const { tokens: { BG, FG, W, B, A } } = useTheme();

  const containerRef = useRef(null);
  const baseX = useMotionValue(0);
  const [drag, setDrag] = useState(false);

  // 1. Continuous Motion: Update baseX by delta * 0.05
  // Added safety check for delta to prevent NaN values
  useAnimationFrame((t, delta) => {
    if (!drag) {
      const moveBy = (delta || 16) * 0.05;
      baseX.set(baseX.get() - moveBy);
    }
  });

  // 4. Visual Variety: Mosaic configuration for the gallery
  const itemConfigs = useMemo(() => [
    { w: 420, h: 520, y: 0 },
    { w: 320, h: 320, y: 140 },
    { w: 520, h: 380, y: -40 },
    { w: 380, h: 480, y: 80 },
    { w: 480, h: 320, y: 60 },
    { w: 320, h: 420, y: -100 },
  ], []);

  // 2. The Infinite Loop (Wrapping): Calculate W_BLOCK (totalUniqueWidth)
  const W_BLOCK = useMemo(() => itemConfigs.reduce((sum, it) => sum + it.w + 32, 0), [itemConfigs]);

  const x = useTransform(baseX, (v) => {
    if (W_BLOCK <= 0) return "0px";
    // Simplified seamless wrap: ensures v stays within [0, -W_BLOCK]
    // As v decreases, this value goes 0 -> -W_BLOCK then snaps back to 0
    const wrapped = v % W_BLOCK;
    return `${wrapped}px`;
  });

  // Duplicated images to fill the track
  const items = useMemo(() => Array(12).fill(itemConfigs).flat(), [itemConfigs]);
  const title = stay?.propertyName || stay?.title || "STAY EXPERIENCE";

  return (
    <section style={{ position: "relative", height: "100vh", background: BG, overflow: "hidden", display: "flex", alignItems: "center", paddingTop: 80 }}>
      {/* Background Decor */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: `linear-gradient(to bottom, ${A}44, transparent)`, zIndex: 2, pointerEvents: "none" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)", zIndex: 2, pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 20, pointerEvents: "none", textAlign: "center", width: "90%" }}>
        <Chars text={title.toUpperCase()} cls="font-display" style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)", fontWeight: 700, color: W, letterSpacing: "-0.02em", lineHeight: 0.9 }} />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ fontSize: 12, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginTop: 12 }}>{toDisplayString(stay?.propertyType) || "Bespoke Stay Experience"}</motion.p>
      </div>

      <motion.div
        onPan={(e, info) => baseX.set(baseX.get() + info.delta.x)}
        onPanStart={() => setDrag(true)}
        onPanEnd={() => setDrag(false)}
        style={{ position: "absolute", inset: 0, zIndex: 10, cursor: drag ? "grabbing" : "grab" }}
      />

      <motion.div ref={containerRef} style={{ x, display: "flex", gap: 32, paddingLeft: 32, alignItems: "center", pointerEvents: "none", marginTop: -120 }}>
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: (i % 6) * 0.05, ease: E }}
            style={{
              flexShrink: 0, width: it.w, height: it.h, y: it.y,
              position: "relative", borderRadius: 24, overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.15)`,
              boxShadow: "0 30px 60px -15px rgba(0,0,0,0.4)"
            }}
          >
            <img src={galleryItems.length > 0 ? galleryItems[i % galleryItems.length] : "https://picsum.photos/seed/stay/800/600"} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </motion.div>
        ))}
      </motion.div>

      <div style={{ position: "absolute", bottom: 60, right: "5%", zIndex: 10, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Explore Gallery</span>
        <motion.div animate={{ width: [30, 80, 30] }} transition={{ duration: 3, repeat: Infinity }} style={{ height: 1, background: "rgba(255,255,255,0.4)" }} />
      </div>
    </section>
  );
}

function StayAmenities({ stay }) {
  const { tokens: { A, FG, M, S, B, W } } = useTheme();

  const iconMap = {
    "wifi": Wifi, "internet": Wifi, "broadband": Wifi,
    "pool": Waves, "swimming": Waves, "plunge": Waves, "jacuzzi": Waves, "hot tub": Waves,
    "spa": Sparkles, "wellness": Sparkles, "sauna": Sparkles, "massage": Sparkles,
    "gym": Dumbbell, "fitness": Dumbbell, "workout": Dumbbell,
    "beach": Umbrella, "sun": Umbrella, "cabana": Umbrella,
    "shuttle": Plane, "airport": Plane, "transfer": Plane, "transport": Plane,
    "bar": GlassWater, "drink": GlassWater, "cocktail": GlassWater, "lounge": GlassWater,
    "restaurant": Utensils, "dining": Utensils, "food": Utensils, "breakfast": Utensils,
    "parking": Car, "valet": Car, "garage": Car,
    "ac": AirVent, "air": AirVent, "cooling": AirVent, "climate": AirVent,
    "building": Building, "reception": Building, "concierge": Building, "front": Building,
    "map": Map, "tour": Map, "excursion": Map,
  };

  const getIcon = (label) => {
    const lower = (label || "").toLowerCase();
    for (const key of Object.keys(iconMap)) {
      if (lower.includes(key)) return iconMap[key];
    }
    return CheckCircle;
  };

  const extractList = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr.map(item => {
      if (typeof item === "string") return item;
      // Search for any common text-bearing key in the object
      return item?.name || item?.amenityName || item?.facilityName || item?.amenity || item?.facility || item?.label || item?.title || item?.value || "";
    }).filter(Boolean);
  };

  const dynamicAmenities = useMemo(() => {
    const list = stay?.amenities || stay?.propertyAmenities || stay?.stayAmenities || stay?.amenityList || [];
    return extractList(list);
  }, [stay]);

  const dynamicFacilities = useMemo(() => {
    const list = stay?.facilities || stay?.propertyFacilities || stay?.stayFacilities || stay?.facilityList || [];
    return extractList(list);
  }, [stay]);

  return (
    <section style={{ background: W, padding: "140px 36px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Soul y={100} s={0.08}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 80, borderBottom: `1px solid ${B}`, paddingBottom: 100 }}>
            <Rev style={{ flex: "1 1 500px" }}>
              <p style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: A, fontWeight: 700, marginBottom: 28 }}>
                <MapPin size={16} />
                {[stay?.city, stay?.state, stay?.country].filter(Boolean).join(", ") || stay?.location || stay?.address || "Location"}
              </p>
              {(() => {
                const short = stay?.shortDescription || "";
                const words = short.trim().split(" ");
                const mid = Math.ceil(words.length / 2);
                const line1 = words.slice(0, mid).join(" ");
                const line2 = words.slice(mid).join(" ");
                return short ? (
                  <>
                    <Chars text={line1} cls="font-display" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)", fontWeight: 700, color: FG, lineHeight: 1, marginBottom: 12 }} />
                    {line2 && <Chars text={line2} delay={0.2} cls="font-display" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)", fontWeight: 700, color: A, lineHeight: 1, marginBottom: 32 }} />}
                  </>
                ) : (
                  <>
                    <Chars text="A sanctuary redefined" cls="font-display" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)", fontWeight: 700, color: FG, lineHeight: 1, marginBottom: 12 }} />
                    <Chars text="at the water's edge." delay={0.2} cls="font-display" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)", fontWeight: 700, color: A, lineHeight: 1, marginBottom: 32 }} />
                  </>
                );
              })()}
              <p style={{ fontSize: 16, color: M, lineHeight: 1.85, maxWidth: 600 }}>
                {stay?.detailedDescription || stay?.description || "Experience the pinnacle of hospitality where architecture meets the raw beauty of nature."}
              </p>
            </Rev>
            
            {/* Top Grid: Show mixed icons for impact */}
            <Rev delay={0.2} style={{ flex: "1 1 400px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 48px", alignContent: "center" }}>
              {[...dynamicAmenities, ...dynamicFacilities].slice(0, 8).map((label, i) => {
                const IconComp = getIcon(label);
                return (
                  <motion.div key={i}
                    animate={{ y: [0, (i % 2 === 0 ? -6 : 6), 0] }}
                    transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: S, border: `1px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={18} color={A} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: FG }}>{toDisplayString(label)}</span>
                  </motion.div>
                );
              })}
            </Rev>
          </div>
        </Soul>
      </div>
    </section>
  );
}

function ImgParallax({ src, alt }) {
  const r = useRef(null);
  const { scrollYProgress } = useScroll({ target: r, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={r} style={{ width: "100%", height: "124%", position: "absolute", top: "-12%", left: 0 }}>
      <motion.img src={src} style={{ y, width: "100%", height: "100%", objectFit: "cover" }} alt={alt} />
    </div>
  );
}

function PolicyItem({ rule, A, FG, M, B }) {
  const [op, setOp] = useState(false);
  return (
    <motion.div key={rule.id} style={{ borderBottom: `1px solid ${B}` }}>
      <button onClick={() => setOp(!op)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "30px 20px", background: "none", border: "none", cursor: "none", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <FileText size={20} color={op ? A : M} />
          <motion.span animate={{ color: op ? A : FG }} style={{ fontSize: 16, fontWeight: 700 }}>{rule.title}</motion.span>
        </div>
        <motion.div animate={{ rotate: op ? 180 : 0 }} transition={{ duration: 0.4 }}>
          <ChevronDown size={18} color={M} />
        </motion.div>
      </button>
      <AnimatePresence>
        {op && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: E }} style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 20px 40px 64px", fontSize: 14, color: M, lineHeight: 1.85, maxWidth: 640, whiteSpace: "pre-wrap" }}>{rule.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StayPoliciesAndContact({ stay, hostData, hostAvatar }) {
  const { tokens: { A, AL, BG, FG, M, S, B, W } } = useTheme();
  const policies = useMemo(() => {
    const p = [];
    if (stay?.checkInTime || stay?.checkOutTime) {
      p.push({ id: 1, title: "Check-in / Check-out", body: `Check-in from ${stay.checkInTime || "2:00 PM"}. Check-out by ${stay.checkOutTime || "11:00 AM"}. Early arrivals or late departures are subject to availability.` });
    } else {
      p.push({ id: 1, title: "Check-in / Check-out", body: "Check-in from 2:00 PM. Check-out by 11:00 AM. Early arrivals or late departures are subject to availability and may incur fees." });
    }
    
    const extractText = (r) => {
      if (!r) return "";
      if (typeof r === 'string') return r;
      const val = r.propertyRule || r.policyRule || r.rule || r.text || r.content || r.description || r.value || r.title || r.name;
      if (val && typeof val === 'string') return val;
      const firstStringVal = Object.values(r).find(v => typeof v === 'string');
      return firstStringVal || "";
    };

    // Helper to deeply search the stay object for a specific array structure
    const findArrayWithKey = (obj, targetKey, targetName) => {
      if (!obj || typeof obj !== 'object') return null;
      
      // If we find an array, check if it matches what we're looking for
      if (Array.isArray(obj) && obj.length > 0) {
        if (typeof obj[0] === 'string' && targetName && targetName.test(obj[0])) return obj;
        if (typeof obj[0] === 'object' && obj[0] !== null) {
          if (targetKey in obj[0] || 'rule' in obj[0] || 'policyRule' in obj[0] || 'propertyRule' in obj[0]) {
            return obj;
          }
        }
      }

      // Explicitly check named properties on the current level first to prioritize them
      const commonNames = ['propertyRules', 'propertyRule', 'rules', 'propertyRulesDefaultTemplate', 'cancellationPolicyRules', 'cancellationRules', 'cancellationPolicy'];
      for (const key of commonNames) {
        if (obj[key] && Array.isArray(obj[key]) && obj[key].length > 0) return obj[key];
      }

      // Recursively search children
      for (const key in obj) {
        const result = findArrayWithKey(obj[key], targetKey, targetName);
        if (result) return result;
      }
      return null;
    };

    // Property Rules
    let propertyRulesBody = "";
    const rawPropRules = stay?.propertyRulesDefaultTemplate || stay?.propertyRules || stay?.propertyRule || findArrayWithKey(stay, 'propertyRule');
    
    if (Array.isArray(rawPropRules) && rawPropRules.length > 0) {
      propertyRulesBody = rawPropRules.map(r => `• ${extractText(r)}`).filter(t => t !== "• " && t !== "•").join("\n");
    } else if (stay?.houseRules) {
      propertyRulesBody = stay.houseRules;
    }

    if (propertyRulesBody) {
      p.push({ id: 2, title: "Property Rules", body: propertyRulesBody });
    } else {
      p.push({ id: 2, title: "Resort Etiquette", body: "We observe quiet hours from 10:00 PM. Our property is a non-smoking sanctuary. Guests are encouraged to respect the natural coral reef systems." });
    }
    
    // Cancellation Policy
    let cancelPolicyBody = "";
    const rawCancelRules = stay?.cancellationPolicyRules || stay?.cancellationPolicyRule || stay?.cancellationRules || findArrayWithKey(stay, 'policyRule');
    
    if (Array.isArray(rawCancelRules) && rawCancelRules.length > 0) {
      cancelPolicyBody = rawCancelRules.map(r => `• ${extractText(r)}`).filter(t => t !== "• " && t !== "•").join("\n");
      const summary = stay?.generatedPolicySummary || stay?.policySummary || (stay?.cancellationPolicy && typeof stay.cancellationPolicy === 'string' ? stay.cancellationPolicy : null);
      if (summary) cancelPolicyBody += `\n\nSummary:\n${summary}`;
    } else if (stay?.generatedPolicySummary || stay?.policySummary) {
      cancelPolicyBody = stay?.generatedPolicySummary || stay?.policySummary;
    } else if (stay?.cancellationPolicy || stay?.cancellationPolicyText) {
      cancelPolicyBody = stay.cancellationPolicy || stay.cancellationPolicyText;
    }

    if (cancelPolicyBody) {
      p.push({ id: 3, title: "Cancellation Policy", body: cancelPolicyBody });
    } else {
      p.push({ id: 3, title: "Reservation Terms", body: "Cancellations made within 7 days of arrival are subject to a 100% penalty. Special event bookings may have unique terms." });
    }

    const privacy = stay?.privacyPolicy || stay?.privacyPolicyRules || stay?.privacyRules;
    if (privacy) {
      p.push({ id: 4, title: "Privacy Policy", body: privacy });
    }

    return p;
  }, [stay]);

  const getPhone = () => {
    const p = hostData?.host?.phone || hostData?.host?.phoneNumber || hostData?.host?.mobileNumber || hostData?.host?.businessContact || hostData?.phone || hostData?.phoneNumber || hostData?.mobileNumber || hostData?.businessContact || stay?.host?.phone || stay?.contactNumber || stay?.phone || stay?.contactPhone || stay?.businessContact;
    return typeof p === "string" && p.trim() ? p.trim() : "Contact via Portal";
  };

  const getEmail = () => {
    const e = hostData?.host?.email || hostData?.host?.emailAddress || hostData?.host?.businessEmail || hostData?.email || hostData?.emailAddress || hostData?.businessEmail || stay?.host?.email || stay?.contactEmail || stay?.email || stay?.emailAddress || stay?.businessEmail;
    return typeof e === "string" && e.trim() ? e.trim() : "reservations@property.com";
  };

  const phone = getPhone();
  const email = getEmail();

  const primaryName = stay?.contactInformation?.primaryContactName || stay?.primaryContactName || stay?.primaryContact?.name || (hostData?.firstName ? `${hostData.firstName} ${hostData.lastName || ""}`.trim() : hostData?.name || hostData?.businessName || hostData?.host?.displayName || stay?.host?.name || stay?.host?.firstName || "Adithyan");
  const primaryPhoneNum = stay?.contactInformation?.primaryPhone || stay?.primaryPhone || stay?.primaryContactNumber || stay?.primaryContact?.phone || phone;
  const primaryEmailAddress = stay?.contactInformation?.primaryEmail || stay?.primaryEmail || stay?.primaryContactEmail || stay?.primaryContact?.email || email;

  const salesName = stay?.contactInformation?.salesContactName || stay?.salesContactName || stay?.salesContact?.name || stay?.salesName;
  const salesPhoneNum = stay?.contactInformation?.salesPhone || stay?.salesPhone || stay?.salesContactNumber || stay?.salesContact?.phone;
  const salesEmailAddress = stay?.contactInformation?.salesEmail || stay?.salesEmail || stay?.salesContactEmail || stay?.salesContact?.email;

  const frontOffice = stay?.contactInformation?.frontOfficePhone || stay?.frontOfficePhone || stay?.frontOfficeContact;

  return (
    <section style={{ background: W, padding: "140px 36px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 100 }} className="pol-contact-grid">
        <Soul y={150} r={-2}>
          <SHdr idx="05" label="Stay Guidelines" />
          <div style={{ borderTop: `1px solid ${B}` }}>
            {policies.map((rule) => (
              <PolicyItem key={rule.id} rule={rule} A={A} FG={FG} M={M} B={B} />
            ))}
          </div>
        </Soul>

        <Rev delay={0.2}>
          <div style={{ background: BG, padding: 48, border: `1px solid ${B}`, borderRadius: 32, display: "flex", flexDirection: "column", height: "100%", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: A, marginBottom: 32, fontWeight: 700 }}>Property Contacts</p>

            <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${B}` }}>
              <p style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Primary Contact</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: FG, marginBottom: 16 }}>{primaryName}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href={`tel:${primaryPhoneNum}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  <Phone size={16} color={A} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: FG }}>{primaryPhoneNum}</span>
                </a>
                <a href={`mailto:${primaryEmailAddress}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  <Mail size={16} color={A} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: FG }}>{primaryEmailAddress}</span>
                </a>
              </div>
            </div>

            {(salesName || salesPhoneNum || salesEmailAddress) && (
              <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${B}` }}>
                <p style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Sales Contact</p>
                {salesName && <p style={{ fontSize: 16, fontWeight: 700, color: FG, marginBottom: 16 }}>{salesName}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {salesPhoneNum && (
                    <a href={`tel:${salesPhoneNum}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                      <Phone size={16} color={A} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: FG }}>{salesPhoneNum}</span>
                    </a>
                  )}
                  {salesEmailAddress && (
                    <a href={`mailto:${salesEmailAddress}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                      <Mail size={16} color={A} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: FG }}>{salesEmailAddress}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {frontOffice && (
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Front Office</p>
                <a href={`tel:${frontOffice}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                  <Building size={16} color={A} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: FG }}>{frontOffice}</span>
                </a>
              </div>
            )}

            <motion.button className="shimmer-cta" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: "100%", padding: 20, border: "none", cursor: "none", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 11 }}>
              Verify Availability
            </motion.button>
          </div>
        </Rev>
      </div>
    </section>
  );
}

/* ─── MAIN COMPONENT ─────────── */
const StayDetails = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const [stay, setStay] = useState(null);
  const [hostData, setHostData] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [externalRoomId, setExternalRoomId] = useState(null);
  const [externalMealPlan, setExternalMealPlan] = useState(null);
  const [externalRoomsCount, setExternalRoomsCount] = useState(1);

  const formatImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== "string") url = url?.url ?? url?.src ?? url?.imageUrl;
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return url;
    return `https://lkpleadstoragedev.blob.core.windows.net/lead-documents/${encodeURI(url.replaceAll("%2F", "/"))}`;
  };

  const handleRoomSelect = useCallback((roomId, mealPlan) => {
    const newRoomId = String(roomId);
    if (newRoomId !== externalRoomId) setExternalRoomsCount(1);
    setExternalRoomId(newRoomId);
    setExternalMealPlan(mealPlan || null);
  }, [externalRoomId]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getStayDetails(id);
        if (!mounted) return;

        if (data) {
          setStay(data);
          // DEBUG: Log full stay payload to identify exact field names for rules/policies
          console.log("🏨 STAY FULL PAYLOAD:", JSON.stringify(data, null, 2));
          const galleryImages = [];
          const cover = data.coverPhotoUrl || data.coverImageUrl || data.coverPhoto || data.coverImage || data.cover;
          if (cover) galleryImages.push(formatImageUrl(cover));

          const collect = (arr) => {
            if (Array.isArray(arr)) arr.forEach(m => {
              const u = typeof m === "string" ? m : m?.url ?? m?.src ?? m?.imageUrl;
              if (u) galleryImages.push(formatImageUrl(u));
            });
          };
          collect(data.media); collect(data.images); collect(data.stayMedia);

          const seen = new Set();
          setGalleryItems(galleryImages.filter(u => u && !seen.has(u) && seen.add(u)));

          const hostId = data.hostId || data.host?.hostId || data.leadUserId || data.userId;
          if (hostId) getHost(hostId).then(h => mounted && setHostData(h || null)).catch(e => console.warn(e));
        }
        setLoading(false);
      } catch (e) {
        console.error("Failed to load stay details", e);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const hostAvatar = useMemo(() => {
    const avatarUrl = hostData?.host?.profilePhotoUrl || hostData?.host?.profilePhoto || stay?.host?.profilePhotoUrl || stay?.host?.profilePhoto;
    return avatarUrl ? formatImageUrl(avatarUrl) : null;
  }, [hostData, stay]);

  if (loading && !stay) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <ScopedThemeProvider>
      <ScopedStyles />
      <ProgressBar />
      <Cursor />

      <StayHeroCarousel stay={stay} galleryItems={galleryItems} />

      {(() => {
        const tags = Array.isArray(stay?.tags)
          ? stay.tags.map(t => typeof t === 'string' ? t : (t?.name || t?.tag || t?.label || t?.value)).filter(Boolean)
          : [];
        const items = tags.length > 0 ? tags : ["Island Sanctuary", "The Living Reef", "Azure Deep", "Bespoke Luxury"];
        return <Mq items={items} size="sm" bg={THEMES.light.S} accent />;
      })()}

      <StayAmenities stay={stay} />

      {(() => {
        const tags = Array.isArray(stay?.tags)
          ? stay.tags.map(t => typeof t === 'string' ? t : (t?.name || t?.tag || t?.label || t?.value)).filter(Boolean)
          : [];
        const items = tags.length > 0 ? tags : ["Island Sanctuary", "Ocean Perspective", "Curated Luxury", "Azure Horizon"];
        return <Mq items={items} dir="r" size="lg" bg={THEMES.light.S} />;
      })()}

      <div style={{ background: THEMES.light.BG, padding: "80px 36px 100px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SHdr idx="02" label="Property Overview" />
          
          <div style={{ background: THEMES.light.W, padding: 48, borderRadius: 24, border: `1px solid ${THEMES.light.B}`, marginBottom: 0 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: THEMES.light.FG, marginBottom: 8 }}>Basic Information</h4>
            <p style={{ fontSize: 13, color: THEMES.light.M, marginBottom: 40 }}>Comprehensive property details provided by the host.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: THEMES.light.A, marginBottom: 8, fontWeight: 700 }}>Property Name</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: THEMES.light.FG }}>{stay?.propertyName || stay?.title || "—"}</p>
              </div>
              
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: THEMES.light.A, marginBottom: 8, fontWeight: 700 }}>Property Type</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: THEMES.light.FG }}>{toDisplayString(stay?.propertyType) || "—"}</p>
              </div>
              
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: THEMES.light.A, marginBottom: 8, fontWeight: 700 }}>Property Category</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: THEMES.light.FG }}>{toDisplayString(stay?.propertyCategory) || "—"}</p>
              </div>
              
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: THEMES.light.A, marginBottom: 8, fontWeight: 700 }}>Star Rating</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: THEMES.light.FG }}>{stay?.starRating ? (String(stay.starRating).toLowerCase().includes('star') ? stay.starRating : `${stay.starRating} Star`) : "—"}</p>
              </div>

              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: THEMES.light.A, marginBottom: 8, fontWeight: 700 }}>Location Category</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: THEMES.light.FG }}>{toDisplayString(stay?.locationCategory) || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: THEMES.light.W, padding: "80px 36px 140px", borderTop: `1px solid ${THEMES.light.B}` }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <SHdr idx="03" label="Accommodations" />
          <p style={{ fontSize: 16, color: THEMES.light.M, marginBottom: 56, maxWidth: 600, lineHeight: 1.7 }}>
            Choose from our curated selection of rooms and suites. Each space is thoughtfully designed for an unparalleled stay experience.
          </p>
          <RoomCards
            listing={stay}
            onRoomSelect={handleRoomSelect}
            selectedRoomId={externalRoomId}
            roomsCount={externalRoomsCount}
            onRoomsCountChange={setExternalRoomsCount}
            noContainer
          />
        </div>
      </div>

      {(() => {
        const tags = Array.isArray(stay?.tags)
          ? stay.tags.map(t => typeof t === 'string' ? t : (t?.name || t?.tag || t?.label || t?.value)).filter(Boolean)
          : [];
        const items = tags.length > 0 ? tags : ["Bespoke Service", "Privacy Guaranteed", "Direct Connection"];
        return <Mq items={items} size="sm" bg={THEMES.light.S} accent />;
      })()}

      <StayLocation stay={stay} />

      <StayPoliciesAndContact stay={stay} hostData={hostData} hostAvatar={hostAvatar} />

    </ScopedThemeProvider>
  );
};

function StayLocation({ stay }) {
  const { tokens: { A, BG, FG, M, S, B, W } } = useTheme();

  // Robustly extract coordinates
  const lat = stay?.latitude || stay?.latitude_decimal || stay?.lat || stay?.meetingLatitude || stay?.listingLatitude;
  const lng = stay?.longitude || stay?.longitude_decimal || stay?.lng || stay?.meetingLongitude || stay?.listingLongitude;

  // Robustly extract the full address from various possible backend fields
  const address = stay?.address || stay?.fullAddress || stay?.location || stay?.meetingAddress || [stay?.city, stay?.state, stay?.country].filter(Boolean).join(", ");
  const city = stay?.city || stay?.district || "Destination";
  const state = stay?.state || stay?.province || "N/A";
  const country = stay?.country || "N/A";

  // Build the query: Prefer coordinates for pinpoint accuracy, fallback to address
  const hasCoords = lat && lng;
  const mapQuery = hasCoords ? `${lat},${lng}` : (address || city);
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=15&output=embed&iwloc=near`;

  if (!address && !stay?.city && !hasCoords) return null;

  const detailRows = [
    { label: "ADDRESS", value: address },
    { label: "DISTRICT", value: city },
    { label: "STATE", value: state },
    { label: "COUNTRY", value: country },
  ];

  return (
    <section style={{ background: W, padding: "120px 36px", borderTop: `1px solid ${B}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <SHdr idx="02" label="PREPARATION" />
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 100, marginTop: 40 }}>
          {/* Left Column: Meeting Point Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h2 className="font-display" style={{ fontSize: 48, fontWeight: 700, color: FG }}>Meeting Point</h2>
            <div style={{ background: S, borderRadius: 2, overflow: "hidden", border: `1px solid ${B}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              {/* Card Header Area */}
              <div style={{ padding: "24px 32px", background: BG, borderBottom: `1px solid ${B}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <MapPin size={20} color={A} style={{ marginTop: 4 }} />
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: FG, marginBottom: 4 }}>{city}</p>
                    <p style={{ fontSize: 13, color: M, lineHeight: 1.5 }}>{address}</p>
                  </div>
                </div>
              </div>
              {/* Map Area */}
              <div style={{ height: 400, position: "relative" }}>
                <iframe
                  title="Property Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={embedUrl}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column: Location Details Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h2 className="font-display" style={{ fontSize: 48, fontWeight: 700, color: FG }}>Location Details</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {detailRows.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 32, padding: "28px 0", borderBottom: `1px solid ${B}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: A, textTransform: "uppercase" }}>{row.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: FG, lineHeight: 1.5 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StayDetails;
