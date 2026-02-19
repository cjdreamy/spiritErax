import { Link } from "react-router-dom";
import { BookOpen, Zap, Users, Lock, Sparkles, Search, User, Settings, Bell, Home, Compass, MessageSquare, Heart, Star, TrendingUp } from "lucide-react";
import SExlogo from '/logo_spritErax.jpeg';
import { AuthManager } from "@/lib/auth";

interface HubCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string[];
  path?: string;
  isLocked?: boolean;
  stats?: string;
  rating?: number;
}

const HUBS: HubCard[] = [
  {
    id: "catholic",
    title: "Catholic Hub Tech",
    icon: <BookOpen className="w-8 h-8" />,
    description: [
      "Tech resources for Bible learn",
      "Common Prayers",
      "Powerful Prayers",
      "Daily Prayer Reminder",
      "Gospel of the Day",
      "Bible Explorer",
      "More Scriptures",
    ],
    path: "/catholic-hub",
    stats: "2.5k users",
    rating: 4.8,
  },
  {
    id: "ai",
    title: "SpiritEraX AI",
    icon: <Sparkles className="w-8 h-8" />,
    description: [
      "AI helper explains verses,",
      "suggests prayers",
      "Answer spiritual questions",
    ],
    isLocked: true,
    stats: "Coming Soon",
    rating: 0,
  },
  {
    id: "machine",
    title: "SpiritEraX Machine Section",
    icon: <Zap className="w-8 h-8" />,
    description: ["Advanced spiritual tools"],
    isLocked: true,
    stats: "Coming Soon",
    rating: 0,
  },
  {
    id: "social",
    title: "Social Community",
    icon: <Users className="w-8 h-8" />,
    description: ["Connect with believers"],
    isLocked: true,
    stats: "Coming Soon",
    rating: 0,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    icon: <Heart className="w-8 h-8" />,
    description: ["Spiritual resources & more"],
    path: "/marketplace",
    stats: "150+ items",
    rating: 4.6,
  },
  {
    id: "channel",
    title: "Channel Hub",
    icon: <MessageSquare className="w-8 h-8" />,
    description: ["Live streams & content"],
    path: "/channel-hub",
    stats: "50+ channels",
    rating: 4.7,
  },
];

export function Dashboard() {
  const currentUser = AuthManager.getCurrentUser();
  
  return (
    <div className="flex-1 overflow-auto w-full relative">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${SExlogo})` }}></div>
      </div>
      
      {/* Header Navigation */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable to redirect to dashboard */}
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={SExlogo} 
                alt="SpiritEraX Logo" 
                className="w-10 h-10 object-contain mr-3"
              />
              <span className="text-gray-900 font-bold text-xl">SpiritEraX</span>
            </Link>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/gospel" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Gospel
              </Link>
              <Link to="/bible" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Bible
              </Link>
              <Link to="/prayers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Prayers
              </Link>
              <Link to="/ai" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                AI
              </Link>
              <Link to="/social" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Social
              </Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="py-4 border-t border-gray-200">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hubs, content, people..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.fullName || 'User'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Where faith and technology unite like never before <br />
            Continue your spiritual journey with our digital tools
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-gray-900 text-2xl font-bold">2.5K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Hubs</p>
                <p className="text-gray-900 text-2xl font-bold">6</p>
              </div>
              <Compass className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Prayers Today</p>
                <p className="text-gray-900 text-2xl font-bold">142</p>
              </div>
              <Heart className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Rating</p>
                <p className="text-gray-900 text-2xl font-bold">4.8</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUBS.map((hub) => (
            <div
              key={hub.id}
              className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 transition-all hover:transform hover:scale-[1.02] hover:shadow-lg ${
                hub.isLocked ? "opacity-60" : "hover:border-blue-300"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  hub.isLocked
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {hub.icon}
                </div>
                {hub.isLocked && (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {hub.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {hub.description[0]}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm">{hub.stats}</span>
                {hub.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-600 text-sm">{hub.rating}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {hub.isLocked ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-500 font-semibold cursor-not-allowed border border-gray-200"
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  to={hub.path || "/"}
                  className="w-full inline-block py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-center"
                >
                  Explore Hub
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
