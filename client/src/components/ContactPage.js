// client/src/components/ContactPage.js
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";

export default function ContactPage() {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ name:"", email:"", message:"", user_id:"" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    let mounted = true;

    api.get("/users")
      .then(res => {
        if (!mounted) return;
        setAdmins(res.data);

        const wanted = searchParams.get("user");
        if (wanted) {
          const match = res.data.find(a => String(a.id) === String(wanted));
          if (match) setForm(f => ({ ...f, user_id: String(match.id) }));
        }
      })
      .catch(console.error);

    return () => { mounted = false; };
  }, [searchParams]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.user_id) errs.user_id = "Please choose a recipient";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async e => {
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
      setForm({ name:"", email:"", message:"", user_id:"" });
    } catch (err) {
      console.error(err);
      setServerError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 640 }}>
      <h1>Contact Me</h1>
      {submitted && <div className="alert alert-success">Thank you!</div>}
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Send to</label>
          <select
            name="user_id"
            className={`form-select ${errors.user_id?'is-invalid':''}`}
            value={form.user_id}
            onChange={handleChange}
          >
            <option value="">Choose admin…</option>
            {admins.map(a => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name} (@{a.username})
              </option>
            ))}
          </select>
          {errors.user_id && <div className="invalid-feedback">{errors.user_id}</div>}
        </div>

        {["name","email","message"].map(f => (
          <div className="mb-3" key={f}>
            <label className="form-label">{f[0].toUpperCase()+f.slice(1)}</label>
            {f === "message" ? (
              <textarea
                name={f}
                rows="4"
                className={`form-control ${errors[f]?'is-invalid':''}`}
                value={form[f]}
                onChange={handleChange}
              />
            ) : (
              <input
                name={f}
                type={f==="email"?"email":"text"}
                className={`form-control ${errors[f]?'is-invalid':''}`}
                value={form[f]}
                onChange={handleChange}
              />
            )}
            {errors[f] && <div className="invalid-feedback">{errors[f]}</div>}
          </div>
        ))}

        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
