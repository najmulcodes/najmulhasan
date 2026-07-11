"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial, Line, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * Holographic mission-control globe. Built entirely from well-tested
 * drei primitives (Sphere, Points, Line, Float) plus @react-three/postprocessing's
 * Bloom — deliberately no hand-written shaders and no custom/extruded
 * geometry, since those are specifically what caused WebGL build/render
 * failures on a past project in this codebase's history. Bloom gives the
 * "glow" look without needing custom shader code.
 *
 * PERFORMANCE: this used to render continuously at 60fps forever — full
 * scene + Bloom post-processing passes — regardless of whether the hero
 * was actually on screen or the tab was even focused. That's exactly the
 * kind of thing that spikes GPU usage and drags a whole laptop down, not
 * just the browser tab. Fixed by pausing the render loop entirely
 * (frameloop="never") whenever the hero isn't visible or the tab is
 * backgrounded, via IntersectionObserver + visibilitychange.
 */

const RADIUS = 2.2;

function latLongToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Bangladesh + a few global hubs, for glowing "network route" arcs —
// a real, recognizable globe-with-routes pattern, not decoration-only.
const BANGLADESH = { lat: 23.685, lon: 90.3563, label: "Dhaka" };
const HUBS = [
  { lat: 1.3521, lon: 103.8198, label: "Singapore" },
  { lat: 51.5074, lon: -0.1278, label: "London" },
  { lat: 25.2048, lon: 55.2708, label: "Dubai" },
  { lat: 37.7749, lon: -122.4194, label: "San Francisco" },
];

function arcPoints(a, b, radius, segments = 32) {
  const start = latLongToVec3(a.lat, a.lon, radius);
  const end = latLongToVec3(b.lat, b.lon, radius);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(radius * 1.45);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(segments);
}

// Generated once at module load (not inside render/useMemo) — Math.random()
// is an impure call and React's purity rules flag it if called during render.
// Reduced from 900 -> 450: still reads as a dense particle field, half the
// per-frame cost.
function generateParticlePositions(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = RADIUS * 1.7 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}
const PARTICLE_POSITIONS = generateParticlePositions(450);

function Globe() {
  const wireRef = useRef(null);
  const groupRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e) {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.6,
        y: (e.clientY / window.innerHeight - 0.5) * 0.3,
      };
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const bdPos = useMemo(() => latLongToVec3(BANGLADESH.lat, BANGLADESH.lon, RADIUS * 1.01), []);
  const arcs = useMemo(() => HUBS.map((h) => arcPoints(BANGLADESH, h, RADIUS)), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += (target.current.y - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe globe shell — segment count trimmed from 36x36 */}
      <Sphere ref={wireRef} args={[RADIUS, 28, 28]}>
        <meshBasicMaterial color="#00E5C3" wireframe transparent opacity={0.22} />
      </Sphere>

      {/* Solid inner core for depth/occlusion, near-black glass */}
      <Sphere args={[RADIUS * 0.985, 32, 32]}>
        <meshPhysicalMaterial
          color="#040911"
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.6}
        />
      </Sphere>

      {/* Route arcs from Bangladesh to global hubs */}
      {arcs.map((points, i) => (
        <Line key={i} points={points} color="#00E5C3" lineWidth={1.4} transparent opacity={0.55} />
      ))}

      {/* Bangladesh marker — the "you are here" glow */}
      <Float speed={2} floatIntensity={0.6}>
        <mesh position={bdPos}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#D4A843" />
        </mesh>
      </Float>

      {/* Ambient particle field */}
      <Points positions={PARTICLE_POSITIONS} stride={3}>
        <PointMaterial color="#00E5C3" size={0.02} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={12} color="#00E5C3" distance={20} />
      <pointLight position={[-5, -2, -3]} intensity={8} color="#D4A843" distance={20} />
    </>
  );
}

export default function HolographicGlobe() {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(false);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let tabVisible = document.visibilityState === "visible";
    let inViewport = false;

    function updateActive() {
      setActive(inViewport && tabVisible);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        updateActive();
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    function onVisibility() {
      tabVisible = document.visibilityState === "visible";
      updateActive();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className="p-globe-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        frameloop={active && !reducedMotion ? "always" : "never"}
      >
        <Lights />
        <Globe />
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
