import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * FooterWordmark
 *
 * Scroll-driven "reverse reveal" animation matching the 100xMedia Framer design.
 *
 * TRIGGER
 *   progress = 0  → card top edge hits the BOTTOM of the viewport
 *                   (offset "start end"). Circles are MASSIVE, covering the footer.
 *   progress = 1  → card top edge is 30% from the top of the viewport
 *                   (offset "start 30%"). Circles have shrunk to resting dot.
 *
 * TIMELINE (progress 0 → 1)
 *   0.0 → 0.9 : Circles shrink from peak size down to resting size using
 *               an exponential curve (matching the Framer physics).
 *   0.9 → 1.0 : Circles settled at resting dot size.
 */

/* ─── Resting dot geometry (em, relative to the h2 font-size) ───────── */
const DOT_TOP_EM = -0.52;       
const PURPLE_SIZE_EM = 0.22;    
const WHITE_SIZE_EM = 0.13;     

/* ─── Peak scale (progress = 0) ──────────────────────────────────────── */
const PEAK_SCALE_PURPLE = 80;
const PEAK_SCALE_WHITE = 27; // ~33% of purple's scale

/* ─── Ornament reveal — staggered ───────────────────────────────────── */
const ORN_A = { fade: [0.3, 0.6], rise: [0.3, 0.65] };
const ORN_B = { fade: [0.4, 0.7], rise: [0.4, 0.75] };
const ORN_C = { fade: [0.5, 0.8], rise: [0.5, 0.85] };

/* ─── White circle top: centered inside purple ──────────────────────── */
const WHITE_TOP_EM = DOT_TOP_EM + (PURPLE_SIZE_EM - WHITE_SIZE_EM) / 2;

/* ================================================================== */

export default function FooterWordmark({ text = "Visorithm", splitAt = 5, cardRef }) {
  /* splitAt = 5 → "Visor" | dotless-ı | "thm" */
  const before = text.slice(0, splitAt);
  const after  = text.slice(splitAt + 1);

  const localRef    = useRef(null);
  const shouldReduce = useReducedMotion();

  /* ── Scroll progress ─────────────────────────────────────────────── */
  // Use "start end" (starts when top of footer enters view)
  // to "end end" (finishes when bottom of footer hits bottom of screen)
  // This ensures the animation completes fully even on large monitors!
  const { scrollYProgress } = useScroll({
    target: cardRef ?? localRef,
    offset: ["start end", "end end"],
  });

  /* ── Scale MotionValues (Shrink from massive down to dot) ────────── */
  // As user scrolls down (progress 0 -> 1), circles SHRINK from PEAK down to 1.
  // We use exponential decay for a physically smooth shrinking feel.
  const purpleScale = useTransform(scrollYProgress, (p) => {
    const progress = Math.max(0, Math.min(1, p));
    return PEAK_SCALE_PURPLE * Math.pow(1 / PEAK_SCALE_PURPLE, progress);
  });

  const whiteScale = useTransform(scrollYProgress, (p) => {
    const progress = Math.max(0, Math.min(1, p));
    return PEAK_SCALE_WHITE * Math.pow(1 / PEAK_SCALE_WHITE, progress);
  });

  /* ── Ornament MotionValues ───────────────────────────────────────── */
  const fadeA = useTransform(scrollYProgress, ORN_A.fade, [0, 1]);
  const riseA = useTransform(scrollYProgress, ORN_A.rise, [28, 0]);
  const fadeB = useTransform(scrollYProgress, ORN_B.fade, [0, 1]);
  const riseB = useTransform(scrollYProgress, ORN_B.rise, [36, 0]);
  const fadeC = useTransform(scrollYProgress, ORN_C.fade, [0, 1]);
  const riseC = useTransform(scrollYProgress, ORN_C.rise, [24, 0]);

  /* ── Reduced-motion: fully settled, static ───────────────────────── */
  if (shouldReduce) {
    return (
      <div ref={localRef} className="relative z-10 select-none">
        <Ornaments settled />
        <WordmarkBlock
          before={before}
          after={after}
          purpleScale={1}
          whiteScale={1}
        />
      </div>
    );
  }

  /* ── Animated ────────────────────────────────────────────────────── */
  return (
    <div ref={localRef} className="relative z-10 select-none">
      <Ornaments
        fadeA={fadeA} riseA={riseA}
        fadeB={fadeB} riseB={riseB}
        fadeC={fadeC} riseC={riseC}
      />
      <WordmarkBlock
        before={before}
        after={after}
        purpleScale={purpleScale}
        whiteScale={whiteScale}
      />
    </div>
  );
}

/* ================================================================== */
/*  Wordmark + circles                                                 */
/* ================================================================== */
function WordmarkBlock({ before, after, purpleScale, whiteScale }) {
  return (
    <h2
      className="relative z-0 m-0 text-center font-extrabold leading-[0.85] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(11,17,32,0.8)]
                 text-[16vw] sm:text-[13vw] lg:text-[10vw]"
      aria-label={`${before}i${after}`}
    >
      {before}

      {/* The dotless-ı span anchors both circles. */}
      <span className="relative inline-block" aria-hidden="true">
        {/* U+0131 dotless i — font never draws its own dot here */}
        {"\u0131"}

        {/* ── PURPLE circle ─────────────────────────────────────────
            z-[-2]: behind the text.  */}
        <motion.span
          className="absolute inset-x-0 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-600"
          style={{
            zIndex: -2,
            top: `${DOT_TOP_EM}em`,
            width: `${PURPLE_SIZE_EM}em`,
            height: `${PURPLE_SIZE_EM}em`,
            transformOrigin: "center",
            transformPerspective: 1200, // Matches Framer's perspective logic
            scale: purpleScale,
          }}
        />

        {/* ── WHITE circle ──────────────────────────────────────────
            z-[-1]: behind the text, in front of purple. */}
        <motion.span
          className="absolute inset-x-0 mx-auto rounded-full bg-white"
          style={{
            zIndex: -1,
            top: `${WHITE_TOP_EM}em`,
            width: `${WHITE_SIZE_EM}em`,
            height: `${WHITE_SIZE_EM}em`,
            transformOrigin: "center",
            transformPerspective: 1200, // Matches Framer's perspective logic
            scale: whiteScale,
          }}
        />
      </span>

      {after}
    </h2>
  );
}

/* ================================================================== */
/*  Ornaments row                                                      */
/* ================================================================== */
/**
 * Props (animated mode): fadeA/riseA, fadeB/riseB, fadeC/riseC — MotionValues.
 * Props (settled mode):  settled={true} — renders all ornaments fully visible.
 */
function Ornaments({ settled, fadeA, riseA, fadeB, riseB, fadeC, riseC }) {
  const aStyle = settled ? { opacity: 1 } : { opacity: fadeA, y: riseA };
  const bStyle = settled ? { opacity: 1 } : { opacity: fadeB, y: riseB };
  const cStyle = settled ? { opacity: 1 } : { opacity: fadeC, y: riseC };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mx-auto flex h-[9vw] max-h-28 w-full max-w-3xl
                 items-end justify-between px-[8%] sm:px-[12%]"
    >
      {/* A: sorting-bars motif */}
      <motion.div className="relative flex items-end gap-1" style={aStyle}>
        <Glow />
        {[0.4, 0.7, 1, 0.55].map((h, i) => (
          <span
            key={i}
            className="w-2 rounded-t-sm bg-slate-500/50 sm:w-2.5"
            style={{ height: `${h * 2.2}rem` }}
          />
        ))}
      </motion.div>

      {/* B: node-fan / arc motif */}
      <motion.div className="relative" style={bStyle}>
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
      <motion.div className="relative flex flex-col items-center gap-1.5" style={cStyle}>
        <Glow />
        <span className="h-3 w-3 rounded-full bg-slate-500/50 sm:h-3.5 sm:w-3.5" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/35 sm:h-3 sm:w-3" />
      </motion.div>
    </div>
  );
}

function Glow() {
  return (
    <span className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-blue-500/10 blur-xl" />
  );
}