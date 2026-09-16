import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedBars } from "./ui/animated-bars";
import { TextFrame } from "./ui/text-frame";
import TextHoverEffect from "./home/TextHoverEffect";
import Seo from "./Seo";
import { Logo } from "@/components/ui/icons/logo";

const icons = {
  Sorting: "↕",
  Graph: "⌘",
  Tree: "⌘",
  "Dynamic Programming": "▦",
  Greedy: "◈",
  Searching: "⌕",
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

function CategoryCard({ category, open, onToggle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#111827]/90 shadow-[0_12px_40px_rgba(2,6,23,0.24)] transition-colors hover:border-blue-400/50 hover:bg-[#172137]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${category.name}-algorithms`}
        className="group flex w-full items-center gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:p-6"
      >
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-xl font-semibold text-blue-300 transition-transform group-hover:scale-105"
          aria-hidden="true"
        >
          {icons[category.name]}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold tracking-tight text-slate-100">
            {category.name} Algorithms
          </span>

          <span className="mt-1 block text-sm text-slate-400">
            {category.items.length} algorithms available
          </span>
        </span>

        <span
          className={`grid h-8 w-8 place-items-center rounded-full border border-slate-700 text-blue-300 transition-transform duration-300 ${
            open ? "rotate-180 bg-blue-500/10" : ""
          }`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${category.name}-algorithms`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
              ease: "easeOut",
            }}
          >
            <div className="border-t border-slate-700/70 px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
              {category.items.map(([id, title, difficulty, note]) => (
                <Link
                  key={id}
                  to={category.path.replace(":algorithm", id)}
                  className="group/item block rounded-xl px-3 py-3 transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-200 group-hover/item:text-blue-300">
                      {title}
                    </span>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        difficulty === "Easy"
                          ? "border-blue-400/25 bg-blue-400/10 text-blue-300"
                          : "border-slate-600 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {difficulty}
                    </span>
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-slate-400">
                    {note}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

const HomeRedesign = () => {
  const [openCategory, setOpenCategory] = useState("Sorting");
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
    <div className="min-h-screen overflow-hidden bg-[#0F172B] text-slate-100">
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

        <div className="mt-10 grid items-start gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              open={openCategory === category.name}
              onToggle={() =>
                setOpenCategory(
                  openCategory === category.name ? null : category.name
                )
              }
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#111827]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Visorithm
            </span>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              A focused place to see algorithms work, one decision at a time.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            {/* TODO: Add GitHub Link */}
            <span>GitHub</span>

            {/* TODO: Add LinkedIn Link */}
            <span>LinkedIn</span>

            {/* TODO: Add Portfolio Link */}
            <span>Documentation</span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl border-t border-slate-800 px-6 py-5 text-xs text-slate-500 sm:px-8">
          © {new Date().getFullYear()} Visorithm. Built for deliberate
          practice.
        </div>
      </footer>
    </div>
  );
};

export default HomeRedesign;