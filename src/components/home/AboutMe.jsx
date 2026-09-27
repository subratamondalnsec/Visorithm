import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ABOUT ME — personal intro section
 * -----------------------------------------------------------------
 * Reference: a portfolio "About me" hero (screen recording + inspected
 * markup) with two things worth carrying over:
 *   1. A large, thin display headline + two short info paragraphs on the
 *      left, revealed once (fade + rise, staggered) the first time the
 *      section scrolls into view.
 *   2. A portrait on the right that moves at its own pace while the page
 *      scrolls past it (parallax) -- the one deliberate piece of motion
 *      in the section, everything else stays quiet.
 * The reference's own colours/typeface aren't copied -- this uses
 * Visorithm's dark-blue palette and content is Subrata's own.
 *
 * TODO: swap PROFILE_IMAGE for a hosted copy of the avatar if you'd
 * rather not depend on GitHub's endpoint staying reachable at runtime.
 */
const PROFILE_IMAGE = "https://github.com/subratamondalnsec.png";
const NAME = "Subrata Mondal";
const ROLE = "Frontend Developer";

const HEADLINE =
  "Part algorithm solver, part interface craftsman. I turn dense logic into visuals people can actually follow.";

const INFO_PARAGRAPHS = [
  "I've solved 700+ problems on competitive judges and picked up wins and podiums across hackathons — an All-India Rank of 372 at TCS CodeVita Season 12, and placements at UI/UX Hack, Smart Megathon, and Puzzle Hack.",
  "Right now I'm building Visorithm, a visualizer for trees, graphs, and search, while sharpening the UI/UX side of how people actually learn algorithms.",
];

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500&family=Inter:wght@400;500&display=swap');
  .about-display { font-family: 'Archivo', 'Inter', sans-serif; font-weight: 200; letter-spacing: -0.01em; }
  .about-body { font-family: 'Inter', sans-serif; }
  .about-word { display: inline-block; will-change: transform, opacity; }
`;

/** Split a sentence into word spans so GSAP can stagger them individually,
 *  while keeping normal text wrapping (spaces are preserved between spans). */
function Words({ text, className }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className={`about-word ${className || ""}`}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </>
  );
}

export default function AboutMe() {
  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);
  const revealRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    if (!section || !imageWrap) return undefined;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // --- one orchestrated reveal, plays once as the section first arrives ---
      const words = revealRefs.current.flatMap((el) =>
        el ? Array.from(el.querySelectorAll(".about-word")) : []
      );
      gsap.set(words, { opacity: 0, y: "0.6em" });
      gsap.set(imageWrap, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      tl.to(words, {
        opacity: 1,
        y: "0em",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.018,
      }).to(imageWrap, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.5");

      // --- the one continuous effect: the portrait parallaxes against the
      // page scroll, moving opposite the scroll direction at a fraction of
      // its speed, for the whole time the section is on screen. ---
      gsap.fromTo(
        imageWrap,
        { "--parallax-y": "-8%" },
        {
          "--parallax-y": "8%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );

      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0F172B] px-6 py-28 md:py-36">
      <style>{fontStyles}</style>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
        {/* LEFT: label, headline, info, link */}
        <div className="md:col-span-7">
          <div
            ref={(el) => (revealRefs.current[0] = el)}
            className="flex items-center gap-2 text-sm text-[#7C8DB0]"
          >
            <span className="about-word inline-block h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
            <span className="about-word about-body">About me</span>
          </div>

          <h2
            ref={(el) => (revealRefs.current[1] = el)}
            className="about-display mt-6 text-[2.1rem] leading-[1.15] text-[#F1F5FB] sm:text-[2.6rem] md:text-[2.9rem]"
          >
            <Words text={HEADLINE} />
          </h2>

          <div className="mt-14 flex gap-10 sm:mt-20">
            <div
              ref={(el) => (revealRefs.current[2] = el)}
              className="about-body pt-1 text-xs tracking-wide text-[#5B6E90]"
            >
              <span className="about-word">[</span>
              <span className="about-word">info</span>
              <span className="about-word">]</span>
            </div>

            <div className="max-w-md space-y-5">
              {INFO_PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  ref={(el) => (revealRefs.current[3 + i] = el)}
                  className="about-body text-[15px] leading-relaxed text-[#AEBBD4]"
                >
                  <Words text={p} />
                </p>
              ))}

              <a
                href="https://github.com/subratamondalnsec"
                target="_blank"
                rel="noreferrer"
                ref={(el) => (revealRefs.current[5] = el)}
                className="about-word group mt-2 inline-flex items-center gap-3 text-[15px] text-[#F1F5FB]"
              >
                <span className="border-b border-[#F1F5FB]/30 pb-0.5 transition-colors group-hover:border-[#38BDF8]">
                  My story
                </span>
                {/* two copies of a plain arrow, stacked so hover slides the
                    first one out to the top-right while the second slides
                    in from the bottom-left to take its place */}
                <span className="relative inline-block h-4 w-4 overflow-hidden">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="absolute inset-0 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:-translate-y-4"
                  >
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="absolute inset-0 h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                  >
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: parallax portrait */}
        <div className="md:col-span-5">
          <div
            ref={imageWrapRef}
            style={{ transform: "translateY(var(--parallax-y, 0%))" }}
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl md:ml-auto md:mr-0"
          >
            <img
              src={PROFILE_IMAGE}
              alt={NAME}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>
          <p className="about-body mt-4 text-right text-xs text-[#5B6E90] md:pr-1">
            {NAME}
            <br />
            {ROLE}
          </p>
        </div>
      </div>
    </section>
  );
}