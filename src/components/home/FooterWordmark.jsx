import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * FooterWordmark (GSAP Version)
 *
 * Scroll-driven "reverse reveal" animation.
 *
 * TRIGGER
 *   start = "top bottom" (card top edge hits the BOTTOM of the viewport)
 *   end   = "bottom bottom" (card bottom edge hits the BOTTOM of the viewport)
 */

/* ─── Resting dot geometry (em, relative to the h2 font-size) ───────── */
const DOT_TOP_EM = 0.03;       
const PURPLE_SIZE_EM = 0.12;    
const WHITE_SIZE_EM = 0.13;     

/* ─── Peak scale (progress = 0) ──────────────────────────────────────── */
const PEAK_SCALE_PURPLE = 80;
const PEAK_SCALE_WHITE = 55;

/* ─── White circle top: centered inside purple ──────────────────────── */
const WHITE_TOP_EM = DOT_TOP_EM + (PURPLE_SIZE_EM - WHITE_SIZE_EM) / 2;

export default function FooterWordmark({ text = "Visorithm", splitAt = 5, cardRef }) {
  const before = text.slice(0, splitAt);
  const after  = text.slice(splitAt + 1);

  const localRef = useRef(null);
  const purpleRef = useRef(null);
  const whiteRef = useRef(null);

  useLayoutEffect(() => {
    // The target that triggers the scroll is the footer card
    const target = cardRef && cardRef.current ? cardRef.current : localRef.current;
    if (!target || !purpleRef.current || !whiteRef.current) return;

    // Use a small delay for ScrollTrigger refresh to ensure the page layout 
    // has completely stabilized (fonts/images loaded) before calculating offsets.
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top bottom", // Top of footer enters bottom of viewport
        end: "bottom bottom", // Bottom of footer hits bottom of viewport
        scrub: 2, // INCREASED for a very buttery smooth lag
      },
    });

    // We start from massive and animate to scale 1.
    gsap.set(purpleRef.current, { scale: PEAK_SCALE_PURPLE });
    gsap.set(whiteRef.current, { scale: PEAK_SCALE_WHITE });

    tl.to(purpleRef.current, {
      scale: 1,
      ease: "expo.out",
      duration: 2
    }, 0)
    .to(whiteRef.current, {
      scale: 1,
      ease: "power4.out", // Different ease + shorter duration = grows much faster!
      duration: 1.25
    }, 0);

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

        {/* The dotless-ı span anchors both circles. */}
        <span className="relative inline-block" aria-hidden="true">
          {/* U+0131 dotless i — font never draws its own dot here */}
          {"\u0131"}

          {/* ── PURPLE circle ───────────────────────────────────────── */}
          <span
            ref={purpleRef}
            className="absolute inset-x-0 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-600"
            style={{
              zIndex: -2,
              top: `${DOT_TOP_EM}em`,
              width: `${PURPLE_SIZE_EM}em`,
              height: `${PURPLE_SIZE_EM}em`,
              transformOrigin: "center",
            }}
          />

          {/* ── WHITE circle ────────────────────────────────────────── */}
          <span
            ref={whiteRef}
            className="absolute inset-x-0 mx-auto rounded-full bg-white"
            style={{
              zIndex: -1,
              top: `${WHITE_TOP_EM}em`,
              width: `${WHITE_SIZE_EM}em`,
              height: `${WHITE_SIZE_EM}em`,
              transformOrigin: "center",
            }}
          />
        </span>

        {after}
      </h2>
    </div>
  );
}