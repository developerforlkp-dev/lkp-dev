import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import cn from "classnames";
import Modal from "../Modal";
import Login from "../Login";
import styles from "./WishlistSaveButton.module.sass";
import { saveWishlistItem } from "../../utils/api";

const SUCCESS_MESSAGES = new Set([
  "Item saved to wishlist",
  "Item already saved",
]);

const WishlistSaveButton = ({
  itemType,
  itemId,
  title,
  variant = "fab",
  className,
  style,
  iconSize = 17,
  savedLabel = "Saved",
  idleLabel = "Save",
  savingLabel = "Saving...",
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);

  const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("jwtToken"));

  const handleSave = async () => {
    const normalizedId = Number(itemId);
    if (!Number.isFinite(normalizedId) || normalizedId <= 0 || saving || saved) return;

    if (!isAuthenticated) {
      setLoginVisible(true);
      return;
    }

    setSaving(true);
    try {
      const response = await saveWishlistItem({ itemType, itemId: normalizedId });
      const message = response?.message;
      if (!message || SUCCESS_MESSAGES.has(message)) {
        setSaved(true);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save this item to your wishlist.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const label = saved ? savedLabel : saving ? savingLabel : idleLabel;
  const buttonClassName =
    variant === "inline"
      ? cn(styles.inlineButton, className)
      : cn("premium-share-fab", styles.fabButton, className, {
          [styles.saved]: saved,
        });

  const content = (
    <>
      <motion.span
        animate={saved ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
        className={styles.iconWrap}
      >
        <Heart
          size={iconSize}
          strokeWidth={2.2}
          fill={saved ? "currentColor" : "none"}
        />
      </motion.span>
      <span className={cn(styles.label, { [styles.labelVisible]: variant === "inline" || saved || saving })}>
        {saved ? savedLabel : label}
      </span>
    </>
  );

  return (
    <>
      <motion.button
        type="button"
        aria-label={`${saved ? "Saved" : "Save"} ${title || "item"} to wishlist`}
        className={buttonClassName}
        onClick={handleSave}
        disabled={saving}
        whileTap={{ scale: 0.96 }}
        style={style}
      >
        {content}
      </motion.button>
      <Modal visible={loginVisible} onClose={() => setLoginVisible(false)}>
        <Login onClose={() => setLoginVisible(false)} />
      </Modal>
    </>
  );
};

export default WishlistSaveButton;
