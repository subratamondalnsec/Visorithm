import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/* ------------------------------------------------------------------ */
/*  TUNING CONSTANTS                                                    */
/* ------------------------------------------------------------------ */
// How quickly the boost fades back to 0 each tick. Closer to 1 = boost
// lingers longer after you stop scrolling; closer to 0 = snaps back fast.
const DECAY = 0.94;

// How much of the raw per-frame scroll delta (in px) turns into boost.
// Raise this if fast scrolling doesn't feel like it speeds the cards up
// enough; lower it if a normal scroll already maxes things out.
const VELOCITY_TO_BOOST = 0.9;

// Hard ceiling so a huge jump (e.g. "scroll to top") can't fling the cards.
const MAX_BOOST = 18;

// Any single-tick scrollY jump bigger than this (px) is clamped before it
// turns into boost. Without this, a one-off layout jump (tab refocus,
// scrollIntoView, a browser scroll-restoration hop) reads as a sudden
// speed spike - i.e. exactly the "glitchy" feel to smooth out.
const RAW_DELTA_CAP = 120;

/**
 * useScrollBoost
 *
 * Returns a ref whose `.current` is a plain number: 0 while the page is
 * still, and spiking up right after the user scrolls (up OR down - only
 * the speed of the scroll matters, not its direction), then decaying back
 * to 0 on its own. MarqueeTrack reads this every frame to speed its
 * cards up while you're actively scrolling.
 *
 * Uses gsap.ticker (already a dependency in this project) instead of a
 * raw requestAnimationFrame loop, so it stays in step with any other
 * GSAP-driven animation on the page.
 */
export function useScrollBoost() {
  const boostRef = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    lastY.current = window.scrollY;

    const tick = () => {
      const y = window.scrollY;
      const delta = Math.min(RAW_DELTA_CAP, Math.abs(y - lastY.current));
      lastY.current = y;

      // Add fresh energy from this frame's scroll movement, then always
      // decay a little - net effect is a spike that eases back to 0.
      boostRef.current = Math.min(
        MAX_BOOST,
        boostRef.current * DECAY + delta * VELOCITY_TO_BOOST
      );
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return boostRef;
}