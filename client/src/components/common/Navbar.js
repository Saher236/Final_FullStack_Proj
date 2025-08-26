// client/src/components/common/Navbar.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Settings, Home, Info, Briefcase, MessageCircle, BookOpen } from "lucide-react";

/**
 * Navbar
 * - Responsive navigation bar with mobile drawer
 * - Shows authentication options (login/logout/admin)
 * - Styled with Tailwind + animations
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Skills", path: "/skills", icon: Briefcase },
    { name: "Contact", path: "/contact", icon: MessageCircle },
    { name: "Blog", path: "/blog", icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        
        {/* Brand */}
        <NavLink
          to="/"
          className="text-2xl font-bold primary-gradient hover:animate-glow transition-smooth"
        >
          MyPortfolio
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-smooth ${
                    isActive ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-500"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <NavLink to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-indigo-500">
                <Settings size={18} /> Admin
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="flex items-center gap-2 text-gray-600 hover:text-indigo-500">
              <User size={18} /> Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t p-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Icon size={18} /> {item.name}
              </NavLink>
            );
          })}
          <div className="border-t pt-3">
            {token ? (
              <>
                <NavLink
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Settings size={18} /> Admin
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <User size={18} /> Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
