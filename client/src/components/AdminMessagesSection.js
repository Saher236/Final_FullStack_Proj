// client/src/components/AdminMessagesSection.js


import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminMessagesSection() {
  const [msgs, setMsgs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/contacts/mine")
      .then(res => setMsgs(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load messages");
      });
  }, []);

  const handleDelete = async id => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      setMsgs(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container my-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {!msgs.length ? <p>No messages yet.</p> : (
        <ul className="list-group">
          {msgs.map(m => (
            <li key={m.id} className="list-group-item">
              <strong>{m.name}</strong> &nbsp;<span className="text-muted">&lt;{m.email}&gt;</span>
              <p className="mb-1">{m.message}</p>
              <small className="text-muted">{new Date(m.created_at).toLocaleString()}</small>
              <button className="btn btn-sm btn-danger float-end" onClick={() => handleDelete(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
