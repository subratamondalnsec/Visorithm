import { useState } from "react";

const TextHoverEffect = ({ children, className = "" }) => {
  const [active, setActive] = useState(false);

  return (
    <h1
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`${className} transition-colors duration-300 ${active ? "text-blue-100" : ""}`}
    >
      {children}
    </h1>
  );
};

export default TextHoverEffect;
