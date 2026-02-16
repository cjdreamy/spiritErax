import { Link } from "react-router-dom";
import { BookOpen, Zap, Users, Lock, Sparkles, Search, User } from "lucide-react";
import SExlogo from '/logo_spritErax.jpeg';
import { AuthManager } from "@/lib/auth";

interface HubCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string[];
  path?: string;
  isLocked?: boolean;
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
  },
  {
    id: "machine",
    title: "SpiritEraX Machine Section",
    icon: <Zap className="w-8 h-8" />,
    description: ["Coming Soon block"],
    isLocked: true,
  },
  {
    id: "social",
    title: "Social Communication are",
    icon: <Users className="w-8 h-8" />,
    description: ["Coming Soon"],
    isLocked: true,
  },
  {
    id: "future",
    title: "Coming Soon block future",
    icon: <Sparkles className="w-8 h-8" />,
    description: ["Future vision"],
    isLocked: true,
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
      
      {/* Header with Search and Profile */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 md:px-12 lg:px-20 w-full">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            SpiritEraX - Faith x Tech for All
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Welcome to SpiritEraX, where faith meets technology
          </p>
          {currentUser && (
            <p className="text-lg text-blue-600 font-medium mb-8">
              Welcome back, {currentUser.fullName}!
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/catholic-hub"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Explore Platform
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">
              Join Community
            </button>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {HUBS.map((hub) => (
            <div
              key={hub.id}
              className={`rounded-xl p-6 transition-all relative bg-white border border-gray-200 shadow-md hover:shadow-lg ${
                hub.isLocked ? "opacity-75" : "hover:border-blue-300"
              }`}
            >
              {/* Lock icon for locked hubs */}
              {hub.isLocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 p-3 rounded-lg w-fit ${
                  hub.isLocked
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {hub.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {hub.title}
              </h3>

              {hub.description.length > 0 ? (
                <ul className="space-y-2 mb-6">
                  {hub.description.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-6">
                  Coming Soon
                </p>
              )}

              {/* Action button */}
              {hub.isLocked ? (
                <button
                  disabled
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  to={hub.path || "/"}
                  className="w-full inline-block py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Explore
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
