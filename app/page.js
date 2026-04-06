"use client";
import { useEffect } from "react";
import WordRotate from "../components/WordRotate";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
export default function Portfolio() {

const greetings = [
  "Hello,",
  "Hola,",
  "Bonjour,",
  "مرحبا،",
  "こんにちは"
];

  useEffect(() => {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(fa);

    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fonts);

    const sections = ["hero","about","skills","projects","experience","education","contact"];
    const navLinks  = document.querySelectorAll(".p-nav-links a");
    const dots      = document.querySelectorAll(".p-side-dot");

    const secObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id  = entry.target.id;
        const idx = sections.indexOf(id);
        navLinks.forEach(a => a.classList.remove("active"));
        const match = document.querySelector(`.p-nav-links a[href="#${id}"]`);
        if (match) match.classList.add("active");
        dots.forEach(d => d.classList.remove("active"));
        if (idx >= 0 && dots[idx]) dots[idx].classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) secObs.observe(el);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const el = document.getElementById(sections[i]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    });

    const reveals = document.querySelectorAll(".p-reveal");
    const revObs  = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("p-visible"), i * 55);
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => revObs.observe(el));

    return () => {
      secObs.disconnect();
      revObs.disconnect();
    };
  }, []);

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
        ul{list-style:none}
        img{display:block}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:var(--bg)}
        ::-webkit-scrollbar-thumb{background:var(--teal);border-radius:4px}
        ::selection{background:rgba(0,229,195,.2)}

        .p-topo{
          position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.035;
          background-image:
            repeating-radial-gradient(circle at 25% 55%,transparent 0,transparent 38px,rgba(0,229,195,1) 39px,transparent 40px),
            repeating-radial-gradient(circle at 75% 18%,transparent 0,transparent 58px,rgba(0,229,195,1) 59px,transparent 60px),
            repeating-radial-gradient(circle at 55% 82%,transparent 0,transparent 76px,rgba(0,229,195,1) 77px,transparent 78px);
        }

        .p-nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 6vw;
          background:rgba(13,17,23,.82);
          backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid var(--border);
          transition:box-shadow .3s,background .3s;
        }
        .p-nav.scrolled{background:rgba(13,17,23,.95);box-shadow:0 4px 32px rgba(0,0,0,.55)}
        .p-logo{font-family:var(--fm);font-size:.88rem;color:var(--teal);letter-spacing:.02em}
        .p-logo .bracket{color:rgba(0,229,195,.55)}
        .p-logo .pname{color:var(--white)}
        .p-nav-links{display:flex;gap:4px}
        .p-nav-links a{font-size:.8rem;font-weight:500;padding:6px 14px;border-radius:8px;color:var(--muted);transition:color .2s,background .2s}
        .p-nav-links a:hover,.p-nav-links a.active{color:var(--teal);background:var(--teal-dim)}
        .p-nav-icons{display:flex;gap:12px;align-items:center}
        .p-nav-icons a{
          width:32px;height:32px;display:flex;align-items:center;justify-content:center;
          border-radius:8px;color:var(--muted);border:1px solid transparent;font-size:1rem;
          transition:color .2s,border-color .2s,background .2s,transform .2s;
        }
        .p-nav-icons a:hover{color:var(--teal);border-color:var(--teal-mid);background:var(--teal-dim);transform:translateY(-2px)}

        .p-side-nav{position:fixed;left:20px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:13px;z-index:90}
        .p-side-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid var(--muted);cursor:pointer;transition:background .25s,height .3s,border-color .25s,box-shadow .25s}
        .p-side-dot.active{background:var(--teal);border-color:var(--teal);height:20px;border-radius:4px;box-shadow:0 0 10px rgba(0,229,195,.45)}

        #hero{min-height:100vh;display:flex;align-items:center;padding:80px 6vw 60px;position:relative;z-index:1}
        .p-hero-inner{display:grid;grid-template-columns:1fr 320px;gap:60px;align-items:center;max-width:1100px;width:100%;margin:0 auto}
        .p-hero-tag{display:inline-flex;align-items:center;gap:8px;font-family:var(--fm);font-size:.72rem;color:var(--teal);background:var(--teal-dim);border:1px solid var(--teal-mid);padding:5px 14px;border-radius:20px;margin-bottom:24px;animation:p-fadeUp .6s ease both}
        .p-tag-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal);animation:p-pulse 1.8s infinite}
        .p-hero-title{font-size:clamp(2.2rem,4.5vw,3.8rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;animation:p-fadeUp .6s .1s ease both;margin-bottom:20px}
        .p-hero-title .hi{
          display: inline-block;
          color: var(--muted);
          font-weight: 400;
          font-size: 0.6em;
          line-height: 1.2;
          margin-bottom: 10px;
          min-height: 1.2em;
          letter-spacing: 0.02em;
        }
        .p-hero-title .name{
          display: block;
          will-change: transform, opacity;
        }
        .p-hero-title .role{display:block;font-size:.56em;font-weight:400;color:var(--teal);letter-spacing:0;margin-top:8px}
        .p-hero-desc{color:var(--muted);font-size:.92rem;max-width:500px;line-height:1.85;margin-bottom:36px;animation:p-fadeUp .6s .2s ease both}
        .p-hero-btns{display:flex;gap:12px;flex-wrap:wrap;animation:p-fadeUp .6s .3s ease both}
        .p-btn-teal{display:inline-flex;align-items:center;gap:8px;padding:11px 28px;background:var(--teal);color:#0d1117;font-weight:700;font-size:.84rem;border-radius:9px;transition:opacity .2s,transform .2s,box-shadow .2s}
        .p-btn-teal:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,229,195,.3)}
        .p-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border:1px solid rgba(255,255,255,.12);color:var(--white);font-size:.84rem;border-radius:9px;background:transparent;transition:border-color .2s,background .2s,transform .2s}
        .p-btn-ghost:hover{border-color:var(--teal-mid);background:var(--teal-dim);transform:translateY(-2px)}

        .p-hero-card{
          background:linear-gradient(145deg,var(--bg2) 0%,rgba(28,35,51,.9) 100%);
          border:1px solid rgba(255,255,255,.09);border-radius:20px;
          padding:28px 26px 24px;animation:p-fadeUp .6s .15s ease both;
          position:relative;overflow:hidden;
        }
        .p-hero-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--teal) 0%,rgba(0,229,195,.15) 100%)}
        .p-card-photo-wrap{position:relative;width:86px;height:86px;margin-bottom:16px}
        .p-card-photo-ring{width:86px;height:86px;border-radius:50%;padding:2.5px;background:linear-gradient(135deg,var(--teal),#0099ff 60%,transparent);display:flex;align-items:center;justify-content:center}
        .p-card-photo-ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:top center;border:2px solid var(--bg2)}
        .p-card-initials{width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,var(--teal),#0099ff);display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:700;color:#0d1117}
        .p-card-online{position:absolute;bottom:3px;right:3px;width:14px;height:14px;border-radius:50%;background:#3fb950;border:2px solid var(--bg2);box-shadow:0 0 8px rgba(63,185,80,.55);animation:p-pulse 2s infinite}
        .p-card-name{font-size:1.05rem;font-weight:700;color:var(--white);margin-bottom:2px;letter-spacing:-.01em}
        .p-card-role{font-family:var(--fm);font-size:.7rem;color:var(--teal);margin-bottom:18px;opacity:.85}
        .p-card-meta{display:flex;flex-direction:column;gap:9px;margin-bottom:20px}
        .p-card-meta-row{display:flex;align-items:center;gap:10px;font-size:.78rem;color:var(--muted);line-height:1.3}
        .p-card-meta-row i{color:var(--teal);width:13px;text-align:center;font-size:.72rem;flex-shrink:0}
        .p-card-meta-row a{color:var(--muted);transition:color .2s}
        .p-card-meta-row a:hover{color:var(--teal)}
        .p-card-divider{height:1px;background:var(--border);margin:16px 0}
        .p-card-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .p-stat-box{text-align:center;background:var(--bg3);border-radius:10px;padding:12px 6px;border:1px solid var(--border);transition:border-color .2s}
        .p-stat-box:hover{border-color:var(--teal-mid)}
        .p-stat-num{font-size:1.35rem;font-weight:700;color:var(--teal);line-height:1;margin-bottom:5px}
        .p-stat-lbl{font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;line-height:1.3}
        .p-card-cta{margin-top:18px;width:100%;display:flex;justify-content:center;align-items:center;gap:8px;padding:10px 20px;background:var(--teal);color:#0d1117;font-family:var(--fh);font-weight:700;font-size:.8rem;border-radius:9px;border:none;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s}
        .p-card-cta:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,229,195,.28)}

        .p-section{padding:100px 6vw;position:relative;z-index:1}
        .p-section.alt{background:var(--bg2)}
        .p-inner{max-width:1100px;margin:0 auto}
        .p-sec-label{font-family:var(--fm);font-size:.7rem;color:var(--teal);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:10px}
        .p-sec-label::after{content:'';flex:1 0 40px;max-width:80px;height:1px;background:linear-gradient(90deg,var(--teal-mid),transparent)}
        .p-sec-title{font-size:clamp(1.7rem,3vw,2.5rem);font-weight:700;letter-spacing:-.03em;margin-bottom:52px;color:var(--white)}
        .p-sec-title span{color:var(--teal)}

        .p-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start}
        .p-terminal{background:var(--bg);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:border-color .3s,box-shadow .3s}
        .p-terminal:hover{border-color:var(--teal-mid);box-shadow:0 0 32px rgba(0,229,195,.05)}
        .p-tbar{background:var(--bg3);padding:10px 16px;display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--border)}
        .p-tdot{width:10px;height:10px;border-radius:50%}
        .p-tdot.r{background:#ff5f57} .p-tdot.y{background:#febc2e} .p-tdot.g{background:#28c840}
        .p-ttitle{margin-left:auto;margin-right:auto;font-size:.72rem;color:var(--muted);font-family:var(--fm)}
        .p-tbody{padding:22px 20px;font-family:var(--fm);font-size:.8rem;line-height:1.95;color:var(--muted)}
        .p-tline{display:flex;gap:8px}
        .p-tprompt{color:var(--teal)} .p-tcmd{color:var(--white)}
        .p-tout{padding-left:18px}
        .p-tval{color:#79c0ff} .p-tstr{color:#a5d6ff} .p-tnum{color:var(--teal)} .p-tbool{color:#ff7b72}
        .p-tcursor{display:inline-block;width:8px;height:13px;background:var(--teal);vertical-align:middle;animation:p-blink 1s step-end infinite;margin-left:4px}
        .p-about-text h3{font-size:1.2rem;font-weight:700;color:var(--white);margin-bottom:16px}
        .p-about-text p{color:var(--muted);font-size:.88rem;margin-bottom:14px}
        .p-about-text strong{color:var(--white)}
        .p-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
        .p-tag{font-family:var(--fm);font-size:.72rem;padding:4px 12px;border-radius:20px;background:var(--teal-dim);border:1px solid var(--teal-mid);color:var(--teal);transition:background .2s,transform .2s}
        .p-tag:hover{background:rgba(0,229,195,.18);transform:translateY(-1px)}

        .p-skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px}
        .p-skill-card{background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:24px 22px;transition:border-color .3s,transform .3s,box-shadow .3s}
        .p-skill-card:hover{border-color:var(--teal-mid);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4),0 0 40px rgba(0,229,195,.055)}
        .p-skill-cat{display:flex;align-items:center;gap:10px;margin-bottom:18px}
        .p-skill-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 9px var(--teal)}
        .p-skill-lbl{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal)}
        .p-skill-icons{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .p-icon-box{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 4px;transition:border-color .2s,background .2s,transform .2s}
        .p-icon-box:hover{border-color:var(--teal-mid);background:var(--teal-dim);transform:translateY(-2px)}
        .p-icon-box i{font-size:1.35rem;line-height:1}
        .p-icon-box span{font-size:.58rem;color:var(--muted);text-align:center;line-height:1.2}
        .fa-html5{color:#e34f26} .fa-css3-alt{color:#2965f1} .fa-js{color:#f7df1e}
        .fa-react{color:#61dafb} .fa-node-js{color:#6cc24a} .fa-git-alt{color:#f14e32}
        .fa-database{color:#47a248} .fa-npm{color:#cb3837}

        .p-proj-list{display:flex;flex-direction:column;gap:22px}
        .p-proj-card{
          background:var(--bg);border:1px solid var(--border);border-radius:16px;
          padding:24px 28px;
          display:flex;flex-direction:row;gap:20px;align-items:flex-start;
          transition:border-color .3s,transform .3s,box-shadow .3s;
          position:relative;overflow:hidden;
        }
        .p-proj-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background .3s;border-radius:2px 0 0 2px}
        .p-proj-card:hover{border-color:rgba(0,229,195,.18);transform:translateX(5px);box-shadow:0 8px 40px rgba(0,0,0,.35)}
        .p-proj-card:hover::before,.p-proj-card.featured::before{background:var(--teal)}
        .p-proj-card.flagship::before{background:linear-gradient(180deg,#79c0ff 0%,var(--teal) 100%)}
        .p-proj-card.featured{border-color:rgba(0,229,195,.15)}
        .p-proj-card.flagship{border-color:rgba(121,192,255,.32);box-shadow:0 16px 48px rgba(0,0,0,.32),0 0 0 1px rgba(121,192,255,.08) inset}
        .p-proj-thumb-wrap{width:200px;min-width:200px;height:130px;border-radius:12px;overflow:hidden;flex-shrink:0;background:var(--bg3);}
        .p-proj-thumb{width:100%;height:100%;object-fit:cover;object-position:top center;display:block;border-radius:0;}
        .p-proj-body{flex:1;min-width:0;}
        .p-proj-header{display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;}
        .p-proj-name{font-size:1.1rem;font-weight:700;color:var(--white)}
        .p-feat-badge{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:20px;background:var(--teal-dim);border:1px solid var(--teal-mid);color:var(--teal)}
        .p-feat-badge.flagship{background:rgba(121,192,255,.14);border-color:rgba(121,192,255,.35);color:#a5d6ff}
        .p-proj-tagline{font-size:.8rem;color:var(--teal);font-weight:500;margin-bottom:12px}
        .p-proj-desc{font-size:.84rem;color:var(--muted);max-width:640px;margin-bottom:18px;line-height:1.75}
        .p-proj-stack{display:flex;flex-wrap:wrap;gap:7px}
        .p-tech{font-family:var(--fm);font-size:.7rem;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid var(--border);color:var(--muted);transition:color .2s,border-color .2s}
        .p-proj-card:hover .p-tech{color:var(--teal);border-color:var(--teal-mid)}
        .p-proj-actions{display:flex;flex-direction:column;gap:10px;align-items:flex-end;flex-shrink:0}
        .p-proj-btn{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;font-weight:600;padding:8px 16px;border-radius:8px;white-space:nowrap;transition:all .2s}
        .p-proj-btn.live{background:var(--teal);color:#0d1117}
        .p-proj-btn.live:hover{opacity:.85;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,229,195,.28)}
        .p-proj-btn.code{border:1px solid var(--border);color:var(--muted);background:transparent}
        .p-proj-btn.code:hover{border-color:var(--teal-mid);color:var(--teal);background:var(--teal-dim)}
        .p-proj-creds{margin-top:12px;padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;font-family:var(--fm);font-size:.72rem;line-height:1.8}
        .p-proj-creds .cred-title{color:var(--teal);font-weight:700;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
        .p-proj-creds .cred-row{color:var(--muted)}
        .p-proj-creds .cred-val{color:var(--white);font-weight:600}

        .p-timeline{max-width:700px;position:relative}
        .p-timeline::before{content:'';position:absolute;left:0;top:12px;bottom:12px;width:1px;background:linear-gradient(to bottom,var(--teal),transparent 90%);opacity:.28}
        .p-tl-item{padding-left:2.4rem;margin-bottom:26px;position:relative}
        .p-tl-item::before{content:'';position:absolute;left:-4px;top:10px;width:9px;height:9px;border-radius:50%;background:var(--teal);box-shadow:0 0 12px rgba(0,229,195,.5)}
        .p-tl-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px 24px;transition:border-color .2s,box-shadow .2s}
        .p-tl-card:hover{border-color:var(--teal-mid);box-shadow:0 4px 20px rgba(0,0,0,.25)}
        .p-tl-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px}
        .p-tl-title{font-size:.9rem;font-weight:700;color:var(--white)}
        .p-tl-period{font-family:var(--fm);font-size:.68rem;color:var(--teal);padding:2px 10px;border-radius:20px;border:1px solid var(--teal-mid);background:var(--teal-dim);white-space:nowrap}
        .p-tl-sub{font-size:.8rem;color:var(--muted);margin-bottom:8px}
        .p-tl-desc{font-size:.8rem;color:var(--muted);line-height:1.7}
        .p-current{display:inline-flex;align-items:center;gap:5px;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3fb950;padding:2px 9px;border-radius:20px;background:rgba(63,185,80,.08);border:1px solid rgba(63,185,80,.22)}
        .p-current::before{content:'';width:5px;height:5px;border-radius:50%;background:#3fb950;animation:p-pulse 1.5s infinite}

        @keyframes p-fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes p-pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes p-blink{50%{opacity:0}}
        .p-reveal{opacity:0;transform:translateY(26px);transition:opacity .65s ease,transform .65s ease}
        .p-reveal.p-visible{opacity:1;transform:none}

        .p-footer{background:var(--bg);border-top:1px solid var(--border);padding:28px 6vw;text-align:center;position:relative;z-index:1}
        .p-footer p{font-size:.76rem;color:var(--muted)}
        .p-footer span{color:var(--teal)}

        .p-dl-mobile{display:none}
        @media(max-width:900px){
          .p-hero-inner{grid-template-columns:1fr}
          .p-hero-card{display:block;max-width:340px;margin:32px auto 0}
          .p-dl-mobile{display:none}
          .p-about-grid{grid-template-columns:1fr}
          .p-proj-actions{flex-direction:row;align-items:flex-start}
          .p-side-nav{display:none}
        }
        @media(max-width:640px){
          .p-proj-card{flex-direction:column;}
          .p-proj-thumb-wrap{width:100% !important;min-width:unset !important;height:180px !important;}
        }
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
          .p-hero-btns{flex-direction:column}
          .p-section{padding:80px 5vw}
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
          .p-mobile-menu ul li a:hover,.p-mobile-menu ul li a.active{color:var(--teal)}
          .p-mobile-menu-icons{display:flex;gap:16px;margin-top:32px}
          .p-mobile-menu-icons a{
            width:44px;height:44px;border-radius:12px;
            border:1px solid var(--border);background:var(--bg2);
            display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;color:var(--muted);transition:all .2s;
          }
          .p-mobile-menu-icons a:hover{color:var(--teal);border-color:var(--teal-mid)}
        }
      `}</style>

      <Navbar />
      <div className="p-topo" />

      <div className="p-side-nav">
        {["hero","about","skills","projects","experience","education","contact"].map((s,i) => (
          <div key={s} className={`p-side-dot${i===0?" active":""}`} title={s} />
        ))}
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="p-hero-inner">
          <div>
            <div className="p-hero-tag">
              <span className="p-tag-dot" />
              Available for opportunities
            </div>
            <h1 className="p-hero-title">
              <span className="hi">
                <WordRotate words={greetings} />
              </span>
              <motion.span
                key="name"
                className="name"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
              >
                I&apos;m Najmul Hasan
              </motion.span>
              <span className="role">
                Full-Stack Developer · MERN · React · Next.js
              </span>
            </h1>
            <p className="p-hero-desc">
              Business graduate turned developer — I build structured, scalable web applications
              with React, Node.js and MongoDB. Focused on clean code and great user experience.
            </p>
            <div className="p-hero-btns">
              <a href="#projects" className="p-btn-teal"><i className="fas fa-rocket" /> View Projects</a>
              <a href="#contact" className="p-btn-ghost"><i className="fas fa-paper-plane" /> Let&apos;s Talk</a>
            </div>
          </div>

          <div className="p-hero-card">
            <div className="p-card-photo-wrap">
              <div className="p-card-photo-ring">
                <img src="/profile.png" alt="Najmul Hasan"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = '<div class="p-card-initials">NH</div>';
                  }}
                />
              </div>
              <span className="p-card-online" />
            </div>
            <div className="p-card-name">Najmul Hasan</div>
            <div className="p-card-role">// Full-Stack Developer · MERN Stack</div>
            <div className="p-card-meta">
              <div className="p-card-meta-row"><i className="fas fa-envelope" /><a href="mailto:najmulhasanshahin@gmail.com">najmulhasanshahin@gmail.com</a></div>
              <div className="p-card-meta-row"><i className="fas fa-map-marker-alt" />Dhaka, Bangladesh</div>
              <div className="p-card-meta-row"><i className="fas fa-briefcase" />Full-time / Freelance</div>
              <div className="p-card-meta-row"><i className="fas fa-globe" /><a href="https://najmul-portfolio-six.vercel.app/" target="_blank" rel="noreferrer">najmul-portfolio-six.vercel.app</a></div>
            </div>
            <div className="p-card-divider" />
            <div className="p-card-stats">
              {[["4", "Programming Languages"], ["6", "Dev Tools"], ["10+", "Projects Built"]].map(([n, l]) => (
                <div key={l} className="p-stat-box">
                  <div className="p-stat-num">{n}</div>
                  <div className="p-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
            <div className="p-card-actions">
              <a href="/Najmul_Hasan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="p-card-cta">
                <i className="fas fa-file-alt" /> Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="p-section alt">
        <div className="p-inner">
          <p className="p-sec-label p-reveal">About me</p>
          <h2 className="p-sec-title p-reveal">About <span>Me</span></h2>
          <div className="p-about-grid">
            <div className="p-terminal p-reveal">
              <div className="p-tbar">
                <div className="p-tdot r"/><div className="p-tdot y"/><div className="p-tdot g"/>
                <span className="p-ttitle">najmul.json</span>
              </div>
              <div className="p-tbody">
                <div className="p-tline"><span className="p-tprompt">$</span><span className="p-tcmd">&nbsp;cat najmul.json</span></div>
                <div className="p-tout">{"{"}</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;name&quot;</span>: <span className="p-tstr">&quot;Najmul Hasan&quot;</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;role&quot;</span>: <span className="p-tstr">&quot;Full-Stack Developer&quot;</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;location&quot;</span>: <span className="p-tstr">&quot;Dhaka, Bangladesh&quot;</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;education&quot;</span>: <span className="p-tstr">&quot;BBA Accounting &amp; Finance&quot;</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;experience&quot;</span>: <span className="p-tnum">3</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;projects&quot;</span>: <span className="p-tnum">10</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;available&quot;</span>: <span className="p-tbool">true</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;<span className="p-tval">&quot;stack&quot;</span>: [</div>
                <div className="p-tout">&nbsp;&nbsp;&nbsp;&nbsp;<span className="p-tstr">&quot;React&quot;</span>, <span className="p-tstr">&quot;Node.js&quot;</span>,</div>
                <div className="p-tout">&nbsp;&nbsp;&nbsp;&nbsp;<span className="p-tstr">&quot;MongoDB&quot;</span>, <span className="p-tstr">&quot;Express&quot;</span></div>
                <div className="p-tout">&nbsp;&nbsp;]</div>
                <div className="p-tout">{"}"}<span className="p-tcursor"/></div>
              </div>
            </div>
            <div className="p-about-text p-reveal">
              <h3>Hello!</h3>
              <p>My name is <strong>Najmul</strong> and I specialise in web development. I&apos;m a highly motivated individual dedicated to writing clean, robust, reusable code — striving to never stop learning and improving.</p>
              <p>I hold a <strong>Bachelor of Business Administration in Accounting &amp; Finance</strong> and have worked across data operations and IT support — fields that sharpened my analytical thinking and problem-solving mindset.</p>
              <p>When I&apos;m not coding, I enjoy reading blogs, learning or picking up some new hands-on side projects.</p>
              <div className="p-tags">
                {["React","Node.js","MongoDB","Express","JavaScript","Tailwind CSS","REST API","JWT"].map(t=>(
                  <span key={t} className="p-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="p-section">
        <div className="p-inner">
          <p className="p-sec-label p-reveal">Technical skills</p>
          <h2 className="p-sec-title p-reveal"><span>&lt;/&gt;</span> Skills</h2>
          <p style={{color:"var(--muted)",fontSize:".86rem",marginTop:"-40px",marginBottom:"44px"}} className="p-reveal">Striving to never stop learning and improving.</p>
          <div className="p-skills-grid">
            {[
              {cat:"Web Development", icons:[["fab fa-html5","HTML5"],["fab fa-css3-alt","CSS3"],["fab fa-js","JS"],["fab fa-react","React"]]},
              {cat:"Backend / API",    icons:[["fab fa-node-js","Node.js"],["fas fa-server","Express","#68a063"],["fas fa-database","MongoDB"],["fas fa-lock","JWT","#f7df1e"]]},
              {cat:"Tools & Platforms",icons:[["fab fa-git-alt","Git"],["fab fa-github","GitHub"],["fas fa-cloud","Netlify","#00c7b7"],["fas fa-bolt","Vercel","#e2e2e2"]]},
              {cat:"Design & Styling", icons:[["fas fa-wind","Tailwind","#38bdf8"],["fas fa-palette","Framer","#b57bee"],["fab fa-figma","Figma","#f24e1e"],["fab fa-npm","npm"]]},
            ].map(({cat,icons})=>(
              <div key={cat} className="p-skill-card p-reveal">
                <div className="p-skill-cat"><div className="p-skill-dot"/><span className="p-skill-lbl">{cat}</span></div>
                <div className="p-skill-icons">
                  {icons.map(([cls,label,color])=>(
                    <div key={label} className="p-icon-box">
                      <i className={cls} style={color?{color}:{}} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="p-section alt">
        <div className="p-inner">
          <p className="p-sec-label p-reveal">Selected work</p>
          <h2 className="p-sec-title p-reveal">My <span>Projects</span></h2>

          <div className="p-proj-list">
            {[
              {
                name: "Badar Uddin Welfare",
                flagship: true,
                featured: true,
                tagline: "Charity Management Platform",
                desc: "A production-focused charity management system designed for real organizational use. Includes donation request workflows, admin approval system, and role-based dashboards to manage funds, activities, and beneficiary records.",
                stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Cloudinary"],
                live: "https://badaruddinwelfareorg.vercel.app/",
                code: "https://github.com/najmulcodes/badaruddinwelfare-client",
                img: "/projects/badaruddin.png"
              },
              {
                name: "MicroTask Platform",
                featured: true,
                tagline: "Role-Based Freelance Marketplace",
                desc: "A multi-role micro-tasking platform with Worker, Buyer, and Admin dashboards. Includes task lifecycle management, secure JWT authentication, Stripe-based payments, and submission approval workflows.",
                stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Stripe"],
                live: "https://microtask-client-iota.vercel.app",
                code: "https://github.com/najmulcodes/microtask-client",
                creds: { email: "admin@microtask.com", password: "Admin123", role: "Admin" },
                img: "/projects/microtask.png"
              },
              {
                name: "DevFolio Analyzer",
                featured: true,
                tagline: "AI-Powered GitHub And Portfolio Profile Analyzer",
                desc: "A full-stack analytics dashboard that fetches real GitHub data, scores profiles deterministically across 6 factors, and generates AI-powered insights using the Claude API — with graceful fallback when unavailable.",
                stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "GitHub API", "Anthropic Claude"],
                live: "https://devfolioanalyzer.vercel.app/",
                code: "https://github.com/najmulcodes/devfolio-analyzer",
                img: "/projects/devfolio-analyzer.png"
              },
              {
                name: "LiveCollab",
                featured: true,
                tagline: "Real-Time Team Collaboration Platform",
                desc: "A full-stack real-time Kanban board with live drag-and-drop sync across all connected users, workspace management with invite codes, live presence indicators, and a timestamped activity log.",
                stack: ["React", "Vite", "Tailwind CSS", "Zustand", "Node.js", "Express", "Socket.IO", "MongoDB", "JWT"],
                live: "https://livecollab-rho.vercel.app/",
                code: "https://github.com/najmulcodes/livecollab-client",
                img: "/projects/livecollab.png"
              },
              {
                name: "Care.xyz",
                featured: true,
                tagline: "Care Service Booking Platform (Next.js)",
                desc: "A Next.js-based service platform for booking caregivers across Bangladesh. Features dynamic pricing, cascading location filtering, private booking routes, and Firebase authentication.",
                stack: ["Next.js", "React", "Firebase", "Tailwind CSS"],
                live: "https://care-xyz-baby-sitting-elderly-care.vercel.app",
                code: "https://github.com/najmulcodes/Care.xyz---Baby-Sitting-Elderly-Care-Service-Platform",
                img: "/projects/carexyz.png"
              },
              {
                name: "Gatherly",
                featured: false,
                tagline: "Community Discovery Platform",
                desc: "A community discovery and management platform for Bangladesh built with Next.js 14 App Router. Features credential and Google OAuth auth via NextAuth.js, a searchable community catalog, event listings, and a fully responsive mobile-first design.",
                stack: ["Next.js 14", "NextAuth.js", "Custom CSS", "localStorage"],
                live: "https://gatherly-navy.vercel.app/",
                code: "https://github.com/najmulcodes/Gatherly",
                img: "/projects/gatherly.png"
              },
              {
                name: "ClubSphere",
                featured: false,
                tagline: "Membership & Event Management System",
                desc: "A role-based club management system with event handling, membership approval flows, and protected routes using JWT authentication.",
                stack: ["React", "Node.js", "Express", "MongoDB"],
                live: "https://clubsphere-client1.netlify.app/",
                code: "https://github.com/najmulcodes/clubsphere-client",
                img: "/projects/clubsphere.png"
              },
              {
                name: "BookHub",
                featured: false,
                tagline: "Book Management Platform",
                desc: "A CRUD-based application for managing books with REST API integration. Includes real-time UI updates and structured data handling.",
                stack: ["React", "Node.js", "Express", "MongoDB"],
                live: "https://bookhub-heaven.surge.sh",
                code: "https://github.com/najmulcodes/bookhub-client",
                img: "/projects/bookhub.png"
              },
            ].map(({ name, featured, flagship, tagline, desc, stack, live, code, creds, img }) => (

              <article key={name} className={`p-proj-card p-reveal${flagship ? " flagship" : ""}${featured ? " featured" : ""}`}>

                <div className="p-proj-thumb-wrap">
                  <img src={img} alt={name} className="p-proj-thumb" onError={e => { e.currentTarget.style.display = "none" }} />
                </div>

                <div className="p-proj-body">
                  <div className="p-proj-header">
                    <h3 className="p-proj-name">{name}</h3>
                    {flagship ? (
                      <span className="p-feat-badge flagship">Flagship</span>
                    ) : featured && (
                      <span className="p-feat-badge">Featured</span>
                    )}
                  </div>
                  <p className="p-proj-tagline">{tagline}</p>
                  <p className="p-proj-desc">{desc}</p>
                  {creds && (
                    <div className="p-proj-creds">
                      <div className="cred-title"><i className="fas fa-key" /> Demo Login</div>
                      <div className="cred-row">Email <span className="cred-val">{creds.email}</span></div>
                      <div className="cred-row">Password <span className="cred-val">{creds.password}</span></div>
                      <div className="cred-row">Role <span className="cred-val">{creds.role}</span></div>
                    </div>
                  )}
                  <div className="p-proj-stack">
                    {stack.map(t => <span key={t} className="p-tech">{t}</span>)}
                  </div>
                </div>

                <div className="p-proj-actions">
                  <a href={live} target="_blank" rel="noreferrer" className="p-proj-btn live">
                    <i className="fas fa-external-link-alt" /> Live
                  </a>
                  <a href={code} target="_blank" rel="noreferrer" className="p-proj-btn code">
                    <i className="fab fa-github" /> Code
                  </a>
                  <a href={`/projects/${name.toLowerCase().replace(/\s+/g, "-")}`} className="p-proj-btn code">
                    Details
                  </a>
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="p-section">
        <div className="p-inner">
          <p className="p-sec-label p-reveal">Work history</p>
          <h2 className="p-sec-title p-reveal">Professional <span>Experience</span></h2>
          <div className="p-timeline">
            {[
              {title:"Data Entry Specialist",sub:"Nation IT Limited",period:"2024 – June 2025",current:true,desc:"Managing structured data operations, maintaining records and ensuring data accuracy across business workflows."},
              {title:"Computer Operator",sub:"IT Solution Feni",period:"2015 – 2017",current:false,desc:"Provided IT support and computer operations, handling technical troubleshooting and system maintenance."},
              {title:"Cashier",sub:"Alkhimah Allraqiyat Restaurant — Saudi Arabia",period:"Overseas",current:false,desc:"Managed point-of-sale transactions, customer service, and daily cash reconciliation."},
            ].map(({title,sub,period,current,desc})=>(
              <div key={title} className="p-tl-item p-reveal">
                <div className="p-tl-card">
                  <div className="p-tl-top">
                    <div><div className="p-tl-title">{title}</div><div className="p-tl-sub">{sub}</div></div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                      <span className="p-tl-period">{period}</span>
                      {current && <span className="p-current">Last Job</span>}
                    </div>
                  </div>
                  <p className="p-tl-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="p-section alt">
        <div className="p-inner">
          <p className="p-sec-label p-reveal">Academic background</p>
          <h2 className="p-sec-title p-reveal">My <span>Education</span></h2>
          <div className="p-timeline">
            {[
              {title:"BBA — Accounting & Finance",sub:"City College",period:"2019 – 2023",extra:"CGPA 3.04",desc:null},
              {title:"Certification — Complete Web Development",sub:"Programming Hero",period:"2025 – 2026",extra:null,desc:"Full Stack Track — covering React, Node.js, Express, MongoDB and deployment."},
              {title:"HSC — Business Studies",sub:"South East Degree College",period:"2013 – 2015",extra:null,desc:null},
              {title:"SSC — Business Studies",sub:"FazilPur Farhad Nagar Zinnah High School",period:"2007 – 2013",extra:null,desc:null},
            ].map(({title,sub,period,extra,desc})=>(
              <div key={title} className="p-tl-item p-reveal">
                <div className="p-tl-card">
                  <div className="p-tl-top">
                    <div><div className="p-tl-title">{title}</div><div className="p-tl-sub">{sub}</div></div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                      <span className="p-tl-period">{period}</span>
                      {extra && <span style={{fontFamily:"var(--fm)",fontSize:".68rem",color:"var(--teal)"}}>{extra}</span>}
                    </div>
                  </div>
                  {desc && <p className="p-tl-desc">{desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="p-section" style={{paddingBottom:"60px"}}>
        <style>{`
          .p-ct-header{text-align:center;margin-bottom:36px}
          .p-ct-header .p-sec-label{justify-content:center}
          .p-ct-header .p-sec-label::after{display:none}
          .p-ct-header .p-sec-title{margin-bottom:12px}
          .p-ct-sub{color:var(--muted);font-size:.88rem;line-height:1.8}
          .p-ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start;margin-bottom:24px;}
          .p-ct-left{display:flex;flex-direction:column;gap:14px}
          .p-ct-item{display:flex;align-items:center;gap:16px;padding:18px 20px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;text-decoration:none;transition:border-color .22s,box-shadow .22s,transform .22s;}
          .p-ct-item:hover{border-color:var(--teal-mid);box-shadow:0 6px 24px rgba(0,229,195,.08);transform:translateX(4px);}
          .p-ct-icon{width:42px;height:42px;border-radius:11px;flex-shrink:0;background:var(--teal-dim);border:1px solid var(--teal-mid);display:flex;align-items:center;justify-content:center;}
          .p-ct-icon i{color:var(--teal);font-size:.92rem}
          .p-ct-lbl{font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:3px;}
          .p-ct-val{font-size:.86rem;color:var(--white);font-weight:600;line-height:1.3}
          .p-ct-soc{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:24px}
          .p-ct-soc-btn{display:inline-flex;align-items:center;gap:9px;padding:11px 24px;border-radius:12px;border:1px solid var(--border);background:var(--bg2);font-size:.8rem;font-weight:600;color:var(--muted);transition:all .22s;}
          .p-ct-soc-btn i{font-size:.95rem}
          .p-ct-soc-btn:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(0,229,195,.1)}
          .p-ct-soc-btn.gh:hover{border-color:rgba(255,255,255,.25);color:var(--white);background:rgba(255,255,255,.05)}
          .p-ct-soc-btn.li:hover{border-color:rgba(10,102,194,.5);color:#0a66c2;background:rgba(10,102,194,.08)}
          .p-ct-soc-btn.wa:hover{border-color:rgba(37,211,102,.4);color:#25d366;background:rgba(37,211,102,.08)}
          .p-ct-copy{text-align:center;padding-top:20px;border-top:1px solid var(--border);font-size:.75rem;color:var(--muted);}
          .p-ct-copy span{color:var(--teal)}
          @media(max-width:760px){.p-ct-grid{grid-template-columns:1fr}}
        `}</style>

        <div className="p-inner">
          <div className="p-ct-header">
            <p className="p-sec-label p-reveal">Get in touch</p>
            <h2 className="p-sec-title p-reveal">Let&apos;s Work <span>Together</span></h2>
            <p className="p-ct-sub p-reveal">
              Open to full-time roles, freelance projects and collaborations.<br />
              I&apos;d love to hear about what you&apos;re building.
            </p>
          </div>

          <div className="p-ct-grid">
            <div className="p-ct-left p-reveal">
              <a href="mailto:najmulhasanshahin@gmail.com" className="p-ct-item">
                <div className="p-ct-icon"><i className="fas fa-envelope" /></div>
                <div><p className="p-ct-lbl">Email</p><p className="p-ct-val">najmulhasanshahin@gmail.com</p></div>
              </a>
              <a href="tel:+8801840242448" className="p-ct-item">
                <div className="p-ct-icon"><i className="fas fa-phone" /></div>
                <div><p className="p-ct-lbl">Phone</p><p className="p-ct-val">+880 1840-242448</p></div>
              </a>
              <div className="p-ct-item" style={{cursor:"default"}}>
                <div className="p-ct-icon"><i className="fas fa-map-marker-alt" /></div>
                <div><p className="p-ct-lbl">Location</p><p className="p-ct-val">Dhaka, Bangladesh</p></div>
              </div>
              <div className="p-ct-item" style={{cursor:"default"}}>
                <div className="p-ct-icon"><i className="fas fa-clock" /></div>
                <div><p className="p-ct-lbl">Response Time</p><p className="p-ct-val">Within 24 hours</p></div>
              </div>
            </div>

            <div className="p-reveal">
              <ContactForm />
            </div>
          </div>

          <div className="p-ct-soc p-reveal">
            <a href="https://github.com/najmulcodes" target="_blank" rel="noreferrer" className="p-ct-soc-btn gh">
              <i className="fab fa-github" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/najmulcodes/" target="_blank" rel="noreferrer" className="p-ct-soc-btn li">
              <i className="fab fa-linkedin" /> LinkedIn
            </a>
            <a href="https://wa.me/8801840242448" target="_blank" rel="noreferrer" className="p-ct-soc-btn wa">
              <i className="fab fa-whatsapp" /> WhatsApp
            </a>
          </div>

          <p className="p-ct-copy p-reveal">
            © {new Date().getFullYear()} <span>Najmul Hasan . All rights reserved.</span> — Crafted with Next.js &amp; Tailwind CSS.
          </p>
        </div>
      </section>

    </>
  );
}
