"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [year] = useState(new Date().getFullYear());

  return (
    <footer className="p-footer">
      <style>{`
        .p-footer-links{margin-top:8px}
        .p-footer-links a{color:var(--muted);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .p-footer-links a:hover{color:var(--teal)}
      `}</style>
      <p>
        © {year} <span>Najmul Hasan. All rights reserved.</span> — Founder & CEO, NAVICORE · Dhaka, Bangladesh
      </p>
      <p className="p-footer-links">
        <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link>
      </p>
    </footer>
  );
}
