import Link from "next/link";
import "../app/blog/blog.css";

// Fill this in. While it still starts with "[" it renders as plain text, not a broken mailto: link.
export const SUPPORT_EMAIL = "hello@navicore.co";

export function Email() {
  return SUPPORT_EMAIL.startsWith("[") ? (
    <>{SUPPORT_EMAIL}</>
  ) : (
    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
  );
}

// Server component: static markup only, no client JS of its own.
// Reuses the blog's look (blog.css) so legal pages match /blog.
export default function LegalShell({ title, updatedIso, updatedLabel, children }) {
  return (
    <div className="b-root">
      <header className="b-head">
        <nav className="b-nav" aria-label="Site">
          <Link href="/" className="b-brand">
            <span>&lt;C/&gt;</span> NajmulHasan
          </Link>
          <ul className="b-links">
            <li><Link href="/">Portfolio</Link></li>
            <li><Link href="/blog">Articles</Link></li>
          </ul>
        </nav>
      </header>
      <main className="b-main">
        <h1 className="b-h1">{title}</h1>
        <p className="b-meta">
          Last updated: <time dateTime={updatedIso}>{updatedLabel}</time>
        </p>
        <div className="b-body" style={{ marginTop: 32 }}>{children}</div>
      </main>
      <footer className="b-foot">
        © {new Date().getFullYear()} Najmul Hasan ·{" "}
        <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
}
