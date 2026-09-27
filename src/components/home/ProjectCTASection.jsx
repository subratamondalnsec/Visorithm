import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * StackIcon
 *
 * Small decorative 3-layer "stack" icon (mint green on top, lavender in
 * the middle, deep navy at the bottom), each layer tilted slightly so it
 * reads as a loosely-leaning stack rather than flat bars - stands in for
 * the little 3D render in the reference design without needing an actual
 * image asset. Swap this out for a real illustration/render if you have
 * one.
 */
function StackIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="stack-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BFF6D6" />
          <stop offset="100%" stopColor="#5FD98E" />
        </linearGradient>
        <linearGradient id="stack-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DAD4FB" />
          <stop offset="100%" stopColor="#8B7CF6" />
        </linearGradient>
        <linearGradient id="stack-bottom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B3F6B" />
          <stop offset="100%" stopColor="#1B1F3B" />
        </linearGradient>
      </defs>
      <rect x="16" y="34" width="32" height="16" rx="8" fill="url(#stack-bottom)" transform="rotate(-6 32 42)" />
      <rect x="14" y="20" width="32" height="16" rx="8" fill="url(#stack-mid)" transform="rotate(-3 30 28)" />
      <rect x="16" y="6" width="32" height="16" rx="8" fill="url(#stack-top)" transform="rotate(4 32 14)" />
    </svg>
  );
}

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * ProjectCTASection
 *
 * "Have a project in mind?" contact/CTA block: a top label + rule, a big
 * two-line heading with a small decorative stack icon, an "Explore Our
 * Expertise" link, and - offset to the right and slightly lower - a card
 * with a pitch line, a "Submit a Project Brief" button, and a small
 * reassurance line underneath.
 *
 * Entrance animation: everything marked data-animate fades up together
 * (staggered) the first time the section scrolls into view, respecting
 * prefers-reduced-motion.
 */
export default function ProjectCTASection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia(REDUCE_MOTION_QUERY).matches;
    if (reduceMotion) return undefined;

    const targets = section.querySelectorAll("[data-animate]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F172B] px-6 py-20 sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* label + rule */}
        <div data-animate className="flex items-center gap-6">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Start a Conversation
          </span>
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:items-start">
          {/* left column: heading + icon + expertise link */}
          <div className="lg:col-span-7">
            <div data-animate className="flex items-start justify-between gap-6">
              <h2 className="text-5xl font-bold leading-[0.95] tracking-tight text-slate-300 sm:text-6xl lg:text-7xl">
                <span className="block">Have a project</span>
                <span className="block italic">in mind?</span>
              </h2>
              <StackIcon className="hidden h-14 w-14 shrink-0 sm:block" />
            </div>

            <a
              href="#expertise"
              data-animate
              className="mt-10 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
            >
              Explore Our Expertise
            </a>
          </div>

          {/* right column: card, offset down to roughly match the reference */}
          <div className="lg:col-span-5 lg:col-start-8 lg:mt-24">
            <div
              data-animate
              className="rounded-2xl border border-white/5 bg-white/[0.04] p-8 sm:p-10"
            >
              <p className="text-xl leading-relaxed text-white sm:text-2xl">
                If you're planning ambitious creative work and need a
                structured partner to execute it well, we'd like to hear
                from you.
              </p>

              <a
                href="#brief"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-900 transition-transform duration-200 hover:scale-[1.03] sm:text-sm"
              >
                Submit a Project Brief
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </a>

              <p className="mt-6 text-sm leading-relaxed text-white/70 underline decoration-white/25 underline-offset-4">
                We review all submissions carefully and respond to aligned
                requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
