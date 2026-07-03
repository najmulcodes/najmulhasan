"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const navbar = navRef.current;
    const onScroll = () => {
      if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    ["/#hero", "Home"],
    ["/#about", "About"],
    ["/#ventures", "Ventures"],
    ["/#skills", "Skills"],
    ["/#projects", "Projects"],
    ["/#experience", "Experience"],
    ["/#contact", "Contact"],
  ];

  return (
    <>
      <nav className="p-nav" ref={navRef}>
        <div className="p-logo">
          <span className="bracket">&lt;C/&gt; </span>
          <span className="pname">NajmulHasan</span>
        </div>
        <ul className="p-nav-links">
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
        <div className="p-nav-icons">
          <a href="https://github.com/najmulcodes" target="_blank" rel="noreferrer" aria-label="GitHub">
            <i className="fab fa-github" />
          </a>
          <a href="https://www.linkedin.com/in/najmulcodes/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin" />
          </a>
          <a href="https://wa.me/8801840242448" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <i className="fab fa-whatsapp" />
          </a>
          <button
            className={`p-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — ONE instance only */}
      <div className={`p-mobile-menu${menuOpen ? " open" : ""}`}>
        <ul>
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <Link href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-mobile-menu-icons">
          <a href="https://github.com/najmulcodes" target="_blank" rel="noreferrer">
            <i className="fab fa-github" />
          </a>
          <a href="https://www.linkedin.com/in/najmulcodes/" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin" />
          </a>
          <a href="https://wa.me/8801840242448" target="_blank" rel="noreferrer">
            <i className="fab fa-whatsapp" />
          </a>
        </div>
      </div>
    </>
  );
}
