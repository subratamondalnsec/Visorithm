import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import MarqueeCard from "./MarqueeCard";

/* ------------------------------------------------------------------ */
/*  TUNING CONSTANTS                                                    */
/* ------------------------------------------------------------------ */
// Resting speed, in px moved per tick AT A 60fps BASELINE (deltaRatio
// below normalizes for actual frame rate, so this number means the same
// thing on a 60Hz or a 144Hz screen).
const BASE_SPEED = 0.5;

// How strongly the shared scroll-boost value (see useScrollBoost.js)
// affects this row's speed. Higher = more dramatic speed-up while
// scrolling.
const BOOST_SCALE = 0.6;

// How quickly the row's actual speed eases toward its target speed each
// tick (0-1). This is what removes the "glitchy" snap when boost changes
// fast - the row glides toward the new speed instead of jumping to it.
const SPEED_EASE = 0.12;

/**
 * MarqueeTrack
 *
 * A single infinitely-looping row of MarqueeCards.
 *
 * How the loop works: `items` is rendered twice, back to back, inside one
 * flex row. Once the row has been nudged left (or right) by exactly the
 * width of ONE copy of the items, the second copy is sitting exactly
 * where the first one started - so snapping the offset back by that same
 * width is invisible, and the motion looks perfectly continuous forever.
 *
 * direction="left"  -> content drifts leftward (new cards enter from the right)
 * direction="right" -> content drifts rightward (new cards enter from the left)
 *
 * boostRef is the ref returned by useScrollBoost() in the parent section -
 * pass the SAME ref into every track so all rows speed up together while
 * the page is being scrolled.
 */
export default function MarqueeTrack({ items, direction = "left", boostRef, className = "" }) {
  const trackRef = useRef(null);
  const halfWidthRef = useRef(0);
  const posRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let initialized = false;

    const measure = () => {
      // The track holds two back-to-back copies of `items`, so half its
      // total width is the width of a single copy - i.e. the loop length.
      const half = track.scrollWidth / 2;
      halfWidthRef.current = half;

      if (!initialized && half) {
        // "right" tracks start pre-shifted left by one copy-width so they
        // have room to travel rightward before wrapping (see tick()).
        posRef.current = direction === "right" ? -half : 0;
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        initialized = true;
      }
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    if (reduceMotion) {
      // Respect the user's OS-level preference: render the row statically
      // instead of animating it.
      return () => ro.disconnect();
    }

    const sign = direction === "left" ? -1 : 1;

    const tick = () => {
      const half = halfWidthRef.current;
      if (!half) return;

      // Normalizes movement to a 60fps baseline, so the row travels the
      // same visual distance per second regardless of the display's
      // actual refresh rate or the occasional dropped frame. Capped at 3x
      // so resuming a backgrounded tab can't cause one huge catch-up jump.
      const dr = Math.min(gsap.ticker.deltaRatio(60), 3);

      const boost = boostRef?.current ?? 0;
      const targetSpeed = BASE_SPEED + boost * BOOST_SCALE;
      // Ease the row's actual speed toward the target instead of snapping
      // straight to it - smooths out any sudden boost changes.
      speedRef.current += (targetSpeed - speedRef.current) * SPEED_EASE;

      posRef.current += sign * speedRef.current * dr;

      // Wrap back around once a full copy-width has scrolled past, so the
      // loop never runs out of content.
      if (direction === "left") {
        if (posRef.current <= -half) posRef.current += half;
      } else {
        if (posRef.current >= 0) posRef.current -= half;
      }

      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
    };

    gsap.ticker.add(tick);
    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [direction, boostRef]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max gap-4 will-change-transform sm:gap-5">
        {items.map((item, i) => (
          <MarqueeCard key={`a-${i}`} {...item} />
        ))}
        {/* second, identical copy - what makes the loop seamless */}
        {items.map((item, i) => (
          <MarqueeCard key={`b-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}