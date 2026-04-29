import React, { useEffect, useState } from "react";
import { withRouter, useLocation } from "react-router-dom";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import { motion } from "framer-motion";
import cn from "classnames";
import styles from "./Page.module.sass";
import Header from "../Header";
import { Footer } from "../JUI/Footer";
import { useTheme } from "../JUI/Theme";

const Page = ({
  separatorHeader,
  children,
  fooferHide,
  wide,
  notAuthorized,
  hideHeaderOnMobile,
}) => {
  const { pathname } = useLocation();
  const { tokens: { B }, theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const E = [0.22, 1, 0.36, 1];

  return (
    <div className={styles.page}>
      {/* Header Background Layer (Under the Hero) */}
      <div 
        style={{ 
          position: separatorHeader ? "sticky" : "fixed", top: 0, left: 0, right: 0, 
          height: (scrolled || separatorHeader) ? "72px" : "0px",
          zIndex: 5, 
          transition: "all 0.4s", 
          background: (scrolled || separatorHeader) ? (theme === 'light' ? "rgba(251,251,249,0.92)" : "rgba(8,8,8,0.92)") : "transparent", 
          backdropFilter: (scrolled || separatorHeader) ? "blur(20px)" : "none", 
          borderBottom: (scrolled || separatorHeader) ? `1px solid ${B}` : "1px solid transparent" 
        }}
      />

      {/* Header Content Layer (Above the Hero) */}
      <motion.div
        className={cn("slim-header-wrapper", { "force-dark": !scrolled && !separatorHeader && theme === "light" })}
        initial={{ y: -72, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.85, ease: E }}
        style={{ 
          position: separatorHeader ? "sticky" : "fixed", top: 0, left: 0, right: 0, 
          zIndex: 100, 
          transition: "all 0.4s", 
          marginTop: separatorHeader ? "-72px" : "0", // Account for the background div in sticky mode
          background: "transparent",
        }}
      >
        <Header
          separatorHeader={separatorHeader}
          wide={wide}
          notAuthorized={notAuthorized}
          hideOnMobile={hideHeaderOnMobile}
        />
      </motion.div>
      
      <div className={styles.inner}>
        {children}
      </div>

      {!fooferHide && <Footer />}

      <style>{`
        .slim-header-wrapper > div { padding: 4px 0 !important; }
        .slim-header-wrapper img { width: 140px !important; }
        
        .force-dark [class*="Header_link"], 
        .force-dark [class*="Header_bookingsLink"],
        .force-dark [class*="Header_themeToggle"] svg,
        .force-dark [class*="Header_user"] svg {
          color: #FCFCFD !important;
          fill: #FCFCFD !important;
        }
      `}</style>
    </div>
  );
};

export default withRouter(Page);
