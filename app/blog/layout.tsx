import Link from "next/link";
import "highlight.js/styles/github-dark.css";
import "./blog.css";
import { blog } from "@/lib/blog-config";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b-root">
      <header className="b-head">
        <nav className="b-nav" aria-label="Blog">
          <Link href="/" className="b-brand">
            <span>&lt;C/&gt;</span> NajmulHasan
          </Link>
          <ul className="b-links">
            <li><Link href="/">Portfolio</Link></li>
            <li><Link href="/blog">Articles</Link></li>
            <li><a href="/feed.xml">RSS</a></li>
          </ul>
        </nav>
      </header>
      <main className="b-main">{children}</main>
      <footer className="b-foot">
        © {new Date().getFullYear()} {blog.name} · {blog.author.role} ·{" "}
        <a href={blog.org.url}>{blog.org.name}</a>
        {" · "}
        <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
      </footer>
    </div>
  );
}
