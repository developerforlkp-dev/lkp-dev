import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { Rev, Chars } from "./UI";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const WhatsAppIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const PinterestIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
  </svg>
);

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

      <div className="bottom-footer-bar">
        <div className="bottom-footer-inner">
          <div className="bottom-footer-links">
            <Link to="/privacy-policy" className="bottom-footer-link">Privacy</Link>
            <span className="bottom-footer-dot">•</span>
            <Link to="/terms-of-service" className="bottom-footer-link">Terms & Conditions</Link>
            <span className="bottom-footer-dot">•</span>
            <span className="bottom-footer-text">Call Us: +91 8104 954 254</span>
          </div>
          
          <div className="bottom-footer-socials">
            <a href="#" className="social-icon-link"><WhatsAppIcon size={18} /></a>
            <a href="#" className="social-icon-link"><Instagram size={18} strokeWidth={2} /></a>
            <a href="#" className="social-icon-link"><PinterestIcon size={18} /></a>
            <a href="#" className="social-icon-link"><Facebook size={18} strokeWidth={2} /></a>
            <a href="#" className="social-icon-link"><Youtube size={18} strokeWidth={2} /></a>
            <a href="#" className="social-icon-link"><Linkedin size={18} strokeWidth={2} /></a>
          </div>
        </div>
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
        .bottom-footer-bar {
          background: #111111;
          border-top: 1px solid #222222;
          padding: 16px 36px;
        }
        .bottom-footer-inner {
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .bottom-footer-links {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .bottom-footer-link, .bottom-footer-text {
          font-size: 13px;
          font-weight: 500;
          color: #E0E0E0 !important;
          text-decoration: none;
          transition: color 0.2s ease;
          letter-spacing: 0.02em;
        }
        .bottom-footer-link:hover {
          color: #FFFFFF !important;
        }
        .bottom-footer-dot {
          color: #555555 !important;
          font-size: 12px;
        }
        .bottom-footer-socials {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .social-icon-link {
          color: #E0E0E0 !important;
          transition: transform 0.2s ease, color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-icon-link:hover {
          color: #FFFFFF !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .bottom-footer-bar {
            padding: 24px 20px;
          }
          .bottom-footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
          .bottom-footer-socials {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
