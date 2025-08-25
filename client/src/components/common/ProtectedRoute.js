// client/src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Wrapper for routes that require authentication.
 * - Redirects to login page if no token is found
 * - Otherwise renders the child component
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
