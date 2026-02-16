import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Loader } from "@/components/Loader";
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

  const noSidebarRoutes = ["/", "/login", "/signup"];
  const isNoSidebarRoute = noSidebarRoutes.includes(location.pathname);

  // Show loader while loading
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar - only on dashboard pages */}
      {!isNoSidebarRoute && (
        <Sidebar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      )}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/catholic-hub" element={<CatholicHub />} />
        <Route path="/channel-hub" element={<ChannelHub />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/settings" element={<Settings />} />
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
