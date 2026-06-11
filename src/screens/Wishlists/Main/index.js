import React, { useEffect, useMemo, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Main.module.sass";
import Control from "../../../components/Control";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import { deleteWishlistItem, getWishlistItems } from "../../../utils/api";
import { buildExperienceUrl } from "../../../utils/experienceUrl";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Wishlists",
  },
];

const normalizeWishlistArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.wishlistItems)) return payload.wishlistItems;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.wishlistItems)) return payload.data.wishlistItems;
  return [];
};

const formatImage = (item) =>
  item?.imageUrl ||
  item?.coverImageUrl ||
  item?.coverPhotoUrl ||
  item?.photoUrl ||
  item?.thumbnailUrl ||
  item?.media?.[0]?.url ||
  item?.media?.[0]?.fileUrl ||
  item?.media?.[0]?.blobName ||
  item?.listing?.coverImageUrl ||
  item?.event?.coverImageUrl ||
  item?.stay?.coverImageUrl ||
  "";

const formatLocation = (item) =>
  item?.location ||
  item?.locationName ||
  item?.city ||
  item?.district ||
  item?.state ||
  item?.venueName ||
  item?.venueDistrict ||
  item?.propertyCity ||
  item?.fullAddress ||
  "";

const resolveTypeLabel = (itemType) => {
  if (itemType === "listing") return "Experience";
  if (itemType === "event") return "Event";
  if (itemType === "stay") return "Stay";
  return "Saved";
};

const resolveTitle = (item) =>
  item?.title ||
  item?.name ||
  item?.propertyName ||
  item?.listingTitle ||
  item?.eventTitle ||
  item?.stayTitle ||
  item?.menuName ||
  "Saved item";

const resolveId = (item) =>
  item?.itemId ||
  item?.listingId ||
  item?.eventId ||
  item?.stayId ||
  item?.id;

const resolveUrl = (itemType, title, itemId) => {
  if (itemType === "event") return `/event?id=${itemId}`;
  if (itemType === "stay") return `/stay-details?id=${itemId}`;
  return buildExperienceUrl(title || "experience", itemId);
};

const adaptWishlistItem = (item) => {
  const entity = item?.listing || item?.event || item?.stay || item?.item || item;
  const itemType = item?.itemType || item?.type || item?.entityType || entity?.itemType || "listing";
  const itemId = resolveId(item) || resolveId(entity);
  const title = resolveTitle(entity);
  const rating = entity?.rating || entity?.averageRating || 0;
  const reviews = entity?.reviews || entity?.reviewCount || entity?.totalReviews || 0;

  return {
    wishlistItemId: item?.wishlistItemId || `${itemType}-${itemId}`,
    itemType,
    itemId,
    card: {
      title,
      src: formatImage(entity),
      url: resolveUrl(itemType, title, itemId),
      categoryText: resolveTypeLabel(itemType),
      location: formatLocation(entity),
      rating,
      reviews,
      hasPrice: false,
    },
  };
};

const Main = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await getWishlistItems();
        if (!mounted) return;
        const normalized = normalizeWishlistArray(payload)
          .map(adaptWishlistItem)
          .filter((item) => Number.isFinite(Number(item.itemId)));
        setItems(normalized);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load your wishlist.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const countLabel = useMemo(() => {
    if (loading) return "Loading your saved items...";
    if (items.length === 1) return "You added 1 item to your wishlist";
    return `You added ${items.length} items to your wishlist`;
  }, [items.length, loading]);

  const handleRemove = async (item) => {
    setRemovingId(item.wishlistItemId);
    try {
      await deleteWishlistItem(item.itemType, item.itemId);
      setItems((current) => current.filter((entry) => entry.wishlistItemId !== item.wishlistItemId));
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to remove this wishlist item.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <Control
          className={styles.control}
          urlHome="/"
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.head}>
          <div className={styles.wrap}>
            <h1 className={cn("h2", styles.title)}>Wishlists</h1>
            <div className={styles.counter}>{countLabel}</div>
          </div>
        </div>
        <div className={styles.wrapper}>
          {loading ? (
            <div className={styles.stateBlock}>
              <Loader className={styles.loader} />
              <span>Loading wishlist...</span>
            </div>
          ) : error ? (
            <div className={styles.stateBlock}>
              <p className={styles.error}>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.stateBlock}>
              <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
              <p className={styles.emptyText}>Save an experience, event, or stay and it will show up here.</p>
              <Link className={cn("button", styles.cta)} to="/">
                Explore now
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {items.map((item) => (
                <div className={styles.cardWrap} key={item.wishlistItemId}>
                  <Card className={styles.wishlistCard} item={item.card} />
                  <button
                    type="button"
                    className={cn("button-stroke", styles.removeButton)}
                    onClick={() => handleRemove(item)}
                    disabled={removingId === item.wishlistItemId}
                  >
                    {removingId === item.wishlistItemId ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
