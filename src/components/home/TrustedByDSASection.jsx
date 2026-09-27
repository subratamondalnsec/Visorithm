import React, { useMemo } from "react";
import MarqueeTrack from "./MarqueeTrack";
import { useScrollBoost } from "./useScrollBoost";
import { ALGORITHM_ICONS } from "./algorithmIcons";

/**
 * Fallback topics, used only if this component is ever rendered without a
 * `categories` prop. Keeps the component safe to preview on its own.
 */
const DEFAULT_TOPICS = [
  { label: "Sorting Algorithms" },
  { label: "Graph Traversal" },
  { label: "Tree Structures" },
  { label: "Dynamic Programming" },
  { label: "Greedy Algorithms" },
  { label: "Searching" },
];

/**
 * Maps each HomeRedesign category name... see algorithmIcons.js - kept
 * here as a thin adapter so topics carry an Icon component per algorithm.
 */
function topicsFromCategories(categories) {
  const topics = [];
  categories.forEach((category) => {
    category.items.forEach(([id, title]) => {
      topics.push({ label: title, Icon: ALGORITHM_ICONS[id] });
    });
  });
  return topics;
}

/**
 * Splits a flat list into 2 buckets (row A, row B) round-robin, the same
 * way the reference site splits its logos into two non-overlapping
 * tracks - so the two rows never show the same card at the same time.
 */
function splitIntoTwo(list) {
  const out = [[], []];
  list.forEach((item, i) => out[i % 2].push(item));
  return out;
}

/**
 * The section's own background color. The fade-patch below is built from
 * this exact value so the patch reads as "part of the page," not a box
 * pasted on top - keep this in sync with the section's bg-[...] class.
 */
const SECTION_BG = "#0F172B";

/**
 * TrustedByDSASection
 *
 * Two continuous, full-width marquee rows (top drifts left, bottom drifts
 * right). On tablet and up, the heading sits centered on top of both rows
 * inside a horizontal fade-gradient patch - transparent at its own left
 * and right edges, solid (matching the section's background) in the
 * middle - so it visually covers whatever cards happen to be scrolling
 * underneath at any moment, the same technique the reference site uses
 * (`linear-gradient(90deg, transparent, bg 15%, bg 85%, transparent)`
 * inspected from its markup) rather than a blurred box or an oval glow.
 *
 * On mobile only, the heading moves out of the overlay and into normal
 * document flow ABOVE the two rows (matching the provided phone
 * screenshot), and the rows themselves need no fade-patch since nothing
 * overlaps them anymore - just two plain full-width marquees stacked
 * under the heading. Tablet and desktop are unchanged from each other;
 * only the sm: breakpoint switches behavior.
 *
 * Pass in the SAME `categories` array HomeRedesign already defines at the
 * top of the file:
 *
 *   <TrustedByDSASection categories={categories} />
 */
export default function TrustedByDSASection({ categories }) {
  const boostRef = useScrollBoost();

  const topics = useMemo(
    () => (categories ? topicsFromCategories(categories) : DEFAULT_TOPICS),
    [categories]
  );

  const [rowA, rowB] = useMemo(() => splitIntoTwo(topics), [topics]);

  const heading = (
    <>
      <span className="block text-4xl leading-[1.05] sm:text-6xl">
        The Right Place
      </span>
      <span className="mt-1 block text-3xl leading-[1.05] sm:text-5xl">
        to Visualize DSA.
      </span>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-[#0F172B] py-16 sm:py-28">
      {/* MOBILE ONLY: heading in normal flow, above the marquee rows -
          no fade-patch needed since nothing overlaps it here. */}
      <div className="relative z-10 px-6 pb-8 text-center sm:hidden">
        <h2 className="font-bold tracking-tight text-white">{heading}</h2>
        <p className="mt-3 text-xs text-white/60">
           If you're here to learn and master DSA, <br/> you're in the right place.
        </p>
      </div>

      <div className="relative">
        {/* TABLET+ ONLY: heading overlaid on top of both rows, sitting
            inside the fade-gradient patch. */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center px-6 sm:flex">
          <div
            className="w-full max-w-md py-10 text-center sm:max-w-lg sm:py-12 lg:max-w-2xl"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 0%, ${SECTION_BG} 18%, ${SECTION_BG} 82%, transparent 100%)`,
            }}
          >
            <h2 className="font-bold tracking-tight text-white">{heading}</h2>
            <p className="mt-4 text-sm text-white/60 font-medium">
              If you're here to learn and master DSA, <br/> you're in the right place.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:gap-7">
          <MarqueeTrack items={rowA} direction="left" boostRef={boostRef} />
          <MarqueeTrack items={rowB} direction="right" boostRef={boostRef} />
        </div>
      </div>
    </section>
  );
}