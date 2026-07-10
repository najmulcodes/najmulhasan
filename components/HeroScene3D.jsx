"use client";
import { useEffect, useRef } from "react";

/**
 * Real WebGL hero centerpiece, using three.js directly (no react-three-fiber
 * / drei abstraction layer). Deliberately built from robust built-in
 * geometry (TorusKnotGeometry + IcosahedronGeometry) rather than custom
 * triangulated/extruded geometry or hand-written shaders — those are the
 * specific things that caused build/render failures on a past project in
 * this codebase's history, so this sticks to primitives that are always
 * well-formed.
 *
 * Renders into a fixed-size canvas, mouse-reactive rotation, capped pixel
 * ratio for perf, skips gracefully if WebGL isn't available, and disposes
 * everything on unmount.
 */
export default function HeroScene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, scene, camera, raf, resizeObserver;
    let knot, ico, ico2;
    let destroyed = false;
    let targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;

    async function init() {
      const THREE = await import("three");
      if (destroyed) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 7);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      // Lighting — warm key light (brand gold) + cool fill (navy) for a
      // premium two-tone metallic look, plus ambient so nothing is fully black.
      scene.add(new THREE.AmbientLight(0x334466, 0.9));
      const keyLight = new THREE.PointLight(0xc8a24b, 14, 20);
      keyLight.position.set(3, 2, 4);
      scene.add(keyLight);
      const fillLight = new THREE.PointLight(0x3a5fb8, 8, 20);
      fillLight.position.set(-4, -2, 3);
      scene.add(fillLight);

      // Centerpiece: a torus knot in brushed-gold physical material —
      // distinctive silhouette, built-in geometry, no custom triangulation.
      const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.34, 180, 24, 2, 3);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0xc8a24b,
        metalness: 0.82,
        roughness: 0.28,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
      });
      knot = new THREE.Mesh(knotGeo, knotMat);
      scene.add(knot);

      // A larger faceted wireframe icosahedron shell around it — cheap,
      // robust primitive, adds a "technical/schematic" layer of depth.
      const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0x3a5fb8,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      ico = new THREE.Mesh(icoGeo, icoMat);
      scene.add(ico);

      const icoGeo2 = new THREE.IcosahedronGeometry(2.5, 1);
      const icoMat2 = new THREE.MeshBasicMaterial({
        color: 0xc8a24b,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      ico2 = new THREE.Mesh(icoGeo2, icoMat2);
      ico2.rotation.set(0.4, 0.3, 0);
      scene.add(ico2);

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function onMouseMove(e) {
        const rect = mount.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 0.6;
        targetRotX = y * 0.4;
      }
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      let t = 0;
      function animate() {
        raf = requestAnimationFrame(animate);
        t += prefersReducedMotion ? 0 : 0.0035;

        curRotX += (targetRotX - curRotX) * 0.05;
        curRotY += (targetRotY - curRotY) * 0.05;

        knot.rotation.x = t * 0.7 + curRotX;
        knot.rotation.y = t + curRotY;
        ico.rotation.x = -t * 0.3 + curRotX * 0.5;
        ico.rotation.y = t * 0.4 + curRotY * 0.5;
        ico2.rotation.x = t * 0.2;
        ico2.rotation.y = -t * 0.25;

        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(animate);

      resizeObserver = new ResizeObserver(() => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(mount);

      mount._cleanupMouseMove = () => window.removeEventListener("mousemove", onMouseMove);
      mount._threeRefs = { THREE, knotGeo, knotMat, icoGeo, icoMat, icoGeo2, icoMat2, renderer };
    }

    try {
      init();
    } catch (err) {
      // WebGL unavailable or failed to init — fail silently, hero still
      // works fine with just the CSS depth orbs behind it.
      console.warn("HeroScene3D: WebGL init failed, skipping.", err);
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      if (resizeObserver) resizeObserver.disconnect();
      if (mount._cleanupMouseMove) mount._cleanupMouseMove();
      if (mount._threeRefs) {
        const { knotGeo, knotMat, icoGeo, icoMat, icoGeo2, icoMat2, renderer } = mount._threeRefs;
        knotGeo?.dispose();
        knotMat?.dispose();
        icoGeo?.dispose();
        icoMat?.dispose();
        icoGeo2?.dispose();
        icoMat2?.dispose();
        renderer?.dispose();
        if (renderer?.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="p-hero-3d" aria-hidden="true" />;
}
