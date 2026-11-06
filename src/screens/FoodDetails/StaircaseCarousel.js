import React, { useEffect, useMemo, useRef, useState } from "react";

export function stepOf(i, active) {
  return i < active ? -1 : i > active ? 1 : 0;
}

export function slideTransform(i, active, step, inactiveScale, sideOffset = 0) {
  const position = stepOf(i, active);
  const horizontal = sideOffset ? `translateX(${position * sideOffset}px) ` : "";
  return `${horizontal}translateY(${position * step * 100}%) scale(${position === 0 ? 1 : inactiveScale})`;
}

export function springAt(t, bounce, duration) {
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
  const w = (2 * Math.PI) / Math.max(duration, 0.05);
  if (zeta >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
}

export function springEasing(bounce, duration, samples = 48) {
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
  const w = (2 * Math.PI) / Math.max(duration, 0.05);
  const total = Math.log(1000) / (zeta * w);
  const points = [];
  for (let k = 0; k <= samples; k += 1) {
    const value = k === samples ? 1 : springAt((k / samples) * total, bounce, duration);
    points.push(String(+value.toFixed(4)));
  }
  return { easing: `linear(${points.join(", ")})`, ms: Math.round(total * 1000) };
}

export function clampIndex(i, n) {
  return n <= 0 ? 0 : Math.min(Math.max(Math.round(i), 0), n - 1);
}

const STYLES = `
  .food-staircase{position:relative;isolation:isolate;overflow:hidden;display:grid;place-items:center;width:100%;box-sizing:border-box;padding:128px 0 12px;color:var(--FG,#0f0f0f);background:var(--BG,#fbfbf9);user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
  .food-staircase::before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(circle at 50% 46%,var(--AL,rgba(0,151,178,.08)),transparent 35%),linear-gradient(135deg,transparent 0 48%,color-mix(in srgb,var(--A,#0097b2) 5%,transparent) 48% 52%,transparent 52%);pointer-events:none}
  .food-staircase::after{content:"";position:absolute;inset:0;z-index:-1;opacity:.16;background-image:radial-gradient(var(--M,#7a7a77) .7px,transparent .7px);background-size:16px 16px;mask-image:linear-gradient(to bottom,transparent,black 28%,black 72%,transparent);pointer-events:none}
  .food-staircase:focus-visible{box-shadow:inset 0 0 0 2px var(--A,#0097b2)}
  .food-staircase__stage{position:relative;z-index:2}
  .food-staircase__strip{display:flex;align-items:center;width:max-content}
  .food-staircase__slide{position:relative;z-index:1;flex-shrink:0;display:block;margin:0;padding:0;border:0;aspect-ratio:1/1;overflow:hidden;cursor:pointer;will-change:transform;background:transparent;box-shadow:0 20px 54px rgba(15,15,15,.14);-webkit-tap-highlight-color:transparent}
  .food-staircase__slide[aria-current="true"]{z-index:2;aspect-ratio:var(--food-staircase-active-ratio,var(--food-staircase-ratio,4/3));box-shadow:0 30px 90px rgba(15,15,15,.22)}
  .food-staircase__slide:focus-visible{outline:2px solid var(--A,#0097b2);outline-offset:5px}
  .food-staircase__slide>img{width:100%;height:100%;max-width:none;display:block;object-fit:cover;pointer-events:none}
  .food-staircase__slide[aria-current="true"]>img{object-fit:cover}
  .food-staircase__backdrops{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
  .food-staircase__backdrop{position:absolute;inset:0;background-position:center;background-size:cover;filter:none;transform:none;opacity:0;animation:food-staircase-backdrop-in 700ms ease both}
  .food-staircase__backdrop[data-out]{animation:food-staircase-backdrop-out 700ms ease both}
  .food-staircase__backdrops::after{content:"";position:absolute;inset:0;background:linear-gradient(35deg,color-mix(in srgb,var(--BG,#fbfbf9) 96%,transparent) 0%,color-mix(in srgb,var(--BG,#fbfbf9) 76%,transparent) 24%,color-mix(in srgb,var(--BG,#fbfbf9) 36%,transparent) 58%,color-mix(in srgb,var(--BG,#fbfbf9) 14%,transparent) 100%)}
  @keyframes food-staircase-backdrop-in{from{opacity:0}to{opacity:1}}
  @keyframes food-staircase-backdrop-out{from{opacity:1}to{opacity:0}}
  .food-staircase__titles{position:absolute;left:100%;top:0;bottom:0;margin-left:24px;z-index:-1;pointer-events:none}
  .food-staircase__title{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;white-space:nowrap;font-family:'Fraunces',Georgia,serif;font-size:clamp(24px,2.3vw,38px);font-weight:700;letter-spacing:-.035em;transform-origin:0 50%}
  .food-staircase__title span{display:block;max-width:min(28vw,380px);white-space:normal;line-height:1.06}
  .food-staircase__title small{display:block;margin-bottom:10px;color:var(--A,#0097b2);font-family:'Inter',sans-serif;font-size:10px;font-weight:800;letter-spacing:.22em;text-transform:uppercase}
  @keyframes food-staircase-in{from{opacity:0;transform:scale(.5);filter:blur(2px)}to{opacity:1;transform:scale(1);filter:blur(0)}}
  @keyframes food-staircase-out{from{opacity:1;transform:scale(1);filter:blur(0)}to{opacity:0;transform:scale(.5);filter:blur(2px)}}
  .food-staircase__controls{position:absolute;bottom:var(--food-hero-control-bottom,28px);left:50%;transform:translateX(-50%) scale(var(--food-hero-scale,1));transform-origin:50% 100%;z-index:3;display:flex;align-items:center;gap:14px;padding:6px;border-radius:999px;color:var(--FG,#0f0f0f);background:color-mix(in srgb,var(--S,#f3f3f1) 82%,transparent);border:1px solid var(--B,#e6e6e3);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 8px 28px rgba(15,15,15,.1)}
  .food-staircase__button{display:grid;place-items:center;margin:0;padding:8px;border:0;border-radius:999px;background:transparent;color:inherit;cursor:pointer;transition:opacity .2s,transform .2s,background .2s}
  .food-staircase__button:not(:disabled):hover{background:var(--AL,rgba(0,151,178,.08));color:var(--A,#0097b2)}
  .food-staircase__button:disabled{opacity:.28;cursor:default}
  .food-staircase__button:not(:disabled):active{transform:scale(.88)}
  .food-staircase__button:focus-visible,.food-staircase__dot:focus-visible{outline:2px solid var(--A,#0097b2);outline-offset:2px}
  .food-staircase__dots{min-width:150px;display:flex;justify-content:center;align-items:center;gap:7px}
  .food-staircase__dot{position:relative;width:7px;height:7px;margin:0;padding:0;border:0;border-radius:999px;background:var(--FG,#0f0f0f);opacity:.25;cursor:pointer;transition:width .3s,opacity .3s,background .3s}
  .food-staircase__dot::after{content:"";position:absolute;inset:-10px -4px}
  .food-staircase__dot[aria-current]{width:26px;opacity:1;background:var(--A,#0097b2)}
  .food-staircase__count{padding:0 18px;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.08em}
  .food-staircase__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  @media(max-width:640px){.food-staircase{padding:82px 0 220px}.food-staircase__slide:not([aria-current="true"]){aspect-ratio:3/4}.food-staircase__titles{left:0;right:0;top:100%;bottom:auto;height:48px;margin:8px 0 0;z-index:1}.food-staircase__title{left:0;right:0;justify-content:center;text-align:center;transform-origin:50% 50%;font-size:17px}.food-staircase__title span{max-width:78vw;line-height:1.15}.food-staircase__title small{font-size:8px;margin-bottom:4px}.food-staircase__controls{display:none}.food-staircase__dots{min-width:112px}}
  @media(prefers-reduced-motion:reduce){.food-staircase__strip,.food-staircase__slide{transition:none!important}.food-staircase__title{animation:none!important}.food-staircase__title[data-out]{display:none}.food-staircase__dot,.food-staircase__button{transition:none}}
`;

function Chevron({ direction }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const pad = (n) => (n < 10 ? `0${n}` : String(n));

export default function StaircaseCarousel({
  items,
  height = "100svh",
  slideWidth = "clamp(150px, 18vw, 230px)",
  slidePitch = slideWidth,
  slideAspectRatio = "4 / 3",
  inactiveScale = 0.8,
  sideOffset = 0,
  step = 0.58,
  radius = 26,
  bounce = 0.1,
  duration = 0.8,
  stepDuration = 0.6,
  titles = true,
  controls = true,
  autoPlay = false,
  autoPlayInterval = 2800,
  loop = false,
  index,
  defaultIndex = 0,
  onIndexChange,
  onSelect,
  ariaLabel = "Food gallery",
  className = "",
}) {
  const count = items.length;
  const initialIndex = clampIndex(index ?? defaultIndex, count);
  const [inner, setInner] = useState(initialIndex);
  const [trackIndex, setTrackIndex] = useState(loop && count > 1 ? count + initialIndex : initialIndex);
  const [isRecentering, setIsRecentering] = useState(false);
  const [imageRatios, setImageRatios] = useState({});
  const active = index == null ? clampIndex(inner, count) : clampIndex(index, count);
  const trackItems = loop && count > 1 ? [...items, ...items, ...items] : items;
  const strip = useMemo(() => springEasing(bounce, duration), [bounce, duration]);
  const pop = useMemo(() => springEasing(0.2, 0.8), []);
  const swipe = useRef({ id: -1, x: 0, done: false });
  const sequence = useRef(0);
  const [shown, setShown] = useState([{ key: 0, i: active, out: false }]);

  useEffect(() => {
    setShown((list) => {
      const current = list.find((title) => !title.out);
      if (current && current.i === active) return list;
      sequence.current += 1;
      return [...list.map((title) => ({ ...title, out: true })), { key: sequence.current, i: active, out: false }];
    });
    const timer = window.setTimeout(() => setShown((list) => list.filter((title) => !title.out)), pop.ms);
    return () => window.clearTimeout(timer);
  }, [active, pop.ms]);

  const go = (nextIndex) => {
    const next = loop && count > 0
      ? ((Math.round(nextIndex) % count) + count) % count
      : clampIndex(nextIndex, count);
    if (next === active) return;
    if (loop && count > 1) {
      if (nextIndex === active + 1 || (active === count - 1 && next === 0)) {
        setTrackIndex((current) => current + 1);
      } else if (nextIndex === active - 1 || (active === 0 && next === count - 1)) {
        setTrackIndex((current) => current - 1);
      } else {
        const candidates = [next, next + count, next + count * 2];
        setTrackIndex((current) => candidates.reduce((closest, candidate) => Math.abs(candidate - current) < Math.abs(closest - current) ? candidate : closest));
      }
    } else {
      setTrackIndex(next);
    }
    setInner(next);
    onIndexChange?.(next);
  };

  useEffect(() => {
    if (!autoPlay || count < 2) return undefined;
    if (!loop && active >= count - 1) return undefined;
    const timer = window.setTimeout(() => {
      const next = loop ? (active + 1) % count : active + 1;
      setTrackIndex((current) => loop ? current + 1 : next);
      setInner(next);
      onIndexChange?.(next);
    }, autoPlayInterval);
    return () => window.clearTimeout(timer);
  }, [active, autoPlay, autoPlayInterval, count, index, loop, onIndexChange]);

  const onKeyDown = (event) => {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    go(next);
  };

  const onPointerDown = (event) => {
    swipe.current = { id: event.pointerId, x: event.clientX, done: false };
  };
  const onPointerMove = (event) => {
    const state = swipe.current;
    if (state.id !== event.pointerId || state.done) return;
    const delta = event.clientX - state.x;
    if (Math.abs(delta) > 40) {
      state.done = true;
      go(active + (delta < 0 ? 1 : -1));
    }
  };
  const onPointerEnd = () => {
    swipe.current.id = -1;
    window.setTimeout(() => { swipe.current.done = false; }, 0);
  };

  const current = items[active];
  const transition = `transform ${stepDuration * 1000}ms ease-in-out, aspect-ratio ${Math.max(stepDuration * 1000, 760)}ms cubic-bezier(.22,1,.36,1)`;
  const recenterTrack = (event) => {
    if (!loop || count < 2 || event.target !== event.currentTarget) return;
    let centered = trackIndex;
    if (trackIndex >= count * 2) centered = trackIndex - count;
    else if (trackIndex < count) centered = trackIndex + count;
    if (centered === trackIndex) return;
    setIsRecentering(true);
    setTrackIndex(centered);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setIsRecentering(false)));
  };

  return (
    <div className={`food-staircase ${className}`} style={{ height }} role="region" aria-roledescription="carousel" aria-label={ariaLabel} tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
      <style>{STYLES}</style>
      <div className="food-staircase__backdrops" aria-hidden="true">
        {shown.map((background) => {
          const src = items[background.i]?.src;
          return src ? <div key={background.key} className="food-staircase__backdrop" data-out={background.out ? "" : undefined} style={{ backgroundImage: `url(${JSON.stringify(src)})` }} /> : null;
        })}
      </div>
      <div className="food-staircase__stage" style={{ width: slideWidth, "--food-staircase-width": slideWidth, "--food-staircase-pitch": slidePitch, "--food-staircase-ratio": slideAspectRatio }}>
        <div className="food-staircase__strip" onTransitionEnd={recenterTrack} style={{ transform: `translateX(calc(${-trackIndex} * var(--food-staircase-pitch)))`, transition: isRecentering ? "none" : `transform ${strip.ms}ms ${strip.easing}` }}>
          {trackItems.map((item, i) => {
            const logicalIndex = count > 0 ? i % count : 0;
            const isActive = i === trackIndex;
            return (
              <button key={`${item.src}-${i}`} type="button" className="food-staircase__slide" aria-label={`${logicalIndex + 1} of ${count}: ${item.title}`} aria-current={isActive ? "true" : undefined} tabIndex={isActive ? 0 : -1} onClick={() => { if (swipe.current.done) return; if (isActive) onSelect?.(item, logicalIndex); else { setTrackIndex(i); setInner(logicalIndex); onIndexChange?.(logicalIndex); } }} style={{ width: slideWidth, marginRight: `calc(${slidePitch} - ${slideWidth})`, borderRadius: radius, "--food-staircase-active-ratio": imageRatios[logicalIndex] || slideAspectRatio, transform: slideTransform(i, trackIndex, step, inactiveScale, sideOffset), transition: isRecentering ? "none" : transition }}>
                <img src={item.src} alt={item.alt || item.title} draggable={false} decoding="async" width="405" height="540" onError={(event) => { const fallback = items.find((candidate) => candidate.src && candidate.src !== item.src)?.src; if (fallback && event.currentTarget.dataset.fallback !== "true") { event.currentTarget.dataset.fallback = "true"; event.currentTarget.src = fallback; } else { event.currentTarget.alt = ""; event.currentTarget.style.opacity = "0"; } }} onLoad={(event) => { const { naturalWidth, naturalHeight } = event.currentTarget; if (!naturalWidth || !naturalHeight) return; const ratio = naturalWidth / naturalHeight; setImageRatios((current) => current[logicalIndex] === ratio ? current : { ...current, [logicalIndex]: ratio }); }} />
              </button>
            );
          })}
        </div>
        {titles ? (
          <div className="food-staircase__titles" aria-hidden="true">
            {shown.map((title) => (
              <div key={title.key} className="food-staircase__title" data-out={title.out ? "" : undefined} style={{ animation: `${title.out ? "food-staircase-out" : "food-staircase-in"} ${pop.ms}ms ${pop.easing} both` }}>
                <span><small>{items[title.i]?.eyebrow || "The culinary edit"}</small>{items[title.i]?.title}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {controls && count > 1 ? (
        <div className="food-staircase__controls" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" className="food-staircase__button" aria-label="Previous photo" disabled={!loop && active <= 0} onClick={() => go(active - 1)}><Chevron direction={-1} /></button>
          <div className="food-staircase__dots">
            {count > 10 ? <span className="food-staircase__count">{pad(active + 1)} / {pad(count)}</span> : items.map((item, i) => <button key={i} type="button" className="food-staircase__dot" aria-label={`Go to photo ${i + 1}: ${item.title}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)} />)}
          </div>
          <button type="button" className="food-staircase__button" aria-label="Next photo" disabled={!loop && active >= count - 1} onClick={() => go(active + 1)}><Chevron direction={1} /></button>
        </div>
      ) : null}
      <div className="food-staircase__sr" aria-live="polite" aria-atomic="true">{current ? `Photo ${active + 1} of ${count}: ${current.title}` : ""}</div>
    </div>
  );
}
