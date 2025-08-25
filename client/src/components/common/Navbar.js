// client/src/components/Navbar.js

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * Navbar
 * Main navigation bar of the site.
 * Features:
 * - Public links: Home, About, Skills, Contact, Blog
 * - Shows "Login" if not authenticated
 * - Shows "Admin Panel" and "Logout" if logged in
 */
export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Handle logout: clear token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <NavLink className="navbar-brand" to="/">
        MyPortfolio
      </NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink end className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/skills">
              Skills
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/contact">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/blog">
              Blog
            </NavLink>
          </li>
        </ul>

        {/* Auth section */}
        <ul className="navbar-nav">
          {token ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin Panel
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
