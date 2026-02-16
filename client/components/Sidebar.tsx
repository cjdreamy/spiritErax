import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { Menu, X, Home, Radio, ShoppingBag, Moon, Settings, LogOut, Sun } from "lucide-react";
import { AuthManager } from "@/lib/auth";

interface SidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ isDarkMode, onToggleDarkMode }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = AuthManager.getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/channel-hub", label: "Channel Hub", icon: Radio },
    { path: "/marketplace", label: "Sacred Marketplace", icon: ShoppingBag },
  ];

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    AuthManager.logout();
    navigate('/login');
    closeSidebar();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 z-40 flex flex-col shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
          <Logo size="sm" />
          <h1 className="text-xl font-bold whitespace-nowrap">SPIRITERAX</h1>
        </div>

        {/* User info section */}
        {currentUser && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar 
                fullName={currentUser.fullName} 
                size="sm" 
                showIcon={!currentUser.fullName} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentUser.fullName || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(path)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-6 border-t border-sidebar-border space-y-2">
          <button
            onClick={onToggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
          </button>

          <Link
            to="/settings"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive("/settings")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
}
