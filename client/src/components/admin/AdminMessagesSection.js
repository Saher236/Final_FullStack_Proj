// client/src/components/admin/AdminMessagesSection.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminMessagesSection
 * Displays all contact messages received by the admin.
 */
export default function AdminMessagesSection() {
  const [msgs, setMsgs] = useState([]);
  const [error, setError] = useState(null);

  // Load messages
  useEffect(() => {
    api
      .get("/contacts/mine")
      .then((res) => setMsgs(res.data))
      .catch(() => setError("Failed to load messages"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      setMsgs((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {!msgs.length ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {msgs.map((m) => (
            <li key={m.id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <strong>{m.name}</strong>{" "}
                  <span className="text-gray-500">&lt;{m.email}&gt;</span>
                  <p className="mt-1">{m.message}</p>
                  <small className="text-gray-400">
                    {new Date(m.created_at).toLocaleString()}
                  </small>
                </div>
                <button
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
