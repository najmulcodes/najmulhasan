"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="p-footer">
      <p>
        © {year} <span>Najmul Hasan. All rights reserved.</span> — Full Stack
        Developer · Dhaka, Bangladesh
      </p>
    </footer>
  );
}
