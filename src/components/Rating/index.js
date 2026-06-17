import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import styles from "./Rating.module.sass";

const clampRating = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(5, numericValue));
};

const STAR_COUNT = 5;

const Form = ({
  className,
  initialRating,
  rating,
  onChange,
  readonly,
  burstContainerSelector,
}) => {
  const controlled = rating !== undefined;
  const [localRating, setLocalRating] = useState(clampRating(initialRating));
  const [hoveredRating, setHoveredRating] = useState(null);
  const [bursts, setBursts] = useState([]);
  const [animatedStars, setAnimatedStars] = useState([]);
  const burstTimeoutRef = useRef(null);
  const starAnimationTimeoutRef = useRef(null);
  const starButtonRefs = useRef([]);

  useEffect(() => {
    if (controlled) {
      setLocalRating(clampRating(rating));
    }
  }, [controlled, rating]);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
      }
      if (starAnimationTimeoutRef.current) {
        clearTimeout(starAnimationTimeoutRef.current);
      }
    };
  }, []);

  const committedRating = controlled ? clampRating(rating) : localRating;
  const activeRating = hoveredRating ?? committedRating;

  const burstNode = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.body;
  }, []);

  const triggerBurst = (nextRating) => {
    if (!burstContainerSelector) {
      return;
    }

    const burstContainer = document.querySelector(burstContainerSelector);

    if (!burstContainer) {
      return;
    }

    const containerBounds = burstContainer.getBoundingClientRect();
    const nextBursts = Array.from({ length: nextRating }, (_, index) => {
      const starValue = nextRating - index;
      const starButton = starButtonRefs.current[starValue - 1];

      if (!starButton) {
        return null;
      }

      const starBounds = starButton.getBoundingClientRect();
      const travelDistance = Math.max(
        starBounds.top - containerBounds.top + starBounds.height * 0.5,
        starBounds.height * 2
      );

      return {
        id: `${Date.now()}-${starValue}-${index}`,
        left: starBounds.left + starBounds.width / 2,
        top: starBounds.top + starBounds.height / 2,
        size: starBounds.width,
        travelDistance,
        delay: index * 70,
      };
    }).filter(Boolean);

    setBursts(nextBursts);

    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }

    burstTimeoutRef.current = setTimeout(() => {
      setBursts([]);
    }, 1100);
  };

  const handleSelect = (nextRating) => {
    if (readonly) {
      return;
    }

    if (!controlled) {
      setLocalRating(nextRating);
    }

    setHoveredRating(null);
    setAnimatedStars(Array.from({ length: nextRating }, (_, index) => nextRating - index));

    if (starAnimationTimeoutRef.current) {
      clearTimeout(starAnimationTimeoutRef.current);
    }

    starAnimationTimeoutRef.current = setTimeout(() => {
      setAnimatedStars([]);
    }, 700);

    triggerBurst(nextRating);

    if (onChange) {
      onChange(nextRating);
    }
  };

  return (
    <>
      <div
        className={cn(styles.rating, className, { [styles.readonly]: readonly })}
        onMouseLeave={() => {
          if (!readonly) {
            setHoveredRating(null);
          }
        }}
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const starValue = index + 1;
          const fillPercent = Math.max(0, Math.min(1, activeRating - index)) * 100;
          const isAnimated = animatedStars.includes(starValue);
          const animationIndex = animatedStars.indexOf(starValue);

          return (
            <button
              key={starValue}
              type="button"
              className={styles.starButton}
              ref={(node) => {
                starButtonRefs.current[index] = node;
              }}
              onMouseEnter={() => {
                if (!readonly) {
                  setHoveredRating(starValue);
                }
              }}
              onFocus={() => {
                if (!readonly) {
                  setHoveredRating(starValue);
                }
              }}
              onBlur={() => {
                if (!readonly) {
                  setHoveredRating(null);
                }
              }}
              onClick={() => handleSelect(starValue)}
              disabled={readonly}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              aria-pressed={!readonly && committedRating === starValue}
            >
              <span
                className={cn(styles.star, {
                  [styles.starAnimated]: isAnimated,
                })}
                style={
                  isAnimated
                    ? { "--star-pop-delay": `${animationIndex * 70}ms` }
                    : undefined
                }
                aria-hidden="true"
              >
                <svg className={styles.starBase} viewBox="0 0 24 24" focusable="false">
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span
                  className={styles.starFill}
                  style={{ "--star-fill-percent": `${fillPercent}%` }}
                >
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {burstNode &&
        bursts.length > 0 &&
        createPortal(
          <>
            {bursts.map((burst) => (
              <span
                key={burst.id}
                className={styles.starBurst}
                style={{
                  left: `${burst.left}px`,
                  top: `${burst.top}px`,
                  width: `${burst.size}px`,
                  height: `${burst.size}px`,
                  "--star-burst-travel": `-${burst.travelDistance}px`,
                  "--star-burst-delay": `${burst.delay}ms`,
                }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </span>
            ))}
          </>,
          burstNode
        )}
    </>
  );
};

export default Form;
