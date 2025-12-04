import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import cn from 'classnames';
import styles from './HeroSectionAnimation.module.sass';

// Default destinations data
const defaultDestinations = [
  {
    place: 'Switzerland Alps',
    title: 'SAINT',
    title2: 'ANTONIEN',
    description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.',
    image: 'https://assets.codepen.io/3685267/timed-cards-1.jpg'
  },
  {
    place: 'Japan Alps',
    title: 'NANGANO',
    title2: 'PREFECTURE',
    description: 'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country\'s best powder.',
    image: 'https://assets.codepen.io/3685267/timed-cards-2.jpg'
  },
  {
    place: 'Sahara Desert - Morocco',
    title: 'MARRAKECH',
    title2: 'MEROUGA',
    description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
    image: 'https://assets.codepen.io/3685267/timed-cards-3.jpg'
  },
  {
    place: 'Sierra Nevada - USA',
    title: 'YOSEMITE',
    title2: 'NATIONAL PARK',
    description: 'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
    image: 'https://assets.codepen.io/3685267/timed-cards-4.jpg'
  },
  {
    place: 'Tarifa - Spain',
    title: 'LOS LANCES',
    title2: 'BEACH',
    description: 'Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach\'s long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.',
    image: 'https://assets.codepen.io/3685267/timed-cards-5.jpg'
  },
  {
    place: 'Cappadocia - Turkey',
    title: 'Göreme',
    title2: 'Valley',
    description: 'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
    image: 'https://assets.codepen.io/3685267/timed-cards-6.jpg'
  },
];

// Constants
const CARD_WIDTH = 50;
const CARD_HEIGHT = 75;
const CARD_GAP = 20;
const CONTAINER_PADDING = 20;
const ANIMATION_DURATION = 3100; // 3.1 seconds
const RESIZE_DEBOUNCE = 250;
const EASE_TYPE = "sine.inOut";

const HeroSectionAnimation = ({ containerRef, destinations = defaultDestinations }) => {
  const demoRef = useRef(null);
  const detailsEvenRef = useRef(null);
  const detailsOddRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const loopTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const orderRef = useRef(null);
  const detailsEvenRef_state = useRef(true);
  const isMountedRef = useRef(true);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Get container dimensions helper
  const getContainerDimensions = () => {
    if (!containerRef?.current) {
      return { width: 0, height: 0 };
    }
    const rect = containerRef.current.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
    };
  };

  // Validate image URL
  const validateImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('/');
    }
  };

  // Preload images
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (!validateImageUrl(src)) {
        reject(new Error(`Invalid image URL: ${src}`));
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // Load all images
  const loadAllImages = async () => {
    const promises = destinations.map(({ image }) => loadImage(image));
    return Promise.allSettled(promises);
  };

  // Get card selector
  const getCard = (index) => `#hero-card-${index}`;
  const getCardContent = (index) => `#hero-card-content-${index}`;

  // Initialize animation - set up initial state, then use step() for first cycle (exactly like all others)
  const init = (order, detailsEven) => {
    if (!demoRef.current || !containerRef?.current) {
      console.warn('Hero section: Container or demo ref not available');
      return;
    }

    const { width: containerWidth, height: containerHeight } = getContainerDimensions();

    if (containerWidth === 0 || containerHeight === 0) {
      console.warn('Hero section: Container has zero dimensions');
      return;
    }

    const [active, ...rest] = order;

    // Calculate positions
    const totalCardsWidth = rest.length * CARD_WIDTH + (rest.length - 1) * CARD_GAP;
    const offsetLeft = Math.max(
      CONTAINER_PADDING,
      containerWidth - totalCardsWidth - CONTAINER_PADDING
    );
    const offsetTop = Math.max(10, containerHeight - CARD_HEIGHT - 10);
    const finalOffsetLeft = Math.max(0, Math.min(offsetLeft, containerWidth - totalCardsWidth));

    // Set up initial state to match what step() expects BEFORE it rotates:
    // - Active card (first in order) should be full-size
    // - Rest cards should be in stack positions
    
    // Position active card as full-size (matches static display)
    gsap.set(getCard(active), {
      x: 0,
      y: 0,
      width: containerWidth,
      height: containerHeight,
      borderRadius: 0,
      zIndex: 20,
      opacity: 1,
      scale: 1,
    });

    gsap.set(getCardContent(active), {
      x: 0,
      y: 0,
      opacity: 0, // Content hidden initially (matches step behavior)
      zIndex: 40,
    });

    // Position rest cards in stack positions
    rest.forEach((cardIndex, index) => {
      const cardX = finalOffsetLeft + index * (CARD_WIDTH + CARD_GAP);
      const boundedX = Math.max(0, Math.min(cardX, containerWidth - CARD_WIDTH));

      gsap.set(getCard(cardIndex), {
        x: boundedX,
        y: offsetTop,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        zIndex: 30,
        borderRadius: 10,
        opacity: 1,
        scale: 1,
      });

      gsap.set(getCardContent(cardIndex), {
        x: boundedX,
        zIndex: 40,
        y: offsetTop + CARD_HEIGHT - 100,
        opacity: 1,
      });
    });

    // Set up details panels initial state
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    
    // Update details content for active card
    const activeElement = document.querySelector(`${detailsActive} .hero-title-1`);
    const activeElement2 = document.querySelector(`${detailsActive} .hero-title-2`);
    const activeDesc = document.querySelector(`${detailsActive} .hero-desc`);

    if (activeElement && destinations[active]) {
      activeElement.textContent = destinations[active].title;
    }
    if (activeElement2 && destinations[active]) {
      activeElement2.textContent = destinations[active].title2;
    }
    if (activeDesc && destinations[active]) {
      activeDesc.textContent = destinations[active].description;
    }

    gsap.set(detailsActive, { 
      opacity: 1, 
      zIndex: 22, 
      yPercent: -50
    });
    gsap.set(`${detailsActive} .hero-title-1`, { y: 0 });
    gsap.set(`${detailsActive} .hero-title-2`, { y: 0 });
    gsap.set(`${detailsActive} .hero-desc`, { y: 0 });
    
    gsap.set(detailsInactive, { 
      opacity: 0, 
      zIndex: 12,
      yPercent: -50
    });
    gsap.set(`${detailsInactive} .hero-title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .hero-title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .hero-desc`, { y: 50 });

    // Wait ANIMATION_DURATION before first step() call, matching loop() timing
    // This ensures the first cycle has the same timing and pacing as all subsequent cycles
    setTimeout(() => {
      if (!isMountedRef.current || !orderRef.current) return;
      
      // Use step function exactly - this ensures first cycle matches all others perfectly
      step(order, detailsEven).then(() => {
        // Start the animation loop after first step completes
        setTimeout(() => {
          if (isMountedRef.current && orderRef.current) {
            loop();
          }
        }, ANIMATION_DURATION);
      });
    }, ANIMATION_DURATION); // Match loop() timing - wait ANIMATION_DURATION before first step
  };

  // Animation step
  const step = (order, detailsEven) => {
    return new Promise((resolve) => {
      if (isAnimatingRef.current) {
        resolve();
        return;
      }

      isAnimatingRef.current = true;
      
      // Rotate order for next card
      const newOrder = [...order];
      newOrder.push(newOrder.shift());
      const newDetailsEven = !detailsEven;

      const detailsActive = newDetailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = newDetailsEven ? "#details-odd" : "#details-even";

      // Update details content - use global class names
      const activeElement = document.querySelector(`${detailsActive} .hero-title-1`);
      const activeElement2 = document.querySelector(`${detailsActive} .hero-title-2`);
      const activeDesc = document.querySelector(`${detailsActive} .hero-desc`);

      if (activeElement && destinations[newOrder[0]]) {
        activeElement.textContent = destinations[newOrder[0]].title;
      }
      if (activeElement2 && destinations[newOrder[0]]) {
        activeElement2.textContent = destinations[newOrder[0]].title2;
      }
      if (activeDesc && destinations[newOrder[0]]) {
        activeDesc.textContent = destinations[newOrder[0]].description;
      }

      const { width: containerWidth, height: containerHeight } = getContainerDimensions();
      const totalCardsWidth = (newOrder.length - 1) * CARD_WIDTH + (newOrder.length - 2) * CARD_GAP;
      const offsetLeft = Math.max(
        CONTAINER_PADDING,
        containerWidth - totalCardsWidth - CONTAINER_PADDING
      );
      const offsetTop = Math.max(10, containerHeight - CARD_HEIGHT - 10);
      const finalOffsetLeft = Math.max(0, Math.min(offsetLeft, containerWidth - totalCardsWidth));

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      // Animate details - use global class names
      gsap.set(detailsActive, { zIndex: 22, yPercent: -50 });
      gsap.to(detailsActive, { opacity: 1, yPercent: -50, delay: 0.4, ease: EASE_TYPE });
      gsap.to(`${detailsActive} .hero-title-1`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease: EASE_TYPE,
      });
      gsap.to(`${detailsActive} .hero-title-2`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease: EASE_TYPE,
      });
      gsap.to(`${detailsActive} .hero-desc`, {
        y: 0,
        delay: 0.3,
        duration: 0.4,
        ease: EASE_TYPE,
      });
      gsap.set(detailsInactive, { zIndex: 12 });

      // Animate cards
      gsap.set(getCard(prv), { zIndex: 10 });
      gsap.set(getCard(active), { zIndex: 20 });
      gsap.to(getCard(prv), { scale: 1.5, ease: EASE_TYPE });

      gsap.to(getCardContent(active), {
        y: offsetTop + CARD_HEIGHT - 10,
        opacity: 0,
        duration: 0.3,
        ease: EASE_TYPE,
      });

      gsap.to(getCard(active), {
        x: 0,
        y: 0,
        ease: EASE_TYPE,
        width: containerWidth,
        height: containerHeight,
        borderRadius: 0,
        onComplete: () => {
          const xNew = finalOffsetLeft + (rest.length - 1) * (CARD_WIDTH + CARD_GAP);
          const boundedX = Math.max(0, Math.min(xNew, containerWidth - CARD_WIDTH));

          gsap.set(getCard(prv), {
            x: boundedX,
            y: offsetTop,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(getCardContent(prv), {
            x: boundedX,
            y: offsetTop + CARD_HEIGHT - 100,
            opacity: 1,
            zIndex: 40,
          });

          gsap.set(detailsInactive, { opacity: 0, yPercent: -50 });
          gsap.set(`${detailsInactive} .hero-title-1`, { y: 100 });
          gsap.set(`${detailsInactive} .hero-title-2`, { y: 100 });
          gsap.set(`${detailsInactive} .hero-desc`, { y: 50 });

          isAnimatingRef.current = false;
          resolve();
        },
      });

      rest.forEach((cardIndex, index) => {
        if (cardIndex !== prv) {
          const cardX = finalOffsetLeft + index * (CARD_WIDTH + CARD_GAP);
          const boundedX = Math.max(0, Math.min(cardX, containerWidth - CARD_WIDTH));

          gsap.set(getCard(cardIndex), { zIndex: 30 });
          gsap.to(getCard(cardIndex), {
            x: boundedX,
            y: offsetTop,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            ease: EASE_TYPE,
            delay: 0.1 * (index + 1),
          });

          gsap.to(getCardContent(cardIndex), {
            x: boundedX,
            y: offsetTop + CARD_HEIGHT - 100,
            opacity: 1,
            zIndex: 40,
            ease: EASE_TYPE,
            delay: 0.1 * (index + 1),
          });
        }
      });
    });
  };

  // Animation loop - update refs and continue
  const loop = async () => {
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    
    // Check if component is still mounted and initialized
    if (!isMountedRef.current || !orderRef.current) {
      return;
    }
    
    const newOrder = [...orderRef.current];
    newOrder.push(newOrder.shift());
    const newDetailsEven = !detailsEvenRef_state.current;
    
    // Update refs
    orderRef.current = newOrder;
    detailsEvenRef_state.current = newDetailsEven;
    
    await step(newOrder, newDetailsEven);
    
    // Check again before scheduling next loop
    if (!isMountedRef.current || !orderRef.current) {
      return;
    }
    
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
    loopTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && orderRef.current) {
        loop();
      }
    }, 0);
  };

  // Handle resize - get current values from refs
  const handleResize = () => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (!isAnimatingRef.current && isInitialized && orderRef.current) {
        init(orderRef.current, detailsEvenRef_state.current);
      }
    }, RESIZE_DEBOUNCE);
  };

  useEffect(() => {
    // Check GSAP availability
    if (typeof gsap === 'undefined') {
      console.error('GSAP is not loaded');
      return;
    }

    // Check container ref
    if (!containerRef?.current) {
      console.warn('Hero section: containerRef is required');
      return;
    }

    // Mark component as mounted
    isMountedRef.current = true;
    
    // Reset state on mount/remount
    setIsInitialized(false);
    isAnimatingRef.current = false;
    
    // Clear any existing timeouts
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = null;
    }
    
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }

    // Kill all existing GSAP animations for this component's elements
    if (demoRef.current) {
      const cards = demoRef.current.querySelectorAll('.hero-card, .hero-card-content');
      cards.forEach(card => {
        gsap.killTweensOf(card);
      });
    }
    gsap.killTweensOf("#details-even, #details-odd");
    
    // Clear any existing HTML content
    if (demoRef.current) {
      demoRef.current.innerHTML = '';
    }

    // Initialize order and detailsEven in refs for proper closure handling
    orderRef.current = destinations.map((_, index) => index);
    detailsEvenRef_state.current = true;

    // Generate cards HTML - use global class names for GSAP selectors
    const cardsHTML = destinations.map((dest, index) => 
      `<div class="hero-card" id="hero-card-${index}" style="background-image:url(${dest.image})"></div>`
    ).join('');

    const cardContentsHTML = destinations.map((dest, index) => 
      `<div class="hero-card-content" id="hero-card-content-${index}">
      </div>`
    ).join('');

    if (demoRef.current) {
      demoRef.current.innerHTML = cardsHTML + cardContentsHTML;
    }

    // Show static first card immediately (before animation starts)
    const showInitialStaticCard = () => {
      if (!demoRef.current || !containerRef?.current || !orderRef.current) return;
      
      const { width: containerWidth, height: containerHeight } = getContainerDimensions();
      if (containerWidth === 0 || containerHeight === 0) return;

      const [active] = orderRef.current;
      const detailsActive = detailsEvenRef_state.current ? "#details-even" : "#details-odd";

      // Show first card as static full-size image immediately
      gsap.set(getCard(active), {
        x: 0,
        y: 0,
        width: containerWidth,
        height: containerHeight,
        borderRadius: 0,
        zIndex: 20,
        opacity: 1,
      });

      gsap.set(getCardContent(active), {
        x: 0,
        y: 0,
        opacity: 0, // Content hidden initially (matches step behavior)
        zIndex: 40,
      });

      // Show details panel immediately with correct content
      gsap.set(detailsActive, { 
        opacity: 1, 
        zIndex: 22, 
        yPercent: -50,
        x: 0
      });
      gsap.set(`${detailsActive} .hero-title-1`, { y: 0 });
      gsap.set(`${detailsActive} .hero-title-2`, { y: 0 });
      gsap.set(`${detailsActive} .hero-desc`, { y: 0 });

      // Hide inactive details panel
      const detailsInactive = detailsEvenRef_state.current ? "#details-odd" : "#details-even";
      gsap.set(detailsInactive, { 
        opacity: 0, 
        zIndex: 12,
        yPercent: -50
      });

      // Hide side cards initially
      const rest = orderRef.current.slice(1);
      rest.forEach((cardIndex) => {
        gsap.set(getCard(cardIndex), {
          opacity: 0,
          zIndex: 0,
        });
        gsap.set(getCardContent(cardIndex), {
          opacity: 0,
          zIndex: 0,
        });
      });
    };

    // Show static card immediately
    showInitialStaticCard();

    // Load images and initialize animation after everything is ready
    const start = async () => {
      try {
        await loadAllImages();
        // Small delay to ensure DOM is ready and images are loaded
        setTimeout(() => {
          if (orderRef.current && containerRef?.current && isMountedRef.current) {
            init(orderRef.current, detailsEvenRef_state.current);
            setIsInitialized(true);
          }
        }, 300); // Give time for images to render
      } catch (error) {
        console.error("Hero section: Error loading images", error);
        // Still initialize even if some images fail, but wait a bit longer
        setTimeout(() => {
          if (orderRef.current && containerRef?.current && isMountedRef.current) {
            init(orderRef.current, detailsEvenRef_state.current);
            setIsInitialized(true);
          }
        }, 500);
      }
    };

    start();

    // Setup resize handler
    const resizeHandler = () => {
      handleResize();
    };
    window.addEventListener('resize', resizeHandler);

    // Cleanup function
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      
      // Stop all animations
      isAnimatingRef.current = false;
      
      // Remove event listeners
      window.removeEventListener('resize', resizeHandler);
      
      // Clear timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
      
      // Kill all GSAP animations for this component's elements
      if (demoRef.current) {
        const cards = demoRef.current.querySelectorAll('.hero-card, .hero-card-content');
        cards.forEach(card => {
          gsap.killTweensOf(card);
        });
      }
      gsap.killTweensOf("#details-even, #details-odd");
      
      // Reset refs
      orderRef.current = null;
      detailsEvenRef_state.current = true;
      
      // Clear HTML content
      if (demoRef.current) {
        demoRef.current.innerHTML = '';
      }
    };
  }, [containerRef, destinations]);

  return (
    <>
      <div ref={demoRef} className={styles.cardsContainer}></div>

      <div className={cn(styles.details, "details")} id="details-even" ref={detailsEvenRef}>
        <div className={styles.titleBox1}>
          <div className={cn(styles.title1, "hero-title-1")}>
            {destinations[0]?.title || "SAINT"}
          </div>
        </div>
        <div className={styles.titleBox2}>
          <div className={cn(styles.title2, "hero-title-2")}>
            {destinations[0]?.title2 || "ANTONIEN"}
          </div>
        </div>
        <div className={cn(styles.desc, "hero-desc")}>
          {destinations[0]?.description || ""}
        </div>
      </div>

      <div className={cn(styles.details, "details")} id="details-odd" ref={detailsOddRef}>
        <div className={styles.titleBox1}>
          <div className={cn(styles.title1, "hero-title-1")}>
            {destinations[0]?.title || "SAINT"}
          </div>
        </div>
        <div className={styles.titleBox2}>
          <div className={cn(styles.title2, "hero-title-2")}>
            {destinations[0]?.title2 || "ANTONIEN"}
          </div>
        </div>
        <div className={cn(styles.desc, "hero-desc")}>
          {destinations[0]?.description || ""}
        </div>
      </div>
    </>
  );
};

export default HeroSectionAnimation;


