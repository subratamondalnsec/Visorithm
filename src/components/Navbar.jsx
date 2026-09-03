import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAlgorithmStore from "../store/algorithmStore";

const categoryPath = (category) => category.toLowerCase().replace(/\s+/g, "-");
const algorithmPath = (algorithm) => algorithm.toLowerCase().replace(/\s+/g, "-");

const Chevron = ({ open }) => (
  <svg
    aria-hidden="true"
    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
};

const SearchIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.35-4.35" strokeLinecap="round" />
  </svg>
);

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
    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-950 lg:h-11 lg:w-11">
      <img
        src="/images/student-illustration.svg"
        alt="Decorative student illustration"
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

  const navLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
      location.pathname === path
        ? "border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.08)]"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
    }`;

  const desktopLinkClass = (path) =>
    `rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
      location.pathname === path
        ? "border-sky-300/45 bg-sky-400/15 text-sky-100 shadow-[0_0_16px_rgba(56,189,248,0.16)]"
        : "border-transparent text-sky-300 hover:border-sky-400/20 hover:bg-sky-400/10 hover:text-sky-200 hover:shadow-[0_0_14px_rgba(56,189,248,0.10)]"
    }`;

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-sky-400/15 bg-slate-950/95 shadow-[0_10px_32px_rgba(2,6,23,0.24)] backdrop-blur-xl"
      aria-label="Primary navigation"
    >
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 min-[600px]:gap-3 min-[600px]:px-4 min-[1024px]:h-[72px] min-[1024px]:gap-6 min-[1024px]:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <img src="images/logo.png" alt="Visorithm" className="h-9 w-9 rounded-lg object-contain" />
          <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold tracking-tight text-transparent">Visorithm</span>
        </Link>

        <div className="hidden min-w-0 items-center justify-center gap-1.5 min-[600px]:flex min-[700px]:gap-2 min-[1024px]:gap-3">
          <Link
            to="/sorting/bubble-sort"
            className={`${desktopLinkClass("/sorting/bubble-sort")} px-2 text-xs min-[1024px]:px-3 min-[1024px]:text-sm`}
          >
            Visualizer
          </Link>

          <div className="relative w-32 min-[700px]:w-36 min-[850px]:w-44 min-[1024px]:w-52 min-[1280px]:w-60 min-[1440px]:w-64">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search algorithms..."
              aria-label="Search algorithms"
              className="h-9 w-full rounded-lg border border-sky-400/15 bg-slate-900/90 py-2 pl-8 pr-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/30 outline-none transition-all duration-200 focus:border-sky-400/45 focus:ring-2 focus:ring-sky-400/20 min-[1024px]:h-10 min-[1024px]:pl-9 min-[1024px]:pr-3 min-[1024px]:text-sm"
            />
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 min-[1024px]:left-3">
              <SearchIcon />
            </span>
            {searchQuery && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 max-h-72 w-full overflow-y-auto rounded-xl border border-sky-400/15 bg-slate-900/98 p-1.5 shadow-xl shadow-slate-950/60">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.category}-${result.name}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectAlgorithm(result.category, result.name)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 hover:bg-sky-400/10 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
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
              className={`flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 min-[1024px]:px-3 min-[1024px]:text-sm ${
                isExploreOpen
                  ? "border border-sky-400/20 bg-sky-400/10 text-sky-100"
                  : "border border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
              }`}
            >
              <span>Explore <span className="hidden min-[1024px]:inline">Algorithms</span></span> <Chevron open={isExploreOpen} />
            </button>

            <div
              id="explore-algorithms-menu"
              role="menu"
              aria-label="Explore algorithms"
              className={`absolute left-1/2 top-full mt-3 max-h-[calc(100vh-6rem)] w-[min(1000px,calc(100vw-3rem))] -translate-x-1/2 overflow-y-auto origin-top rounded-2xl border border-sky-300/15 bg-slate-900/98 p-4 shadow-2xl shadow-slate-950/60 transition-all duration-200 max-[1023px]:fixed max-[1023px]:top-[72px] max-[1023px]:mt-0 max-[1023px]:w-[calc(100vw-2rem)] ${
                isExploreOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-4 border-b border-slate-700/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-400/10 p-1.5 text-sky-300"><SearchIcon /></span>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Explore Algorithms</p>
                    <p className="text-xs text-slate-400">Choose an algorithm to visualize</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 min-[1024px]:grid-cols-4">
                {Object.entries(algorithmCategories).map(([category, algorithms]) => (
                  <section key={category} aria-label={category} className="min-w-0 rounded-lg border border-slate-800/80 bg-slate-950/35 p-2.5">
                    <h2 className="mb-1.5 truncate border-b border-slate-800 pb-1.5 text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-sky-300" title={category}>
                      {category}
                    </h2>
                    <div className="space-y-px">
                      {algorithms.map((algorithm) => (
                        <button
                          key={algorithm}
                          type="button"
                          role="menuitem"
                          onClick={() => selectAlgorithm(category, algorithm)}
                          title={algorithm}
                          className="group flex w-full min-w-0 items-center rounded-md px-1.5 py-1 text-left text-xs leading-tight text-slate-300 transition-all duration-150 hover:translate-x-0.5 hover:bg-sky-400/10 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                        >
                          <span className="mr-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600 transition-colors group-hover:bg-sky-300" />
                          <span className="truncate">{algorithm}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <Link to="/race-mode" className={`${navLinkClass("/race-mode")} hidden min-[1024px]:block`}>
            Open Race Mode
          </Link>
        </div>

        <div className="hidden shrink-0 items-center min-[600px]:flex">
          <StudentIllustration />
        </div>
        <button
          type="button"
          className="justify-self-end rounded-lg p-2 text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 min-[600px]:hidden"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 shadow-2xl min-[600px]:hidden">
          <div className="mx-auto max-w-7xl space-y-1">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/sorting/bubble-sort" className="block rounded-lg border border-sky-400/15 bg-sky-400/10 px-3 py-3 text-sm font-semibold text-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
              Visualizer
            </Link>
            <div className="relative px-1 py-2">
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search algorithms..."
                aria-label="Search algorithms"
                className="h-11 w-full rounded-lg border border-sky-400/15 bg-slate-900/90 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-slate-950/30 outline-none transition-all duration-200 focus:border-sky-400/45 focus:ring-2 focus:ring-sky-400/20"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></span>
              {searchQuery && (
                <div className="absolute inset-x-1 top-[calc(100%+2px)] z-20 max-h-56 overflow-y-auto rounded-xl border border-sky-400/15 bg-slate-900/98 p-1.5 shadow-xl shadow-slate-950/60">
                  {searchResults.length ? (
                    searchResults.map((result) => (
                      <button key={`${result.category}-${result.name}`} type="button" onClick={() => selectAlgorithm(result.category, result.name)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 hover:bg-sky-400/10 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
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
            <div className="rounded-lg border border-slate-800 bg-slate-900/70">
              <button type="button" className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-medium text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300" aria-expanded={isMobileExploreOpen} onClick={() => setIsMobileExploreOpen((open) => !open)}>
                Explore Algorithms <Chevron open={isMobileExploreOpen} />
              </button>
              {isMobileExploreOpen && (
                <div className="grid max-h-[55vh] grid-cols-1 gap-4 overflow-y-auto border-t border-slate-800 px-3 py-4 sm:grid-cols-2">
                  {Object.entries(algorithmCategories).map(([category, algorithms]) => (
                    <section key={category}>
                      <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-300">{category}</h2>
                      {algorithms.map((algorithm) => (
                        <button key={algorithm} type="button" onClick={() => selectAlgorithm(category, algorithm)} className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-300 hover:bg-sky-400/10 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
                          {algorithm}
                        </button>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </div>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/race-mode" className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
              Open Race Mode
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
