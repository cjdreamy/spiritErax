import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-blue-100 mb-2 font-semibold">Page Not Found</p>
        <p className="text-blue-200 mb-8">
          The page you're looking for doesn't exist. Let's get you back on track!
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-full bg-white text-blue-900 font-bold hover:bg-gray-100 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
