import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-6">
      {/* Logo with glow */}
      <div className="mb-12">
        <Logo size="lg" />
      </div>

      {/* Main text */}
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 font-inter">
        Igniting Your
      </h1>
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 font-inter">
        Spirit...
      </h1>

      {/* Subtext */}
      <p className="text-xl text-white text-center mb-12">Please wait...</p>

      {/* Loading animation */}
      <div className="flex gap-2 mb-16">
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.6s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.8s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: "1.2s" }} />
      </div>

      {/* Footer text */}
      <p className="text-white text-lg font-medium">Powered by SpiritEraX</p>
    </div>
  );
}
