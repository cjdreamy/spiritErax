import SExlogo from '/logo_spritErax.jpeg'
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]}`}>
      <img src={SExlogo} alt="logo" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-xl" />

    </div>
  );
}
