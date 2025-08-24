// client/src/components/UserAboutPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import UserSectionNav from "./UserSectionNav";

export default function UserAboutPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    api.get(`/profiles/user/${userId}`)
      .then(res => setProfile(res.data))
      .catch(e => { console.error(e); setErr("Failed to load profile"); })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="about" />
      <h1>About</h1>

      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && (
        <p style={{ whiteSpace: "pre-wrap" }}>
          {profile?.about || "—"}
        </p>
      )}
    </div>
  );
}
