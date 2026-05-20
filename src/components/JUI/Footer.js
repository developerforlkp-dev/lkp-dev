import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "./Theme";
import { Rev, Chars } from "./UI";

export function Footer() {
  const { tokens: { A, AH }, theme } = useTheme();
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.4, 1], [0.85, 0.95, 1]);
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ["0.5em", "-0.02em"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);

  return (
    <footer 
      ref={footerRef}
      className="cinematic-footer"
      style={{ 
        background: "#080808", 
        color: "#FFFFFF", 
        borderTop: "1px solid #222", 
        overflow: "hidden",
        position: "relative",
        zIndex: 10
      }}
    >


      <div style={{ padding: "80px 0", textAlign: "center", borderBottom: "1px solid #222" }}>
        <motion.h1 
          className="font-display"
          style={{ 
            fontSize: "clamp(4rem, 15vw, 18rem)", fontWeight: 900, color: "#FFFFFF", margin: 0, lineHeight: 0.8,
            scaleX, letterSpacing, opacity, transformOrigin: "center center"
          }}
        >
          LITTLE KNOWN PLANET
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
           <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#0097B2" }} />
           <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#FFFFFF" }}>A Little Known Planet Production</span>
        </div>
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "#8C8C88", textTransform: "uppercase" }}>© 2026 — All Rights Allocated.</p>
      </div>

      <style>{`
        body .cinematic-footer h1, 
        body .cinematic-footer h2, 
        body .cinematic-footer h3,
        body .cinematic-footer a,
        body .cinematic-footer button,
        body .cinematic-footer input {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }
        body .cinematic-footer p, 
        body .cinematic-footer span,
        body .cinematic-footer label {
          color: #8C8C88 !important;
          -webkit-text-fill-color: #8C8C88 !important;
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 80px !important; }
        }
      `}</style>
    </footer>
  );
}
