// client/src/components/auth/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../../api";

/**
 * LoginPage
 * Modern login form for admins.
 * Features:
 * - Validates input fields
 * - Sends credentials to backend (/auth/login)
 * - Stores JWT token in localStorage
 * - Configures axios with token for authenticated requests
 * - Redirects to admin panel on success
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle login form submission
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", { username, password });

      // Save token and configure axios
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);

      // Redirect to admin panel
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Username */}
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
