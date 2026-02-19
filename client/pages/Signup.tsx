import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { AuthManager } from "@/lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractUsername = (fullName: string) => {
    // Extract username from full name (remove spaces and make lowercase)
    return fullName.replace(/\s+/g, '').toLowerCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Use AuthManager for registration
    const username = extractUsername(formData.fullName);
    const result = await AuthManager.register(username, formData.fullName, formData.email, formData.password);

    if (result.success) {
      // Auto-login after successful registration
      const loginResult = await AuthManager.login(formData.email, formData.password);
      setIsLoading(false);

      if (loginResult.success) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
      return;
    }

    setIsLoading(false);
    // Show error message
    if (result.message.includes("Email")) {
      setErrors({ email: result.message });
    } else {
      setErrors({ fullName: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-start justify-center p-4 md:p-8 py-12 relative ">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-16 relative z-10 min-h-0 overflow-y-auto">
        {/* Left Side - Logo and Brand */}
        <div className="flex-1 text-center lg:text-left py-8">
          <div className="mb-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <img 
                src="/logo_spritErax.jpeg" 
                alt="SpiritEraX Logo" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Spirit<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Era</span>X
            </h1>
            <p className="text-xl text-blue-200/80 mb-6 max-w-md">
              Join next generation of digital experiences
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

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 max-w-md py-8">
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
              <h2 className="text-3xl font-bold text-white mb-2">Join SpiritEraX</h2>
              <p className="text-blue-200/80">Create your account and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-4 rounded-2xl border-2 transition-all focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm bg-white/10 text-white placeholder-white/50 ${
                    errors.fullName
                      ? "border-red-400/50 bg-red-500/10"
                      : "border-white/20 bg-white/5 focus:bg-white/15"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-300 text-sm font-medium mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 p-3 backdrop-blur-sm bg-white/5 rounded-2xl space-y-2 border border-white/10">
                    {passwordRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-medium"
                      >
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-white/40" />
                        )}
                        <span
                          className={
                            req.met ? "text-green-300" : "text-white/60"
                          }
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-4 rounded-2xl border-2 transition-all focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 pr-12 backdrop-blur-sm bg-white/10 text-white placeholder-white/50 ${
                      errors.confirmPassword
                        ? "border-red-400/50 bg-red-500/10"
                        : "border-white/20 bg-white/5 focus:bg-white/15"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm font-medium mt-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] mt-6"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 backdrop-blur-sm bg-white/10 text-white/60 rounded-full border border-white/10">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link
              to="/login"
              className="w-full block text-center backdrop-blur-sm bg-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
