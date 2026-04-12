"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const projects = {
  "devfolio-analyzer": {
    name: "DevFolio Analyzer",
    tagline: "GitHub profile intelligence — scored, structured, and actionable.",
    img: "/projects/devfolio-analyzer.png",
    live: "https://devfolioanalyzer.vercel.app/",
    code: "https://github.com/najmulcodes/devfolio-analyzer",
    overview:
      "Connects the GitHub REST API with Anthropic Claude to evaluate developer profiles across contribution consistency, repository quality, tech breadth, and documentation depth. Scoring is deterministic and decoupled from the AI layer — a stable numeric score is computed first, then Claude generates qualitative feedback on top of it. This ensures the dashboard renders correctly regardless of model response variance. Authenticated users get a persistent analysis history; guest mode allows instant evaluation without signup.",
    features: [
      "GitHub profile ingestion via REST API — repositories, stars, forks, commit cadence, language breakdown",
      "Deterministic scoring (0–100) across contribution consistency, tech breadth, documentation quality, and profile completeness",
      "Claude API integration constrained by a structured system prompt — AI output is schema-validated before reaching the frontend",
      "Guest mode for instant analysis without authentication",
      "Persistent analysis history per authenticated user, stored in MongoDB",
      "Interactive dashboard with KPI cards, score trends, and improvement recommendations",
    ],
    tech: {
      frontend: ["React 18", "React Router", "Recharts"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcryptjs"],
    },
    challenges: [
      "LLM output inconsistency — Claude responses varied in structure when prompts were underspecified, breaking frontend render logic",
      "GitHub API rate limits — unauthenticated requests cap at 60/hr, causing failures for users with large profiles",
      "Scoring subjectivity — defining what makes a 'strong' profile required iterating on evaluation criteria with real test accounts",
    ],
    solutions: [
      "Enforced a strict JSON schema in the system prompt with fallback defaults for missing fields; added a validation layer before the response reaches the frontend",
      "Implemented optional GitHub OAuth token pass-through for authenticated calls (5,000 req/hr), with per-user token caching in session",
      "Separated deterministic scoring logic from the AI layer entirely — the score is computed server-side first; Claude only sees the structured data, not raw API output",
    ],
    future: [
      "Repository-level language and contribution breakdown per project",
      "Side-by-side profile comparison against role-specific baselines (junior/mid/senior)",
      "Webhook-triggered re-analysis on new GitHub pushes",
    ],
  },

  livecollab: {
    name: "LiveCollab",
    tagline: "Shared Kanban state across all connected clients — no polling, no refresh.",
    img: "/projects/livecollab.png",
    live: "https://livecollab-rho.vercel.app/",
    code: "https://github.com/najmulcodes/livecollab-client",
    overview:
      "Board operations — card moves, column reorders, member presence — propagate via Socket.IO events scoped per workspace room. Drag-and-drop is optimistically applied locally on the originating client and reconciled against the server's authoritative state on broadcast; other clients update silently without re-fetch. Workspace access is enforced at socket handshake: JWT is verified and membership is checked against MongoDB before any room join is admitted. Zustand manages local board state with selector-based subscriptions to prevent unnecessary re-renders on unrelated updates.",
    features: [
      "Bidirectional Socket.IO events for card movement, creation, deletion, and column reorder — all reflected live across sessions",
      "Optimistic local state with server reconciliation on conflict — last server-confirmed state wins",
      "Live presence indicators — per-user status visible to all workspace members in real time",
      "Invite-code workspace onboarding — no email verification required to join a team",
      "Timestamped activity log persisted to MongoDB — full audit trail of board actions",
      "JWT auth at socket handshake level — room access is gated before any event is processed",
    ],
    tech: {
      frontend: ["React 18", "Vite", "Tailwind CSS", "Zustand", "React Query", "@dnd-kit"],
      backend: ["Node.js", "Express", "Socket.IO"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcrypt"],
    },
    challenges: [
      "Race conditions on simultaneous drag events from multiple clients targeting the same card position",
      "Socket room authentication — ensuring users can only emit and receive events for workspaces they belong to",
      "Zustand store hydration on socket reconnect — stale local state after a dropped connection",
    ],
    solutions: [
      "Server processes drag events sequentially per workspace; broadcasts the authoritative position to all clients including the originator, who discards their optimistic state if it differs",
      "JWT is verified on every socket handshake; room join is gated behind a workspace membership check against MongoDB before the socket is admitted to the room",
      "On reconnect, the client fetches a full board snapshot via REST then re-subscribes to socket events — socket events only handle deltas after initial hydration",
    ],
    future: [
      "Card assignment with per-user task filtering across workspaces",
      "Rich-text card descriptions with inline comment threads and @mentions",
      "Redis pub/sub adapter for horizontal Socket.IO scaling across multiple Node instances",
    ],
  },

  "microtask-platform": {
    name: "MicroTask Platform",
    tagline: "Three-sided task marketplace with server-enforced lifecycle and Stripe disbursement.",
    img: "/projects/microtask.png",
    live: "https://microtask-client-iota.vercel.app",
    code: "https://github.com/najmulcodes/microtask-client",
    overview:
      "Worker, Buyer, and Admin each operate in a role-scoped dashboard with context-appropriate data fetching and navigation. Task status transitions — draft → published → submitted → approved/rejected → paid — are validated server-side on every mutation; the client cannot skip states by crafting direct API calls. Stripe payment credits are triggered by webhook confirmation, not client callback, preventing double-credit on network retries. JWT payloads carry the user role; all API routes validate the claim before processing.",
    features: [
      "Full task lifecycle enforced at the API layer — status transitions validated server-side, not client-driven",
      "Stripe webhook-based payment confirmation — worker balances credited only after event verification",
      "Separate dashboard UX per role: Worker, Buyer, Admin — each with role-scoped data fetching",
      "Submission approval workflow with optional rejection reason returned to the worker",
      "Admin dispute resolution panel with override capability on approved/rejected outcomes",
      "Idempotency key check on webhook handler — already-processed events are logged and skipped",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Preventing double payment on network retry when Stripe webhooks arrive out of order",
      "Keeping three separate frontend experiences maintainable without significant code duplication",
      "Role changes needing to reflect immediately without forcing re-login",
    ],
    solutions: [
      "Stripe webhook handler checks an idempotency key before processing; already-handled events are logged and exited early",
      "Dashboard layouts share a common shell component; only the data-fetching hooks and route guards differ per role",
      "On role change, a silent token refresh endpoint issues a new JWT with the updated role claim; the frontend swaps the stored token without redirecting",
    ],
    future: [
      "Escrow model — Buyer funds locked on task post, released on worker approval",
      "Worker reputation scoring based on approval rate and dispute history",
      "Task category browsing with skill-tag and budget-range filtering",
    ],
  },

  "badar-uddin-welfare": {
    name: "Badar Uddin Welfare",
    tagline: "Production charity system — live deployment for a real Bangladeshi NGO.",
    img: "/projects/badaruddin.png",
    live: "https://badaruddinwelfareorg.vercel.app/",
    code: "https://github.com/najmulcodes/badaruddinwelfare-client",
    overview:
      "Deployed for active organizational use by the Badar Uddin Bepari Welfare Organization in Feni, Bangladesh. Handles the full donation lifecycle: member requests, three-tier admin review (superAdmin / admin / member), fund disbursement tracking, and beneficiary records. All role checks are enforced at the API route level — frontend guards are UI only. Cloudinary manages signed document uploads (receipts, ID files), keeping sensitive assets off the application server. OTP email verification via Brevo gates new registrations. The entire UI is in Bengali (Hind Siliguri), requiring deliberate font loading and spacing decisions.",
    features: [
      "Three-tier RBAC enforced server-side: superAdmin → admin → member with scoped API permissions",
      "Donation request workflow with status transitions: pending → under review → approved/rejected",
      "Cloudinary signed upload presets for receipts and supporting documents",
      "OTP email verification at registration via Brevo API to reduce fraudulent accounts",
      "Full Bengali-language UI with Hind Siliguri font loading and consistent rendering across Android browsers",
      "Admin dashboard with fund summary, pending actions queue, and member activity log",
    ],
    tech: {
      frontend: ["React", "Vite"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Brevo sender verification required multiple iterations due to SPF/DKIM setup on a shared hosting environment",
      "Bengali font rendering inconsistency across Android browsers — some weights failed to load correctly",
      "Role enforcement needed to be airtight at the API layer — frontend-only guards are insufficient for a live organization",
    ],
    solutions: [
      "Configured a verified Brevo sender domain with full SPF and DKIM records; OTP emails now pass spam filters consistently",
      "Standardized on Hind Siliguri with explicit font-weight declarations and a CSS fallback stack that degrades cleanly on older devices",
      "All protected routes validate the decoded JWT role server-side before processing the request; frontend route guards handle UX only",
    ],
    future: [
      "Annual fund report generation as a downloadable PDF",
      "SMS notification fallback for beneficiaries without email access",
      "Audit log export for organizational accountability and external reporting",
    ],
  },

  "care.xyz": {
    name: "Care.xyz",
    tagline: "Caregiver booking with cascading location filters and middleware-level route protection.",
    img: "/projects/carexyz.png",
    live: "https://care-xyz-baby-sitting-elderly-care.vercel.app",
    code: "https://github.com/najmulcodes/Care.xyz---Baby-Sitting-Elderly-Care-Service-Platform",
    overview:
      "Service marketplace for booking childcare and elderly care providers across Bangladesh. Location filtering cascades across three administrative tiers — division → district → upazila — loading each tier's options lazily on parent selection. This avoids the performance cost of exposing thousands of upazila records on initial load while keeping the UX responsive. Route protection runs in Next.js middleware before page render; unauthenticated users never receive protected HTML. Pricing adjusts dynamically per service type and care duration.",
    features: [
      "Cascading location filter: Division → District → Upazila with lazy-loaded option sets per tier",
      "Dynamic pricing engine — base rate modified by service type, care duration, and location",
      "Firebase Authentication with Google OAuth and email/password providers",
      "Next.js middleware-based route protection — redirect at the edge before page HTML is served",
      "Service listings with availability status and caregiver profile pages",
    ],
    tech: {
      frontend: ["Next.js 14", "React"],
      backend: ["Firebase"],
      database: ["Firestore"],
      auth: ["Firebase Auth"],
    },
    challenges: [
      "Loading all upazila options upfront caused a 3–4 second render delay on low-end Android devices",
      "Firebase auth state hydration on hard refresh caused a flash of the unauthenticated layout before the redirect fired client-side",
    ],
    solutions: [
      "Switched to on-demand fetching per filter level — district options load only once a division is selected; each tier's dataset is small enough for a single fast fetch without pagination",
      "Auth state is read from a cookie set on login; Next.js middleware checks the cookie server-side before rendering, eliminating the client-side auth flash entirely",
    ],
    future: [
      "Real-time availability calendar per caregiver with booking slot management",
      "In-app messaging between booker and caregiver before booking confirmation",
      "Review and rating system accessible post-booking completion",
    ],
  },

  gatherly: {
    name: "Gatherly",
    tagline: "Community discovery platform with server-rendered listings and multi-provider auth.",
    img: "/projects/gatherly.png",
    live: "https://gatherly-navy.vercel.app/",
    code: "https://github.com/najmulcodes/gatherly",
    overview:
      "Built on Next.js 14 App Router with a deliberate Server/Client Component boundary: community and event listing pages render server-side for fast initial load, while auth-gated interactions (join buttons, create form, manage table) are isolated to Client Components to avoid shipping unnecessary JS for static content. NextAuth.js handles credential and Google OAuth flows, session persistence, and CSRF protection. The mobile-first layout was designed around 360px as the baseline viewport — the majority of the Bangladesh audience accesses the web on mid-range Android devices.",
    features: [
      "NextAuth.js with credentials provider and Google OAuth — session persisted via JWT strategy",
      "Server Component rendering for community and event listing pages — fast TTFB without client JS overhead",
      "Full-text search across community names, tags, and descriptions",
      "Mobile-first responsive layout — 360px viewport as design baseline",
      "Protected community creation form and manage-communities table behind NextAuth session guard",
      "Middleware-level route protection for /add-club and /manage-clubs routes",
    ],
    tech: {
      frontend: ["Next.js 14 (App Router)", "NextAuth.js v4", "Custom CSS"],
      backend: ["NextAuth Credentials + Google OAuth"],
      database: ["localStorage (demo)"],
      auth: ["NextAuth.js", "JWT sessions"],
    },
    challenges: [
      "NextAuth.js session not available in Server Components without explicit server-side session fetching",
      "localStorage used for some state — unavailable during SSR, causing hydration mismatches on initial render",
    ],
    solutions: [
      "Used getServerSession from next-auth/next in auth-gated Server Components; Client Components use the useSession hook — both patterns are consistent across the codebase",
      "Wrapped all localStorage reads in a useEffect with an isMounted guard; longer term this would move to cookie-based or database-backed storage",
    ],
    future: [
      "Replace localStorage with a Prisma + PostgreSQL backend for persistent community data",
      "Real-time RSVP counts with Socket.IO for live event attendance tracking",
      "Push notifications for upcoming gatherings in joined communities",
    ],
  },

  clubsphere: {
    name: "ClubSphere",
    tagline: "Club management with resource-level ownership enforcement and approval workflows.",
    img: "/projects/clubsphere.png",
    live: "https://clubsphere-client1.netlify.app/",
    code: "https://github.com/najmulcodes/clubsphere-client",
    overview:
      "Handles club membership and event logistics for organizations with multiple clubs under one platform. Membership requests go through an admin approval step before access is granted. Event operations are enforced at the resource level, not just role level — a club admin can only modify events they created, preventing cross-club interference. Ownership is stored as a denormalized creator ID on each event document, making the authorization check a single field comparison on read rather than a collection join. The MERN stack is kept intentionally lean here — no UI library, no state management library beyond React state — to demonstrate fundamentals without scaffolding.",
    features: [
      "Multi-step membership approval — request → admin review → grant/deny with optional reason",
      "Resource-level ownership enforcement: event mutations check creator ID server-side, not just user role",
      "Club-scoped event listings — members only see events from their joined clubs",
      "JWT auth with protected frontend routes and matching server-side API guards",
      "Denormalized creator ID on event documents — authorization check is O(1), no join required",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Resource ownership checks required joining membership and event collections on every protected mutation, adding query complexity and latency",
    ],
    solutions: [
      "Denormalized the creator ID into the event document at write time; ownership check on mutation is a single field comparison — trades a small write overhead for significantly faster read-time authorization",
    ],
    future: [
      "Event attendance tracking with QR code check-in for physical events",
      "Club analytics dashboard — member growth over time and event attendance rate",
    ],
  },

  bookhub: {
    name: "BookHub",
    tagline: "Book catalog with optimistic UI updates and consistent REST API design.",
    img: "/projects/bookhub.png",
    live: "https://bookhub-heaven.surge.sh",
    code: "https://github.com/najmulcodes/bookhub-client",
    overview:
      "Built as a deliberate exercise in REST API fundamentals before adding complexity in later projects. Every endpoint returns a consistent response envelope (status, data, message); error responses include machine-readable codes alongside human-readable messages; all mutations return the updated resource rather than a generic success flag. Optimistic updates on the frontend keep the UI responsive — edits appear immediately and roll back cleanly from a pre-mutation snapshot if the API call fails. This pattern was carried forward into every subsequent MERN project as a baseline.",
    features: [
      "Consistent API response envelope across all endpoints — predictable shape for every frontend consumer",
      "Optimistic UI updates with snapshot-based rollback on failure — no re-fetch, no stale data flash",
      "Search and filter by title, author, and genre",
      "Cover image management via URL-based storage",
      "Machine-readable error codes on all failure responses — frontend can differentiate error types without string parsing",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: [],
    },
    challenges: [
      "Ensuring rollback logic was reliable — a failed optimistic update that doesn't revert cleanly leaves the UI in a broken state that's difficult to recover from without a page reload",
    ],
    solutions: [
      "Stored pre-mutation state in a local variable before applying the optimistic update; the catch block restores from that snapshot rather than re-fetching — faster recovery and avoids a flash of stale server data",
    ],
    future: [
      "User authentication with personal reading lists and progress tracking",
      "ISBN lookup via Open Library API to auto-fill book metadata on add",
    ],
  },
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects[slug];

  useEffect(() => {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(fa);

    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fonts);
  }, []);

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "120px 6vw", color: "#e6edf3", background: "#0d1117", minHeight: "100vh" }}>
          Project not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --bg:#0d1117; --bg2:#161b22; --bg3:#1c2333;
          --teal:#00e5c3;
          --teal-dim:rgba(0,229,195,0.10);
          --teal-mid:rgba(0,229,195,0.22);
          --white:#e6edf3; --muted:#7d8590;
          --border:rgba(255,255,255,0.07);
          --fh:'Space Grotesk',sans-serif;
          --fm:'Fira Code',monospace;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{
          background:var(--bg);color:var(--white);
          font-family:var(--fh);line-height:1.7;overflow-x:hidden;
        }
        a{text-decoration:none;color:inherit}

        /* ── PROJECT IMAGE — full width, no crop ── */
        .proj-img-wrap {
          margin-bottom: 36px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          box-shadow: 0 10px 40px rgba(0,0,0,.4);
          background: var(--bg2);
          /* Let the image determine the height naturally */
          line-height: 0;
        }
        .proj-img-wrap img {
          width: 100%;
          height: auto;          /* full image visible — no crop */
          display: block;
          object-fit: contain;   /* contain keeps aspect ratio intact */
        }

        /* Navbar styles */
        .p-nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 6vw;
          background:rgba(13,17,23,.95);
          backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid var(--border);
        }
        .p-logo{font-family:var(--fm);font-size:.88rem;color:var(--teal);letter-spacing:.02em}
        .p-logo .bracket{color:rgba(0,229,195,.55)}
        .p-logo .pname{color:var(--white)}
        .p-nav-links{display:flex;gap:4px;list-style:none}
        .p-nav-links a{font-size:.8rem;font-weight:500;padding:6px 14px;border-radius:8px;color:var(--muted);transition:color .2s,background .2s}
        .p-nav-links a:hover{color:var(--teal);background:var(--teal-dim)}
        .p-nav-icons{display:flex;gap:12px;align-items:center}
        .p-nav-icons a{
          width:32px;height:32px;display:flex;align-items:center;justify-content:center;
          border-radius:8px;color:var(--muted);border:1px solid transparent;font-size:1rem;
          transition:color .2s,border-color .2s,background .2s,transform .2s;
        }
        .p-nav-icons a:hover{color:var(--teal);border-color:var(--teal-mid);background:var(--teal-dim);transform:translateY(-2px)}
        .p-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;border:none;background:transparent;z-index:201}
        .p-hamburger span{display:block;width:24px;height:2px;background:var(--white);border-radius:2px;transition:all .3s}
        .p-hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
        .p-hamburger.open span:nth-child(2){opacity:0}
        .p-hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
        .p-mobile-menu{display:none}
        @media(max-width:640px){
          .p-nav{padding:14px 5vw}
          .p-nav-links{display:none}
          .p-hamburger{display:flex}
          .p-mobile-menu{
            display:block;position:fixed;top:0;left:0;right:0;bottom:0;
            background:rgba(13,17,23,.97);z-index:200;
            padding:90px 8vw 40px;
            transform:translateX(100%);transition:transform .3s ease;
          }
          .p-mobile-menu.open{transform:translateX(0)}
          .p-mobile-menu ul{list-style:none;display:flex;flex-direction:column;gap:8px}
          .p-mobile-menu ul li a{
            display:block;font-size:1.25rem;font-weight:600;
            color:var(--muted);padding:14px 0;
            border-bottom:1px solid var(--border);
            transition:color .2s;
          }
          .p-mobile-menu ul li a:hover{color:var(--teal)}
          .p-mobile-menu-icons{display:flex;gap:16px;margin-top:32px}
          .p-mobile-menu-icons a{
            width:44px;height:44px;border-radius:12px;
            border:1px solid var(--border);background:var(--bg2);
            display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;color:var(--muted);transition:all .2s;
          }
          .p-mobile-menu-icons a:hover{color:var(--teal);border-color:var(--teal-mid)}
        }

        /* Footer */
        .p-footer{background:var(--bg);border-top:1px solid var(--border);padding:28px 6vw;text-align:center;position:relative;z-index:1}
        .p-footer p{font-size:.76rem;color:var(--muted)}
        .p-footer span{color:var(--teal)}

        /* Back button */
        .p-back-btn{
          display:inline-flex;align-items:center;gap:6px;
          margin-bottom:14px;font-size:.82rem;color:var(--muted);
          border:1px solid var(--border);padding:7px 16px;border-radius:8px;
          transition:color .2s,border-color .2s,background .2s;
        }
        .p-back-btn:hover{color:var(--teal);border-color:var(--teal-mid);background:var(--teal-dim)}

        /* Project action buttons */
        .p-proj-btn{
          display:inline-flex;align-items:center;gap:7px;
          font-size:.8rem;font-weight:600;padding:10px 20px;
          border-radius:10px;transition:all .2s ease;
        }
        .p-proj-btn.live{background:var(--teal);color:#0d1117;}
        .p-proj-btn.live:hover{opacity:.85;}
        .p-proj-btn.code{border:1px solid rgba(255,255,255,.1);color:var(--muted);}
        .p-proj-btn.code:hover{color:var(--teal);border-color:var(--teal);}
      `}</style>

      <Navbar />

      <div style={{ paddingTop: "36px", background: "var(--bg)", minHeight: "100vh" }}>
        <div className="p-inner" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px" }}>

          <Link href="/#projects" className="p-back-btn">← Back to Projects</Link>

          {/* ── PROJECT IMAGE — full, no cropping ── */}
          <div className="proj-img-wrap">
            <img
              src={project.img}
              alt={project.name}
              loading="lazy"
            />
          </div>

          {/* HEADER */}
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "6px", color: "var(--white)" }}>{project.name}</h2>
            <p style={{ color: "var(--teal)", marginBottom: "18px" }}>{project.tagline}</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href={project.live} target="_blank" rel="noreferrer" className="p-proj-btn live">
                <i className="fas fa-external-link-alt" /> Live
              </a>
              <a href={project.code} target="_blank" rel="noreferrer" className="p-proj-btn code">
                <i className="fab fa-github" /> Code
              </a>
            </div>
          </div>

          {/* CONTENT BLOCKS */}
          {[
            ["Overview", project.overview],
            ["Key Features", project.features],
            ["Tech Stack", project.tech],
            ["Challenges", project.challenges],
            ["Solutions", project.solutions],
            ["Future Improvements", project.future],
          ].map(([title, data], i) => (
            <div key={i} style={{ marginBottom: "36px", maxWidth: "680px" }}>
              <h3 style={{ marginBottom: "10px", color: "var(--teal)" }}>{title}</h3>
              {Array.isArray(data) ? (
                <ul style={{ color: "var(--muted)", fontSize: ".88rem", paddingLeft: "4px" }}>
                  {data.map((item, idx) => <li key={idx} style={{ marginBottom: "4px" }}>• {item}</li>)}
                </ul>
              ) : typeof data === "object" ? (
                <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                  <p><strong style={{ color: "var(--white)" }}>Frontend:</strong> {data.frontend.join(", ")}</p>
                  <p><strong style={{ color: "var(--white)" }}>Backend:</strong> {data.backend.join(", ")}</p>
                  <p><strong style={{ color: "var(--white)" }}>Database:</strong> {data.database.join(", ")}</p>
                  {data.auth.length > 0 && (
                    <p><strong style={{ color: "var(--white)" }}>Auth:</strong> {data.auth.join(", ")}</p>
                  )}
                </div>
              ) : (
                <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>{data}</p>
              )}
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </>
  );
}