// client/src/components/ContactPage.js

import React, { useState, useEffect } from "react";
import { api } from "../../api";
import { useSearchParams } from "react-router-dom";

/**
 * ContactPage
 * - Allows visitors to send messages to a specific admin
 * - Fetches dynamic admin list from API
 * - Client-side validation for all fields
 * - Saves the message to backend
 */
export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [admins, setAdmins] = useState([]);

  // Load admins and preselect if "user" query param is present
  useEffect(() => {
    let mounted = true;
    api
      .get("/users")
      .then((res) => {
        if (!mounted) return;
        setAdmins(res.data || []);
        const wanted = searchParams.get("user");
        if (wanted) {
          const match = res.data.find((a) => String(a.id) === String(wanted));
          if (match) setForm((f) => ({ ...f, user_id: String(match.id) }));
        }
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.user_id) errs.user_id = "Please choose a recipient";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError(null);
    if (Object.keys(errs).length) return;

    try {
      await api.post("/contacts", {
        name: form.name,
        email: form.email,
        message: form.message,
        user_id: Number(form.user_id),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "", user_id: "" });
    } catch (err) {
      console.error(err);
      setServerError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">📬 Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Want to collaborate, ask questions, or just say hi?  
        Select one of our admins and send a direct message.
      </p>

      {/* Success / Error Alerts */}
      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-300">
          ✅ Thank you! Your message has been sent.
        </div>
      )}
      {serverError && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
          ❌ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        {/* Select admin */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Send to</label>
          <select
            name="user_id"
            className={`w-full border rounded-md p-3 focus:ring focus:ring-indigo-200 ${
              errors.user_id ? "border-red-500" : "border-gray-300"
            }`}
            value={form.user_id}
            onChange={handleChange}
          >
            <option value="">Choose admin…</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name} (@{a.username})
              </option>
            ))}
          </select>
          {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            name="name"
            type="text"
            className={`w-full border rounded-md p-3 focus:ring focus:ring-indigo-200 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            name="email"
            type="email"
            className={`w-full border rounded-md p-3 focus:ring focus:ring-indigo-200 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            rows="4"
            className={`w-full border rounded-md p-3 focus:ring focus:ring-indigo-200 resize-none ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            value={form.message}
            onChange={handleChange}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition-smooth"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
