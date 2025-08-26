// client/src/components/user/UserSectionNav.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  User,
  Briefcase,
  BookOpen,
  Layers,
  MessageCircle,
} from "lucide-react";

/**
 * UserSectionNav
 * - Styled like Navbar
 * - Shows Portfolio sections with icons
 * - Contact button floats right
 */
export default function UserSectionNav({ userId, active, userName }) {
  const linkClass = (key) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
      active === key
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:text-indigo-500 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-16 z-40 glass-effect shadow-md mb-6">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3 h-12">

        {/* Optional Developer Name */}
        {userName && (
          <span className="mr-4 text-gray-700 font-semibold">
            👤 {userName}
          </span>
        )}

        {/* Links */}
        <Link to={`/user/${userId}`} className={linkClass("portfolio")}>
          <FileText size={16} /> Portfolio & Resume
        </Link>
        <Link to={`/user/${userId}/about`} className={linkClass("about")}>
          <User size={16} /> About
        </Link>
        <Link to={`/user/${userId}/skills`} className={linkClass("skills")}>
          <Briefcase size={16} /> Skills
        </Link>
        <Link to={`/user/${userId}/blog`} className={linkClass("blog")}>
          <BookOpen size={16} /> Blog
        </Link>
        <Link to={`/user/${userId}/projects`} className={linkClass("projects")}>
          <Layers size={16} /> Projects
        </Link>

        {/* Contact */}
        <Link
          to={`/contact?user=${userId}`}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
        >
          <MessageCircle size={16} /> Contact Me
        </Link>
      </div>
    </nav>
  );
}
