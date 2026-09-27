import { useState, useRef, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { ALGORITHM_ICONS } from "./algorithmIcons";

/**
 * ExploreAccordion
 * ------------------------------------------------------------------
 * v3 - two more rounds of fixes on top of v2:
 *
 *  1. The per-algorithm description ("note") is gone, everywhere -
 *     desktop, tablet, and phone. It was the actual root cause of
 *     the scrollbar: four or five two-line rows plus a description
 *     plus a header no longer fit inside a fixed-height panel, so
 *     the list's overflow-y-auto kicked in and drew a scrollbar
 *     (sometimes a visually-confusing horizontal-looking one too,
 *     once the vertical scrollbar's own width squeezed a row enough
 *     to wrap oddly). Rather than trying to detect overflow and
 *     react to it at runtime, the fix is simpler and matches what
 *     was asked for directly: don't render that line at all, on any
 *     tier. Each row is now a single line (icon + title + badge,
 *     arrow on the right), which comfortably fits every category
 *     without scrolling.
 *  2. Because a scrollbar must now never be able to appear even if
 *     some future edit adds more items than fit, the row list uses
 *     overflow-hidden instead of overflow-y-auto - it can clip in a
 *     worst case, but it will never draw a scrollbar.
 *  3. Every row gets its own distinct icon from ALGORITHM_ICONS
 *     (keyed by the same algorithm id already used for its route),
 *     instead of no icon at all. Category icons are now real
 *     components too (passed in via the `icons` prop), not unicode
 *     glyphs, so they render crisply at any size.
 *  4. Row padding increased now that each row is a single line, so
 *     the list doesn't look cramped with all the extra vertical
 *     room the removed note freed up.
 *
 * (v2's fixes - calc()-based flex-basis sizing so the rail can never
 * overflow its container, and the hover-lock that stops two columns
 * flickering at their shared border - are unchanged.)
 *
 * Responsive tiers:
 *  - < md (phone): vertical tap accordion.
 *  - md to lg (tablet): the hover rail, header centered, category
 *    description hidden to keep the trimmed panel short.
 *  - lg+ (desktop): the full hover rail, header left-aligned,
 *    category description shown.
 *
 * Props
 *   categories  - the existing `categories` array (unchanged shape;
 *                 each item's 4th element, the description, is simply
 *                 no longer read)
 *   icons       - category.name -> a component (e.g. a lucide icon),
 *                 NOT a string
 *   defaultOpen - category.name to start open (defaults to the first)
 */

const TRANSITION_MS = 500;
const TRANSITION_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const TRANSITION_LOCK_MS = TRANSITION_MS + 60;

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
        .explore-rail > .explore-col .explore-panel {
          width: max(
            var(--open-min),
            calc(100% - (var(--count) - 1) * var(--closed) - (var(--count) - 1) * var(--gap))
          );
        }
        /* Tablet tier only: hide the category description so the
           trimmed panel stays short. Scoped to the rail, so the
           phone accordion (a separate element) is never touched. */
        @media (max-width: 1023px) {
          .explore-rail .explore-note {
            display: none;
          }
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
            Icon={icons[category.name]}
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
            Icon={icons[category.name]}
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
function AccordionColumn({ category, Icon, index, isOpen, onOpen, reduceMotion }) {
  return (
    <div
      onMouseEnter={onOpen}
      onFocus={onOpen}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      className={`explore-col relative flex h-full min-w-0 flex-none flex-col overflow-hidden rounded-3xl border outline-none ${
        isOpen
          ? "is-open border-blue-400/50 bg-gradient-to-b from-[#1B3358] to-[#16294A] ring-1 ring-inset ring-blue-400/40"
          : "cursor-pointer border-slate-700/60 bg-[#0F1B2E] hover:bg-[#132238]"
      }`}
    >
      {/* collapsed label - centered + stacked at tablet width, an
          inline row at lg+. Only rendered while closed. */}
      {!isOpen && (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-sm font-semibold tracking-tight text-slate-200 lg:flex-row lg:justify-start lg:gap-2 lg:px-5 lg:pt-6 lg:text-left">
          <Icon className="h-5 w-5 shrink-0 text-blue-300 lg:h-[18px] lg:w-[18px]" strokeWidth={2} />
          <span className="max-w-full truncate">{category.name}</span>
        </div>
      )}

      {/* expanded content - width pinned to the exact calc() value the
          column animates to, so it never reflows mid-transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: "easeOut",
              delay: reduceMotion ? 0 : 0.15,
            }}
            className="explore-panel flex h-full flex-none flex-col px-5 pt-6 sm:px-8"
          >
            <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:items-center lg:gap-2.5 lg:text-left">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">
                  {category.name}
                </p>
                <p className="text-xs text-slate-400">
                  {category.items.length} algorithms
                </p>
              </div>
            </div>

            {/* description - desktop only; hidden at tablet width via
                the .explore-note media query above */}
            <p className="explore-note mt-3 max-w-md text-sm leading-6 text-slate-300">
              {category.description}
            </p>

            {/* overflow-hidden (not auto) - a scrollbar must never be
                able to appear here, even in a worst case; without the
                note each category now fits comfortably regardless */}
            <div className="mt-5 flex-1 overflow-hidden">
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

      {/* index number, bottom-left, present in both states */}
      <span className="mt-auto px-5 pb-5 text-center font-mono text-xs text-slate-500 lg:text-left">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ONE ALGORITHM ROW - shared by the desktop/tablet panel and the     */
/*  phone accordion. Single line now: icon, title, difficulty badge,   */
/*  and a diagonal arrow that snaps level and lifts on hover.          */
/* ------------------------------------------------------------------ */
function AlgorithmRow({ to, icon: Icon, title, difficulty }) {
  return (
    <Link
      to={to}
      className="group/row -mx-3 flex items-center justify-between gap-3 rounded-xl border-b border-white/10 px-3 py-4 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.04]"
    >
      <span className="flex min-w-0 items-center gap-3 transition-transform duration-300 group-hover/row:-translate-y-0.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-slate-400 transition-colors duration-300 group-hover/row:bg-blue-400/10 group-hover/row:text-blue-300">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="truncate font-medium text-slate-200 transition-colors duration-300 group-hover/row:text-white">
          {title}
        </span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${
            difficulty === "Easy"
              ? "border-blue-400/25 bg-blue-400/10 text-blue-300"
              : difficulty === "Medium"
              ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
              : "border-rose-400/25 bg-rose-400/10 text-rose-300"
          }`}
        >
          {difficulty}
        </span>
      </span>

      <ArrowUpRight
        size={16}
        strokeWidth={2.2}
        className="shrink-0 text-slate-500 transition-all duration-300 group-hover/row:translate-y-[-2px] group-hover/row:rotate-45 group-hover/row:text-blue-300"
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  PHONE ROW - "01  Category Name  ⌄", tap to open                    */
/* ------------------------------------------------------------------ */
function AccordionRow({ category, Icon, index, isOpen, onToggle, reduceMotion }) {
  const panelId = useId();
  return (
    <div className="bg-[#0F1B2E]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="font-mono text-xs text-slate-500">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Icon className="h-[18px] w-[18px] text-blue-300" strokeWidth={2} />
        <span className="flex-1 text-base font-semibold text-slate-100">
          {category.name}
        </span>
        <ChevronDown
          size={18}
          className={`text-blue-300 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
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