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
          --gap: 0.375rem;
          --closed: 3.125rem;
          --open-min: 12.5rem;
        }
        @media (min-width: 768px) {
          .explore-rail {
            --gap: 0.5rem;
            --closed: 3.5rem;
            --open-min: 14rem;
          }
        }
        @media (min-width: 1024px) {
          .explore-rail {
            --gap: 0.5rem;
            --closed: 4.5rem;
            --open-min: 18rem;
          }
        }
        @media (min-width: 1280px) {
          .explore-rail {
            --gap: 0.625rem;
            --closed: 5.25rem;
            --open-min: 20rem;
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
        @media (min-width: 680px) and (max-width: 767px) {
          .explore-rail .algo-icon,
          .explore-rail .algo-arrow {
            display: none !important;
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
        className="explore-rail hidden gap-[var(--gap)] overflow-hidden min-[680px]:flex min-[680px]:h-[500px] lg:h-[580px]"
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
      <div className="divide-y divide-slate-700/60 overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0B1220] min-[680px]:hidden">

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
            className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 lg:pb-16 px-1 sm:px-2"
          >
            <div className="explore-vlabel flex items-center gap-6 sm:gap-10 lg:gap-14">
              <span className="font-mono text-sm sm:text-base lg:text-xl font-bold text-slate-500 slashed-zero">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-black tracking-tight text-slate-100">
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
            className="explore-panel flex h-full w-full flex-col px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8"
          >
            <div className="flex items-start gap-3 lg:gap-4">
              <span className="mt-2 font-mono text-xs font-bold text-slate-400/80 slashed-zero lg:mt-3 lg:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.1]">
                  {category.name}
                </p>
                <p className="hidden lg:block text-xs sm:text-sm font-medium text-slate-400 mt-1.5">
                  {category.items.length} algorithms
                </p>
              </div>
            </div>

            {/* description - desktop only; hidden at tablet width via
                the .explore-note media query above */}
            <p className="explore-note hidden lg:block mt-3 text-xs sm:text-sm leading-relaxed text-slate-300 line-clamp-2">
              {category.description}
            </p>

            {/* overflow-hidden (not auto) - a scrollbar must never be
                able to appear here, even in a worst case */}
            <div className="mt-4 sm:mt-5 flex flex-1 flex-col gap-1.5 overflow-hidden">
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
  const IconComponent = Icon || ArrowUpRight;
  return (
    <Link
      to={to}
      className="group/row flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-transparent border-b-white/10 px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-300 hover:border-blue-500/20 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-0.5"
      style={{ transitionTimingFunction: SPRING_EASE }}
    >
      <span className="flex min-w-0 items-center gap-2.5 sm:gap-4">
        <span className="algo-icon grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 shadow-inner transition-all duration-300 group-hover/row:bg-blue-500/20 group-hover/row:border-blue-500/30 group-hover/row:text-blue-300 group-hover/row:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <IconComponent className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="truncate font-semibold text-xs sm:text-sm lg:text-base text-slate-300 transition-colors duration-300 group-hover/row:text-white">
          {title}
        </span>
        <span
          className={`hidden min-[900px]:block shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-all duration-300 ${
            difficulty === "Easy"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover/row:border-emerald-500/30 group-hover/row:bg-emerald-500/15 group-hover/row:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              : difficulty === "Medium"
                ? "border-amber-500/20 bg-amber-500/10 text-amber-400 group-hover/row:border-amber-500/30 group-hover/row:bg-amber-500/15 group-hover/row:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400 group-hover/row:border-rose-500/30 group-hover/row:bg-rose-500/15 group-hover/row:shadow-[0_0_12px_rgba(244,63,94,0.2)]"
          }`}
        >
          {difficulty}
        </span>
      </span>

      {/* arrow chip */}
      <span className="algo-arrow grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full bg-slate-800/40 text-slate-500 transition-all duration-300 group-hover/row:bg-blue-500 group-hover/row:text-white group-hover/row:shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
        <ArrowUpRight
          size={15}
          strokeWidth={2.5}
          className="transition-transform duration-500 group-hover/row:translate-x-[3px] group-hover/row:rotate-45 group-hover/row:scale-110"
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
            <div className="flex flex-col gap-1.5 px-5 pb-4">
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