"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { anchors, bus, Anchor } from "./diamond-bus";
import { DIAMOND_PIECES, DIAMOND_VIEWBOX } from "./diamond-paths";

const ASPECT = DIAMOND_VIEWBOX.height / DIAMOND_VIEWBOX.width;
const { damp, clamp, lerp, smoothstep } = THREE.MathUtils;

// Deterministic per-piece "chaos" so the scatter looks designed, not random.
const SCATTER = [
  { rot: [1.9, -2.4, 0.8], push: [-0.9, 1.6, 0.6] },
  { rot: [-1.2, 2.8, -1.6], push: [1.8, 0.7, -0.4] },
  { rot: [2.2, 1.1, 2.4], push: [0.6, -1.7, 0.8] },
  { rot: [-2.6, -1.4, -0.9], push: [-1.9, -0.5, -0.6] },
] as const;

function buildPieces() {
  const loader = new SVGLoader();
  return DIAMOND_PIECES.map((piece, i) => {
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${piece.d}"/></svg>`);
    const shapes = SVGLoader.createShapes(data.paths[0]);
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 64,
      bevelEnabled: true,
      bevelThickness: 12,
      bevelSize: 5,
      bevelSegments: 6,
      curveSegments: 24,
    });
    // SVG space → unit space: centre on the diamond, flip Y. Two negative axes
    // keep the triangle winding (and therefore the normals) intact.
    const s = 1 / DIAMOND_VIEWBOX.width;
    geo.translate(-DIAMOND_VIEWBOX.width / 2, -DIAMOND_VIEWBOX.height / 2, -32);
    geo.scale(s, -s, -s);
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox!.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);
    geo.computeVertexNormals();
    const box = new THREE.Vector3();
    geo.boundingBox!.getSize(box);
    // How much this piece must grow to fill the whole diamond's box on its own.
    const fill = Math.min(ASPECT / box.y, 1 / box.x);
    return { geo, center, fill, dir: new THREE.Vector3(piece.dir[0], piece.dir[1], 0), scatter: SCATTER[i] };
  });
}

type Pose = {
  x: number;
  y: number;
  size: number;
  explode: number;
  glow: number;
  spin: number;
  tilt: number;
  color: THREE.Color;
  /** Per piece: 1 = this piece is shown alone, centred and enlarged. */
  solo: number[];
  /** Per piece: 0 = hidden. */
  vis: number[];
};

function makePose(): Pose {
  return {
    x: 0, y: 0, size: 0, explode: 0, glow: 0, spin: 0, tilt: 1, color: new THREE.Color(),
    solo: [0, 0, 0, 0], vis: [1, 1, 1, 1],
  };
}

function readAnchor(a: Anchor, out: Pose) {
  const r = a.el.getBoundingClientRect();
  out.x = r.left + r.width / 2;
  out.y = r.top + r.height / 2;
  out.size = r.height * a.pose.scale;
  out.explode = a.pose.explode;
  out.glow = a.pose.glow;
  out.spin = a.pose.spin;
  out.tilt = a.pose.tilt;
  out.color.set(a.pose.color);
  for (let i = 0; i < 4; i++) {
    out.solo[i] = a.pose.solo === i ? 1 : 0;
    out.vis[i] = a.pose.solo < 0 || a.pose.solo === i ? 1 : 0;
  }
  return out;
}

function mixPose(a: Pose, b: Pose, t: number, out: Pose) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.size = lerp(a.size, b.size, t);
  out.explode = lerp(a.explode, b.explode, t);
  out.glow = lerp(a.glow, b.glow, t);
  out.spin = lerp(a.spin, b.spin, t);
  out.tilt = lerp(a.tilt, b.tilt, t);
  out.color.lerpColors(a.color, b.color, t);
  for (let i = 0; i < 4; i++) {
    out.solo[i] = lerp(a.solo[i], b.solo[i], t);
    out.vis[i] = lerp(a.vis[i], b.vis[i], t);
  }
  return out;
}

const PRELOADER_COLOR = new THREE.Color("#E54100");

// Scratch poses reused every frame — no garbage in the render loop. There is
// only ever one stage, so module scope is safe.
const scratch = { a: makePose(), b: makePose(), mixed: makePose(), center: makePose(), target: makePose() };

function Diamond() {
  const pieces = useMemo(() => buildPieces(), []);
  const materials = useMemo(
    () =>
      pieces.map(
        () =>
          new THREE.MeshPhysicalMaterial({
            color: "#460E04",
            roughness: 0.3,
            metalness: 0.08,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            emissive: "#E54100",
            emissiveIntensity: 0,
            envMapIntensity: 0.7,
          })
      ),
    [pieces]
  );

  useEffect(
    () => () => {
      pieces.forEach((p) => p.geo.dispose());
      materials.forEach((m) => m.dispose());
    },
    [pieces, materials]
  );

  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const { camera, size } = useThree();

  const live = useRef({
    x: 0, y: 0, size: 0, explode: 3, glow: 0.4, spin: 0, tilt: 0,
    color: new THREE.Color("#E54100"), angle: 0, kickVel: 0, burst: 0, hover: 0,
    tiltX: 0, tiltY: 0, focus: [0, 0, 0, 0], first: true, flip: 0, flight: 0,
    solo: [0, 0, 0, 0], vis: [1, 1, 1, 1],
  });
  const pointer = useRef({ x: -1e4, y: -1e4, nx: 0, ny: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ny = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const vw = size.width;
    const vh = size.height;
    const cam = camera as THREE.PerspectiveCamera;
    const worldH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const wpp = worldH / vh; // world units per CSS pixel
    const L = live.current;
    const { a, b, mixed, center, target } = scratch;

    // 1. Where should the diamond be? Blend between the two anchors whose
    //    section boundary is currently crossing the middle band of the screen.
    const list = [...anchors.values()].sort((p, q) =>
      p.el.compareDocumentPosition(q.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
    let haveAnchor = list.length > 0;
    let flight = 0;
    let flipTarget = 0;
    if (haveAnchor) {
      const enter = vh * 0.85;
      const span = vh * 0.55;
      let k = 0;
      for (let i = 1; i < list.length; i++) {
        if (list[i].section.getBoundingClientRect().top < enter) k = i;
      }
      if (k === 0) {
        readAnchor(list[0], mixed);
      } else {
        const top = list[k].section.getBoundingClientRect().top;
        const t = smoothstep(clamp((enter - top) / span, 0, 1), 0, 1);
        mixPose(readAnchor(list[k - 1], a), readAnchor(list[k], b), t, mixed);
        // In transit the diamond ducks smaller and turns a full circle per
        // section (so lone pieces never land mirrored) — the turn accumulates,
        // so it's continuous at boundaries.
        flight = Math.sin(Math.PI * t);
        flipTarget = (k - 1 + t) * Math.PI * 2;
      }
      haveAnchor = mixed.size > 0;
      mixed.size *= 1 - 0.35 * flight;
    }

    // 2. During the preloader the diamond is held centre-stage instead.
    center.x = vw / 2;
    center.y = vh / 2;
    center.size = Math.min(vw, vh) * 0.3;
    center.explode = 0;
    center.glow = 0.35;
    center.spin = 0.25;
    center.tilt = 0.6;
    center.color.copy(PRELOADER_COLOR);
    center.solo.fill(0);
    center.vis.fill(1);
    if (haveAnchor) mixPose(center, mixed, bus.handoff, target);
    else mixPose(center, center, 0, target);

    // 3. Ease the live pose toward the target. Position follows quickly so the
    //    object feels attached to the page; size and colour drift more slowly.
    if (L.first) {
      L.x = target.x; L.y = target.y; L.size = target.size; L.first = false;
    }
    L.x = damp(L.x, target.x, 9, dt);
    L.y = damp(L.y, target.y, 9, dt);
    L.size = damp(L.size, target.size, 6, dt);
    L.explode = damp(L.explode, target.explode + (1 - bus.assembly) * 2.2, 4, dt);
    L.glow = damp(L.glow, target.glow, 3, dt);
    L.spin = damp(L.spin, target.spin, 2, dt);
    L.tilt = damp(L.tilt, target.tilt, 3, dt);
    L.color.lerp(target.color, 1 - Math.exp(-3.5 * dt));
    L.flip = damp(L.flip, flipTarget * bus.handoff, 7, dt);
    L.flight = damp(L.flight, flight, 7, dt);

    // Impulses: keystrokes add spin, a burst blows the pieces apart.
    if (bus.kick) {
      L.kickVel += bus.kick * 2.6;
      bus.kick = 0;
    }
    L.kickVel = damp(L.kickVel, 0, 2.2, dt);
    if (bus.burst) {
      L.burst = Math.max(L.burst, bus.burst);
      bus.burst = 0;
    }
    L.burst = damp(L.burst, 0, 2.4, dt);

    // Hovering the diamond makes it breathe open.
    const dx = pointer.current.x - L.x;
    const dy = pointer.current.y - L.y;
    const near = Math.hypot(dx, dy) < L.size * 0.55;
    L.hover = damp(L.hover, near ? 1 : 0, 6, dt);

    // Cursor tilt: the whole object leans toward the pointer.
    L.tiltX = damp(L.tiltX, pointer.current.ny * 0.45 * L.tilt, 4, dt);
    L.tiltY = damp(L.tiltY, pointer.current.nx * 0.6 * L.tilt, 4, dt);
    L.angle += (L.spin + L.kickVel) * dt;
    // When an anchor doesn't ask for spin, ease back to the nearest full turn
    // so the object (or a lone piece) faces the right way round.
    const settle = 1 - clamp(L.spin / 0.3, 0, 1);
    const TURN = Math.PI * 2;
    if (settle > 0 && Math.abs(L.kickVel) < 0.5) {
      L.angle = damp(L.angle, Math.round(L.angle / TURN) * TURN, 2.5 * settle, dt);
    }

    // 4. Apply.
    const s = (L.size * wpp) / ASPECT;
    const visible = s > 0.001 && L.y > -L.size && L.y < vh + L.size;
    g.visible = visible;
    if (!visible) return;
    const time = state.clock.elapsedTime;
    g.position.set((L.x - vw / 2) * wpp, -(L.y - vh / 2) * wpp + Math.sin(time * 1.1) * 0.025 * s, 0);
    g.scale.setScalar(s);
    g.rotation.set(
      L.tiltX + Math.sin(time * 0.7) * 0.06 + L.flight * 0.35,
      L.angle + L.flip + L.tiltY + Math.sin(time * 0.45) * 0.22,
      Math.sin(time * 0.5) * 0.03
    );

    const chaos = 1 - bus.assembly;
    pieces.forEach((p, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const focused = bus.focus === i;
      L.focus[i] = damp(L.focus[i], focused ? 1 : 0, 6, dt);
      const f = L.focus[i];
      L.solo[i] = damp(L.solo[i], target.solo[i], 5, dt);
      L.vis[i] = damp(L.vis[i], target.vis[i], 5, dt);
      const solo = L.solo[i];
      const keep = 1 - solo;
      m.visible = L.vis[i] > 0.01;
      // A solo piece slides to the centre and grows to fill the anchor alone.
      m.scale.setScalar(Math.max(L.vis[i], 0.0001) * (1 + solo * (p.fill - 1)));
      const push = (L.explode * 0.5 + L.hover * 0.06 + L.burst * 0.9 + f * 0.16) * keep + L.burst * 0.3 * solo;
      const sc = p.scatter;
      m.position.set(
        p.center.x * keep + p.dir.x * push + sc.push[0] * chaos * 0.6,
        p.center.y * keep + p.dir.y * push + sc.push[1] * chaos * 0.6,
        p.center.z + sc.push[2] * (chaos + L.burst) * 0.5 + f * 0.12
      );
      const r = chaos + L.burst * 0.5 + L.explode * 0.08 * keep;
      m.rotation.set(sc.rot[0] * r, sc.rot[1] * r, sc.rot[2] * r);
      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.color.copy(L.color);
      // Unfocused pieces recede slightly when one piece is in the spotlight.
      if (bus.focus >= 0) mat.color.multiplyScalar(1 - (1 - f) * 0.25);
      mat.emissiveIntensity = L.glow * 0.6 + f * 0.55 + L.burst * 0.4;
    });

    if (!bus.ready) bus.ready = true;
  });

  return (
    <group ref={group}>
      {pieces.map((p, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={p.geo}
          material={materials[i]}
        />
      ))}
    </group>
  );
}

export default function DiamondStage() {
  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 30, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.NeutralToneMapping, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} color="#FFF5EC" />
      <directionalLight position={[-5, -2, 3]} intensity={0.9} color="#FFD0A5" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#FFF5EC" position={[0, 4, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#E54100" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#FFD0A5" position={[5, -2, 3]} scale={3} />
        <Lightformer form="rect" intensity={1.2} color="#FFF5EC" position={[0, -5, 1]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>
      <Diamond />
    </Canvas>
  );
}
