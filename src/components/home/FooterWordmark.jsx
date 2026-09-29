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

export default function FooterWordmark({ text = "Visorithm", splitAt = 5, cardRef }) {
  const before = text.slice(0, splitAt);
  const after  = text.slice(splitAt + 1);

  const localRef = useRef(null);
  const purpleRef = useRef(null);
  const whiteRef = useRef(null);

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

    return () => {
      clearTimeout(timeout);
      tl.kill();
    };
  }, [cardRef]);

  return (
    <div ref={localRef} className="relative z-10 select-none">
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