"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

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
      "Real-time tracking of donations and requests"
    ],
    tech: {
      frontend: ["React", "Tailwind CSS"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"]
    },
    challenges: [
      "Implementing secure role-based access",
      "Managing multiple dashboard states",
      "Keeping data consistent across users"
    ],
    solutions: [
      "Used middleware-based JWT authorization",
      "Structured APIs based on user roles",
      "Added backend validation and state control"
    ],
    future: [
      "Add payment gateway integration",
      "Improve analytics dashboard",
      "Add notification system"
    ]
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
      "Coin-based earning system"
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"]
    },
    challenges: [
      "Handling multiple roles",
      "Stripe integration",
      "Task lifecycle management"
    ],
    solutions: [
      "Role-based routing",
      "Secure Stripe API",
      "Structured backend logic"
    ],
    future: [
      "Add messaging",
      "Improve UX",
      "Add filtering"
    ]
  },

  "care.xyz": {
    name: "Care.xyz",
    tagline: "Care Service Booking Platform",
    img: "/projects/carexyz.png",
    live: "https://care-xyz-baby-sitting-elderly-care.vercel.app",
    code: "https://github.com/najmulcodes/Care.xyz---Baby-Sitting-Elderly-Care-Service-Platform",
    overview:
      "A Next.js platform for booking caregivers with dynamic pricing and location filtering.",
    features: [
      "Dynamic pricing",
      "Location filters",
      "Firebase auth",
      "Private booking system"
    ],
    tech: {
      frontend: ["Next.js", "React"],
      backend: ["Firebase"],
      database: ["Firestore"],
      auth: ["Firebase"]
    },
    challenges: [
      "Dynamic pricing logic",
      "Route protection"
    ],
    solutions: [
      "Custom logic system",
      "Firebase protection"
    ],
    future: [
      "Add payments",
      "Improve UI"
    ]
  },

  "clubsphere": {
    name: "ClubSphere",
    tagline: "Membership & Event Management",
    img: "/projects/clubsphere.png",
    live: "https://clubsphere-client1.netlify.app/",
    code: "https://github.com/najmulcodes/clubsphere-client",
    overview:
      "A club management system with role-based dashboards and event workflows.",
    features: [
      "Role dashboards",
      "Membership approval",
      "Event system"
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      auth: ["JWT"]
    },
    challenges: [
      "Role control",
      "Approval flow"
    ],
    solutions: [
      "Middleware logic",
      "Structured API"
    ],
    future: [
      "Add analytics",
      "Improve UI"
    ]
  },

  "bookhub": {
    name: "BookHub",
    tagline: "Book Management Platform",
    img: "/projects/bookhub.png",
    live: "https://bookhub-heaven.surge.sh",
    code: "https://github.com/najmulcodes/bookhub-client",
    overview:
      "A CRUD-based platform for managing books with real-time updates.",
    features: [
      "CRUD system",
      "Live UI updates"
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      auth: []
    },
    challenges: [
      "State sync"
    ],
    solutions: [
      "Efficient state handling"
    ],
    future: [
      "Add auth",
      "Add reviews"
    ]
  }
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects[slug];

  if (!project) return <div className="p-section">Project not found</div>;

  return (
    <section className="p-section alt">

      {/* LOCAL STYLES */}
      <style>{`
        body {
          background:#0d1117;
          color:#e6edf3;
        }

        .p-proj-btn{
          display:inline-flex;
          align-items:center;
          gap:7px;
          font-size:.8rem;
          font-weight:600;
          padding:10px 20px;
          border-radius:10px;
          transition:all .2s ease;
        }

        .p-proj-btn.live{
          background:#00e5c3;
          color:#0d1117;
        }

        .p-proj-btn.code{
          border:1px solid rgba(255,255,255,.1);
          color:#7d8590;
        }

        .p-proj-btn.code:hover{
          color:#00e5c3;
          border-color:#00e5c3;
        }
      `}</style>

      <div className="p-inner" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px" }}>

        {/* BACK */}
        <Link href="/#projects" className="p-back-btn">← Back to Projects</Link>

        {/* IMAGE */}
        <div style={{
          marginBottom: "36px",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.07)",
          boxShadow: "0 10px 40px rgba(0,0,0,.4)"
        }}>
          <img
            src={project.img}
            alt={project.name}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover"
            }}
          />
        </div>

        {/* HEADER */}
        <div style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{project.name}</h2>
          <p style={{ color: "#00e5c3", marginBottom: "18px" }}>{project.tagline}</p>

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
          ["Future Improvements", project.future]
        ].map(([title, data], i) => (
          <div key={i} style={{ marginBottom: "36px", maxWidth: "680px" }}>
            <h3 style={{ marginBottom: "10px", color: "#00e5c3" }}>{title}</h3>

            {Array.isArray(data) ? (
              <ul>
                {data.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            ) : typeof data === "object" ? (
              <>
                <p><strong>Frontend:</strong> {data.frontend.join(", ")}</p>
                <p><strong>Backend:</strong> {data.backend.join(", ")}</p>
                <p><strong>Database:</strong> {data.database.join(", ")}</p>
                {data.auth.length > 0 && (
                  <p><strong>Auth:</strong> {data.auth.join(", ")}</p>
                )}
              </>
            ) : (
              <p>{data}</p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}