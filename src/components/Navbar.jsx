import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAlgorithmStore from "../store/algorithmStore";

const categoryPath = (category) => category.toLowerCase().replace(/\s+/g, "-");
const algorithmPath = (algorithm) => algorithm.toLowerCase().replace(/\s+/g, "-");

const Chevron = ({ open, className = "" }) => (
  <svg
    aria-hidden="true"
    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

Chevron.propTypes = {
  open: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

const SearchIcon = ({ className = "h-4 w-4" }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.35-4.35" strokeLinecap="round" />
  </svg>
);

SearchIcon.propTypes = {
  className: PropTypes.string,
};

const DocsIcon = ({ className = "h-4 w-4" }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7h8M8 11h6" strokeLinecap="round" />
  </svg>
);

DocsIcon.propTypes = {
  className: PropTypes.string,
};

const HomeIcon = ({ className = "h-4 w-4" }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

HomeIcon.propTypes = {
  className: PropTypes.string,
};

const RaceIcon = ({ className = "h-4 w-4" }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" y1="22" x2="4" y2="15" strokeLinecap="round" />
  </svg>
);

RaceIcon.propTypes = {
  className: PropTypes.string,
};

const MenuIcon = () => (
  <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
  </svg>
);

const StudentIllustration = () => (
  <div className="rounded-full bg-gradient-to-br from-violet-400 via-blue-500 to-cyan-300 p-[2px] shadow-[0_0_16px_rgba(59,130,246,0.24)]">
    <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-950 lg:h-10 lg:w-10">
      <img
        src="/images/student-illustration.svg"
        alt="User profile illustration"
        className="h-full w-full object-contain"
      />
    </div>
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exploreRef = useRef(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
  const {
    algorithmCategories,
    searchQuery,
    searchResults,
    searchAlgorithms,
    setCurrentAlgorithm,
    setSearchQuery,
  } = useAlgorithmStore();

  const totalAlgorithmsCount = Object.values(algorithmCategories).reduce(
    (acc, current) => acc + (Array.isArray(current) ? current.length : 0),
    0
  );

  const selectAlgorithm = (category, algorithm) => {
    setCurrentAlgorithm(algorithm);
    setSearchQuery("");
    setIsExploreOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/${categoryPath(category)}/${algorithmPath(algorithm)}`);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchAlgorithms(query);
  };

  const closeWhenFocusLeaves = (event) => {
    if (!exploreRef.current?.contains(event.relatedTarget)) {
      setIsExploreOpen(false);
    }
  };

  const isVisualizerActive =
    location.pathname.startsWith("/sorting") ||
    location.pathname.startsWith("/searching") ||
    location.pathname.startsWith("/graph") ||
    location.pathname.startsWith("/dynamic-programming") ||
    location.pathname.startsWith("/greedy-algorithm") ||
    location.pathname.startsWith("/backtracking") ||
    location.pathname.startsWith("/tree-algorithms") ||
    location.pathname.startsWith("/mathematical-algorithms");

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs lg:px-3 lg:py-2 lg:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
      isActive
        ? "border border-sky-400/30 bg-sky-400/15 text-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.12)]"
        : "border border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-800/80 hover:text-slate-100"
    }`;
  };

  const visualizerLinkClass = `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs lg:px-3 lg:py-2 lg:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
    isVisualizerActive
      ? "border border-sky-400/30 bg-sky-400/15 text-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.12)]"
      : "border border-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-800/80 hover:text-slate-100"
  }`;

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-sky-400/15 bg-slate-950/95 shadow-[0_10px_32px_rgba(2,6,23,0.24)] backdrop-blur-xl"
      aria-label="Primary navigation"
    >
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 min-[600px]:px-4 min-[1024px]:h-[72px] min-[1024px]:px-8">
        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <img src="/images/logo.png" alt="Visorithm" className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg object-contain" />
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-base lg:text-lg font-bold tracking-tight text-transparent">
              Visorithm
            </span>
          </Link>

          {/* Desktop Left Links: Home & Visualizer */}
          <div className="hidden min-[900px]:flex items-center gap-1 lg:gap-1.5 ml-1 lg:ml-2">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/sorting/bubble-sort" className={visualizerLinkClass}>
              Visualizer
            </Link>
          </div>
        </div>

        {/* ================= CENTER SECTION (DEAD-CENTER FOCAL POINT) ================= */}
        <div className="hidden min-[860px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div
            ref={exploreRef}
            className="relative"
            onMouseEnter={() => setIsExploreOpen(true)}
            onMouseLeave={() => setIsExploreOpen(false)}
            onBlur={closeWhenFocusLeaves}
            onKeyDown={(event) => event.key === "Escape" && setIsExploreOpen(false)}
          >
            <button
              type="button"
              aria-expanded={isExploreOpen}
              aria-haspopup="menu"
              aria-controls="explore-algorithms-menu"
              onClick={() => setIsExploreOpen((open) => !open)}
              onFocus={() => setIsExploreOpen(true)}
              className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 lg:px-4 lg:py-2 lg:text-sm ${
                isExploreOpen
                  ? "border border-sky-400/50 bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-sky-500/20 text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40"
                  : "border border-sky-400/25 bg-slate-900/90 text-sky-200 hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white hover:shadow-[0_0_18px_rgba(56,189,248,0.18)] shadow-sm"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
              </span>
              <span>Explore Algorithms</span>
              <Chevron open={isExploreOpen} />
            </button>

            {/* Centered Hover Dropdown Menu */}
            <div
              id="explore-algorithms-menu"
              role="menu"
              aria-label="Explore algorithms"
              className={`absolute left-1/2 top-full mt-2.5 max-h-[calc(100vh-6rem)] w-[min(1060px,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto origin-top rounded-2xl border border-sky-300/20 bg-slate-900/98 p-4 lg:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_25px_rgba(56,189,248,0.12)] backdrop-blur-2xl transition-all duration-200 before:absolute before:-top-3 before:h-3 before:inset-x-0 before:content-[''] ${
                isExploreOpen
                  ? "visible translate-y-0 opacity-100 pointer-events-auto"
                  : "invisible -translate-y-1.5 opacity-0 pointer-events-none"
              }`}
            >
              <div className="mb-3.5 flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20">
                    <SearchIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-100 tracking-wide">Explore Algorithm Library</p>
                    <p className="text-xs text-slate-400">Choose an algorithm to launch the interactive visualizer</p>
                  </div>
                </div>
                <span className="hidden sm:inline-block rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                  {totalAlgorithmsCount} Algorithms
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Object.entries(algorithmCategories).map(([category, algorithms]) => (
                  <section
                    key={category}
                    aria-label={category}
                    className="group/cat min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/40 p-2.5 lg:p-3 transition-colors hover:border-sky-400/25 hover:bg-slate-950/70"
                  >
                    <h2
                      className="mb-2 truncate border-b border-slate-800/90 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-300"
                      title={category}
                    >
                      {category}
                    </h2>
                    <div className="space-y-0.5">
                      {algorithms.map((algorithm) => (
                        <button
                          key={algorithm}
                          type="button"
                          role="menuitem"
                          onClick={() => selectAlgorithm(category, algorithm)}
                          title={algorithm}
                          className="group/item flex w-full min-w-0 items-center rounded-md px-2 py-1.5 text-left text-xs font-medium text-slate-300 transition-all duration-150 hover:translate-x-1 hover:bg-sky-400/15 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                        >
                          <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600 transition-colors group-hover/item:bg-sky-300" />
                          <span className="truncate">{algorithm}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Race Mode Link (visible on desktop >= 1150px) */}
          <Link
            to="/race-mode"
            className={`${navLinkClass("/race-mode")} hidden min-[1150px]:inline-flex items-center gap-1.5`}
          >
            <RaceIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-sky-400" />
            <span>Race Mode</span>
          </Link>

          {/* Open Docs Link (visible on desktop >= 980px) */}
          <Link
            to="/faq"
            className={`${navLinkClass("/faq")} hidden min-[980px]:inline-flex items-center gap-1.5`}
            title="Open Documentation and FAQs"
          >
            <DocsIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-sky-400" />
            <span>Open Docs</span>
          </Link>

          {/* Search Box with Autocomplete (hidden on small mobile) */}
          <div className="relative hidden min-[600px]:block w-36 min-[720px]:w-40 min-[1080px]:w-48 min-[1280px]:w-56">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search algorithms..."
              aria-label="Search algorithms"
              className="h-9 w-full rounded-lg border border-sky-400/20 bg-slate-900/90 py-1.5 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/30 outline-none transition-all duration-200 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 lg:h-10 lg:pl-9 lg:pr-3 lg:text-sm"
            />
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 lg:left-3">
              <SearchIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </span>
            {searchQuery && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 max-h-72 w-72 overflow-y-auto rounded-xl border border-sky-400/20 bg-slate-900/98 p-1.5 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.category}-${result.name}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectAlgorithm(result.category, result.name)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs lg:text-sm transition-all duration-150 hover:bg-sky-400/15 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                    >
                      <span className="font-medium text-slate-200 truncate">{result.name}</span>
                      <span className="text-[11px] text-slate-400 shrink-0">{result.category}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs lg:text-sm text-slate-400">No algorithms found.</p>
                )}
              </div>
            )}
          </div>

          {/* Profile Avatar / Student Illustration */}
          <div className="hidden min-[480px]:flex shrink-0 items-center">
            <StudentIllustration />
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 min-[860px]:hidden"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE & TABLET DRAWER ================= */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/98 px-4 py-4 shadow-2xl backdrop-blur-2xl min-[860px]:hidden">
          <div className="mx-auto max-w-7xl space-y-2.5">
            {/* Mobile Search Bar */}
            <div className="relative pb-1">
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search algorithms..."
                aria-label="Search algorithms"
                className="h-10 w-full rounded-lg border border-sky-400/20 bg-slate-900/90 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/30 outline-none transition-all duration-200 focus:border-sky-400/45 focus:ring-2 focus:ring-sky-400/20"
              />
              <span className="pointer-events-none absolute left-3 top-[19px] -translate-y-1/2 text-slate-500">
                <SearchIcon className="h-4 w-4" />
              </span>
              {searchQuery && (
                <div className="absolute inset-x-0 top-[calc(100%+2px)] z-50 max-h-56 overflow-y-auto rounded-xl border border-sky-400/20 bg-slate-900/98 p-1.5 shadow-xl shadow-slate-950/80">
                  {searchResults.length ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.category}-${result.name}`}
                        type="button"
                        onClick={() => selectAlgorithm(result.category, result.name)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 hover:bg-sky-400/10 hover:text-sky-100"
                      >
                        <span className="font-medium text-slate-200">{result.name}</span>
                        <span className="text-xs text-slate-500">{result.category}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-500">No algorithms found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links: Home & Visualizer */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/"
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "border border-sky-400/30 bg-sky-400/15 text-sky-100"
                    : "border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/sorting/bubble-sort"
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isVisualizerActive
                    ? "border border-sky-400/30 bg-sky-400/15 text-sky-100"
                    : "border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span>Visualizer</span>
              </Link>
            </div>

            {/* Mobile Explore Algorithms Accordion */}
            <div className="rounded-xl border border-sky-400/25 bg-slate-900/80 overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-semibold text-sky-200 focus:outline-none"
                aria-expanded={isMobileExploreOpen}
                onClick={() => setIsMobileExploreOpen((open) => !open)}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  Explore Algorithms
                </span>
                <Chevron open={isMobileExploreOpen} />
              </button>
              {isMobileExploreOpen && (
                <div className="grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto border-t border-slate-800/80 px-3 py-3 sm:grid-cols-2">
                  {Object.entries(algorithmCategories).map(([category, algorithms]) => (
                    <section key={category} className="rounded-lg border border-slate-800/70 bg-slate-950/50 p-2.5">
                      <h2 className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-300">{category}</h2>
                      <div className="space-y-0.5">
                        {algorithms.map((algorithm) => (
                          <button
                            key={algorithm}
                            type="button"
                            onClick={() => selectAlgorithm(category, algorithm)}
                            className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-sky-400/15 hover:text-sky-100"
                          >
                            {algorithm}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            {/* Race Mode & Open Docs */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/race-mode"
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === "/race-mode"
                    ? "border border-sky-400/30 bg-sky-400/15 text-sky-100"
                    : "border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <RaceIcon className="h-4 w-4 text-sky-400" />
                <span>Race Mode</span>
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/faq"
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === "/faq"
                    ? "border border-sky-400/30 bg-sky-400/15 text-sky-100"
                    : "border border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <DocsIcon className="h-4 w-4 text-sky-400" />
                <span>Open Docs</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
