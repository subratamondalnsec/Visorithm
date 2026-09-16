import * as React from "react";

export function Logo({
  className = "h-6 w-auto object-contain",
  alt = "Visorithm Logo",
  usePng = false,
  src,
  ...props
}) {
  return (
    <img
      src={src || (usePng ? "/images/logo.png" : "/images/logo.svg")}
      alt={alt}
      className={className}
      draggable={false}
      {...props}
    />
  );
}

Logo.displayName = "Logo";
export default Logo;
