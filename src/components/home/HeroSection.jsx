import { motion, useReducedMotion } from "motion/react";
import { AnimatedBars } from "../ui/animated-bars";
import { TextFrame } from "../ui/text-frame";
import { ThreeDButton } from "../ui/three-d-button";
import TextHoverEffect from "./TextHoverEffect";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedBars numBars={40} gradientFrom="rgba(37,99,235,0.52)" gradientTo="transparent" backgroundColor="#0F172B" animationDuration={5} className="min-h-[610px] rounded-none border-x-0 border-t-0 border-slate-800">
      <div className="relative mx-auto flex min-h-[610px] max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-36 text-center sm:px-8">
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-7 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90 sm:text-sm">
          Interactive algorithm learning
        </motion.p>
        <TextHoverEffect className="max-w-4xl bg-gradient-to-b from-white via-slate-100 to-blue-200 bg-clip-text text-5xl font-semibold tracking-[-0.055em] text-transparent sm:text-7xl">
          Visorithm
        </TextHoverEffect>
        <p className="mt-7 max-w-3xl text-xl font-medium leading-relaxed text-slate-200 sm:text-2xl">
          Visualize algorithms. Understand concepts. <TextFrame className="mx-1 text-cyan-200">Master DSA.</TextFrame>
        </p>
        <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-300 sm:text-[1.05rem]">
          Explore each step, connect theory to motion, and develop the intuition that makes problem solving stick.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <ThreeDButton href="#explore" color1="#1d4ed8" color2="#2563eb">Explore algorithms</ThreeDButton>
          <ThreeDButton href="/race-mode" color1="#172554" color2="#334155" className="border border-blue-300/35 text-slate-100 hover:border-cyan-200/60">Open race mode <span aria-hidden="true" className="ml-2 text-cyan-200">→</span></ThreeDButton>
        </div>
      </div>
    </AnimatedBars>
  );
}
