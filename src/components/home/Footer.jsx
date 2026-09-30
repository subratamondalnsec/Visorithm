import { useRef } from "react";
import FooterWordmark from "./FooterWordmark";
// import VisorithmDepthWordmark from "./VisorithmDepthWordmark";

/**
 * Footer
 *
 * The footer renders as a single rounded "card" (`cardRef` below) that sits
 * inset from the page edges. That card is the thing that gets `overflow-
 * hidden`: the purple/white reveal circles inside FooterWordmark grow large
 * enough to cover the WHOLE card (nav row included, not just the wordmark),
 * and the card's own rounding is what clips them -- so during the "grown"
 * phase the shape naturally reads as filling the card corner-to-corner with
 * the card's own rounded corners, no extra corner-matching logic needed.
 *
 * `cardRef` is created here and handed to FooterWordmark, which uses it as
 * the scroll target (how far the CARD has scrolled into view drives the
 * whole animation) and as the clipping boundary described above.
 *
 * `categories` is the same array already built in HomeRedesign.jsx -- pass
 * it straight through so the "Explore" column always matches the real site
 * sections instead of a hand-maintained duplicate list.
 */
export default function Footer({ categories = [] }) {
  const year = new Date().getFullYear();
  const cardRef = useRef(null);

  return (
    <div className="bg-[#0F172B] px-3 pb-3 sm:px-6 sm:pb-6">
      <footer
        ref={cardRef}
        className="relative overflow-hidden rounded-[2.25rem] border border-slate-800 bg-[#0B1120]"
      >
        <div className="relative z-0 mx-auto max-w-6xl px-6 pb-4 pt-14 sm:px-8">
          {/* ---- nav / contact block ---- */}
          <div className="flex flex-col gap-10  pb-12 sm:flex-row sm:justify-between">
            <div className="max-w-sm">
              <span className="text-lg font-semibold tracking-tight text-white">
                Visorithm
              </span>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                A focused place to see algorithms work, one decision at a time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
              <NavColumn
                title="Explore"
                links={categories.slice(0, 5).map((c) => ({
                  label: c.name,
                  href: c.path.replace(":algorithm", c.items?.[0]?.[0] ?? ""),
                }))}
              />
              <NavColumn
                title="Connect"
                links={[
                  { label: "GitHub", href: "#" /* TODO: Add GitHub link */ },
                  { label: "LinkedIn", href: "#" /* TODO: Add LinkedIn link */ },
                  { label: "Documentation", href: "#" /* TODO: Add docs link */ },
                ]}
              />
              <NavColumn
                title="Legal"
                links={[
                  { label: "Privacy Policy", href: "#" /* TODO: Add privacy policy */ },
                  { label: "Terms of Service", href: "#" /* TODO: Add terms */ },
                ]}
              />
            </div>
          </div>

          {/* ---- ornaments + giant animated wordmark (the reveal circles
              inside this live at a much higher z-index, so they paint over
              this whole card -- nav row included -- while grown) ---- */}
          <div className="pt-10">
            <FooterWordmark text="Visorithm" splitAt={5} cardRef={cardRef} />
            {/* <VisorithmDepthWordmark /> */}
          </div>

          {/* ---- copyright ---- */}
          <div className="relative z-0 mt-8 flex flex-col gap-2 border-t border-slate-800 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© {year} Visorithm. Built for deliberate practice.</span>
            <span className="text-slate-600">Algorithm visualization, one step at a time.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavColumn({ title, links }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-slate-100"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}