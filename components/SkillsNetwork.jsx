"use client";
import { useState, useRef, useEffect } from "react";

/**
 * Network-graph skills visualization: a core hub with category nodes
 * orbiting it, and individual skills fanned out from each category.
 * Pure SVG lines + HTML-positioned nodes (no physics simulation, no
 * external graph library) — positions are computed with simple
 * trigonometry so the layout is deterministic and easy to reason about
 * without a browser to visually tune a force simulation in.
 *
 * Falls back to a simpler stacked-list layout below 860px — a radial
 * graph with 20+ nodes doesn't have room to breathe on a phone screen.
 */

const CATEGORIES = [
  { id: "web", label: "Web Development", angle: -55, icon: "fab fa-react", skills: [
    ["fab fa-html5", "HTML5"], ["fab fa-css3-alt", "CSS3"], ["fab fa-js", "JavaScript"], ["fab fa-react", "React"],
  ]},
  { id: "backend", label: "Backend / API", angle: 35, icon: "fab fa-node-js", skills: [
    ["fab fa-node-js", "Node.js"], ["fas fa-server", "Express"], ["fas fa-database", "MongoDB"], ["fas fa-lock", "JWT"],
  ]},
  { id: "tools", label: "Tools & Platforms", angle: 145, icon: "fab fa-github", skills: [
    ["fab fa-git-alt", "Git"], ["fab fa-github", "GitHub"], ["fas fa-cloud", "Netlify"], ["fas fa-bolt", "Vercel"],
  ]},
  { id: "design", label: "Design & Styling", angle: 235, icon: "fas fa-palette", skills: [
    ["fas fa-wind", "Tailwind"], ["fas fa-palette", "Framer"], ["fab fa-figma", "Figma"], ["fab fa-npm", "npm"],
  ]},
];

const CAT_RADIUS = 180;
const SKILL_RADIUS = 300;
const SKILL_SPREAD = 34; // degrees, how wide each category's skills fan out

function polar(cx, cy, radius, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
}

export default function SkillsNetwork() {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cx = 400, cy = 300;

  const categoryNodes = CATEGORIES.map((cat) => ({
    ...cat,
    pos: polar(cx, cy, CAT_RADIUS, cat.angle),
  }));

  const skillNodes = categoryNodes.flatMap((cat) =>
    cat.skills.map(([icon, label], i) => {
      const spread = (i - (cat.skills.length - 1) / 2) * (SKILL_SPREAD / (cat.skills.length - 1 || 1));
      return {
        catId: cat.id,
        icon,
        label,
        pos: polar(cx, cy, SKILL_RADIUS, cat.angle + spread),
      };
    })
  );

  return (
    <div ref={rootRef} className={`p-skillnet${visible ? " p-skillnet-visible" : ""}`}>
      <svg className="p-skillnet-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {categoryNodes.map((cat) => (
          <line
            key={`core-${cat.id}`}
            x1={cx} y1={cy} x2={cat.pos.x} y2={cat.pos.y}
            className={`p-skillnet-line${active === null || active === cat.id ? " p-skillnet-line-on" : ""}`}
          />
        ))}
        {skillNodes.map((s, i) => {
          const cat = categoryNodes.find((c) => c.id === s.catId);
          return (
            <line
              key={`skill-${i}`}
              x1={cat.pos.x} y1={cat.pos.y} x2={s.pos.x} y2={s.pos.y}
              className={`p-skillnet-line p-skillnet-line-thin${active === null || active === s.catId ? " p-skillnet-line-on" : ""}`}
            />
          );
        })}
      </svg>

      <div className="p-skillnet-node p-skillnet-core" style={{ left: `${(cx / 800) * 100}%`, top: `${(cy / 600) * 100}%` }}>
        <i className="fas fa-microchip" />
        <span>NAVICORE</span>
      </div>

      {categoryNodes.map((cat) => (
        <div
          key={cat.id}
          className={`p-skillnet-node p-skillnet-cat${active === cat.id ? " p-skillnet-active" : ""}`}
          style={{ left: `${(cat.pos.x / 800) * 100}%`, top: `${(cat.pos.y / 600) * 100}%` }}
          onMouseEnter={() => setActive(cat.id)}
          onMouseLeave={() => setActive(null)}
        >
          <i className={cat.icon} />
          <span>{cat.label}</span>
        </div>
      ))}

      {skillNodes.map((s, i) => (
        <div
          key={i}
          className={`p-skillnet-node p-skillnet-skill${active === s.catId ? " p-skillnet-active" : ""}`}
          style={{ left: `${(s.pos.x / 800) * 100}%`, top: `${(s.pos.y / 600) * 100}%` }}
          onMouseEnter={() => setActive(s.catId)}
          onMouseLeave={() => setActive(null)}
        >
          <i className={s.icon} />
          <span>{s.label}</span>
        </div>
      ))}

      {/* Mobile fallback — simpler stacked category list, same data */}
      <div className="p-skillnet-mobile">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="p-skillnet-mobile-cat">
            <div className="p-skillnet-mobile-catlbl"><i className={cat.icon} /> {cat.label}</div>
            <div className="p-skillnet-mobile-skills">
              {cat.skills.map(([icon, label]) => (
                <span key={label} className="p-tech"><i className={icon} /> {label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
