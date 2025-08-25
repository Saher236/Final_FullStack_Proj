// client/src/components/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../../api";

/**
 * LoginPage
 * Simple login form for admins.
 * Features:
 * - Sends username and password to /auth/login
 * - Stores JWT token in localStorage
 * - Sets token in axios headers for authenticated requests
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
      setError("Login failed");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 420 }}>
      <h1>Login</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}