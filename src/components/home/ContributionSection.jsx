import React, { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

/**
 * Responsive bezier path data for the curved connector arrow following the green route:
 * - Begins around the LEFT / MIDDLE-SIDE of the circular icon
 * - Curves significantly outward toward the left into open whitespace (broad elegant C-curve)
 * - Swoops back inward toward the next step
 * - Levels off horizontally pointing directly into the middle-left / equator of the next icon
 * - Finishes with a clean ~7-8px visual gap before the perimeter.
 */
const DESKTOP_CONNECTOR_PATH = "M -4 8 C -22 24, -24 58, -8 78 C 3.2 94, 20 98, 32 98 L 43 98";
const TABLET_CONNECTOR_PATH = "M -4 8 C -18 24, -20 58, -6 78 C 2 94, 14 98, 22 98 L 28 98";
const MOBILE_CONNECTOR_PATH = "M -4 8 C -14 24, -16 58, -6 78 C -1 94, 4 98, 6 98 L 9 98";

export default function ContributionSection() {
  const sectionRef = useRef(null);

  // Stage element refs
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);
  const raysRef = useRef(null);

  // Connector 1 (01 -> 02) refs
  const path1Ref = useRef(null);
  const arrow1Ref = useRef(null);
  const track1Ref = useRef(null);

  // Connector 2 (02 -> 03) refs
  const path2Ref = useRef(null);
  const arrow2Ref = useRef(null);
  const track2Ref = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const stage1 = stage1Ref.current;
    const stage2 = stage2Ref.current;
    const stage3 = stage3Ref.current;
    const rays = raysRef.current;
    const path1 = path1Ref.current;
    const arrow1 = arrow1Ref.current;
    const track1 = track1Ref.current;
    const path2 = path2Ref.current;
    const arrow2 = arrow2Ref.current;
    const track2 = track2Ref.current;

    if (!stage1 || !stage2 || !stage3 || !path1 || !arrow1 || !path2 || !arrow2) {
      return undefined;
    }

    // Default initial calculations from desktop path
    const initialRawPath = MotionPathPlugin.stringToRawPath(DESKTOP_CONNECTOR_PATH);
    const initialStartPos = MotionPathPlugin.getPositionOnPath(initialRawPath, 0, true);

    // Explicitly set initial arrowhead positions immediately to guarantee deterministic initial state
    arrow1.setAttribute(
      "transform",
      `translate(${initialStartPos.x}, ${initialStartPos.y}) rotate(${initialStartPos.angle})`
    );
    arrow2.setAttribute(
      "transform",
      `translate(${initialStartPos.x}, ${initialStartPos.y}) rotate(${initialStartPos.angle})`
    );

    // Scoped GSAP context to ensure refresh safety and zero duplicate triggers
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 640px) and (max-width: 1023px)",
          mobile: "(max-width: 639px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (matchMediaCtx) => {
          const { desktop, tablet, reduceMotion } = matchMediaCtx.conditions;
          const currentPath = desktop
            ? DESKTOP_CONNECTOR_PATH
            : tablet
            ? TABLET_CONNECTOR_PATH
            : MOBILE_CONNECTOR_PATH;

          path1.setAttribute("d", currentPath);
          track1.setAttribute("d", currentPath);
          path2.setAttribute("d", currentPath);
          track2.setAttribute("d", currentPath);

          const rawPath = MotionPathPlugin.stringToRawPath(currentPath);
          const startPos = MotionPathPlugin.getPositionOnPath(rawPath, 0, true);
          const endPos = MotionPathPlugin.getPositionOnPath(rawPath, 1, true);

          if (reduceMotion) {
            // Accessible presentation for users who prefer reduced motion
            gsap.set([stage1, stage2, stage3], { opacity: 1, y: 0, pointerEvents: "auto" });
            if (rays) gsap.set(rays, { opacity: 1 });
            gsap.set([path1, path2], { strokeDashoffset: 0 });
            gsap.set([arrow1, arrow2], { opacity: 1 });
            gsap.set([track1, track2], { opacity: 0.35 });
            arrow1.setAttribute(
              "transform",
              `translate(${endPos.x}, ${endPos.y}) rotate(${endPos.angle})`
            );
            arrow2.setAttribute(
              "transform",
              `translate(${endPos.x}, ${endPos.y}) rotate(${endPos.angle})`
            );
            return undefined;
          }

          // Deterministic initial state before ScrollTrigger binds
          gsap.set(stage1, { opacity: 1, y: 0 });
          gsap.set(stage2, { opacity: 0, y: 22, pointerEvents: "none" });
          gsap.set(stage3, { opacity: 0, y: 22, pointerEvents: "none" });
          if (rays) gsap.set(rays, { opacity: 0 });

          gsap.set([path1, path2], { strokeDashoffset: 100 });
          gsap.set(track1, { opacity: 0.35 });
          gsap.set(track2, { opacity: 0 });
          gsap.set([arrow1, arrow2], { opacity: 0 });
          arrow1.setAttribute(
            "transform",
            `translate(${startPos.x}, ${startPos.y}) rotate(${startPos.angle})`
          );
          arrow2.setAttribute(
            "transform",
            `translate(${startPos.x}, ${startPos.y}) rotate(${startPos.angle})`
          );

          const progress1 = { val: 0 };
          const progress2 = { val: 0 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => {
                const h = window.innerHeight;
                const w = window.innerWidth;
                const multiplier = w >= 1024 ? 1.8 : w >= 640 ? 1.6 : 1.4;
                return `+=${Math.round(h * multiplier)}`;
              },
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 1. Initial dwell: Stage 01 alone
          tl.addLabel("start", 0);

          // 2. SCROLL PHASE 1 (01 -> 02): Connector 1 draws progressively along curve
          tl.to(
            progress1,
            {
              val: 1,
              duration: 1.0,
              ease: "none",
              onUpdate: () => {
                const p = progress1.val;
                path1.style.strokeDashoffset = (1 - p) * 100;
                const pos = MotionPathPlugin.getPositionOnPath(rawPath, p, true);
                arrow1.setAttribute(
                  "transform",
                  `translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`
                );
                arrow1.style.opacity = p > 0.03 ? 1 : 0;
              },
            },
            0.2
          );

          // 3. Stage 02 subtle reveal as Connector 1 approaches its middle-side
          tl.to(
            stage2,
            {
              opacity: 1,
              y: 0,
              pointerEvents: "auto",
              duration: 0.35,
              ease: "power2.out",
            },
            1.15
          );

          // 4. Reveal Connector 2 guide track as Stage 02 settles
          tl.to(track2, { opacity: 0.35, duration: 0.15 }, 1.55);

          // 5. SCROLL PHASE 2 (02 -> 03): Connector 2 draws progressively along curve
          tl.to(
            progress2,
            {
              val: 1,
              duration: 1.0,
              ease: "none",
              onUpdate: () => {
                const p = progress2.val;
                path2.style.strokeDashoffset = (1 - p) * 100;
                const pos = MotionPathPlugin.getPositionOnPath(rawPath, p, true);
                arrow2.setAttribute(
                  "transform",
                  `translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`
                );
                arrow2.style.opacity = p > 0.03 ? 1 : 0;
              },
            },
            1.7
          );

          // 6. Stage 03 subtle reveal as Connector 2 approaches its middle-side
          tl.to(
            stage3,
            {
              opacity: 1,
              y: 0,
              pointerEvents: "auto",
              duration: 0.35,
              ease: "power2.out",
            },
            2.65
          );

          // 7. Decorative sketch marks in lower-right reveal with Stage 03
          if (rays) {
            tl.to(rays, { opacity: 1, duration: 0.3, ease: "power2.out" }, 2.75);
          }

          // 8. Final hold on completed composition before naturally unpinning
          tl.to({}, { duration: 0.3 }, 3.0);
        }
      );
    }, section);

    // Refresh ScrollTrigger to ensure deterministic pin placement
    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contribute"
      aria-label="Contribute to Visorithm"
      className="relative w-full min-h-screen flex flex-col justify-center bg-[#0F172B] px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 overflow-hidden"
    >
      {/* Ensure Caveat font is loaded */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-14 lg:items-center">
          {/* ================= LEFT COLUMN: 100% UNTOUCHED ================= */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Section label: small editorial-label character */}
            <div className="flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-sky-400/90">
                Contribute to Visorithm
              </span>
            </div>

            {/* Main heading: dominant, premium hierarchy with Visorithm signature accent */}
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-black tracking-[-0.03em] text-white leading-[1.06]">
              Help Shape <br />
              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                Visorithm
              </span>
            </h2>

            {/* Supporting paragraph: high readability against dark canvas */}
            <p className="mt-5 sm:mt-6 max-w-lg text-base sm:text-lg lg:text-[19px] leading-relaxed text-slate-300 font-normal">
              Your ideas can make DSA learning more visual, interactive and effective.
            </p>

            {/* Primary CTA: High contrast pure white text & arrow */}
            <div className="mt-8 sm:mt-10">
              <a
                href="https://github.com/subratamondalnsec/Visorithm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suggest or contribute to Visorithm on GitHub"
                style={{ color: "#ffffff" }}
                className="group relative inline-flex h-12 w-full sm:w-auto select-none items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/90 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 px-7 text-sm font-semibold !text-white shadow-[0_8px_24px_rgba(14,165,233,0.22),0_4px_0_rgba(29,78,216,0.42),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 ease-out hover:brightness-[1.06] hover:shadow-[0_12px_30px_rgba(14,165,233,0.3),0_5px_0_rgba(29,78,216,0.46),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/25 to-transparent opacity-90"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 top-0 h-full w-16 -skew-x-12 bg-white/15 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[340px]"
                />
                <span
                  className="relative z-10 flex items-center gap-2 font-semibold !text-white"
                  style={{ color: "#ffffff" }}
                >
                  <span className="tracking-wider text-white" style={{ color: "#ffffff" }}>
                    SUGGEST / CONTRIBUTE
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: "#ffffff" }}
                  />
                </span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Refined Positioning, Spacing & Connectors ================= */}
          <div className="lg:col-span-6 xl:col-span-6 relative pt-2 sm:pt-4 pb-4">
            {/* HANDWRITTEN NOTE: Completely separated in upper-right whitespace */}
            <div className="absolute -top-1 sm:-top-1.5 lg:-top-2 xl:-top-2 right-0 sm:right-1 lg:right-2 xl:right-3 z-20 pointer-events-none select-none transform -rotate-2 lg:-rotate-4">
              <div
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-2xl sm:text-[27px] lg:text-[29px] text-slate-100 font-bold leading-[1.12] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              >
                Let's make <br />
                DSA learning <br />
                better, together!
              </div>
              {/* Hand-drawn curved arrow pointing diagonally down-left into the empty whitespace */}
              <svg
                viewBox="0 0 65 42"
                className="w-13 sm:w-15 h-8 sm:h-9 overflow-visible mt-2 ml-4 text-slate-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
                fill="none"
              >
                <path
                  d="M 48 4 C 42 16, 26 26, 6 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 12 17 L 4 24 L 11 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* STAGES JOURNEY TRACK (NO RECTANGULAR CARDS - direct on canvas) */}
            <div className="relative flex flex-col w-full">
              {/* ================= STAGE 01: generous vertical separation from note ================= */}
              <div
                ref={stage1Ref}
                data-stage="01"
                className="relative z-10 flex items-start gap-4 sm:gap-5 mt-10 sm:mt-12 lg:mt-14"
              >
                {/* Circular badge container */}
                <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-b from-white via-[#FFFDF5] to-[#FEF3C7] shadow-[0_10px_28px_rgba(245,158,11,0.25),0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-amber-200/80">
                  {/* Lightbulb SVG */}
                  <svg viewBox="0 0 28 32" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
                    <path
                      d="M 14 3 C 8.48 3 4 7.48 4 13 C 4 16.85 6.18 20.2 9.5 21.85 L 9.5 24 C 9.5 24.55 9.95 25 10.5 25 L 17.5 25 C 18.05 25 18.5 24.55 18.5 24 L 18.5 21.85 C 21.82 20.2 24 16.85 24 13 C 24 7.48 19.52 3 14 3 Z"
                      fill="url(#bulb-grad)"
                    />
                    <path
                      d="M 10 26 L 18 26 M 11 28 L 17 28 M 12.5 30 L 15.5 30"
                      stroke="#0F172A"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="bulb-grad" x1="14" y1="3" x2="14" y2="25" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Step number badge at 1 o'clock */}
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 font-mono text-xs sm:text-sm font-bold text-slate-300">
                    01
                  </span>
                </div>

                {/* Text container */}
                <div className="flex flex-col pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    Suggest a new algorithm
                  </h3>
                  <p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-slate-400 max-w-[240px] sm:max-w-[260px]">
                    Have an algorithm in mind? Let us know.
                  </p>
                </div>
              </div>

              {/* ================= CONNECTOR 1 (01 -> 02): Middle-Side to Middle-Side through Whitespace ================= */}
              <div
                data-connector="01-02"
                aria-hidden="true"
                className="relative w-full h-24 sm:h-28 lg:h-32 -my-6 sm:-my-7 pointer-events-none z-0"
              >
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 sm:w-36 lg:w-40 h-24 sm:h-28 lg:h-32 overflow-visible"
                >
                  {/* Faint dashed trajectory guide - always visible on fresh load */}
                  <path
                    ref={track1Ref}
                    d={DESKTOP_CONNECTOR_PATH}
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ opacity: 0.35 }}
                  />

                  {/* Active glowing path - direct strokeDashoffset animation for 100% deterministic rendering */}
                  <path
                    ref={path1Ref}
                    d={DESKTOP_CONNECTOR_PATH}
                    stroke="#38BDF8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    pathLength="100"
                    strokeDasharray="100"
                    style={{ strokeDashoffset: 100 }}
                    className="drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]"
                  />

                  {/* Directional arrowhead traveling along curve */}
                  <g ref={arrow1Ref} className="pointer-events-none" style={{ opacity: 0 }}>
                    <path
                      d="M -6 -4.5 L 1 0 L -6 4.5"
                      stroke="#38BDF8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className="drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]"
                    />
                  </g>
                </svg>
              </div>

              {/* ================= STAGE 02 ================= */}
              <div
                ref={stage2Ref}
                data-stage="02"
                style={{ opacity: 0, transform: "translateY(22px)", pointerEvents: "none" }}
                className="relative z-10 flex items-start gap-4 sm:gap-5 ml-8 sm:ml-14 lg:ml-20"
              >
                {/* Circular badge container */}
                <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-b from-white via-[#F0F9FF] to-[#E0F2FE] shadow-[0_10px_28px_rgba(56,189,248,0.25),0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-sky-200/80">
                  {/* Bar Chart SVG */}
                  <svg viewBox="0 0 28 28" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
                    <defs>
                      <linearGradient id="bars-grad" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                    <rect x="3" y="14" width="5" height="11" rx="2.5" fill="url(#bars-grad)" />
                    <rect x="11.5" y="8" width="5" height="17" rx="2.5" fill="url(#bars-grad)" />
                    <rect x="20" y="3" width="5" height="22" rx="2.5" fill="url(#bars-grad)" />
                  </svg>
                  {/* Step number badge at 1 o'clock */}
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 font-mono text-xs sm:text-sm font-bold text-slate-300">
                    02
                  </span>
                </div>

                {/* Text container */}
                <div className="flex flex-col pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    Improve an existing visualization
                  </h3>
                  <p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-slate-400 max-w-[250px] sm:max-w-xs">
                    See something that could be better? Let us know.
                  </p>
                </div>
              </div>

              {/* ================= CONNECTOR 2 (02 -> 03): Middle-Side to Middle-Side through Whitespace ================= */}
              <div
                data-connector="02-03"
                aria-hidden="true"
                className="relative w-full h-24 sm:h-28 lg:h-32 -my-6 sm:-my-7 pointer-events-none z-0 ml-8 sm:ml-14 lg:ml-20"
              >
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 sm:w-36 lg:w-40 h-24 sm:h-28 lg:h-32 overflow-visible"
                >
                  {/* Faint dashed trajectory guide */}
                  <path
                    ref={track2Ref}
                    d={DESKTOP_CONNECTOR_PATH}
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{ opacity: 0 }}
                  />

                  {/* Active glowing path */}
                  <path
                    ref={path2Ref}
                    d={DESKTOP_CONNECTOR_PATH}
                    stroke="#38BDF8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    pathLength="100"
                    strokeDasharray="100"
                    style={{ strokeDashoffset: 100 }}
                    className="drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]"
                  />

                  {/* Directional arrowhead */}
                  <g ref={arrow2Ref} className="pointer-events-none" style={{ opacity: 0 }}>
                    <path
                      d="M -6 -4.5 L 1 0 L -6 4.5"
                      stroke="#38BDF8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className="drop-shadow-[0_0_6px_rgba(56,189,248,0.75)]"
                    />
                  </g>
                </svg>
              </div>

              {/* ================= STAGE 03 ================= */}
              <div
                ref={stage3Ref}
                data-stage="03"
                style={{ opacity: 0, transform: "translateY(22px)", pointerEvents: "none" }}
                className="relative z-10 flex items-start gap-4 sm:gap-5 ml-16 sm:ml-28 lg:ml-40"
              >
                {/* Circular badge container */}
                <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-b from-white via-[#F0FDF4] to-[#DCFCE7] shadow-[0_10px_28px_rgba(16,185,129,0.25),0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-emerald-200/80">
                  {/* People Collaboration SVG */}
                  <svg viewBox="0 0 32 28" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
                    <defs>
                      <linearGradient id="users-grad" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <circle cx="10" cy="8" r="4.5" fill="url(#users-grad)" />
                    <path
                      d="M 2 24 C 2 19.5 5.5 16 10 16 C 14.5 16 18 19.5 18 24 C 18 24.5 17.5 25 17 25 L 3 25 C 2.5 25 2 24.5 2 24 Z"
                      fill="url(#users-grad)"
                    />
                    <circle cx="21" cy="9.5" r="4" fill="url(#users-grad)" />
                    <path
                      d="M 16.5 18.5 C 17.8 17.6 19.3 17 21 17 C 25 17 28.5 20 28.5 24 C 28.5 24.5 28 25 27.5 25 L 18.5 25 C 19 24.2 19.2 23.2 19.1 22.1 C 18.8 20.7 17.8 19.4 16.5 18.5 Z"
                      fill="url(#users-grad)"
                    />
                  </svg>
                  {/* Step number badge at 1 o'clock */}
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 font-mono text-xs sm:text-sm font-bold text-slate-300">
                    03
                  </span>
                </div>

                {/* Text container */}
                <div className="flex flex-col pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    Contribute to development
                  </h3>
                  <p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-slate-400 max-w-[260px] sm:max-w-xs">
                    Want to help bring an idea to life? Let's build it together.
                  </p>
                </div>
              </div>

              {/* PROBLEM 4 FIXED: Bottom decorative handwritten marks in the empty lower-right space */}
              <div
                ref={raysRef}
                style={{ opacity: 0 }}
                className="mt-6 ml-auto mr-10 sm:mr-16 pointer-events-none select-none flex items-center justify-end"
                aria-hidden="true"
              >
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-slate-400/50" fill="none">
                  <line x1="12" y1="28" x2="22" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="22" y1="34" x2="28" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="32" y1="30" x2="30" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
