import {
  ArrowLeftRight,
  Crosshair,
  ListPlus,
  GitMerge,
  Split,
  Route,
  Waves,
  Navigation,
  Network,
  Cable,
  ListTree,
  GitBranch,
  Scale,
  Palette,
  Repeat,
  Backpack,
  GitCompare,
  Diff,
  CalendarCheck,
  Binary,
  ScanLine,
  Divide,
  FastForward,
  LineChart,
  Crown,
  LayoutGrid,
  Calculator,
  Hash,
} from "lucide-react";

/**
 * One distinct, semantically-matched lucide-react icon per algorithm id -
 * the same `id` used as the first element of each entry in HomeRedesign's
 * `categories[].items` array (e.g. ["bubble", "Bubble Sort", "Easy", ...]).
 *
 * Every algorithm gets its OWN icon - nothing is reused across entries in
 * the same category, which was the "duplicate icon" problem before. Feel
 * free to swap any of these for a different lucide icon that reads better
 * to you; browse the full set at https://lucide.dev/icons.
 */
export const ALGORITHM_ICONS = {
  // Sorting
  bubble: ArrowLeftRight, // repeatedly swaps adjacent pairs
  selection: Crosshair, // picks out the minimum each pass
  insertion: ListPlus, // inserts one item into its place at a time
  merge: GitMerge, // divides, then merges ordered halves
  quick: Split, // partitions around a pivot

  // Graph
  dfs: Route, // follows one path as deep as it goes
  bfs: Waves, // expands outward layer by layer, like ripples
  dijkstra: Navigation, // shortest-path navigation
  prim: Network, // grows a connected spanning network
  kruskal: Cable, // connects edges into a spanning tree

  // Tree
  "tree-traversals": ListTree, // literally a tree-shaped list
  "binary-search-tree": GitBranch, // branching binary structure
  "avl-tree": Scale, // height-BALANCE via rotations
  "red-black-tree": Palette, // balance rules driven by node color

  // Dynamic Programming
  fibonacci: Repeat, // reuses prior results each step
  knapsack: Backpack, // literally a knapsack
  lcs: GitCompare, // comparing two sequences
  "edit-distance": Diff, // the diff between two strings

  // Greedy
  "activity-selection": CalendarCheck, // scheduling compatible activities
  "huffman-coding": Binary, // builds binary prefix codes

  // Searching
  linear: ScanLine, // scans straight through
  binary: Divide, // halves the search space each step
  jump: FastForward, // skips ahead in blocks
  interpolation: LineChart, // estimates position from a trend

  // Backtracking
  "n-queens": Crown, // non-attacking chess queens
  "sudoku-solver": LayoutGrid, // 9x9 sudoku grid

  // Mathematical
  "gcd-euclidean": Calculator, // greatest common divisor
  "gcd-(euclidean)": Calculator,
  "sieve-of-eratosthenes": Hash, // prime number sieve
  "prime-factorization": Binary, // prime factors decomposition
};