"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Interactive 3D golden rose divider.
 *
 * Loads a real rose model (public/models/rose.glb), re-skins it in polished gold
 * lit by a generated studio environment, and lets the visitor drag to rotate
 * (OrbitControls). It auto-rotates gently when idle, lazy-loads three.js, and
 * only renders while on screen. Reduced motion disables the idle spin; missing
 * WebGL hides the section.
 *
 * Model: "Rose" by Erbay ÇELIK — licensed CC BY 3.0 (see public/models/CREDITS.md).
 */

export default function RoseDivider() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const THREE = await import("three");
        const [{ GLTFLoader }, { OrbitControls }, { RoomEnvironment }] =
          await Promise.all([
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/controls/OrbitControls.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
          ]);
        if (disposed) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(
          new RoomEnvironment(),
          0.04,
        ).texture;

        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0.3, 3.3);

        // Warm lights for golden highlights.
        const key = new THREE.DirectionalLight(0xfff1d5, 1.6);
        key.position.set(2.5, 3.5, 2.5);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xffd98a, 0.7);
        fill.position.set(-3, 1, -2);
        scene.add(fill);
        scene.add(new THREE.AmbientLight(0xffffff, 0.22));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.enableZoom = false; // keep page scroll natural
        controls.autoRotate = !reduceMotion;
        controls.autoRotateSpeed = 1.4;
        controls.target.set(0, 0, 0);

        const gold = new THREE.MeshPhysicalMaterial({
          color: 0xcaa23a,
          metalness: 1,
          roughness: 0.28,
          clearcoat: 0.5,
          clearcoatRoughness: 0.35,
          envMapIntensity: 1.3,
          side: THREE.DoubleSide,
        });

        const loader = new GLTFLoader();
        loader.load(
          "/models/rose.glb",
          (gltf) => {
            if (disposed) return;
            const root = gltf.scene;
            root.traverse((o) => {
              const m = o as { isMesh?: boolean; material?: unknown };
              if (m.isMesh) m.material = gold;
            });

            // Scale to a consistent size, then re-center. The recenter offset
            // must be scaled too (translation happens in parent space, after
            // the geometry is scaled) — otherwise the model is flung off-view.
            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const s = 1.85 / maxDim;
            root.scale.setScalar(s);
            root.position.set(-center.x * s, -center.y * s, -center.z * s);

            scene.add(root);
            renderer.render(scene, camera);
          },
          undefined,
          () => {
            if (!disposed) setFailed(true);
          },
        );

        let raf = 0;
        let visible = true;
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!visible) return;
          controls.update();
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(loop);

        const io = new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
          },
          { threshold: 0.02 },
        );
        io.observe(mount);

        const onResize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(mount);

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          controls.dispose();
          gold.dispose();
          scene.environment?.dispose();
          pmrem.dispose();
          scene.traverse((o) => {
            const m = o as { geometry?: { dispose?: () => void } };
            m.geometry?.dispose?.();
          });
          renderer.dispose();
          if (renderer.domElement.parentNode === mount) {
            mount.removeChild(renderer.domElement);
          }
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  if (failed) return null;

  return (
    <section className="rose-divider" data-screen-label="Rose">
      <div className="rose-stage" ref={mountRef} />
    </section>
  );
}
