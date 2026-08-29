const TextFrame = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-xs font-medium tracking-wide text-blue-200 shadow-[0_0_24px_rgba(59,130,246,0.08)] ${className}`}>
    {children}
  </span>
);

export default TextFrame;
