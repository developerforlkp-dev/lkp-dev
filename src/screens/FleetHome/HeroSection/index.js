import React, { useRef } from "react";
import HeroSectionAnimation from "./HeroSectionAnimation";
import styles from "./HeroSection.module.sass";

const HeroSection = () => {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className={styles.container}>
      <HeroSectionAnimation containerRef={containerRef} />
    </div>
  );
};

export default HeroSection;

