// client/src/components/common/Navbar.js

// client/src/components/Navbar.js

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";

/**
 * Navbar
 * Main navigation bar of the site (Bootstrap version).
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
    <BsNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Brand / Logo */}
        <BsNavbar.Brand as={NavLink} to="/">
          MyPortfolio
        </BsNavbar.Brand>

        {/* Mobile Toggle */}
        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          {/* Public Links */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} end to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/skills">
              Skills
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blog">
              Blog
            </Nav.Link>
          </Nav>

          {/* Auth Section */}
          <Nav>
            {token ? (
              <>
                <Nav.Link as={NavLink} to="/admin">
                  Admin Panel
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
