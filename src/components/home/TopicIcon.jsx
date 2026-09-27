import React from "react";

/* Shared presentation attrs so every icon renders with the same stroke
   weight / color (inherits color from the wrapping .marquee-card-icon). */
const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function TreeIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6" cy="13" r="2" />
      <circle cx="18" cy="13" r="2" />
      <circle cx="3" cy="20" r="1.6" />
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="15" cy="20" r="1.6" />
      <circle cx="21" cy="20" r="1.6" />
      <line x1="12" y1="7" x2="6" y2="11.3" />
      <line x1="12" y1="7" x2="18" y2="11.3" />
      <line x1="6" y1="14.8" x2="3" y2="18.6" />
      <line x1="6" y1="14.8" x2="9" y2="18.6" />
      <line x1="18" y1="14.8" x2="15" y2="18.6" />
      <line x1="18" y1="14.8" x2="21" y2="18.6" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <circle cx="12" cy="12" r="2" />
      <line x1="6.6" y1="7.2" x2="10.6" y2="10.6" />
      <line x1="17.4" y1="7.2" x2="13.4" y2="10.6" />
      <line x1="6.6" y1="16.8" x2="10.6" y2="13.4" />
      <line x1="17.4" y1="16.8" x2="13.4" y2="13.4" />
      <line x1="7" y1="6" x2="17" y2="6" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </svg>
  );
}

function BacktrackIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="4" r="2" />
      <line x1="12" y1="6" x2="6" y2="11" />
      <line x1="12" y1="6" x2="18" y2="11" />
      <circle cx="6" cy="13" r="2" />
      <circle cx="18" cy="13" r="2" />
      <line x1="6" y1="15" x2="4" y2="19" />
      <line x1="6" y1="15" x2="9" y2="19" />
      <line x1="16.5" y1="15.5" x2="19.5" y2="18.5" />
      <line x1="19.5" y1="15.5" x2="16.5" y2="18.5" />
    </svg>
  );
}

function RecursionIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 4a8 8 0 1 1-6.9 4" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function DPIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity="0.35" stroke="none" />
    </svg>
  );
}

function GreedyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="15" width="4" height="6" rx="1" />
      <rect x="10" y="10" width="4" height="11" rx="1" />
      <rect x="17" y="5" width="4" height="16" rx="1" />
      <path d="M14.5 4.5 L16.5 6.5 L20.5 2.5" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg {...ICON_PROPS}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <rect x="4" y="9" width="4" height="6" rx="1" fill="currentColor" opacity="0.25" stroke="none" />
      <rect x="10" y="9" width="3" height="6" rx="1" />
      <rect x="15" y="9" width="5" height="6" rx="1" fill="currentColor" opacity="0.25" stroke="none" />
    </svg>
  );
}

const ICONS = {
  tree: TreeIcon,
  graph: GraphIcon,
  backtrack: BacktrackIcon,
  recursion: RecursionIcon,
  dp: DPIcon,
  greedy: GreedyIcon,
  timeline: TimelineIcon,
};

export default function TopicIcon({ type }) {
  const Icon = ICONS[type] || TreeIcon;
  return <Icon />;
}