const bars = [16, 34, 23, 48, 29, 58, 40, 70, 36, 52, 26, 44, 20];

const AnimatedBars = () => (
  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 flex h-56 items-end justify-center gap-2 overflow-hidden px-6 opacity-40 sm:gap-3"
    aria-hidden="true"
  >
    {bars.map((height, index) => (
      <span
        key={index}
        className="home-bar w-3 rounded-t-full bg-gradient-to-t from-blue-500/5 to-blue-300/45 sm:w-5"
        style={{ height: `${height}%`, animationDelay: `${index * 110}ms` }}
      />
    ))}
  </div>
);

export default AnimatedBars;
