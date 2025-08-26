// client/src/components/user/UserSectionNav.js

import React from "react";
import { Link } from "react-router-dom";

/**
 * UserSectionNav
 * Navigation bar for user portfolio sections.
 * Features:
 * - Quick links to Portfolio, About, Skills, Blog, Projects
 * - Highlights active section
 * - Contact button floats to the right
 */
export default function UserSectionNav({ userId, active }) {
  const linkClass = (key) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      active === key
        ? "bg-indigo-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <Link to={`/user/${userId}`} className={linkClass("portfolio")}>
        Portfolio & Resume
      </Link>
      <Link to={`/user/${userId}/about`} className={linkClass("about")}>
        About
      </Link>
      <Link to={`/user/${userId}/skills`} className={linkClass("skills")}>
        Skills
      </Link>
      <Link to={`/user/${userId}/blog`} className={linkClass("blog")}>
        Blog
      </Link>
      <Link to={`/user/${userId}/projects`} className={linkClass("projects")}>
        All Projects
      </Link>

      <Link
        to={`/contact?user=${userId}`}
        className="ml-auto px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600 transition"
      >
        Contact Me
      </Link>
    </div>
  );
}
