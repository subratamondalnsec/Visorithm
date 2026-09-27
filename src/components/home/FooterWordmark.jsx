import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";

/**
 * FooterWordmark
 *
 * REBUILT from a frame-by-frame PDF breakdown + a verbal walkthrough of the
 * reference site (percent-by-percent, e.g. "at 10% scroll the purple circle
 * has already covered the whole navbar row; by 40% it's near its biggest;
 * from there it recedes, and by ~90-100% it's shrunk down to a small dot
 * sitting on the wordmark's i, with a white circle still visible inside it").
 * Earlier version of this file only handled a simple "big -> small" shrink
 * confined to the area right above the wordmark -- it never grew to cover
 * the section, which is the whole point of the effect. This version does:
 *
 *   1. GROW: from progress 0, two circles (purple behind, white in front,
 *      both anchored at the wordmark's i-dot) swell up FAST -- essentially
 *      full-grown by ~10-12% of scroll -- large enough to cover the entire
 *      footer card (nav row included). The card itself (see `cardRef`,
 *      passed from Footer.jsx) clips them with `overflow-hidden`, which is
 *      what makes the grown shape read as "filling the card, corners and
 *      all" without any separate corner-matching code.
 *   2. HOLD/EASE: they stay large through ~12-35%, purple always a little
 *      ahead of white (matches "purple grows a bit faster").
 *   3. SHRINK: from ~35% to ~92%, both recede back down to their resting
 *      size -- a normal-sized dot -- progressively revealing the nav row,
 *      the wordmark, and the copyright line underneath as they go.
 *   4. REST: from ~92-100%, settled: a purple ring with a visible white
 *      center sitting on the i -- NOT a solid purple dot. White is always
 *      smaller than purple and always on top (z-index: white > purple > the
 *      rest of the card), at every point in the animation, not just at rest.
 *
 * Because this is one continuous `scrollYProgress`-driven curve (not a
 * "play once" animation), scrolling back up simply retraces the same curve
 * in reverse -- it re-grows, then shrinks back to the dot again.
 *
 * `cardRef`: a ref to the OUTER card element (created in Footer.jsx). Used
 * as the `useScroll` target, so the timeline is driven by how far the card
 * itself has scrolled into view.
 *
 * TUNING NOTE: DOT_TOP_EM positions the resting dot relative to the dotless
 * "ı" -- a reasonable default for most sans-serif fonts, but check it
 * against your real font. PEAK_SCALE is deliberately generous (60x) so the
 * circles reliably cover the card regardless of its exact pixel size; if
 * your card is unusually large/small, adjust it until the "grown" frame
 * fully fills the card with no background peeking through at the far
 * corner, and no wasted excess beyond that.
 */

const DOT_TOP_EM = -0.55; // vertical position of the resting dot, relative to the dotless-i's own top
const PURPLE_SIZE_EM = 0.22; // purple circle's resting diameter, in em
const WHITE_SIZE_EM = 0.13; // white circle's resting diameter, in em (always smaller than purple)

const PEAK_SCALE = 60; // how many times bigger than resting size, at the biggest point of the "grow"
const WHITE_PEAK_RATIO = 0.85; // white's peak scale, as a fraction of purple's (purple grows a bit bigger/faster)

// Shared progress keyframes: 0 (start) -> fast grow -> near-peak hold -> shrink -> settle.
const PROGRESS_STOPS = [0, 0.12, 0.35, 0.92, 1];
const PURPLE_SCALE_STOPS = [0.4, PEAK_SCALE, PEAK_SCALE * 0.9, 1, 1];
const WHITE_SCALE_STOPS = [
  0.4,
  PEAK_SCALE * WHITE_PEAK_RATIO,
  PEAK_SCALE * WHITE_PEAK_RATIO * 0.9,
  1,
  1,
];

export default function FooterWordmark({ text = "Visorithm", splitAt = 5, cardRef }) {
  // splitAt=5 -> "Visor" | "i" | "thm"  (the i between r and t, per the brief)
  const before = text.slice(0, splitAt);
  const after = text.slice(splitAt + 1);

  const localRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Progress 0 -> 1 as the CARD scrolls from "just entering the bottom of
  // the viewport" to "sitting comfortably in view". Scrubs both ways.
  const { scrollYProgress } = useScroll({
    target: cardRef ?? localRef,
    offset: ["start 90%", "start 25%"],
  });

  // DEBUG: live readout of scrollYProgress — REMOVE after timing check.
  const [debugProgress, setDebugProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setDebugProgress(v));

  const purpleScale = useTransform(scrollYProgress, PROGRESS_STOPS, PURPLE_SCALE_STOPS);
  const whiteScale = useTransform(scrollYProgress, PROGRESS_STOPS, WHITE_SCALE_STOPS);
  const purpleTransform = useTransform(purpleScale, (s) => `perspective(1200px) scale(${s})`);
  const whiteTransform = useTransform(whiteScale, (s) => `perspective(1200px) scale(${s})`);

  // Ornaments: staggered ranges so they arrive one after another, only once
  // the circles have mostly receded (they'd be hidden underneath early on).
  const riseA = useTransform(scrollYProgress, [0.4, 0.75], [26, 0]);
  const fadeA = useTransform(scrollYProgress, [0.4, 0.68], [0, 1]);
  const riseB = useTransform(scrollYProgress, [0.5, 0.85], [34, 0]);
  const fadeB = useTransform(scrollYProgress, [0.5, 0.78], [0, 1]);
  const riseC = useTransform(scrollYProgress, [0.6, 0.95], [22, 0]);
  const fadeC = useTransform(scrollYProgress, [0.6, 0.88], [0, 1]);

  if (reduceMotion) {
    // Static, fully-settled state -- no scroll-linked motion at all.
    return (
      <div ref={localRef} className="relative z-10 select-none">
        <Ornaments style={{ opacity: 1 }} />
        <Wordmark
          before={before}
          after={after}
          purpleStyle={{ transform: "scale(1)" }}
          whiteStyle={{ transform: "scale(1)" }}
        />
      </div>
    );
  }

  return (
    <>
    {/* DEBUG overlay — REMOVE after timing check */}
    <div style={{
      position: "fixed", bottom: 12, left: 12, zIndex: 99999,
      background: "rgba(0,0,0,0.75)", color: "#0f0",
      fontFamily: "monospace", fontSize: 11, padding: "4px 8px",
      borderRadius: 4, pointerEvents: "none", lineHeight: 1.4,
    }}>
      footer scrollYProgress: {debugProgress.toFixed(4)}
    </div>
    <div ref={localRef} className="relative z-10 select-none">
      <Ornaments
        aStyle={{ y: riseA, opacity: fadeA }}
        bStyle={{ y: riseB, opacity: fadeB }}
        cStyle={{ y: riseC, opacity: fadeC }}
      />
      <Wordmark
        before={before}
        after={after}
        purpleStyle={{ transform: purpleTransform }}
        whiteStyle={{ transform: whiteTransform }}
      />
    </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  The wordmark itself, plus the two reveal circles                   */
/* ------------------------------------------------------------------ */
function Wordmark({ before, after, purpleStyle, whiteStyle }) {
  return (
    <h2
      className="relative z-0 m-0 text-center font-extrabold leading-[0.85] tracking-tight text-white
                 text-[16vw] sm:text-[13vw] lg:text-[10vw]"
      aria-label={`${before}i${after}`}
    >
      {before}
      <span className="relative inline-block" aria-hidden="true">
        {/* dotless i -- the real glyph never draws its own dot */}
        {"\u0131"}

        {/* PURPLE: bigger of the two, sits behind White, lower z-index. */}
        <motion.span
          className="absolute inset-x-0 z-30 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-600"
          style={{
            top: `${DOT_TOP_EM}em`,
            width: `${PURPLE_SIZE_EM}em`,
            height: `${PURPLE_SIZE_EM}em`,
            transformOrigin: "center",
            ...purpleStyle,
          }}
        />

        {/* WHITE: smaller, always on top (highest z-index of the two, per
            the reference: white > purple > everything else on the card). */}
        <motion.span
          className="absolute inset-x-0 z-40 mx-auto rounded-full bg-white"
          style={{
            top: `${DOT_TOP_EM + (PURPLE_SIZE_EM - WHITE_SIZE_EM) / 2}em`,
            width: `${WHITE_SIZE_EM}em`,
            height: `${WHITE_SIZE_EM}em`,
            transformOrigin: "center",
            ...whiteStyle,
          }}
        />
      </span>
      {after}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Three small "glass" ornament clusters above the wordmark.          */
/*  Purely decorative (aria-hidden). Swap the shapes for whatever fits */
/*  the brand -- these lean on the same DSA motifs as the rest of the  */
/*  site (bars / node-fan / linked dots).                              */
/* ------------------------------------------------------------------ */
function Ornaments({ aStyle, bStyle, cStyle, style }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mx-auto flex h-[9vw] max-h-28 w-full max-w-3xl
                 items-end justify-between px-[8%] sm:px-[12%]"
    >
      {/* A: mini sorting-bars motif */}
      <motion.div className="relative flex items-end gap-1" style={aStyle ?? style}>
        <Glow />
        {[0.4, 0.7, 1, 0.55].map((h, i) => (
          <span
            key={i}
            className="w-2 rounded-t-sm bg-slate-500/50 sm:w-2.5"
            style={{ height: `${h * 2.2}rem` }}
          />
        ))}
      </motion.div>

      {/* B: node-fan motif (three stacked arcs, evokes a tree/graph fan) */}
      <motion.div className="relative" style={bStyle ?? style}>
        <Glow />
        <div className="flex flex-col items-center gap-0.5">
          {[0.9, 0.65, 0.4].map((s, i) => (
            <span
              key={i}
              className="rounded-t-full bg-slate-500/40"
              style={{ width: `${s * 3.6}rem`, height: `${s * 1.8}rem` }}
            />
          ))}
        </div>
      </motion.div>

      {/* C: linked-dots motif */}
      <motion.div className="relative flex flex-col items-center gap-1.5" style={cStyle ?? style}>
        <Glow />
        <span className="h-3 w-3 rounded-full bg-slate-500/50 sm:h-3.5 sm:w-3.5" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/35 sm:h-3 sm:w-3" />
      </motion.div>
    </div>
  );
}

function Glow() {
  return (
    <span
      className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-blue-500/10 blur-xl"
    />
  );
}