// client/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import SkillsPage from "./components/pages/SkillsPage";
import ContactPage from "./components/pages/ContactPage";

import BlogListPage from "./components/common/blog/BlogListPage";
import BlogPostPage from "./components/common/blog/BlogPostPage";

import UserPortfolioPage from "./components/user/UserPortfolioPage";
import UserAboutPage from "./components/user/UserAboutPage";
import UserSkillsPage from "./components/user/UserSkillsPage";
import UserBlogListPage from "./components/user/UserBlogListPage";
import UserProjectsPage from "./components/user/UserProjectsPage";
import UserProjectPage from "./components/user/UserProjectPage";

import LoginPage from "./components/auth/LoginPage";
import AdminPage from "./components/admin/AdminPage";
import AdminBlogPage from "./components/admin/AdminBlogPage";

import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFound from "./components/common/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* User profile pages */}
        <Route path="/user/:userId" element={<UserPortfolioPage />} />
        <Route path="/user/:userId/about" element={<UserAboutPage />} />
        <Route path="/user/:userId/skills" element={<UserSkillsPage />} />
        <Route path="/user/:userId/blog" element={<UserBlogListPage />} />
        <Route path="/user/:userId/projects" element={<UserProjectsPage />} />
        <Route
          path="/user/:userId/projects/:projectId"
          element={<UserProjectPage />}
        />

        {/* Admin panel */}
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

        {/* Authentication and 404 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}