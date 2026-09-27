import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowUpDown, Share2, TreePine, Grid3x3, Gem, Search } from "lucide-react";
import { AnimatedBars } from "./ui/animated-bars";
import { TextFrame } from "./ui/text-frame";
import TextHoverEffect from "./home/TextHoverEffect";
import TrustedByDSASection from "./home/TrustedByDSASection";
import ScrollImageStack from "./home/ScrollImageStack";
import ExploreAccordion from "./home/ExploreAccordion";
import Aboutme from "./home/AboutMe"
import ProjectCTASection from "./home/ProjectCTASection"
import Footer from "./home/Footer";

import Seo from "./Seo";
import { Logo } from "@/components/ui/icons/logo";

// One distinct lucide icon per category - chosen so none of them repeats
// an icon already used by one of that category's own algorithm rows
// (see algorithmIcons.js). These are components, not strings, and are
// rendered with <Icon .../> inside ExploreAccordion.

const icons = {
  Sorting: ArrowUpDown,
  Graph: Share2,
  Tree: TreePine,
  "Dynamic Programming": Grid3x3,
  Greedy: Gem,
  Searching: Search,
};

const categories = [
  {
    name: "Sorting",
    path: "/sorting/:algorithm",
    description:
      "Order data and compare the trade-offs of classic sorting techniques.",
    items: [
      [
        "bubble",
        "Bubble Sort",
        "Easy",
        "Repeatedly swaps adjacent out-of-order values.",
      ],
      [
        "selection",
        "Selection Sort",
        "Easy",
        "Selects the smallest item for each position.",
      ],
      [
        "insertion",
        "Insertion Sort",
        "Easy",
        "Builds a sorted sequence one item at a time.",
      ],
      [
        "merge",
        "Merge Sort",
        "Medium",
        "Divides data, then merges ordered halves.",
      ],
      [
        "quick",
        "Quick Sort",
        "Medium",
        "Partitions data around a chosen pivot.",
      ],
    ],
  },
  {
    name: "Graph",
    path: "/graph/:algorithm",
    description:
      "Traverse networks, discover paths, and build minimum spanning trees.",
    items: [
      [
        "dfs",
        "Depth First Search",
        "Easy",
        "Explores one branch as deeply as possible.",
      ],
      [
        "bfs",
        "Breadth First Search",
        "Easy",
        "Visits graph layers in distance order.",
      ],
      [
        "dijkstra",
        "Dijkstra's Algorithm",
        "Medium",
        "Finds shortest paths with non-negative weights.",
      ],
      [
        "prim",
        "Prim's Algorithm",
        "Medium",
        "Grows a minimum spanning tree edge by edge.",
      ],
      [
        "kruskal",
        "Kruskal's Algorithm",
        "Medium",
        "Builds a spanning tree from the lightest edges.",
      ],
    ],
  },
  {
    name: "Tree",
    path: "/tree-algorithms/:algorithm",
    description:
      "Understand hierarchical structures, traversal, and balanced search trees.",
    items: [
      [
        "tree-traversals",
        "Tree Traversals",
        "Easy",
        "Explore pre-order, in-order, and post-order traversal.",
      ],
      [
        "binary-search-tree",
        "Binary Search Tree",
        "Medium",
        "Organize searchable values in a binary tree.",
      ],
      [
        "avl-tree",
        "AVL Tree",
        "Hard",
        "Keep a binary search tree height-balanced.",
      ],
      [
        "red-black-tree",
        "Red-Black Tree",
        "Hard",
        "Use color rules to maintain fast operations.",
      ],
    ],
  },
  {
    name: "Dynamic Programming",
    path: "/dynamic-programming/:algorithm",
    description:
      "Break complex problems into reusable, optimally solved subproblems.",
    items: [
      [
        "fibonacci",
        "Fibonacci Sequence",
        "Easy",
        "Reuse earlier results to calculate each next value.",
      ],
      [
        "knapsack",
        "0/1 Knapsack",
        "Medium",
        "Maximize value within a fixed capacity.",
      ],
      [
        "lcs",
        "Longest Common Subsequence",
        "Medium",
        "Find the longest shared ordered sequence.",
      ],
      [
        "edit-distance",
        "Edit Distance",
        "Hard",
        "Measure edits required to transform one string into another.",
      ],
    ],
  },
  {
    name: "Greedy",
    path: "/greedy-algorithm/:algorithm",
    description:
      "Make locally optimal choices to efficiently reach a global solution.",
    items: [
      [
        "activity-selection",
        "Activity Selection",
        "Easy",
        "Choose the largest compatible set of activities.",
      ],
      [
        "huffman-coding",
        "Huffman Coding",
        "Medium",
        "Build an efficient prefix code from frequencies.",
      ],
    ],
  },
  {
    name: "Searching",
    path: "/searching/:algorithm",
    description:
      "Find values efficiently across sorted and unsorted collections.",
    items: [
      [
        "linear",
        "Linear Search",
        "Easy",
        "Check each value until a match is found.",
      ],
      [
        "binary",
        "Binary Search",
        "Easy",
        "Halve a sorted search space at every step.",
      ],
      [
        "jump",
        "Jump Search",
        "Medium",
        "Skip ahead in blocks, then search locally.",
      ],
      [
        "interpolation",
        "Interpolation Search",
        "Medium",
        "Estimate where a value may be in sorted data.",
      ],
    ],
  },
];

const HomeRedesign = () => {
  const [isRaceHovered, setIsRaceHovered] = useState(false);
  const [travelDistance, setTravelDistance] = useState(0);
  const reduceMotion = useReducedMotion();

  const raceBtnRef = useCallback((node) => {
    if (!node) return;
    const measure = () => setTravelDistance(node.clientWidth - 40 - 8);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F172B] text-slate-100">
      <Seo
        title="Visorithm — Interactive Algorithm Visualization"
        description="Visualize algorithms, understand core concepts, and master DSA through focused interactive learning."
        keywords="algorithm visualization, DSA, sorting, graph algorithms, dynamic programming"
      />

      <AnimatedBars
        numBars={40}
        gradientFrom="rgb(59, 130, 246)"
        gradientTo="transparent"
        backgroundColor="#0F172B"
        animationDuration={4}
        className="min-h-[610px] rounded-none border-x-0 border-t-0 border-slate-800"
      >
        <div className="relative mx-auto flex min-h-[610px] max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-44 text-center sm:px-8">
          <TextHoverEffect className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-100 sm:text-7xl">
            Visorithm
          </TextHoverEffect>
 
          <p className="mt-7 max-w-2xl text-xl font-medium leading-relaxed text-slate-400 sm:text-2xl">
            Visualize algorithms. Understand concepts.{" "}
            <TextFrame className="mx-1 text-sky-400 [&_svg]:text-sky-400 tracking-normal selection:bg-blue-900 selection:text-cyan-50">
              <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text font-semibold text-transparent selection:bg-blue-900 selection:text-cyan-50">
                Master DSA
              </span>
            </TextFrame>
          </p>
 
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
            Explore each step, connect theory to motion, and develop the
            intuition that makes problem solving stick.
          </p>
 
          {/* CTA group */}
          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            {/* Explore Algorithms */}
            <a
              href="#explore"
              className="group relative inline-flex h-12 w-full select-none items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/90 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(14,165,233,0.22),0_4px_0_rgba(29,78,216,0.42),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 ease-out hover:brightness-[1.06] hover:shadow-[0_12px_30px_rgba(14,165,233,0.3),0_5px_0_rgba(29,78,216,0.46),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:w-auto"
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
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/85 transition-all duration-300 group-hover:ring-white"
              />
 
              <span className="relative z-10 flex items-center gap-1.5">
                {/* Visorithm Logo — rendered as black */}
                <Logo
                  className="h-6 w-auto shrink-0 object-contain brightness-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105"
                  aria-hidden="true"
                />
 
                <span className="font-semibold text-white">Explore Algorithms</span>
              </span>
            </a>
 
            {/* Open Race Mode */}
            <Link
              ref={raceBtnRef}
              to="/race-mode"
              onMouseEnter={() => setIsRaceHovered(true)}
              onMouseLeave={() => setIsRaceHovered(false)}
              className="group relative inline-flex h-12 w-full min-w-0 select-none items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#161822]/95 ps-6 pe-14 text-sm font-semibold text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-inset ring-white/15 backdrop-blur-md transition-all duration-500 ease-out hover:border-white/35 hover:bg-[#11131a] hover:ps-14 hover:pe-6 hover:text-white hover:ring-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:w-auto sm:min-w-[190px]"
            >
              {/* Soft inner sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
 
              {/* Subtle white contour ring */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15 transition-all duration-300 group-hover:ring-white/30"
              />
 
              <span className="relative z-10 whitespace-nowrap text-slate-100 transition-all duration-500 group-hover:text-white">
                Open Race Mode
              </span>
 
              <motion.div
                aria-hidden="true"
                className="absolute right-1 z-20 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{
                  background: "linear-gradient(135deg,  #0085FF 100%, #00428D 80%, #000000 0%)",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.22), 0 8px 20px rgba(0,133,255,0.16), inset 0 1.5px 0 rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,55,130,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
                animate={{
                  x: reduceMotion ? 0 : isRaceHovered ? -travelDistance : 0,
                  rotate: reduceMotion ? 0 : isRaceHovered ? 360 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 28,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-0 z-20 h-2/5 w-[80%] -translate-x-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/40 via-white/15 to-transparent blur-[0.5px]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),inset_0_1.5px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(204,0,102,0.2)]"
                />
                <motion.span
                  className="relative z-30 flex items-center justify-center drop-shadow-sm text-white"
                  animate={{ rotate: reduceMotion ? 0 : isRaceHovered ? 45 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <ArrowUpRight size={16} strokeWidth={2.4} />
                </motion.span>
              </motion.div>
            </Link>
          </div>
 
          {/* TODO: Add Visorithm Hero Illustration */}
        </div>
      </AnimatedBars>

      {/* Infinite marquee of every algorithm on the site, built from the
          same `categories` and `icons` defined above - no duplicated data. */}
      <TrustedByDSASection categories={categories} icons={icons} />

      <ScrollImageStack />

      <main
        id="explore"
        className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Explore the toolkit
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
            Learn by following every decision.
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            Choose a family to view its visualizers, difficulty, and the idea
            behind each algorithm.
          </p>
        </div>

        <div className="mt-10">
          <ExploreAccordion
            categories={categories}
            icons={icons}
            defaultOpen="Sorting"
          />
        </div>
      </main>

      <Aboutme />
       <ProjectCTASection/> 
      {/* Footer: nav block + the scroll-animated "Visorithm" wordmark
          (dot-morph + glass ornaments). See ./home/Footer.jsx and
          ./home/FooterWordmark.jsx. */}
      <Footer categories={categories} />

    </div>
  );
};

export default HomeRedesign;