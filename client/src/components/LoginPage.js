// client/src/components/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      nav("/admin", { replace: true });
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
        <input className="form-control mb-2" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
