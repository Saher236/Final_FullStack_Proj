// client/src/components/NotFound.js

import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFound
 * Simple fallback page for unknown routes (404).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-10">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
