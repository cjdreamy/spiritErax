export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-xl" />

      {/* SVG Logo */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Flame (top) */}
        <g>
          {/* Left flame */}
          <path
            d="M 35 20 Q 30 30 35 45 Q 40 35 40 25 Q 40 20 35 20"
            fill="white"
          />
          {/* Right flame */}
          <path
            d="M 50 10 Q 45 25 50 40 Q 55 25 60 15 Q 60 8 50 10"
            fill="white"
          />
          {/* Center top */}
          <path
            d="M 42 15 Q 38 22 42 35 Q 46 25 48 18 Q 48 13 42 15"
            fill="white"
          />
        </g>

        {/* X (bottom) */}
        <g>
          <line x1="30" y1="50" x2="50" y2="70" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="50" x2="30" y2="70" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Chevron/Arrow pointing down (center) */}
        <g>
          <line x1="45" y1="65" x2="55" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="55" y1="65" x2="45" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
