"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Synd = { devto?: string; hashnode?: string; blogger?: string };
type Cfg = { siteUrl: string; gscProperty: string; devto: boolean; hashnode: boolean; blogger: boolean; indexnow: boolean };
type Meta = { slug: string; title: string; date: string; draft: boolean; tags: string[]; syndication: Synd };
type Form = {
  slug: string; title: string; seoTitle: string; description: string; date: string;
  tags: string; keyword: string; draft: boolean; linkedin: string; bnTitle: string; bnSummary: string; body: string;
};
type Msg = { kind: "ok" | "err"; text: string } | null;

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const emptyForm = (): Form => ({
  slug: "", title: "", seoTitle: "", description: "", date: today(), tags: "", keyword: "", draft: true, linkedin: "", bnTitle: "", bnSummary: "", body: "",
});

class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? `HTTP ${res.status}`);
  return data as T;
}

const post = <T,>(path: string, body: unknown) => api<T>(path, { method: "POST", body: JSON.stringify(body) });
const errText = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
const copy = async (text: string) => { await navigator.clipboard.writeText(text); };
const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export default function AdminPage() {
  const [phase, setPhase] = useState<"loading" | "login" | "app">("loading");
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [editing, setEditing] = useState<string | null | undefined>(undefined); // undefined = list, null = new

  useEffect(() => {
    api<Cfg>("/api/admin/session").then((c) => { setCfg(c); setPhase("app"); }).catch(() => setPhase("login"));
  }, []);

  const onUnauthorized = useCallback(() => setPhase("login"), []);

  if (phase === "loading") return <p className="adm-center">Loading…</p>;
  if (phase === "login") return <Login onDone={() => api<Cfg>("/api/admin/session").then((c) => { setCfg(c); setPhase("app"); })} />;

  return (
    <div className="adm-wrap">
      <header className="adm-top">
        <strong>Articles admin</strong>
        <span className="adm-sp" />
        <button className="adm-btn ghost" onClick={async () => { await post("/api/admin/logout", {}); setPhase("login"); }}>Log out</button>
      </header>
      {editing === undefined
        ? <List onOpen={(s) => setEditing(s)} onUnauthorized={onUnauthorized} />
        : <Editor key={String(editing)} slug={editing} cfg={cfg!} onBack={() => setEditing(undefined)} onUnauthorized={onUnauthorized} />}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="adm-center">
      <form className="adm-card adm-login" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr("");
        try { await post("/api/admin/login", { password: pw }); onDone(); } catch (x) { setErr(errText(x)); } finally { setBusy(false); }
      }}>
        <h1>Admin</h1>
        <input type="password" autoComplete="current-password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        <button className="adm-btn" disabled={busy || !pw}>{busy ? "…" : "Log in"}</button>
        {err && <p className="adm-err">{err}</p>}
      </form>
    </div>
  );
}

function List({ onOpen, onUnauthorized }: { onOpen: (s: string | null) => void; onUnauthorized: () => void }) {
  const [items, setItems] = useState<Meta[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api<{ articles: Meta[] }>("/api/admin/articles")
      .then((r) => setItems(r.articles))
      .catch((e) => (e instanceof ApiError && e.status === 401 ? onUnauthorized() : setErr(errText(e))));
  }, [onUnauthorized]);

  return (
    <section>
      <div className="adm-row">
        <h1>Articles</h1><span className="adm-sp" />
        <button className="adm-btn" onClick={() => onOpen(null)}>+ New article</button>
      </div>
      {err && <p className="adm-err">{err}</p>}
      {!items && !err && <p className="adm-muted">Loading from GitHub…</p>}
      {items && items.length === 0 && <p className="adm-muted">No articles yet.</p>}
      <ul className="adm-list">
        {items?.map((a) => (
          <li key={a.slug} className="adm-card">
            <div className="adm-grow">
              <button className="adm-link" onClick={() => onOpen(a.slug)}>{a.title}</button>
              <div className="adm-muted">{a.date} · {a.slug}</div>
            </div>
            <span className={`adm-badge ${a.draft ? "draft" : "live"}`}>{a.draft ? "Draft" : "Published"}</span>
            {a.syndication.devto && <span className="adm-badge">dev.to</span>}
            {a.syndication.hashnode && <span className="adm-badge">Hashnode</span>}
            {a.syndication.blogger && <span className="adm-badge">Blogger</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function seoChecks(f: Form, siteUrl: string) {
  const words = f.body.trim().split(/\s+/).filter(Boolean);
  const first100 = words.slice(0, 100).join(" ").toLowerCase();
  const t = f.seoTitle || f.title;
  return [
    { ok: !!f.seoTitle && f.seoTitle.length <= 45, text: `SEO title ≤ 45 chars (${f.seoTitle.length})` },
    { ok: f.description.length >= 120 && f.description.length <= 160, text: `Description 120–160 chars (${f.description.length})` },
    { ok: !!f.keyword && t.toLowerCase().includes(f.keyword.toLowerCase()), text: "Keyword in the title" },
    { ok: !!f.keyword && first100.includes(f.keyword.toLowerCase()), text: "Keyword in the first 100 words" },
    { ok: (f.body.match(/^## /gm) ?? []).length >= 3, text: "At least 3 H2 sections" },
    { ok: words.length >= 600, text: `600+ words (${words.length})` },
    { ok: f.body.includes(`${siteUrl}/blog/`), text: "Links to another article of yours" },
  ];
}

function Editor({ slug, cfg, onBack, onUnauthorized }: { slug: string | null; cfg: Cfg; onBack: () => void; onUnauthorized: () => void }) {
  const isNew = slug === null;
  const [form, setForm] = useState<Form>(emptyForm());
  const [sha, setSha] = useState<string | undefined>();
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [persistedDraft, setPersistedDraft] = useState<boolean | null>(null);
  const [syndication, setSyndication] = useState<Synd>({});
  const [tab, setTab] = useState<"write" | "preview" | "distribute">("write");
  const [html, setHtml] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  const fail = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) onUnauthorized(); else setMsg({ kind: "err", text: errText(e) });
  }, [onUnauthorized]);

  useEffect(() => {
    if (!slug) return;
    api<{ article: Omit<Form, "tags"> & { tags: string[] }; sha: string; syndication: Synd }>(`/api/admin/articles?slug=${encodeURIComponent(slug)}`)
      .then((r) => {
        setForm({ ...r.article, tags: r.article.tags.join(", ") });
        setSha(r.sha); setPersistedDraft(r.article.draft); setSyndication(r.syndication); setLoaded(true);
      })
      .catch(fail);
  }, [slug, fail]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const url = `${cfg.siteUrl}/blog/${form.slug}`;
  const checks = useMemo(() => seoChecks(form, cfg.siteUrl), [form, cfg.siteUrl]);

  async function save(draft: boolean) {
    setBusy(true); setMsg(null);
    try {
      const r = await post<{ sha: string }>("/api/admin/articles", {
        ...form, draft, sha,
        tags: form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      });
      setSha(r.sha); setSlugLocked(true); setPersistedDraft(draft); set("draft", draft);
      setMsg({ kind: "ok", text: draft ? "Saved as draft (committed to GitHub)." : "Published: committed to GitHub, Vercel is deploying." });
      if (!draft) setTab("distribute");
    } catch (e) { fail(e); } finally { setBusy(false); }
  }

  async function loadPreview() {
    setTab("preview");
    try { setHtml((await post<{ html: string }>("/api/admin/preview", { markdown: form.body })).html); } catch (e) { fail(e); }
  }

  const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const defaultLinkedin = `${form.description}\n\nFull write-up with code: link in the first comment.\n\n${tags.slice(0, 3).map((t) => "#" + t.replace(/[^a-z0-9]/gi, "")).join(" ")}`;

  if (!loaded) return <p className="adm-muted">{msg?.text ?? "Loading…"}</p>;

  return (
    <section>
      <div className="adm-row">
        <button className="adm-btn ghost" onClick={onBack}>← All articles</button>
        <span className="adm-sp" />
        <span className={`adm-badge ${persistedDraft === false ? "live" : "draft"}`}>{persistedDraft === null ? "New" : persistedDraft ? "Draft" : "Published"}</span>
      </div>

      <nav className="adm-tabs">
        <button className={tab === "write" ? "on" : ""} onClick={() => setTab("write")}>Write</button>
        <button className={tab === "preview" ? "on" : ""} onClick={loadPreview}>Preview</button>
        <button className={tab === "distribute" ? "on" : ""} onClick={() => setTab("distribute")} disabled={persistedDraft !== false}>Distribute</button>
      </nav>

      {msg && <p className={msg.kind === "ok" ? "adm-ok" : "adm-err"}>{msg.text}</p>}

      {tab === "write" && (
        <div className="adm-grid">
          <div className="adm-fields">
            <label>Title (H1)<input value={form.title} onChange={(e) => { set("title", e.target.value); if (!slugLocked) set("slug", slugify(e.target.value)); }} maxLength={120} /></label>
            <label>SEO title <small>{form.seoTitle.length}/45: becomes the browser/Google title</small><input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={70} /></label>
            <label>Description <small>{form.description.length}/160</small><textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={300} /></label>
            <div className="adm-two">
              <label>Slug<input value={form.slug} disabled={slugLocked} onChange={(e) => set("slug", slugify(e.target.value))} /></label>
              <label>Date<input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></label>
            </div>
            <div className="adm-two">
              <label>Primary keyword<input value={form.keyword} onChange={(e) => set("keyword", e.target.value)} /></label>
              <label>Tags (comma separated, max 8)<input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="nextjs, supabase" /></label>
            </div>
            <label>Bangla title <small>optional: for the Blogger summary post</small><input value={form.bnTitle} onChange={(e) => set("bnTitle", e.target.value)} maxLength={150} lang="bn" /></label>
            <label>Bangla summary <small>{form.bnSummary.length}/1500: 3–5 short paragraphs, written by you. Posted to Blogger with a link to the English article.</small><textarea rows={5} value={form.bnSummary} onChange={(e) => set("bnSummary", e.target.value)} maxLength={1500} lang="bn" /></label>
            <label>Body (Markdown)<textarea className="adm-body" rows={26} value={form.body} onChange={(e) => set("body", e.target.value)} spellCheck /></label>
          </div>
          <aside className="adm-side">
            <div className="adm-card">
              <h3>SEO checklist</h3>
              <ul className="adm-checks">{checks.map((c) => <li key={c.text} className={c.ok ? "ok" : ""}>{c.ok ? "✓" : "○"} {c.text}</li>)}</ul>
            </div>
            <div className="adm-card adm-actions">
              <button className="adm-btn ghost" disabled={busy} onClick={() => save(true)}>Save draft</button>
              <button className="adm-btn" disabled={busy} onClick={() => save(false)}>{persistedDraft === false ? "Update published" : "Publish"}</button>
              {persistedDraft === false && <button className="adm-btn danger" disabled={busy} onClick={() => save(true)}>Unpublish</button>}
              <p className="adm-muted">Every save is one Git commit and one Vercel deploy (about 1–2 min).</p>
            </div>
          </aside>
        </div>
      )}

      {tab === "preview" && (
        <article className="adm-prev">
          <h1>{form.title}</h1>
          <div className="adm-prevbody" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      )}

      {tab === "distribute" && persistedDraft === false && (
        <Distribute form={form} url={url} cfg={cfg} syndication={syndication} setSyndication={setSyndication}
          linkedin={form.linkedin || defaultLinkedin} onLinkedin={(v) => set("linkedin", v)} saveLinkedin={() => save(false)} fail={fail} />
      )}
    </section>
  );
}

function Distribute({ form, url, cfg, syndication, setSyndication, linkedin, onLinkedin, saveLinkedin, fail }: {
  form: Form; url: string; cfg: Cfg; syndication: Synd; setSyndication: (s: Synd) => void;
  linkedin: string; onLinkedin: (v: string) => void; saveLinkedin: () => void; fail: (e: unknown) => void;
}) {
  const [live, setLive] = useState<boolean | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});
  const flash = (k: string, v: string) => setNote((n) => ({ ...n, [k]: v }));

  const check = useCallback(async () => {
    try { setLive((await api<{ live: boolean }>(`/api/admin/status?slug=${encodeURIComponent(form.slug)}`)).live); } catch (e) { fail(e); }
  }, [form.slug, fail]);

  useEffect(() => {
    check();
    const id = setInterval(() => { if (!live) check(); }, 8000);
    return () => clearInterval(id);
  }, [check, live]);

  const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const markdown = `${form.body.trim()}\n\n---\n\n*Originally published at [${url.replace(/^https?:\/\//, "")}](${url}).*\n`;

  async function run(key: string, fn: () => Promise<string>) {
    flash(key, "…");
    try { flash(key, await fn()); } catch (e) { flash(key, ""); fail(e); }
  }

  return (
    <div className="adm-dist">
      <Step n={1} title="Deploy" state={live ? "done" : "wait"}
        desc={live ? "Live on your site." : "Waiting for Vercel to finish deploying (checks every 8 s)…"}>
        <button className="adm-btn ghost" onClick={check}>Check now</button>
        <button className="adm-btn ghost" onClick={() => open(url)}>Open article</button>
      </Step>

      <Step n={2} title="Google" state="manual"
        desc="Google has no API for normal pages. Open Search Console, paste the URL in the top bar, click Request indexing (about 20 s).">
        <button className="adm-btn" onClick={async () => { await copy(url); open(`https://search.google.com/search-console?resource_id=${encodeURIComponent(cfg.gscProperty)}`); flash("gsc", "URL copied. Paste it into the inspect bar."); }}>Copy URL + open Search Console</button>
        <small>{note.gsc}</small>
      </Step>

      <Step n={3} title="Bing / Yandex (IndexNow)" state={cfg.indexnow ? "auto" : "off"}
        desc={cfg.indexnow ? "One click, instant." : "Set INDEXNOW_KEY in Vercel to enable."}>
        <button className="adm-btn" disabled={!cfg.indexnow || !live} onClick={() => run("in", async () => { await post("/api/admin/indexnow", { slug: form.slug }); return "Submitted ✓"; })}>Notify</button>
        <small>{note.in}</small>
      </Step>

      <Step n={4} title="dev.to" state={syndication.devto ? "done" : cfg.devto ? "auto" : "off"}
        desc={syndication.devto ? `Already created: ${syndication.devto}` : cfg.devto ? "Canonical URL points to your site. Create a draft first, review it on dev.to, then publish." : "Set DEVTO_API_KEY in Vercel to enable."}>
        {syndication.devto
          ? <button className="adm-btn ghost" onClick={() => open(syndication.devto!)}>Open on dev.to</button>
          : <>
              <button className="adm-btn" disabled={!cfg.devto || !live} onClick={() => run("dv", async () => { const r = await post<{ url: string }>("/api/admin/devto", { slug: form.slug, publish: false }); setSyndication({ ...syndication, devto: r.url }); return "Draft created ✓"; })}>Create draft</button>
              <button className="adm-btn ghost" disabled={!cfg.devto || !live} onClick={() => run("dv", async () => { const r = await post<{ url: string }>("/api/admin/devto", { slug: form.slug, publish: true }); setSyndication({ ...syndication, devto: r.url }); return "Published ✓"; })}>Publish now</button>
            </>}
        <small>{note.dv}</small>
      </Step>

      <Step n={5} title="Hashnode" state={syndication.hashnode ? "done" : cfg.hashnode ? "auto" : "manual"}
        desc={syndication.hashnode ? `Already posted: ${syndication.hashnode}` : cfg.hashnode ? "Posts to your Hashnode blog with the original URL set to your site. Copy buttons stay as a manual fallback." : "Set HASHNODE_TOKEN in Vercel to enable one-click posting, or paste manually: set the original article URL in the editor."}>
        {cfg.hashnode && !syndication.hashnode && (
          <button className="adm-btn" disabled={!live} onClick={() => run("hn", async () => { const r = await post<{ url: string }>("/api/admin/hashnode", { slug: form.slug }); setSyndication({ ...syndication, hashnode: r.url }); return "Posted ✓"; })}>Post to Hashnode</button>
        )}
        {syndication.hashnode && <button className="adm-btn ghost" onClick={() => open(syndication.hashnode!)}>Open on Hashnode</button>}
        <button className="adm-btn ghost" onClick={async () => { await copy(form.title); flash("hn", "Title copied"); }}>Copy title</button>
        <button className="adm-btn ghost" onClick={async () => { await copy(markdown); flash("hn", "Markdown copied"); }}>Copy markdown</button>
        <button className="adm-btn ghost" onClick={async () => { await copy(url); flash("hn", "Original URL copied"); }}>Copy original URL</button>
        <button className="adm-btn ghost" onClick={() => open("https://hashnode.com")}>Open Hashnode</button>
        <small>{note.hn}</small>
      </Step>

      <Step n={6} title="Blogger (Bangla summary)" state={syndication.blogger ? "done" : cfg.blogger ? "auto" : "off"}
        desc={syndication.blogger ? `Already posted: ${syndication.blogger}` : cfg.blogger ? (form.bnTitle && form.bnSummary ? "Posts your Bangla title and summary with a link to the English original (never the full article)." : "Fill in the Bangla title and summary on the Write tab, click Update published, then post.") : "Set the BLOGGER_* variables in Vercel to enable (see ADMIN-SETUP.md)."}>
        {syndication.blogger
          ? <button className="adm-btn ghost" onClick={() => open(syndication.blogger!)}>Open on Blogger</button>
          : <button className="adm-btn" disabled={!cfg.blogger || !live || !form.bnTitle || !form.bnSummary} onClick={() => run("bl", async () => { const r = await post<{ url: string }>("/api/admin/blogger", { slug: form.slug }); setSyndication({ ...syndication, blogger: r.url }); return "Posted ✓"; })}>Post to Blogger</button>}
        <small>{note.bl}</small>
      </Step>

      <Step n={7} title="Medium" state="manual"
        desc="No public API for new accounts. Use Import a story with your URL; Medium sets the canonical to your site.">
        <button className="adm-btn" onClick={async () => { await copy(url); open("https://medium.com/p/import"); flash("md", "URL copied. Paste it in the import box."); }}>Copy URL + open import</button>
        <small>{note.md}</small>
      </Step>

      <Step n={8} title="LinkedIn" state="manual"
        desc="Post the text, then add the article link as the first comment (links in the body reduce reach).">
        <textarea rows={7} value={linkedin} onChange={(e) => onLinkedin(e.target.value)} />
        <div className="adm-row">
          <button className="adm-btn" onClick={async () => { await copy(linkedin); flash("li", "Post text copied"); }}>Copy post</button>
          <button className="adm-btn ghost" onClick={async () => { await copy(url); flash("li", "Link copied for the first comment"); }}>Copy link (first comment)</button>
          <button className="adm-btn ghost" onClick={() => open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedin)}`)}>Open composer</button>
          <button className="adm-btn ghost" onClick={saveLinkedin}>Save text with article</button>
        </div>
        <small>{note.li}</small>
      </Step>
    </div>
  );
}

function Step({ n, title, desc, state, children }: { n: number; title: string; desc: string; state: "done" | "wait" | "manual" | "auto" | "off"; children: React.ReactNode }) {
  const label = { done: "Done", wait: "Waiting", manual: "Manual", auto: "Automatic", off: "Not configured" }[state];
  return (
    <div className="adm-card adm-step">
      <div className="adm-row"><strong>{n}. {title}</strong><span className="adm-sp" /><span className={`adm-badge ${state}`}>{label}</span></div>
      <p className="adm-muted">{desc}</p>
      <div className="adm-actions-row">{children}</div>
    </div>
  );
}
