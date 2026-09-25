import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import avlTreeImg1 from "../../../public/images/avl_tree_framed.png";
import nqueen from "../../../public/images/n_queens_framed.png"
import primAlgo from "../../../public/images/prim_algorithm_framed.png"
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * THE THREE STACK IMAGES, back card first, front card last.
 *   1 = AVL tree      (pinned first, sits at the back)
 *   2 = Graph         (Prim's / Kruskal's)
 *   3 = N-Queens      (front card, the one that stays fully visible at the end)
 *
 * TODO: replace each `src` with its own Cloudinary URL (keep f_auto,q_auto,w_2000).
 * Until then all three point at the old image so nothing breaks.
 * The scroll timeline is built for EXACTLY three cards, so keep three entries.
 */


const STACK_IMAGES = [
  { src: avlTreeImg1, alt: "AVL tree visualizer" },
  { src: nqueen, alt:"N-Queens backtracking visualizer"  },
  { src: primAlgo, alt:"Prim's algorithm graph visualizer"  },
];

/* ------------------------------------------------------------------ */
/*  TUNING CONSTANTS                                                   */
/* ------------------------------------------------------------------ */

// How long the stage stays pinned, in viewport heights of scrolling.
const PIN_SCREENS = 3;

// Timeline units (only ratios matter; stretched across PIN_SCREENS).
const T = {
  lead: 0.6, // first image sits pinned alone briefly
  rise: 3, // duration of the 2nd and 3rd card entrances
  gap: 0.8, // pause between card 2 settling and card 3 starting
  tail: 1.2, // final hold on the finished stack before release
};

// Final stack offsets (px) at desktop. Scaled down on tablet/mobile.
const OFFSET_SECOND = 32;
const OFFSET_THIRD = 60;

// Scrub smoothing, in seconds of "catch-up" behind the scroll position.
// 0.8 -> 0.5: noticeably tighter to the wheel, still soft on both directions.
// Raise toward 0.7 for floatier, lower toward 0.3 for more direct.
const SCRUB = 0.5;

// Entrance easing. power1.out starts a little gentler than power2.out did,
// so cards leave and return without an abrupt kick in either direction.
const RISE_EASE = "power1.out";

/* ------------------------------------------------------------------ */
/*  PER-CARD BOTTOM DISSOLVE                                           */
/*  Each card's image fades into the page background near its bottom   */
/*  edge (mask) and is reinforced by a solid-color gradient overlay.   */
/*  Cards 1 & 2 (AVL, Graph) sit further back / disappear behind the   */
/*  next card anyway, so they only need a light dissolve to keep as    */
/*  much of the screenshot legible as possible. Card 3 (N-Queens) is   */
/*  the one left on screen at the end, so it must stay fully solid     */
/*  across almost its whole height and only dissolve in a thin strip   */
/*  right at the bottom edge, so it reads as one card merging into     */
/*  the page rather than a half-transparent screenshot.                */
/*    start = % of card height that stays fully opaque                 */
/*    end   = % of card height where it becomes fully transparent      */
/*  Tune these two numbers per card to trade "shadow" for "visibility".*/
/* ------------------------------------------------------------------ */
const DISSOLVE = [
  { start: 84, end: 98, overlay: "16%" }, // card 1 - AVL tree (back): light fade, keep content visible
  { start: 82, end: 97, overlay: "20%" }, // card 2 - Graph: light fade, keep content visible
  { start: 88, end: 99, overlay: "18%" }, // card 3 - N-Queens (front): solid everywhere, dissolve only right at the bottom edge
];

/* ------------------------------------------------------------------ */
/*  CARD SHAPE                                                         */
/*  Percentages are of the card box width. [left, right] x-positions.  */
/*  The right side (80% top / 95% bottom) is unchanged from the        */
/*  previous version. The left edge moved outward (20% -> 9% at the    */
/*  top, 26% -> 14% at the bottom) with the same slight inward lean.   */
/*  radius = corner rounding in px.                                    */
/* ------------------------------------------------------------------ */
const SHAPES = {
  desktop: { top: [9, 80], bottom: [14, 95], radius: 22 },
  compact: { top: [9, 84], bottom: [15, 96], radius: 18 }, // <= 768px
  phone: { top: [5, 90], bottom: [12, 96], radius: 14 }, // <= 480px
};

function getShape() {
  const w = window.innerWidth;
  if (w <= 480) return SHAPES.phone;
  if (w <= 768) return SHAPES.compact;
  return SHAPES.desktop;
}

/**
 * Builds an SVG path for a polygon with every corner rounded by `radius` px.
 * A plain CSS border-radius can't do this: the trapezoid's corners are cut by
 * clip-path, so the box's own corners are never visible. We round the actual
 * polygon vertices instead (tangent points + circular arcs), and use that
 * path for the clip, the soft shadow and the rim highlight, so they all match.
 * Points must be in clockwise order (top-left, top-right, bottom-right,
 * bottom-left).
 */
function roundedPolygonPath(points, radius) {
  const n = points.length;
  const f = (v) => v.toFixed(2);

  const corners = points.map((p, i) => {
    const prev = points[(i + n - 1) % n];
    const next = points[(i + 1) % n];
    const v1x = prev[0] - p[0];
    const v1y = prev[1] - p[1];
    const v2x = next[0] - p[0];
    const v2y = next[1] - p[1];
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    const u1x = v1x / l1;
    const u1y = v1y / l1;
    const u2x = v2x / l2;
    const u2y = v2y / l2;

    const cos = Math.min(1, Math.max(-1, u1x * u2x + u1y * u2y));
    const tan = Math.tan(Math.acos(cos) / 2);
    const d = Math.min(radius / tan, l1 / 2, l2 / 2); // tangent distance
    const r = d * tan; // actual arc radius after clamping

    return {
      a: [p[0] + u1x * d, p[1] + u1y * d], // where the arc starts
      b: [p[0] + u2x * d, p[1] + u2y * d], // where the arc ends
      r,
      sweep: u1x * u2y - u1y * u2x < 0 ? 1 : 0,
    };
  });

  const arc = (c) => `A ${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.b[0])} ${f(c.b[1])}`;

  let d = `M ${f(corners[0].b[0])} ${f(corners[0].b[1])}`;
  for (let i = 1; i < n; i++) {
    d += ` L ${f(corners[i].a[0])} ${f(corners[i].a[1])} ${arc(corners[i])}`;
  }
  d += ` L ${f(corners[0].a[0])} ${f(corners[0].a[1])} ${arc(corners[0])} Z`;
  return d;
}

/* ------------------------------------------------------------------ */
/*  3D TREATMENT                                                       */
/*  - .frame-tilt : rotateX tilt with perspective() in the transform   */
/*  The bottom-edge dissolve (mask) used to be one shared .frame-fade  */
/*  class; it's now applied inline per card from DISSOLVE above, so    */
/*  each of the three images can fade at a different point.            */
/*  The trapezoid clip-path is applied from JS (see SHAPES above).     */
/* ------------------------------------------------------------------ */
const frameStyles = `
  .frame-tilt {
    transform: perspective(1800px) rotateX(8deg);
    transform-origin: top center;
  }
  @media (max-width: 768px) {
    .frame-tilt { transform: perspective(1100px) rotateX(6deg); }
  }
  @media (max-width: 480px) {
    .frame-tilt { transform: perspective(800px) rotateX(5deg); }
  }
`;

/**
 * ScrollImageStack
 *
 * Same architecture as before (GSAP ScrollTrigger only):
 *   1. Pre-pin trigger: card 1 rises as the intro scrolls out.
 *   2. Pinned, scrubbed timeline: card 2, hold, card 3, hold, release.
 * Everything is driven by scroll position, so scrolling up simply plays the
 * same timeline backwards. There are no separate reverse animations.
 *
 * Cards are centered with inset-x-0 + mx-auto (no translate classes), so
 * GSAP owns each card's transform.
 */
export default function ScrollImageStack() {
  const introRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  /* ---- Rounded trapezoid: recompute the path whenever a card resizes ---- */
  useLayoutEffect(() => {
    const cleanups = cardRefs.current.filter(Boolean).map((card) => {
      const frame = card.querySelector("[data-frame]");
      const shape = card.querySelector("[data-shape]");
      const outlines = card.querySelectorAll("[data-outline]");
      if (!frame || !shape) return () => {};

      const apply = () => {
        // offsetWidth/Height are layout sizes, unaffected by the 3D tilt.
        const w = frame.offsetWidth;
        const h = frame.offsetHeight;
        if (!w || !h) return;
        const s = getShape();
        const d = roundedPolygonPath(
          [
            [(w * s.top[0]) / 100, 0],
            [(w * s.top[1]) / 100, 0],
            [(w * s.bottom[1]) / 100, h],
            [(w * s.bottom[0]) / 100, h],
          ],
          s.radius
        );
        shape.style.clipPath = `path("${d}")`;
        shape.style.webkitClipPath = `path("${d}")`;
        outlines.forEach((p) => p.setAttribute("d", d));
      };

      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(frame);
      return () => ro.disconnect();
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  /* ---- Scroll choreography ---- */
  useLayoutEffect(() => {
    const intro = introRef.current;
    const stage = stageRef.current;
    const [c1, c2, c3] = cardRefs.current;
    if (!intro || !stage || !c1 || !c2 || !c3) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 640px) and (max-width: 1023px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { desktop, tablet, reduceMotion } = ctx.conditions;

        const k = desktop ? 1 : tablet ? 0.7 : 0.4;
        const o2 = { x: OFFSET_SECOND * k, y: OFFSET_SECOND * k };
        const o3 = { x: OFFSET_THIRD * k, y: OFFSET_THIRD * k };

        if (reduceMotion) {
          gsap.set(c1, { y: 0, opacity: 1, scale: 1 });
          gsap.set(c2, { x: o2.x, y: o2.y, opacity: 1, scale: 1 });
          gsap.set(c3, { x: o3.x, y: o3.y, opacity: 1, scale: 1 });
          return undefined;
        }

        /* 1. PRE-PIN: first image rises as the intro scrolls out */
        gsap.fromTo(
          c1,
          { y: () => window.innerHeight * 0.16, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: RISE_EASE,
            force3D: true, // stay on the GPU layer; avoids a 3D->2D swap "hop" at the end
            scrollTrigger: {
              trigger: intro,
              start: "bottom 92%",
              end: "bottom top",
              scrub: SCRUB,
              invalidateOnRefresh: true,
            },
          }
        );

        /* 2. PINNED TIMELINE: card 2 then card 3 */
        const t2 = T.lead;
        const t3 = t2 + T.rise + T.gap;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${window.innerHeight * PIN_SCREENS}`,
              pin: true,
              scrub: SCRUB,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            c2,
            { y: () => window.innerHeight, x: o2.x * 0.4, scale: 0.94 },
            { y: o2.y, x: o2.x, scale: 1, duration: T.rise, ease: RISE_EASE, force3D: true },
            t2
          )
          .fromTo(
            c3,
            { y: () => window.innerHeight, x: o3.x * 0.4, scale: 0.94 },
            { y: o3.y, x: o3.x, scale: 1, duration: T.rise, ease: RISE_EASE, force3D: true },
            t3
          )
          .to({}, { duration: T.tail }, t3 + T.rise);

        return undefined;
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div className="relative bg-[#0F172B]">
      <style>{frameStyles}</style>

      {/* INTRO: normal page content */}
      <div
        ref={introRef}
        className="min-h-[80svh] flex flex-col items-center justify-center text-center px-6 pt-24"
      >
        <h1 className="text-white text-4xl md:text-6xl font-semibold max-w-3xl">
          See Data Structures &amp; Algorithms in Motion
        </h1>
        <p className="text-white/60 mt-4 max-w-xl">
          Step through trees, graphs, sorting and backtracking with
          interactive visualizations that make every concept click.
        </p>
      </div>

      {/* STAGE: the element that gets pinned. overflow-hidden prevents any
          horizontal scrollbar from the wide 3D shape. */}
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* ambient glow (static) */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[90%] max-w-5xl h-[60%] bg-blue-500/10 blur-[110px] rounded-full"
        />

        {STACK_IMAGES.map((image, i) => {
          const fade = DISSOLVE[i] ?? DISSOLVE[DISSOLVE.length - 1];
          const maskImage = `linear-gradient(to bottom, black 0%, black ${fade.start}%, transparent ${fade.end}%)`;

          return (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              /* Card box = full stage width (capped only on ultrawide). Height is
                 svh-based: 70svh desktop / 54svh tablet / 42svh phone. */
              className="absolute inset-x-0 mx-auto w-full max-w-[2200px] max-h-[1000px]
                         h-[42svh] sm:h-[54svh] lg:h-[70svh]
                         top-[22svh] sm:top-[18svh] lg:top-[14svh]"
              style={{ zIndex: (i + 1) * 10, willChange: "transform" }}
            >
              <div
                data-frame
                className="frame-tilt relative w-full h-full"
                style={{
                  WebkitMaskImage: maskImage,
                  maskImage: maskImage,
                }}
              >
                {/* SOFT SHADOW: follows the rounded shape. Lives in the card's own
                    layer, so it is painted once and only the layer moves while
                    scrolling (cheaper than a CSS filter on an animated element).
                    Also gives each newer card a soft edge against the one below. */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                >
                  <defs>
                    <filter
                      id={`stack-shadow-${i}`}
                      x="-15%"
                      y="-15%"
                      width="130%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="22" />
                    </filter>
                  </defs>
                  <path
                    data-outline
                    fill="rgba(2,6,24,0.6)"
                    filter={`url(#stack-shadow-${i})`}
                    transform="translate(0 26)"
                  />
                </svg>

                {/* IMAGE: clipped to the rounded trapezoid (clip-path set from JS) */}
                <div data-shape className="absolute inset-0 overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
                    draggable="false"
                    decoding="async"
                  />
                  {/* solid-color blend so the bottom edge dissolves into the
                      background; height is tuned per card in DISSOLVE above. */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0
                               bg-gradient-to-b from-transparent via-[#0F172B]/50 to-[#0F172B] blur-sm"
                    style={{ height: fade.overlay }}
                  />
                </div>

                {/* RIM: hairline highlight along the rounded edge, brightest at
                    the top and fading out with the image. */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id={`stack-rim-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
                      <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.07" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    data-outline
                    fill="none"
                    stroke={`url(#stack-rim-${i})`}
                    strokeWidth="1.25"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}