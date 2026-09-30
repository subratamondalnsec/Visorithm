import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * FooterWordmark (GSAP Keyframe Staged Version)
 *
 * Scroll-driven reverse reveal with an initial oversized HOLD phase.
 *
 * + 3 GHOST SLICES (added WITHOUT touching the dot):
 *   - the dot code, its timeline, its trigger and the layout box it triggers
 *     on are exactly as in the original file
 *   - the slices are absolutely positioned ABOVE the word, so they add no
 *     height to the trigger box (nothing shifts)
 *   - they run in their OWN ScrollTrigger that starts exactly where the dot
 *     trigger ends ("bottom bottom") and runs to the very end of the page
 *     ("max"), so the duration = all the scroll that is left
 */

/* ─── Resting Base Sizes (em) ─── */
const DOT_TOP_EM = 0.03;
const WHITE_SIZE_EM = 0.13;  // WHITE > PURPLE
const PURPLE_SIZE_EM = 0.12; // PURPLE sits visually inside WHITE

/* ─── Normalized Scale Keyframes ─── */
// KF3 (Oversized start, approx 2.0 cm from bottom)
const SCALE_KF3_W = 55.0;
const SCALE_KF3_P = 100.0;

// KF2 (Approx 3.0 cm from bottom)
const SCALE_KF2_W = 7.0;
const SCALE_KF2_P = 10;

// KF1 (Approx 3.5 cm from bottom)
const SCALE_KF1_W = 1.0;
const SCALE_KF1_P = 2.0;

/* ─── Timeline Pacing (Duration Units) ─── */
const DUR_HOLD = 5.5;
const DUR_KF3_TO_KF2 = 3;
const DUR_KF2_TO_KF1 = 2;
const DUR_KF1_TO_FINAL = 1;

/* ─── Centering Logic ─── */
// White is the larger background circle, Purple is smaller and centered inside.
const WHITE_TOP_EM = DOT_TOP_EM;
const PURPLE_TOP_EM = DOT_TOP_EM + (WHITE_SIZE_EM - PURPLE_SIZE_EM) / 2;

/* ─── GHOST SLICES (new, independent of the dot) ─── */
const BASE = 56;
const SCALE = 3.4; // higher = thinner slices, lower = thicker
const em = (px) => `${(px / (BASE * SCALE)).toFixed(4)}em`;

const GHOSTS = [
  { window: 18, opacity: 0.1 },
  { window: 20, opacity: 0.2 },
  { window: 22, opacity: 0.3 },
];
const GHOST_START_Y = em(34); // text starts below its window (hidden)
const GHOST_GAP = em(4);      // gap between slices and word
// The word's h2 has leading 0.85, so its letter tops start 0.063em below the
// box top. Slices stack's bottom edge sits 0.042em below the box top, which
// leaves the same 4px-equivalent gap above the letters.
const STACK_BOTTOM = "calc(100% - 0.042em)";

/* ─── Slice timeline (own scrub, own duration units) ─── */
const DUR_SLICES = 2;        // one slice's grow
const SLICES_STAGGER = 0.35; // delay between slices
const SLICES_SCRUB = 1;

export default function FooterWordmark({ text = "Visorithm", splitAt = 5, cardRef }) {
  const before = text.slice(0, splitAt);
  const after  = text.slice(splitAt + 1);

  const localRef = useRef(null);
  const purpleRef = useRef(null);
  const whiteRef = useRef(null);
  const ghostRefs = useRef([]);

  useLayoutEffect(() => {
    const target = cardRef && cardRef.current ? cardRef.current : localRef.current;
    if (!target || !purpleRef.current || !whiteRef.current) return;

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 170%", // Trigger starts early
        end: "bottom bottom", 
        scrub: 2,
      },
    });

    // Initial Oversized Setup
    gsap.set(whiteRef.current, { scale: SCALE_KF3_W });
    gsap.set(purpleRef.current, { scale: SCALE_KF3_P });

    // 1. Initial HOLD / Delay phase (No scale change)
    tl.to(whiteRef.current,  { scale: SCALE_KF3_W, ease: "none", duration: DUR_HOLD }, "start")
      .to(purpleRef.current, { scale: SCALE_KF3_P, ease: "none", duration: DUR_HOLD }, "start")
      
    // 2. KF3 -> KF2 (Noticeable contraction)
      .to(whiteRef.current,  { scale: SCALE_KF2_W, ease: "none", duration: DUR_KF3_TO_KF2 }, "kf3")
      .to(purpleRef.current, { scale: SCALE_KF2_P, ease: "none", duration: DUR_KF3_TO_KF2 }, "kf3")
      
    // 3. KF2 -> KF1 (Faster contraction)
      .to(whiteRef.current,  { scale: SCALE_KF1_W, ease: "none", duration: DUR_KF2_TO_KF1 }, "kf2")
      .to(purpleRef.current, { scale: SCALE_KF1_P, ease: "none", duration: DUR_KF2_TO_KF1 }, "kf2")
      
    // 4. KF1 -> Final Resting State (Smoothly settle)
      .to(whiteRef.current,  { scale: 1, ease: "none", duration: DUR_KF1_TO_FINAL }, "kf1")
      .to(purpleRef.current, { scale: 1, ease: "none", duration: DUR_KF1_TO_FINAL }, "kf1");

    /* ───────── GHOST SLICES: separate timeline, starts where the dot ends ───────── */
    const ghosts = ghostRefs.current.filter(Boolean);
    gsap.set(ghosts, { y: GHOST_START_Y, force3D: true }); // hidden below the windows

    const slicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "bottom bottom", // = exactly where the dot trigger above ends
        end: "max",             // = the very end of the page
        scrub: SLICES_SCRUB,
      },
    });
    slicesTl.to(ghosts, {
      y: 0,
      ease: "power3.out",
      duration: DUR_SLICES,
      stagger: SLICES_STAGGER,
      force3D: true,
    });

    return () => {
      clearTimeout(timeout);
      tl.kill();
      slicesTl.kill();
    };
  }, [cardRef]);

  const sizeClass = "text-[22vw] sm:text-[18vw] lg:text-[15vw]";

  return (
    <div ref={localRef} className="relative z-10 select-none">
      {/* ── 3 GHOST SLICES — absolutely positioned above the word (adds no height) ── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 flex flex-col items-center ${sizeClass}`}
        style={{ bottom: STACK_BOTTOM, gap: GHOST_GAP }}
      >
        {GHOSTS.map((g, i) => (
          <div
            key={i}
            className="relative flex w-full flex-none items-start justify-center overflow-clip"
            style={{ height: em(g.window), opacity: g.opacity }}
          >
            <h2
              ref={(el) => (ghostRefs.current[i] = el)}
              className="m-0 w-full shrink-0 text-center font-extrabold leading-[0.75] tracking-tight text-white
                         text-[22vw] sm:text-[18vw] lg:text-[15vw]"
              style={{ willChange: "transform" }}
            >
              {text}
            </h2>
          </div>
        ))}
      </div>

      {/* ── MAIN WORDMARK — identical to the original ── */}
      <h2
        className="relative z-0 m-0 text-center font-extrabold leading-[0.85] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(11,17,32,0.8)]
                   text-[22vw] sm:text-[18vw] lg:text-[15vw]"
        aria-label={`${before}i${after}`}
      >
        {before}

        <span className="relative inline-block" aria-hidden="true">
          {"\u0131"}

          {/* ── WHITE circle (Outer / Larger) ─────────────────────── */}
          <span
            ref={whiteRef}
            className="absolute inset-x-0 mx-auto rounded-full bg-white"
            style={{
              zIndex: -1, // Sits BEHIND purple
              top: `${WHITE_TOP_EM}em`,
              width: `${WHITE_SIZE_EM}em`,
              height: `${WHITE_SIZE_EM}em`,
              transformOrigin: "center",
            }}
          />

          {/* ── PURPLE circle (Inner / Smaller) ───────────────────── */}
          <span
            ref={purpleRef}
            className="absolute inset-x-0 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-600"
            style={{
              zIndex: -2, // Sits IN FRONT of white
              top: `${PURPLE_TOP_EM}em`,
              width: `${PURPLE_SIZE_EM}em`,
              height: `${PURPLE_SIZE_EM}em`,
              transformOrigin: "center",
            }}
          />
        </span>

        {after}
      </h2>
    </div>
  );
}