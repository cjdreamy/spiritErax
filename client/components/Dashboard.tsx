import { Link } from "react-router-dom";
import { BookOpen, Zap, Users, Lock, Sparkles } from "lucide-react";

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
    description: [],
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
  return (
    <div className="flex-1 overflow-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 md:p-8 md:px-12 lg:px-20 border-b border-border w-full">
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Explore our hubs and begin your spiritual journey
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 md:px-12 lg:px-20 w-full">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Get Started
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Platform
            </Link>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">
              Join Community
            </button>
          </div>
        </div>

        {/* Hub Cards Grid */}
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Our Hubs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUBS.map((hub) => (
            <div
              key={hub.id}
              className={`rounded-2xl p-6 transition-all relative ${
                hub.isLocked
                  ? "bg-card border border-border/50 opacity-70 cursor-not-allowed shadow-sm"
                  : "bg-card border border-border shadow-sm hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30"
              }`}
            >
              {/* Lock icon for locked hubs */}
              {hub.isLocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`mb-4 p-3 rounded-lg w-fit ${
                  hub.isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {hub.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-card-foreground mb-3">
                {hub.title}
              </h3>

              {hub.description.length > 0 ? (
                <ul className="space-y-2 mb-6">
                  {hub.description.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mb-6">
                  Coming Soon
                </p>
              )}

              {/* Action button */}
              {hub.isLocked ? (
                <button
                  disabled
                  className="w-full py-2 px-4 rounded-lg bg-muted text-muted-foreground font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  to={hub.path || "/"}
                  className="w-full inline-block py-2 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-center"
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
