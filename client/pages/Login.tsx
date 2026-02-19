import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { AuthManager } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Use AuthManager for authentication
    const result = await AuthManager.login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      // Show error message
      setErrors({ email: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10">
        {/* Left Side - Logo and Brand */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white text-3xl font-bold">S</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Spirit<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Era</span>X
            </h1>
            <p className="text-xl text-blue-200/80 mb-6 max-w-md">
              Welcome to the next generation of digital experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Modern Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          {/* Back button */}
          <Link
            to="/"
            className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors z-20 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20 lg:hidden"
          >
            ← Back
          </Link>

          {/* Glass Form Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-blue-200/80">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  Email Address
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm bg-white/10 text-white placeholder-white/50 ${
                    errors.email
                      ? "border-red-400/50 bg-red-500/10"
                      : "border-white/20 bg-white/5 focus:bg-white/15"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-300 text-sm font-medium mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 pr-12 backdrop-blur-sm bg-white/10 text-white placeholder-white/50 ${
                      errors.password
                        ? "border-red-400/50 bg-red-500/10"
                        : "border-white/20 bg-white/5 focus:bg-white/15"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm font-medium mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="#" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 backdrop-blur-sm bg-white/10 text-white/60 rounded-full border border-white/10">New to SpiritEraX?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className="w-full block text-center backdrop-blur-sm bg-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
