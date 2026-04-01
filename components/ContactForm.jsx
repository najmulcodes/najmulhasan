"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/mlgolyed", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        .cf-card{
          background:var(--bg2);border:1px solid var(--border);
          border-radius:16px;padding:20px 22px;position:relative;
          overflow:hidden;margin-bottom:0;
        }
        .cf-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,var(--teal),rgba(0,229,195,.1));
        }
        .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cf-group{margin-bottom:12px}
        .cf-lbl{
          display:block;font-size:.72rem;font-weight:600;
          color:var(--white);margin-bottom:5px;letter-spacing:.04em;
        }
        .cf-input,.cf-textarea{
          width:100%;box-sizing:border-box;
          background:var(--bg);border:1px solid var(--border);
          border-radius:9px;padding:9px 13px;
          color:var(--white);font-size:.84rem;
          font-family:var(--fh);transition:border-color .2s,box-shadow .2s;
          outline:none;resize:none;
        }
        .cf-input::placeholder,.cf-textarea::placeholder{color:var(--muted)}
        .cf-input:focus,.cf-textarea:focus{
          border-color:var(--teal-mid);
          box-shadow:0 0 0 3px rgba(0,229,195,.07);
        }
        .cf-textarea{min-height:90px}
        .cf-btn{
          width:100%;padding:10px 20px;background:var(--teal);
          color:#0d1117;font-family:var(--fh);font-weight:700;
          font-size:.86rem;border:none;border-radius:9px;
          cursor:pointer;display:flex;align-items:center;
          justify-content:center;gap:8px;
          transition:opacity .2s,transform .2s,box-shadow .2s;margin-top:2px;
        }
        .cf-btn:hover:not(:disabled){
          opacity:.88;transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(0,229,195,.28);
        }
        .cf-btn:disabled{opacity:.55;cursor:not-allowed}
        .cf-status{
          margin-top:14px;padding:13px;border-radius:10px;
          font-size:.85rem;font-weight:600;text-align:center;
        }
        .cf-status.success{
          background:rgba(63,185,80,.1);
          border:1px solid rgba(63,185,80,.22);color:#3fb950;
        }
        .cf-status.error{
          background:rgba(248,81,73,.1);
          border:1px solid rgba(248,81,73,.22);color:#f85149;
        }
        @media(max-width:500px){.cf-row{grid-template-columns:1fr}}
      `}</style>

      <form className="cf-card p-reveal" onSubmit={handleSubmit}>
        <div className="cf-row">
          <div className="cf-group">
            <label className="cf-lbl">Name</label>
            <input className="cf-input" type="text" name="name" placeholder="Your name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="cf-group">
            <label className="cf-lbl">Email</label>
            <input className="cf-input" type="email" name="email" placeholder="your@email.com"
              value={form.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="cf-group">
          <label className="cf-lbl">Subject</label>
          <input className="cf-input" type="text" name="subject" placeholder="What's this about?"
            value={form.subject} onChange={handleChange} />
        </div>
        <div className="cf-group">
          <label className="cf-lbl">Message</label>
          <textarea className="cf-textarea" name="message" placeholder="Your message..."
            value={form.message} onChange={handleChange} required />
        </div>
        <button className="cf-btn" type="submit" disabled={status === "sending"}>
          <i className="fas fa-paper-plane" />
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        {status === "success" && (
          <div className="cf-status success">✓ Message sent! I&apos;ll get back to you soon.</div>
        )}
        {status === "error" && (
          <div className="cf-status error">Something went wrong. Please try emailing me directly.</div>
        )}
      </form>
    </>
  );
}