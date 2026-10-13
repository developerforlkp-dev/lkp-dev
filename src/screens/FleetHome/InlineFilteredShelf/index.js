import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./InlineFilteredShelf.module.sass";
import Card from "../../../components/Card";
import Icon from "../../../components/Icon";
import HorizontalScroll from "../../../components/HorizontalScroll";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import {
  searchNearbyListings,
  getFilteredListings,
  filterStayListings,
  filterEventListings,
  filterFoodMenus,
  filterPlaces,
} from "../../../utils/api";
import { transformListingToCard } from "../CardStyles";

/**
 * InlineFilteredShelf
 * Displays filtered listings right on the homepage when a category or destination card is clicked.
 */
const InlineFilteredShelf = ({ activeItem, section, onClose }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shelfRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: true });

  const handleScrollStateChange = useCallback((state) => {
    setScrollState(state);
  }, []);

  // Parse parameters from activeItem
  const parseItemParams = useCallback(() => {
    let businessInterest = "EXPERIENCE";
    let businessInterestId = 1;
    let categoryType = activeItem.categoryType || section?.categoryType || "";
    let categoryValues = [];
    let selectedCategoryLabel = activeItem.title || "";

    if (activeItem.url && activeItem.url.includes("?")) {
      try {
        const queryString = activeItem.url.split("?")[1];
        const params = new URLSearchParams(queryString);
        if (params.get("businessInterest")) {
          businessInterest = params.get("businessInterest");
        }
        if (params.get("businessInterestId")) {
          businessInterestId = Number(params.get("businessInterestId"));
        }
        if (params.get("categoryType")) {
          categoryType = params.get("categoryType");
        }
        const vals = params.getAll("categoryValues");
        if (vals && vals.length > 0) {
          categoryValues = vals;
        } else if (params.get("categoryValues")) {
          categoryValues = params
            .get("categoryValues")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        if (params.get("selectedCategoryLabel")) {
          selectedCategoryLabel = params.get("selectedCategoryLabel");
        }
      } catch (err) {
        console.warn("[InlineFilteredShelf] Error parsing url:", err);
      }
    }

    if (categoryValues.length === 0 && activeItem.categoryId != null) {
      categoryValues = [String(activeItem.categoryId)];
    }

    return {
      businessInterest: String(businessInterest).toUpperCase(),
      businessInterestId,
      categoryType,
      categoryValues,
      selectedCategoryLabel,
    };
  }, [activeItem, section]);

  // Fetch matching listings
  useEffect(() => {
    let isMounted = true;
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      const {
        businessInterest,
        businessInterestId,
        categoryType,
        categoryValues,
        selectedCategoryLabel,
      } = parseItemParams();

      try {
        let rawListings = [];

        const normalizedType = String(categoryType || "").toUpperCase();
        const isLocationOrDestination =
          normalizedType.includes("DESTINATION") ||
          normalizedType.includes("LOCATION") ||
          normalizedType.includes("DISTRICT") ||
          normalizedType.includes("STATE") ||
          String(section?.sectionTitle || "").toUpperCase().includes("DESTINATION");

        // 1. Try Nearby Search if destination/location
        if (isLocationOrDestination && selectedCategoryLabel) {
          try {
            const nearbyRes = await searchNearbyListings({
              businessInterest,
              locationName: selectedCategoryLabel,
              limit: 12,
            });
            const nearbyItems = nearbyRes?.listings || nearbyRes?.data || [];
            if (Array.isArray(nearbyItems) && nearbyItems.length > 0) {
              rawListings = nearbyItems;
            }
          } catch (nearbyErr) {
            console.warn("[InlineFilteredShelf] Nearby search fallback:", nearbyErr);
          }
        }

        // 2. If no nearby results or standard category, use appropriate filter API
        if (rawListings.length === 0) {
          if (businessInterest === "STAY" || businessInterest === "STAYS") {
            const res = await filterStayListings({
              categoryType: categoryType || undefined,
              categoryValues: categoryValues.length > 0 ? categoryValues.join(",") : undefined,
              limit: 12,
            });
            rawListings = res?.listings || [];
          } else if (businessInterest === "EVENT" || businessInterest === "EVENTS") {
            const res = await filterEventListings({
              categoryType: categoryType || undefined,
              categoryValues: categoryValues.length > 0 ? categoryValues.join(",") : undefined,
              limit: 12,
            });
            rawListings = res?.listings || [];
          } else if (businessInterest === "FOOD") {
            const res = await filterFoodMenus({
              categoryType: categoryType || undefined,
              categoryValues: categoryValues.length > 0 ? categoryValues.join(",") : undefined,
              limit: 12,
            });
            rawListings = res?.listings || [];
          } else if (businessInterest === "PLACE" || businessInterest === "PLACES") {
            const res = await filterPlaces({
              categoryType: categoryType || undefined,
              categoryValues: categoryValues.length > 0 ? categoryValues.join(",") : undefined,
              limit: 12,
            });
            rawListings = res?.places || res?.listings || [];
          } else {
            // Default: EXPERIENCE
            const res = await getFilteredListings({
              businessInterestId: businessInterestId || 1,
              categoryType: categoryType || undefined,
              categoryValues: categoryValues.length > 0 ? categoryValues : [selectedCategoryLabel],
              limit: 12,
              sortBy: "newest",
            });
            rawListings = res?.listings || [];
          }
        }

        if (!isMounted) return;

        // Transform listings into Card format
        const formatted = rawListings.map((item) =>
          transformListingToCard(item, {
            ...section,
            displayMode: "SHOW_LISTINGS_ONLY",
          })
        );

        setListings(formatted);
      } catch (err) {
        if (!isMounted) return;
        console.error("[InlineFilteredShelf] Failed to load listings:", err);
        setError("Unable to load listings for this selection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListings();

    return () => {
      isMounted = false;
    };
  }, [activeItem, section, parseItemParams]);

  // Smooth scroll into view when opened or item changes
  useEffect(() => {
    if (shelfRef.current) {
      setTimeout(() => {
        shelfRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [activeItem?.id, activeItem?.title]);

  const { selectedCategoryLabel } = parseItemParams();
  const viewAllUrl = activeItem.url || "/listings";

  return (
    <motion.div
      ref={shelfRef}
      className={styles.shelfContainer}
      initial={{ opacity: 0, y: -8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className={styles.topPointer} />

      {/* Shelf Header */}
      <div className={styles.shelfHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>
              <Icon name="location" size="12" />
              {section?.sectionTitle || "EXPLORE"}
            </span>
            {!loading && listings.length > 0 && (
              <span className={styles.countPill}>
                {listings.length} {listings.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>
          <h3 className={styles.shelfTitle}>
            Top picks in <span className={styles.accentWord}>{selectedCategoryLabel}</span>
          </h3>
        </div>

        <div className={styles.headerRight}>
          <Link
            to={viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewAllLink}
          >
            <span>View all in {selectedCategoryLabel}</span>
            <Icon name="arrow-next" size="14" />
          </Link>

          {/* Slider Arrows */}
          {!loading && listings.length > 0 && (
            <div className={styles.sliderArrows}>
              <button
                onClick={() => scrollRef.current?.scrollLeft()}
                className={styles.sliderArrow}
                aria-label="Previous"
                style={{
                  opacity: scrollState.canScrollLeft ? 1 : 0.4,
                  pointerEvents: scrollState.canScrollLeft ? "auto" : "none",
                }}
              >
                <Icon name="arrow-prev" size="14" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollRight()}
                className={styles.sliderArrow}
                aria-label="Next"
                style={{
                  opacity: scrollState.canScrollRight ? 1 : 0.4,
                  pointerEvents: scrollState.canScrollRight ? "auto" : "none",
                }}
              >
                <Icon name="arrow-next" size="14" />
              </button>
            </div>
          )}

          {/* Close Shelf Button */}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close filtered shelf"
            title="Close results"
          >
            <Icon name="close" size="14" />
          </button>
        </div>
      </div>

      {/* Shelf Content */}
      <div className={styles.shelfBody}>
        {loading && (
          <div className={styles.skeletonWrapper}>
            <LoadingSkeleton variant="cards" count={4} />
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorBox}>
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <Icon name="location" size="24" />
            </div>
            <div className={styles.emptyTitle}>
              No listings found for {selectedCategoryLabel}
            </div>
            <p className={styles.emptySubtitle}>
              We couldn't find any direct listings right now. You can check all listings or explore other categories.
            </p>
            <Link to={viewAllUrl} className={styles.emptyButton}>
              Explore All Listings
            </Link>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className={styles.horizontalScrollWrapper}>
            <HorizontalScroll
              ref={scrollRef}
              hideDefaultArrows={true}
              onScrollStateChange={handleScrollStateChange}
              className={styles.horizontalScroll}
              gap={24}
            >
              {listings.map((item) => (
                <div key={item.id} className={styles.cardItemWrapper}>
                  <Card item={item} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InlineFilteredShelf;
