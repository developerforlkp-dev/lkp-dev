import React, { useEffect, useMemo, useState } from "react";
import cn from "classnames";
import styles from "./Main.module.sass";
import Card from "../../../components/Card";
import { getCustomerWishlistItems } from "../../../utils/api";
import { buildExperienceUrl } from "../../../utils/experienceUrl";
import { primeWishlistCache } from "../../../hooks/useWishlist";
import LoadingSkeleton from "../../../components/LoadingSkeleton";

const WISHLIST_EVENT_NAME = "lkp:wishlist-changed";

const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("jwtToken");
  return Boolean(token && token !== "undefined" && token !== "null" && token !== "NaN");
};

const getWishlistItemUrl = (itemType, itemId, title) => {
  if (itemType === "event") return `/event?id=${itemId}`;
  if (itemType === "stay") return `/stay-details?id=${itemId}`;
  if (itemType === "food") return `/food-details?id=${itemId}`;
  if (itemType === "place") return `/place-details?id=${itemId}`;
  return buildExperienceUrl(title || "experience", itemId);
};

const getWishlistLocation = (location) => {
  if (!location) return null;
  if (typeof location === "string") return location;
  if (location.label) return location.label;
  return [location.city, location.state, location.country].filter(Boolean).join(", ") || null;
};

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("lkpleadstoragedev.blob.core.windows.net") && (!url.includes("sig=") || !url.includes("sv="))) {
      return null;
    }
    return url;
  }
  if (url.startsWith("/")) return url;
  return null;
};

const transformWishlistItemToCard = (item) => {
  const display = item?.display;
  if (!display?.title || item?.itemId == null || !item?.itemType) return null;
  const imageUrl = formatImageUrl(display.imageUrl) || formatImageUrl(display.imageBlobName);
  const title = display.title;
  const pricingLabel = display.pricing?.label || null;
  const rating = display.averageRating ?? display.rating;
  const reviews = display.totalReviews ?? display.reviewCount;
  const category = display.primaryCategoryName || display.primaryCategory?.name || display.categoryName || display.category?.name || display.categoryText;

  return {
    id: `wishlist-${item?.itemType}-${item?.itemId}`,
    listingId: item?.itemId,
    title,
    src: imageUrl,
    srcSet: imageUrl,
    url: getWishlistItemUrl(item?.itemType, item?.itemId, title),
    location: getWishlistLocation(item?.display?.location),
    briefDescription: item?.display?.subtitle || null,
    hasPrice: Boolean(pricingLabel),
    cost: pricingLabel,
    priceActual: pricingLabel,
    rating,
    reviews,
    hideRating: !(Number(rating) > 0),
    categoryText: category || null,
    badgeColor: "teal",
    apiDataOnly: true,
    options: [],
    wishlistItemType: item?.itemType,
    wishlistItemId: item?.itemId,
    wishlistSaved: true,
  };
};

const Main = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadWishlist = async () => {
      if (!isAuthenticated()) {
        if (mounted) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError("");
        const wishlistItems = await getCustomerWishlistItems();
        primeWishlistCache(wishlistItems);
        if (mounted) {
          setItems(wishlistItems);
        }
      } catch (err) {
        if (mounted) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            setItems([]);
          } else {
            setItems([]);
            setError("We couldn't load your wishlist right now.");
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    const handleWishlistChange = (event) => {
      const detail = event?.detail || {};
      if (!detail?.itemType || detail?.itemId == null) return;

      setItems((currentItems) => {
        if (detail.saved === false) {
          return currentItems.filter(
            (item) => !(item?.itemType === detail.itemType && String(item?.itemId) === String(detail.itemId))
          );
        }
        return currentItems;
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener(WISHLIST_EVENT_NAME, handleWishlistChange);
    }

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(WISHLIST_EVENT_NAME, handleWishlistChange);
      }
    };
  }, [reloadTick]);

  const cardItems = useMemo(
    () => items.map(transformWishlistItemToCard).filter(Boolean),
    [items]
  );

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.mobileHeaderFlex}>
          {!loading && !error && cardItems.length > 0 && (
            <h1 className={cn("h2", styles.mobileTitle)} style={{ 
              fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
              fontSize: "28px",
              lineHeight: "1.1",
              letterSpacing: "-0.02em"
            }}>
              Your <span style={{ fontStyle: "italic", color: "#0097B2" }}>Wishlist</span>
            </h1>
          )}
        </div>

        {loading ? (
          <div style={{ paddingTop: "20px", paddingBottom: "60px" }}>
            <LoadingSkeleton variant="cards" count={4} />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0", maxWidth: "420px", margin: "0 auto" }}>
            <h1 className={cn("h2", styles.title)} style={{ marginBottom: "16px" }}>Wishlist Unavailable</h1>
            <p style={{ marginBottom: "32px", fontSize: "16px", color: "var(--n4)", lineHeight: "1.5" }}>
              {error}
            </p>
            <button
              type="button"
              className={cn("button", styles.button)}
              onClick={() => setReloadTick((value) => value + 1)}
            >
              Try Again
            </button>
          </div>
        ) : cardItems.length > 0 ? (
          <>
            <div className={styles.head}>
              <div className={styles.wrap}>
                <h1 className={cn("h2", styles.title)} style={{ 
                  fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
                  fontSize: "48px",
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em"
                }}>
                  Your <span style={{ fontStyle: "italic", color: "#0097B2" }}>Wishlist</span>
                </h1>
                <div className={styles.counter}>
                  {cardItems.length} saved {cardItems.length === 1 ? "item" : "items"}
                </div>
              </div>
            </div>
            <div className={styles.list}>
              {cardItems.map((item) => (
                <Card className={styles.card} item={item} key={item.id} />
              ))}
            </div>
          </>
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default Main;
