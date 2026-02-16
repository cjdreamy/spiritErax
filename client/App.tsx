import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Loader } from "@/components/Loader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthManager } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CatholicHub from "./pages/CatholicHub";
import ChannelHub from "./pages/ChannelHub";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return true; // Default to dark mode for SpiritEraX
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check if user is authenticated for protected routes
  const isProtectedRoute = ["/dashboard", "/catholic-hub", "/channel-hub", "/marketplace", "/settings"].includes(location.pathname);
  const isAuthenticated = AuthManager.isAuthenticated();

  // Show loader while loading
  if (isLoading) {
    return <Loader />;
  }

  // Redirect to login if trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-blue-200 mb-8">Please log in to access this page</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const noSidebarRoutes = ["/", "/login", "/signup"];
  const isNoSidebarRoute = noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar - only on dashboard pages */}
      {!isNoSidebarRoute && (
        <Sidebar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      )}

      {/* Main Content */}
      <Routes>
        <Route
          path="/"
          element={<Homepage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/catholic-hub" 
          element={
            <ProtectedRoute>
              <CatholicHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/channel-hub" 
          element={
            <ProtectedRoute>
              <ChannelHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
