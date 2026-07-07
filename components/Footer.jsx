"use client";
import { useState } from "react";

export default function Footer() {
  const [year] = useState(new Date().getFullYear());

  return (
    <footer className="p-footer">
      <p>
        © {year} <span>Najmul Hasan. All rights reserved.</span> — Founder & CEO, NAVICORE · Dhaka, Bangladesh
      </p>
      <p>
        <a href="https://profile.navicore.co" target="_blank" rel="noopener noreferrer">
          NAVICORE Company Profile
        </a>
      </p>
    </footer>
  );
}
