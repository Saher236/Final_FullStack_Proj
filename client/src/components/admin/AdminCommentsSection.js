// client/src/components/admin/AdminCommentsSection.js
import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminCommentsSection
 * Admin panel section to manage blog post comments.
 *
 * Features:
 * - Loads all comments for posts owned by the admin
 * - Approve comments
 * - Delete comments
 */
export default function AdminCommentsSection() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load comments from API
  const fetchComments = () => {
    setLoading(true);
    api.get("/comments/all")
      .then((res) => setComments(res.data || []))
      .catch((err) => {
        console.error("Error loading comments:", err);
        setError("Failed to load comments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Approve a comment
  const handleApprove = async (id) => {
    try {
      await api.put(`/comments/${id}/approve`);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Failed to approve comment");
    }
  };

  // Delete a comment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading comments…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h5 className="mb-3 font-semibold text-lg">Manage Blog Comments</h5>
      {!comments.length ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="p-3 bg-gray-100 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <strong>{c.user_name}</strong>{" "}
                  <span className="text-gray-500">
                    ({new Date(c.created_at).toLocaleString()})
                  </span>
                  <p className="mb-1">{c.content}</p>
                  <small className="text-gray-500">Post ID: {c.post_id}</small>
                </div>
                <div className="flex gap-2">
                  {!c.approved && (
                    <button
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                      onClick={() => handleApprove(c.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
