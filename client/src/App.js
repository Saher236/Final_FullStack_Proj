// client/src/App.js

import React from "react";
import { Routes, Route  } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage           from "./components/HomePage";
import AboutPage          from "./components/AboutPage";
import SkillsPage         from "./components/SkillsPage";
import ContactPage        from "./components/ContactPage";
import BlogListPage       from "./components/BlogListPage";
import BlogPostPage       from "./components/BlogPostPage";
// import TeamPage           from "./components/TeamPage";

import UserPortfolioPage  from "./components/UserPortfolioPage";
import UserAboutPage      from "./components/UserAboutPage";
import UserSkillsPage     from "./components/UserSkillsPage";
import UserBlogListPage   from "./components/UserBlogListPage";
import UserProjectsPage   from "./components/UserProjectsPage";
import UserProjectPage    from "./components/UserProjectPage";

import LoginPage          from "./components/LoginPage";
import AdminPage          from "./components/AdminPage";
import AdminBlogPage      from "./components/AdminBlogPage";
import ProtectedRoute     from "./components/ProtectedRoute";
import NotFound           from "./components/NotFound";

export default function App() {
  return (
    <>
      {/* <nav className="navbar navbar-dark bg-dark navbar-expand">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">MyPortfolio</Link>
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/skills">Skills</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li> */}
            {/* <li className="nav-item"><Link className="nav-link" to="/team">Team</Link></li> */}
          {/* </ul>
          <div className="ms-auto">
            <Link className="btn btn-outline-light me-2" to="/admin">Admin Panel</Link>
            <Link className="btn btn-outline-secondary" to="/login">Login</Link>
          </div>
        </div>
      </nav> */}

      <Navbar />

      <Routes>
        {/* דפים כלליים */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/team" element={<TeamPage />} /> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* דפים לכל משתמש */}
        <Route path="/user/:userId" element={<UserPortfolioPage />} />
        <Route path="/user/:userId/about" element={<UserAboutPage />} />
        <Route path="/user/:userId/skills" element={<UserSkillsPage />} />
        <Route path="/user/:userId/blog" element={<UserBlogListPage />} />
        <Route path="/user/:userId/projects" element={<UserProjectsPage />} />
        <Route path="/user/:userId/projects/:projectId" element={<UserProjectPage />} />

        {/* אדמין */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              <AdminBlogPage />
            </ProtectedRoute>
          }
        />

        {/* לוגין + 404 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
