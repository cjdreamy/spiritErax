import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-xl font-bold text-white">SPIRITERAX</span>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-2 rounded-full bg-white text-blue-900 font-semibold hover:bg-gray-100 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        <div className="text-center max-w-3xl">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            SpiritEraX – Faith x Tech<br />
            for All
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed">
            Welcome to SpiritEraX, where faith and technology<br />
            unite like never before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-full bg-white text-blue-900 font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explore Platform
            </Link>
            <button className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-colors">
              Join Community
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {/* Catholic Hub */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">✞</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Catholic Hub Tech
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Tech resources for Bible learn</li>
                <li>• Common Prayers</li>
                <li>• Powerful Prayers</li>
                <li>• Daily Prayer Reminder</li>
                <li>• Gospel of the Day</li>
                <li>• Bible Explorer</li>
                <li>• More Scriptures</li>
              </ul>
            </div>

            {/* AI Hub */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                SpiritEraX AI
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• AI helper explains verses,</li>
                <li>suggests prayers</li>
                <li>• Answer spiritual questions</li>
              </ul>
            </div>

            {/* Coming Soon */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                SpiritEraX Machine Section
              </h3>
              <p className="text-sm text-gray-700">
                Coming Soon block
              </p>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">💬</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Social Communication
              </h3>
              <p className="text-sm text-gray-700">
                Coming Soon
              </p>
            </div>

            {/* Future Vision 1 */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">🔮</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Coming Soon block
              </h3>
              <p className="text-sm text-gray-700">
                Future vision
              </p>
            </div>

            {/* Future Vision 2 */}
            <div className="bg-white rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-900 font-bold">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Future features
              </h3>
              <p className="text-sm text-gray-700">
                More exciting things coming
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-blue-200 border-t border-blue-700/50">
        <p>&copy; 2024 SpiritEraX. All rights reserved.</p>
      </footer>
    </main>
  );
}
