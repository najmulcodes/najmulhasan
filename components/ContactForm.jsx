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
          background:var(--bg2);border:1px solid var(--teal-mid);
          border-radius:var(--radius);padding:0;position:relative;
          overflow:hidden;margin-bottom:0;font-family:var(--fm);
          box-shadow:0 0 40px rgba(0,229,195,.06);
        }
        .cf-titlebar{
          display:flex;align-items:center;gap:8px;padding:11px 16px;
          background:var(--bg3);border-bottom:1px solid var(--border);
        }
        .cf-dot{width:9px;height:9px;border-radius:50%}
        .cf-dot.r{background:#ff5f56}
        .cf-dot.y{background:#ffbd2e}
        .cf-dot.g{background:#27c93f}
        .cf-titletext{margin-left:8px;font-size:.68rem;color:var(--muted);letter-spacing:.04em}
        .cf-body{padding:22px}
        .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cf-group{margin-bottom:12px}
        .cf-lbl{
          display:block;font-size:.72rem;font-weight:600;
          color:var(--teal);margin-bottom:5px;letter-spacing:.02em;
        }
        .cf-lbl::before{content:'> ';color:var(--gold)}
        .cf-input,.cf-textarea{
          width:100%;box-sizing:border-box;
          background:var(--bg);border:1px solid var(--border);
          border-radius:var(--radius);padding:9px 13px;
          color:var(--white);font-size:.84rem;
          font-family:var(--fm);transition:border-color .2s,box-shadow .2s;
          outline:none;resize:none;
        }
        .cf-input::placeholder,.cf-textarea::placeholder{color:var(--muted)}
        .cf-input:focus,.cf-textarea:focus{
          border-color:var(--teal);
          box-shadow:0 0 0 3px var(--teal-dim);
        }
        .cf-textarea{min-height:90px}
        .cf-btn{
          width:100%;padding:11px 20px;background:var(--teal);
          color:var(--bg);font-family:var(--fm);font-weight:700;
          font-size:.86rem;border:none;border-radius:var(--radius);
          cursor:pointer;display:flex;align-items:center;
          justify-content:center;gap:8px;letter-spacing:.02em;
          transition:opacity .2s,transform .2s,box-shadow .2s;margin-top:2px;
        }
        .cf-btn:hover:not(:disabled){
          opacity:.9;transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(0,229,195,.28);
        }
        .cf-btn:disabled{opacity:.55;cursor:not-allowed}
        .cf-status{
          margin-top:14px;padding:13px;border-radius:var(--radius);
          font-size:.82rem;font-weight:600;text-align:center;font-family:var(--fm);
        }
        .cf-status.success{
          background:rgba(63,185,80,.1);
          border:1px solid rgba(63,185,80,.22);color:#3fb950;
        }
        .cf-status.error{
          background:rgba(248,81,73,.1);
          border:1px solid rgba(248,81,73,.22);color:#f85149;
        }
        .cf-bn{display:block;font-size:.68rem;color:var(--muted);margin-top:2px;font-family:var(--fh);font-weight:400}
        @media(max-width:500px){.cf-row{grid-template-columns:1fr}}
      `}</style>

      <form className="cf-card p-reveal" onSubmit={handleSubmit}>
        <div className="cf-titlebar">
          <span className="cf-dot r" /><span className="cf-dot y" /><span className="cf-dot g" />
          <span className="cf-titletext">secure_channel.transmit()</span>
        </div>
        <div className="cf-body">
        <div className="cf-row">
          <div className="cf-group">
            <label className="cf-lbl">name</label>
            <input className="cf-input" type="text" name="name" placeholder="Your name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="cf-group">
            <label className="cf-lbl">email</label>
            <input className="cf-input" type="email" name="email" placeholder="your@email.com"
              value={form.email} onChange={handleChange} required />
          </div>
        </div>
        <div className="cf-group">
          <label className="cf-lbl">subject</label>
          <input className="cf-input" type="text" name="subject" placeholder="What's this about?"
            value={form.subject} onChange={handleChange} />
        </div>
        <div className="cf-group">
          <label className="cf-lbl">message</label>
          <textarea className="cf-textarea" name="message" placeholder="Your message..."
            value={form.message} onChange={handleChange} required />
        </div>
        <button className="cf-btn" type="submit" disabled={status === "sending"}>
          <i className="fas fa-paper-plane" />
          {status === "sending" ? "Transmitting…" : "Send Message"}
        </button>
        {status === "success" && (
          <div className="cf-status success">
            ✓ Transmission successful — I&apos;ll respond soon.
            <span className="cf-bn">বার্তা পাঠানো হয়েছে — শীঘ্রই উত্তর দেব।</span>
          </div>
        )}
        {status === "error" && (
          <div className="cf-status error">
            Transmission failed — please email me directly.
            <span className="cf-bn">বার্তা পাঠাতে সমস্যা হয়েছে — সরাসরি ইমেইল করুন।</span>
          </div>
        )}
        </div>
      </form>
    </>
  );
}