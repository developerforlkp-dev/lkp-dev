import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import cn from "classnames";
import Modal from "../Modal";
import Login from "../Login";
import styles from "./WishlistSaveButton.module.sass";
import { saveWishlistItem } from "../../utils/api";
import { useTheme } from "../JUI/Theme";

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
  const [hovered, setHovered] = useState(false);
  const { tokens: { A } } = useTheme();

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
  const glow = A || "#0097B2";
  const buttonClassName =
    variant === "inline"
      ? cn(styles.inlineButton, className)
      : cn("premium-share-fab", styles.fabButton, className, {
          [styles.saved]: saved,
        });
  const fabExpanded = hovered || saved || saving;
  const fabStyle =
    variant === "inline"
      ? style
      : {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 44,
          maxWidth: fabExpanded ? 150 : 44,
          overflow: "hidden",
          paddingLeft: 13,
          paddingRight: fabExpanded ? 18 : 13,
          background: saved ? `${glow}33` : "rgba(0,151,178,0.13)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: `1.5px solid ${saved ? `${glow}88` : `${glow}55`}`,
          borderRadius: 50,
          cursor: saving ? "default" : "pointer",
          color: "#FFFFFF",
          fontFamily: "inherit",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          boxShadow: fabExpanded
            ? `0 0 20px ${glow}55, 0 0 50px ${glow}20, 0 6px 24px rgba(0,0,0,0.28)`
            : `0 0 10px ${glow}30, 0 4px 14px rgba(0,0,0,0.2)`,
          outline: "none",
          userSelect: "none",
          transition: "max-width 0.45s cubic-bezier(0.22,1,0.36,1), padding-right 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease",
          ...style,
        };

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
      <span className={cn(styles.label, { [styles.labelVisible]: variant === "inline" || hovered || saved || saving })}>
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
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        disabled={saving}
        whileTap={{ scale: 0.96 }}
        style={fabStyle}
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
