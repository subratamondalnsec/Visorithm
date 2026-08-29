import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const ThreeDButton = forwardRef(function ThreeDButton(
  { href, color1, color2, children, className, ...props },
  ref
) {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "relative inline-flex h-11 items-center justify-center overflow-hidden rounded-lg px-5 text-sm font-semibold tracking-[0.01em] text-white transition duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172B] active:translate-y-px",
        className
      )}
      style={{
        background: `linear-gradient(to top, ${color1}, ${color2})`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -2px 5px rgba(2,6,23,0.42), 0 8px 18px rgba(2,6,23,0.28)",
      }}
      {...props}
    >
      <span className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-[82%] -translate-x-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/20 to-transparent" />
      <span className="relative z-10">{children}</span>
    </a>
  );
});

ThreeDButton.displayName = "ThreeDButton";
ThreeDButton.propTypes = {
  href: PropTypes.string,
  color1: PropTypes.string.isRequired,
  color2: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { ThreeDButton };
