"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const projects = {
  "badar-uddin-welfare": {
    name: "Badar Uddin Welfare",
    tagline: "Charity Management Platform",
    img: "/projects/badaruddin.png",
    live: "https://badaruddinwelfareorg.vercel.app/",
    code: "https://github.com/najmulcodes/badaruddinwelfare-client",
    overview:
      "A production-focused charity management system designed for real organizational use. It enables structured donation workflows, approval systems, and role-based dashboards to manage funds and beneficiaries.",
    features: [
      "Role-based dashboards (Admin & Members)",
      "Donation request and approval workflow",
      "Secure JWT authentication system",
      "Cloudinary image upload integration",
      "Real-time tracking of donations and requests",
    ],
    tech: {
      frontend: ["React", "Tailwind CSS"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Implementing secure role-based access",
      "Managing multiple dashboard states",
      "Keeping data consistent across users",
    ],
    solutions: [
      "Used middleware-based JWT authorization",
      "Structured APIs based on user roles",
      "Added backend validation and state control",
    ],
    future: [
      "Add payment gateway integration",
      "Improve analytics dashboard",
      "Add notification system",
    ],
  },

  "microtask-platform": {
    name: "MicroTask Platform",
    tagline: "Freelance Micro-Task Marketplace",
    img: "/projects/microtask.png",
    live: "https://microtask-client-iota.vercel.app",
    code: "https://github.com/najmulcodes/microtask-client",
    overview:
      "A multi-role freelance platform where users can post tasks, complete work, and earn rewards.",
    features: [
      "Worker, Buyer, and Admin dashboards",
      "Stripe payment integration",
      "Task submission and approval system",
      "JWT authentication",
      "Coin-based earning system",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: ["Handling multiple roles", "Stripe integration", "Task lifecycle management"],
    solutions: ["Role-based routing", "Secure Stripe API", "Structured backend logic"],
    future: ["Add messaging", "Improve UX", "Add filtering"],
  },

  "devfolio-analyzer": {
    name: "DevFolio Analyzer",
    tagline: "AI-Powered GitHub Profile Analyzer",
    img: "/projects/devfolio-analyzer.png",
    live: "https://devfolio-analyzer.vercel.app/",
    code: "https://github.com/najmulcodes/devfolio-analyzer",
    overview:
      "A full-stack web application that analyses developer GitHub profiles and generates a structured evaluation — score, strengths, weaknesses, and AI-powered suggestions — presented in a modern analytics dashboard.",
    features: [
      "GitHub Profile Analysis — fetches real data via the GitHub REST API",
      "Deterministic scoring (0–100) across 6 factors: repos, stars, followers, activity, profile completeness, portfolio bonus",
      "AI-Powered Insights using Claude (Anthropic) API with graceful fallback",
      "Guest Mode — instant analysis with no account required",
      "Authenticated users can save history and track score improvement over time",
      "KPI cards, score-over-time chart (Recharts), and recent activity table",
    ],
    tech: {
      frontend: ["React 18", "React Router", "Recharts"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcryptjs"],
    },
    challenges: [
      "Keeping deterministic scoring consistent regardless of AI availability",
      "Rate-limiting GitHub API calls without a token (60 req/hr)",
      "Paginating and persisting analysis history per authenticated user",
    ],
    solutions: [
      "Score calculated before any AI call; Claude response layered on top",
      "Optional GitHub token support bumps limit to 5 000 req/hr",
      "MongoDB-backed Analysis model with paginated history endpoints",
    ],
    future: [
      "Add repository language breakdown chart",
      "Compare two profiles side-by-side",
      "Email digest of weekly score changes",
    ],
  },
 
  livecollab: {
    name: "LiveCollab",
    tagline: "Real-Time Team Collaboration Platform",
    img: "/projects/livecollab.png",
    live: "https://livecollab.vercel.app",
    code: "https://github.com/najmulcodes/livecollab",
    overview:
      "A full-stack real-time Kanban collaboration platform where teams can create workspaces, invite members, and drag-and-drop cards with instant sync across all connected browsers.",
    features: [
      "JWT-based register / login with protected routes",
      "Workspaces — create teams, invite via code, manage members",
      "Real-Time Kanban Board — drag-and-drop with live sync via Socket.IO",
      "Live Presence — see who's online in your workspace in real time",
      "Timestamped Activity Log for every board action",
      "Zustand + React Query for efficient client-side state",
    ],
    tech: {
      frontend: ["React 18", "Vite", "Tailwind CSS", "Zustand", "React Query", "@dnd-kit"],
      backend: ["Node.js", "Express", "Socket.IO"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcrypt"],
    },
    challenges: [
      "Broadcasting card position changes with sub-100 ms latency",
      "Preventing conflicting updates when two users drag simultaneously",
      "Keeping presence state accurate when users disconnect unexpectedly",
    ],
    solutions: [
      "Socket.IO rooms scoped per workspace for minimal broadcast surface",
      "Optimistic UI updates with server reconciliation on conflict",
      "Heartbeat + disconnect events to clean up stale presence entries",
    ],
    future: [
      "Add card comments and file attachments",
      "Email notifications for @mentions",
      "Export board as CSV or PDF",
    ],
  },
 
  gatherly: {
    name: "Gatherly",
    tagline: "Community Discovery Platform",
    img: "/projects/gatherly.png",
    live: "https://gatherly-navy.vercel.app/",
    code: "https://github.com/najmulcodes/gatherly",
    overview:
      "Gatherly connects people with local communities across Bangladesh — photography, hiking, books, tech, food, and more. Organisers get simple tools to list their community and surface upcoming gatherings; everyone else gets one place to discover what's happening close to home.",
    features: [
      "Landing page with hero, stats, featured communities, categories, and testimonials",
      "Email/password credentials + optional Google OAuth via NextAuth.js",
      "Searchable, filterable community catalog with category chips and member counts",
      "Community detail pages with banner, description, tags, and join button",
      "Protected 'Start a Community' form with inline validation",
      "Protected 'Manage Communities' table with View and Remove actions",
      "Fully responsive mobile-first layout with hamburger nav",
    ],
    tech: {
      frontend: ["Next.js 14 (App Router)", "NextAuth.js v4", "Custom CSS (violet/purple palette)"],
      backend: ["NextAuth Credentials + Google OAuth"],
      database: ["localStorage (demo)"],
      auth: ["NextAuth.js", "JWT sessions"],
    },
    challenges: [
      "Persisting user-created communities without a backend database",
      "Hiding removed seed communities consistently across sessions",
      "Keeping route protection simple with Next.js middleware",
    ],
    solutions: [
      "localStorage CRUD helpers in src/lib/club-store.js",
      "Separate localStorage key tracks removed community IDs",
      "middleware.js protects /add-club and /manage-clubs at the edge",
    ],
    future: [
      "Replace localStorage with Prisma + PostgreSQL backend",
      "Add real-time RSVP counts with Socket.IO",
      "Push notifications for upcoming gatherings",
    ],
  },
 
  "care.xyz": {
    name: "Care.xyz",
    tagline: "Care Service Booking Platform",
    img: "/projects/carexyz.png",
    live: "https://care-xyz-baby-sitting-elderly-care.vercel.app",
    code: "https://github.com/najmulcodes/Care.xyz---Baby-Sitting-Elderly-Care-Service-Platform",
    overview:
      "A Next.js platform for booking caregivers with dynamic pricing and location filtering.",
    features: ["Dynamic pricing", "Location filters", "Firebase auth", "Private booking system"],
    tech: {
      frontend: ["Next.js", "React"],
      backend: ["Firebase"],
      database: ["Firestore"],
      auth: ["Firebase"],
    },
    challenges: ["Dynamic pricing logic", "Route protection"],
    solutions: ["Custom logic system", "Firebase protection"],
    future: ["Add payments", "Improve UI"],
  },

  clubsphere: {
    name: "ClubSphere",
    tagline: "Membership & Event Management",
    img: "/projects/clubsphere.png",
    live: "https://clubsphere-client1.netlify.app/",
    code: "https://github.com/najmulcodes/clubsphere-client",
    overview: "A club management system with role-based dashboards and event workflows.",
    features: ["Role dashboards", "Membership approval", "Event system"],
    tech: {
      frontend: ["React"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: ["Role control", "Approval flow"],
    solutions: ["Middleware logic", "Structured API"],
    future: ["Add analytics", "Improve UI"],
  },

  bookhub: {
    name: "BookHub",
    tagline: "Book Management Platform",
    img: "/projects/bookhub.png",
    live: "https://bookhub-heaven.surge.sh",
    code: "https://github.com/najmulcodes/bookhub-client",
    overview: "A CRUD-based platform for managing books with real-time updates.",
    features: ["CRUD system", "Live UI updates"],
    tech: {
      frontend: ["React"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      auth: [],
    },
    challenges: ["State sync"],
    solutions: ["Efficient state handling"],
    future: ["Add auth", "Add reviews"],
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

        /* Navbar styles (must be present on slug page too) */
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

        /* Project detail content */
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

      {/* ── NAVBAR (single instance from component) ── */}
      <Navbar />

      {/* Page content — push below fixed navbar */}
      <div style={{ paddingTop: "36px", background: "var(--bg)", minHeight: "100vh" }}>
        <div className="p-inner" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px" }}>

          <Link href="/#projects" className="p-back-btn">← Back to Projects</Link>

          {/* IMAGE */}
          <div style={{
            marginBottom: "36px", borderRadius: "14px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,.07)", boxShadow: "0 10px 40px rgba(0,0,0,.4)",
          }}>
            <img src={project.img} alt={project.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
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

      {/* ── FOOTER (single instance from component) ── */}
      <Footer />
    </>
  );
}
