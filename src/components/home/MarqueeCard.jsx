import React from "react";

/**
 * MarqueeCard
 *
 * Colors are measured directly off the reference world-clock cards: top-
 * left corner sits around rgb(1,12,29) (near-black navy), bottom-right
 * around rgb(12,27,50) (a touch lighter blue) - a subtle diagonal fill,
 * dark to light. On top of that sits a soft highlight anchored at the
 * exact top-left corner (a radial glow, not a real border) that fades out
 * before it reaches the top-right or bottom-left corners - that's what
 * reads as "an outline only on the top+left side."
 *
 * `Icon` is a component reference (e.g. from lucide-react / algorithmIcons.js),
 * not a string - render it directly as <Icon />.
 */
export default function MarqueeCard({ label, Icon }) {
  return (
    <div
      className="group relative flex h-24 w-64 shrink-0 select-none items-center
                 gap-3 overflow-hidden rounded-2xl px-4 shadow-[0_12px_30px_rgba(2,6,23,0.35)]
                 transition-shadow duration-300 ease-out
                 hover:shadow-[0_16px_36px_rgba(2,6,23,0.5)]
                 sm:h-28 sm:w-80 sm:gap-4 sm:px-5"
    >
      {/* base fill: dark navy top-left fading to a lighter blue bottom-right */}
      <div
        className="absolute inset-0 -z-20"
        style={{ background: "linear-gradient(135deg, #050B1A 0%, #152840 100%)" }}
      />

      {/* corner highlight: a soft glow anchored at the top-left corner only,
          fading out well before the top-right / bottom-left corners - this
          is the "outline that only shows on two sides" effect */}
      <div
        className="absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(148,163,209,0.3), transparent 55%)",
        }}
      />

      {/* gentle overall brighten on hover */}
      <div className="absolute inset-0 -z-10 bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.04]" />

      {Icon ? (
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl
                     border border-blue-400/20 bg-blue-500/10 text-blue-300
                     transition-transform duration-300 group-hover:scale-105
                     sm:h-11 sm:w-11"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
        </span>
      ) : null}

      <span className="text-sm font-semibold leading-snug tracking-tight text-slate-200 transition-colors duration-300 group-hover:text-white sm:text-base">
        {label}
      </span>
    </div>
  );
}