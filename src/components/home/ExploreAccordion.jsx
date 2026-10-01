import { useState, useRef, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { ALGORITHM_ICONS } from "./algorithmIcons";

/**
 * ExploreAccordion
 * ------------------------------------------------------------------
 * v4 - on top of v3's fixes (no per-algorithm note, overflow-hidden
 * so a scrollbar can never appear, calc()-based sizing that can't
 * overflow its container, hover-lock against border flicker):
 *
 *  1. The collapsed column's label used to be a horizontal line of
 *     text truncated with an ellipsis ("Dyna...") because a ~64-110px
 *     -wide column has nowhere near enough room for "Dynamic
 *     Programming" written left-to-right. It's rotated now (CSS
 *     writing-mode, not a transform hack) so the text runs along the
 *     column's HEIGHT instead of its width - 480-560px is plenty for
 *     every category name in full, matching how the reference site's
 *     own collapsed columns behave.
 *  2. Font weight bumped to extrabold on every category name (both
 *     collapsed and open) for a more solid, deliberate look instead
 *     of the thinner semibold before.
 *  3. Each row's arrow now lives in its own circular chip, sits with
 *     more resting distance from the title, and travels further on
 *     hover with a back-out easing curve that overshoots slightly -
 *     a CSS approximation of spring/bounce physics - instead of the
 *     small 2px nudge before. Row corners are rounder (2xl) and the
 *     whole row lifts and scales up a touch on hover for a punchier,
 *     more "alive" feel.
 *
 * Responsive tiers:
 *  - < md (phone): vertical tap accordion.
 *  - md to lg (tablet): the hover rail, header centered, category
 *    description hidden to keep the trimmed panel short.
 *  - lg+ (desktop): the full hover rail, header left-aligned,
 *    category description shown.
 *
 * Props
 *   categories  - the existing `categories` array (unchanged shape)
 *   icons       - category.name -> a component (e.g. a lucide icon),
 *                 NOT a string
 *   defaultOpen - category.name to start open (defaults to the first)
 */

const TRANSITION_MS = 500;
const TRANSITION_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const TRANSITION_LOCK_MS = TRANSITION_MS + 60;
// A "back out" curve - eases in normally, then overshoots past the
// target and settles back - the standard CSS stand-in for a spring.
const SPRING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export default function ExploreAccordion({ categories, icons, defaultOpen }) {
  const [openIndex, setOpenIndex] = useState(() => {
    const i = categories.findIndex((c) => c.name === defaultOpen);
    return i === -1 ? 0 : i;
  });
  const reduceMotion = useReducedMotion();

  const lockedRef = useRef(false);
  const unlockTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(unlockTimerRef.current), []);

  const handleOpen = (i) => {
    if (i === openIndex || lockedRef.current) return;
    lockedRef.current = true;
    setOpenIndex(i);
    clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(
      () => {
        lockedRef.current = false;
      },
      reduceMotion ? 0 : TRANSITION_LOCK_MS
    );
  };

  return (
    <div className="w-full">
      <style>{`
        .explore-rail {
          --gap: 0.5rem;
          --closed: 4rem;
          --open-min: 16rem;
        }
        @media (min-width: 1024px) {
          .explore-rail {
            --gap: 0.75rem;
            --closed: 6.875rem;
            --open-min: 18.75rem;
          }
        }
        .explore-rail > .explore-col {
          flex-basis: var(--closed);
          transition: flex-basis ${TRANSITION_MS}ms ${TRANSITION_EASE},
                      background-color ${TRANSITION_MS}ms ${TRANSITION_EASE};
        }
        .explore-rail > .explore-col.is-open {
          flex-basis: max(
            var(--open-min),
            calc(100% - (var(--count) - 1) * var(--closed) - (var(--count) - 1) * var(--gap))
          );
        }
        }
        /* Tablet tier only: hide the category description so the
           trimmed panel stays short. Scoped to the rail, so the
           phone accordion (a separate element) is never touched. */
        @media (max-width: 1023px) {
          .explore-rail .explore-note {
            display: none;
          }
        }
        /* Vertical label for collapsed columns - runs bottom-to-top,
           along the column's height instead of its width, so long
           names never need truncating. */
        .explore-vlabel {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>

      {/* ---------- TABLET + DESKTOP: hover-to-expand column rail ---------- */}
      <div
        className="explore-rail hidden gap-3 overflow-hidden md:flex md:h-[480px] lg:h-[560px]"
        style={{ "--count": categories.length }}
      >
        {categories.map((category, i) => (
          <AccordionColumn
            key={category.name}
            category={category}
            index={i}
            isOpen={openIndex === i}
            onOpen={() => handleOpen(i)}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {/* ---------- PHONE: vertical tap accordion ---------- */}
      <div className="divide-y divide-slate-700/60 overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0B1220] md:hidden">

        {categories.map((category, i) => (
          <AccordionRow
            key={category.name}
            category={category}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TABLET + DESKTOP COLUMN                                            */
/* ------------------------------------------------------------------ */
function AccordionColumn({ category, index, isOpen, onOpen, reduceMotion }) {
  return (
    <div
      onMouseEnter={onOpen}
      onFocus={onOpen}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      className={`explore-col relative flex h-full min-w-0 flex-none flex-col overflow-hidden rounded-3xl border outline-none ${isOpen
          ? "is-open border-blue-400/50 bg-gradient-to-b from-[#1B3358] to-[#16294A] ring-1 ring-inset ring-blue-400/40"
          : "cursor-pointer border-slate-700/60 bg-[#0F1B2E] hover:bg-[#132238]"
        }`}
    >
      {/* collapsed label - anchored to the bottom with absolute positioning to prevent layout shifts during flex-basis animation. */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-22 px-2"
          >
            <div className="explore-vlabel flex items-center gap-22">
              <span className="font-mono text-lg lg:text-2xl font-bold text-slate-500 slashed-zero">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl lg:text-[1.75rem] font-black tracking-tight text-slate-100">
                {category.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* expanded content - width pinned to the exact calc() value the
          column animates to, so it never reflows mid-transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reduceMotion ? 0 : 0.3,
                ease: "easeOut",
                delay: reduceMotion ? 0 : 0.15,
              },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0 },
            }}
            className="explore-panel flex h-full w-full flex-col px-5 pt-8 sm:px-8"
          >
            <div className="flex items-start gap-3 lg:gap-4">
              <span className="mt-2.5 font-mono text-xs font-bold text-slate-400/80 slashed-zero lg:mt-3.5 lg:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight text-white leading-[1.1]">
                  {category.name}
                </p>
                <p className="text-sm font-medium text-slate-400 mt-2">
                  {category.items.length} algorithms
                </p>
              </div>
            </div>

            {/* description - desktop only; hidden at tablet width via
                the .explore-note media query above */}
            <p className="explore-note mt-5 text-sm leading-6 text-slate-300">
              {category.description}
            </p>

            {/* overflow-hidden (not auto) - a scrollbar must never be
                able to appear here, even in a worst case */}
            <div className="mt-6 flex-1 overflow-hidden">
              {category.items.map(([id, title, difficulty]) => (
                <AlgorithmRow
                  key={id}
                  to={category.path.replace(":algorithm", id)}
                  icon={ALGORITHM_ICONS[id]}
                  title={title}
                  difficulty={difficulty}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ONE ALGORITHM ROW - shared by the desktop/tablet panel and the     */
/*  phone accordion. The arrow sits in its own chip with real         */
/*  breathing room from the title, and springs further out on hover   */
/*  via a back-out easing curve instead of a small linear nudge.      */
/* ------------------------------------------------------------------ */
function AlgorithmRow({ to, icon: Icon, title, difficulty }) {
  return (
    <Link
      to={to}
      className="group/row -mx-3 flex items-center justify-between gap-4 rounded-2xl border-b border-white/10 px-3 py-4 transition-[background-color,transform] duration-300 last:border-b-0 hover:bg-white/[0.05] hover:scale-[1.01]"
      style={{ transitionTimingFunction: SPRING_EASE }}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-400 transition-colors duration-300 group-hover/row:bg-blue-400/10 group-hover/row:text-blue-300">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="truncate font-medium text-slate-200 transition-colors duration-300 group-hover/row:text-white">
          {title}
        </span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${difficulty === "Easy"
              ? "border-blue-400/25 bg-blue-400/10 text-blue-300"
              : difficulty === "Medium"
                ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
                : "border-rose-400/25 bg-rose-400/10 text-rose-300"
            }`}
        >
          {difficulty}
        </span>
      </span>

      {/* arrow chip - deliberately spaced away from the title (not
          flush against it), and on hover it springs further right
          and rotates level, overshooting slightly before settling */}
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-slate-500 transition-colors duration-300 group-hover/row:bg-blue-400/15 group-hover/row:text-blue-300">
        <ArrowUpRight
          size={17}
          strokeWidth={2.4}
          className="transition-transform duration-500 group-hover/row:translate-x-[3px] group-hover/row:rotate-45"
          style={{ transitionTimingFunction: SPRING_EASE }}
        />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  PHONE ROW - "01  Category Name  ⌄", tap to open                    */
/* ------------------------------------------------------------------ */
function AccordionRow({ category, index, isOpen, onToggle, reduceMotion }) {
  const panelId = useId();
  return (
    <div className="bg-[#0F1B2E]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-5 py-5 text-left"
      >
        <span className="font-mono text-sm font-bold text-slate-500 slashed-zero">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-xl sm:text-2xl font-black tracking-tight text-slate-100">
          {category.name}
        </span>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <p className="mb-2 text-sm leading-6 text-slate-400">
                {category.description}
              </p>
              {category.items.map(([id, title, difficulty]) => (
                <AlgorithmRow
                  key={id}
                  to={category.path.replace(":algorithm", id)}
                  icon={ALGORITHM_ICONS[id]}
                  title={title}
                  difficulty={difficulty}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}