import { memo, useId, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const corners = [
  { id: 1, x: "0", y: "0" },
  { id: 2, x: "0", y: "calc(100% - 0.16em)" },
  { id: 3, x: "calc(100% - 0.16em)", y: "calc(100% - 0.16em)" },
  { id: 4, x: "calc(100% - 0.16em)", y: "0" },
];

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
};

const TextFrame = memo(function TextFrame({ children, as: Component = "span", lineStyle = "solid", accessible = true, className, ...props }) {
  const MotionComponent = useMemo(() => motion.create(Component), [Component]);
  const gradientId = useId();
  const clipId = useId();

  return (
    <MotionComponent {...props} className={cn("relative inline-flex items-center justify-center -mx-[0.1em] whitespace-nowrap px-[0.2em] pb-[0.25em] pt-[0.2em] font-serif italic leading-none text-current selection:bg-cyan-300/20", className)} aria-label={accessible && typeof children === "string" ? children : undefined}>
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="var(--color-background)" stopOpacity="0.01" /><stop offset="60%" stopColor="currentColor" stopOpacity="0.1" /><stop offset="100%" stopColor="currentColor" stopOpacity="0.4" /></linearGradient>
          <clipPath id={clipId}><motion.rect x="0" y="0" width="100%" height="100%" initial={{ x: "100%" }} animate={{ x: "0%" }} transition={{ delay: 0.3, duration: 1, type: "spring", damping: 18, stiffness: 100 }} /></clipPath>
        </defs>
        <rect x="0.08em" y="0.08em" width="calc(100% - 0.16em)" height="calc(100% - 0.16em)" strokeWidth={lineStyle === "dashed" ? "0.012em" : "0.015em"} stroke="currentColor" strokeDasharray={lineStyle === "dashed" ? "0.16em 0.12em" : undefined} fill={`url(#${gradientId})`} clipPath={`url(#${clipId})`} />
        {corners.map((corner) => <motion.rect key={corner.id} x={corner.x} y={corner.y} width="0.16em" height="0.16em" rx="0.015em" strokeWidth={lineStyle === "dashed" ? "0.012em" : "0.015em"} stroke="currentColor" fill="var(--color-background)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.72, duration: 0.45, type: "spring", damping: 16, stiffness: 200 }} style={{ transformOrigin: "center" }} />)}
      </svg>
      <motion.span variants={containerVariants} initial="hidden" animate="show" exit="exit" style={{ display: "inline-block" }}><motion.span variants={itemVariants} style={{ display: "inline-block" }} aria-hidden={accessible ? true : undefined}>{children}</motion.span></motion.span>
    </MotionComponent>
  );
});

TextFrame.displayName = "TextFrame";

TextFrame.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  lineStyle: PropTypes.oneOf(["dashed", "solid"]),
  accessible: PropTypes.bool,
  className: PropTypes.string,
};

export { TextFrame };
