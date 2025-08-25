// client/src/components/UserSectionNav.js

import React from "react";
import { Link } from "react-router-dom";

/**
 * UserSectionNav
 * Navigation bar for user portfolio sections.
 * Features:
 * - Provides quick links to Portfolio, About, Skills, Blog, Projects
 * - Highlights the active section
 * - Includes "Contact Me" button aligned to the right
 */
export default function UserSectionNav({ userId, active }) {
  const btn = (key, to, label, extraClass = "") => (
    <Link
      to={to}
      className={`btn btn-outline-secondary ${active === key ? "active" : ""} ${extraClass}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="d-flex gap-2 mb-3">
      {btn("portfolio", `/user/${userId}`, "Portfolio & Resume")}
      {btn("about", `/user/${userId}/about`, "About")}
      {btn("skills", `/user/${userId}/skills`, "Skills")}
      {btn("blog", `/user/${userId}/blog`, "Blog")}
      {btn("projects", `/user/${userId}/projects`, "All Projects")}

      {/* Contact button on the right side */}
      <Link to={`/contact?user=${userId}`} className="btn btn-primary ms-auto">
        Contact Me
      </Link>
    </div>
  );
}
