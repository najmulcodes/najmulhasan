"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { projects } from "./data";

export default function ProjectDetailClient() {
  const { slug } = useParams();
  const project = projects[slug];

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "120px 6vw", color: "#e6edf3", background: "#051626", minHeight: "100vh" }}>
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
          --bg:#051626; --bg2:#0A2342; --bg3:#1E2630;
          --teal:#C8A24B;
          --teal-dim:rgba(200,162,75,0.10);
          --teal-mid:rgba(200,162,75,0.22);
          --white:#e6edf3; --muted:#7d8590;
          --border:rgba(255,255,255,0.07);
          --fh:'Plus Jakarta Sans',sans-serif;
          --fm:'JetBrains Mono',monospace;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{
          background:var(--bg);color:var(--white);
          font-family:var(--fh);line-height:1.7;overflow-x:hidden;
        }
        a{text-decoration:none;color:inherit}

        .proj-img-wrap {
          margin-bottom: 36px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          box-shadow: 0 10px 40px rgba(0,0,0,.4);
          background: var(--bg2);
          line-height: 0;
        }
        .proj-img-wrap img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .p-nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 6vw;
          background:rgba(13,17,23,.95);
          backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid var(--border);
        }
        .p-logo{font-family:var(--fm);font-size:.88rem;color:var(--teal);letter-spacing:.02em}
        .p-logo .bracket{color:rgba(200,162,75,.55)}
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

        .p-footer{background:var(--bg);border-top:1px solid var(--border);padding:28px 6vw;text-align:center;position:relative;z-index:1}
        .p-footer p{font-size:.76rem;color:var(--muted)}
        .p-footer span{color:var(--teal)}

        .p-back-btn{
          display:inline-flex;align-items:center;gap:6px;
          margin-bottom:14px;font-size:.82rem;color:var(--muted);
          border:1px solid var(--border);padding:7px 16px;border-radius:8px;
          transition:color .2s,border-color .2s,background .2s;
        }
        .p-back-btn:hover{color:var(--teal);border-color:var(--teal-mid);background:var(--teal-dim)}

        .p-proj-btn{
          display:inline-flex;align-items:center;gap:7px;
          font-size:.8rem;font-weight:600;padding:10px 20px;
          border-radius:10px;transition:all .2s ease;
        }
        .p-proj-btn.live{background:var(--teal);color:var(--bg);}
        .p-proj-btn.live:hover{opacity:.85;}
        .p-proj-btn.code{border:1px solid rgba(255,255,255,.1);color:var(--muted);}
        .p-proj-btn.code:hover{color:var(--teal);border-color:var(--teal);}
      `}</style>

      <Navbar />

      <div style={{ paddingTop: "36px", background: "var(--bg)", minHeight: "100vh" }}>
        <div className="p-inner" style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 16px" }}>

          <Link href="/#projects" className="p-back-btn">← Back to Projects</Link>

          <div className="proj-img-wrap">
            <img
              src={project.img}
              alt={`${project.name} project screenshot`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML =
                  '<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:220px;"><i class="fas fa-cube" style="font-size:3rem;color:var(--teal);opacity:.35"></i></div>';
              }}
            />
          </div>

          {/* HEADER */}
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "6px", color: "var(--white)" }}>{project.name}</h2>
            <p style={{ color: "var(--teal)", marginBottom: "10px" }}>{project.tagline}</p>
            {(project.category || project.status) && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
                {project.category && (
                  <span style={{ fontSize: ".7rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "4px 10px" }}>
                    {project.category}
                  </span>
                )}
                {project.status && (
                  <span style={{ fontSize: ".7rem", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold, var(--teal))", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "4px 10px" }}>
                    {project.status}
                  </span>
                )}
              </div>
            )}
            {(project.live || project.code) && (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-proj-btn live">
                    <i className="fas fa-external-link-alt" /> Live
                  </a>
                )}
                {project.code && (
                  <a href={project.code} target="_blank" rel="noopener noreferrer" className="p-proj-btn code">
                    <i className="fab fa-github" /> Code
                  </a>
                )}
              </div>
            )}
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
                  {data.auth && data.auth.length > 0 && (
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