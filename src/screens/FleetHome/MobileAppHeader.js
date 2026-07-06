import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useHistory } from "react-router-dom";
import { Search, Heart, Menu } from "lucide-react";
import { getCustomerWishlistItems } from "../../utils/api";
import styles from "./MobileAppHeader.module.sass";

const MobileAppHeader = ({
  visibleFilterOptions,
  activeFilter,
  handleFilterClick,
  businessInterestAvailability,
  onSearchClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 150); // Threshold to show the sticky header
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    if (!token) return;

    getCustomerWishlistItems()
      .then(items => {
        if (Array.isArray(items)) {
          setWishlistCount(items.length);
        }
      })
      .catch(() => {});

    const handleWishlistChange = (e) => {
      if (e.detail?.saved === true) {
        setWishlistCount(prev => prev + 1);
      } else if (e.detail?.saved === false) {
        setWishlistCount(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("lkp:wishlist-changed", handleWishlistChange);
    return () => {
      window.removeEventListener("lkp:wishlist-changed", handleWishlistChange);
    };
  }, []);

  return (
    <div className={cn(styles.container, { [styles.visible]: isScrolled })}>
      <div className={styles.headerTop}>
        <img 
          src="/images/littleplanet-logo.svg" 
          alt="Little Planet" 
          className={styles.logo} 
        />
        <div className={styles.searchBar} onClick={onSearchClick}>
          <Search size={18} className={styles.searchIcon} />
          <div className={styles.searchText}>
            <div className={styles.searchTitle}>Search by...</div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.iconButton}
            onClick={() => history.push("/wishlists")}
            aria-label="Wishlists"
            style={{ position: 'relative' }}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className={styles.wishlistBadge}>
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>
          <button 
            className={styles.iconButton}
            onClick={() => window.dispatchEvent(new CustomEvent("open-mobile-nav"))}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.categoriesScroll}>
        <div className={styles.categoriesRow}>
          {visibleFilterOptions.map((filter) => {
            const isEnabledForListings = businessInterestAvailability[filter.id] !== false;
            const isActive = activeFilter === filter.id;
            
            return (
              <button
                key={filter.id}
                className={cn(styles.categoryCard, {
                  [styles.active]: isActive,
                  [styles.disabled]: !isEnabledForListings,
                })}
                onClick={() => {
                  if (isEnabledForListings) handleFilterClick(filter.id);
                }}
              >
                <img src={filter.image} alt={filter.label} className={styles.categoryImage} />
                <span className={styles.categoryLabel}>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileAppHeader;
