"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  RingGeometry,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type Points,
} from "three";
import { getScroll } from "@/lib/scroll";

/* ------------------------------------------------------------------ *
 * Route-specific centerpieces that swap into the persistent space
 * scene. The gas giant uses real Saturn maps (Solar System Scope,
 * CC BY 4.0) tinted violet like the Earth; the rest are procedural
 * but built for the same photoreal lighting + Bloom pipeline. Each
 * sits at the Earth's anchor so page layouts keep working.
 * ------------------------------------------------------------------ */

const ANCHOR: [number, number, number] = [8.9, 0.3, -6.5];

function makeTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  return new CanvasTexture(canvas);
}

/* ---------------- Services: ringed gas giant ---------------- */

const RING_INNER = 5.5;
const RING_OUTER = 9.6;

export function GasGiant() {
  const planet = useRef<Mesh>(null);

  const [surfaceMap, ringMap] = useTexture([
    "/textures/planet/saturn_2k.jpg",
    "/textures/planet/saturn_ring_alpha.png",
  ]);

  useMemo(() => {
    surfaceMap.colorSpace = SRGBColorSpace;
    ringMap.colorSpace = SRGBColorSpace;
  }, [surfaceMap, ringMap]);

  /* The ring texture is a radial strip — remap the ring UVs so u runs
     inner→outer edge instead of the default planar projection. */
  const ringGeometry = useMemo(() => {
    const geo = new RingGeometry(RING_INNER, RING_OUTER, 192, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - RING_INNER) / (RING_OUTER - RING_INNER), 0.5);
    }
    return geo;
  }, []);

  useFrame((state) => {
    const spin = getScroll().progress * Math.PI * 2;
    if (planet.current) planet.current.rotation.y = state.clock.elapsedTime * 0.03 + spin;
  });

  return (
    <group position={ANCHOR} rotation={[0.35, 0, -0.24]}>
      <mesh ref={planet}>
        <sphereGeometry args={[4.3, 96, 96]} />
        <meshStandardMaterial map={surfaceMap} color="#c2b4ff" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* thin atmosphere limb */}
      <mesh scale={1.012}>
        <sphereGeometry args={[4.3, 64, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.06} side={BackSide} />
      </mesh>
      <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          map={ringMap}
          color="#cfc2f2"
          transparent
          side={DoubleSide}
          depthWrite={false}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

/* ---------------- Work: black hole ---------------- */

export function BlackHole() {
  const disk = useRef<Group>(null);
  const lens = useRef<Group>(null);
  const jet = useRef<Group>(null);

  /* Layered accretion texture: a hot inner wall, dusty outer bands, and
     broken orbital streaks. The brighter right side mimics relativistic
     beaming so the disk feels less like a flat graphic. */
  const diskMap = useMemo(
    () =>
      makeTexture(1024, 1024, (ctx) => {
        const cx = 512;
        const cy = 512;

        const g = ctx.createRadialGradient(cx, cy, 230, cx, cy, 510);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.1, "rgba(255,248,245,1)");
        g.addColorStop(0.17, "rgba(255,214,255,0.95)");
        g.addColorStop(0.33, "rgba(201,130,255,0.72)");
        g.addColorStop(0.55, "rgba(117,72,226,0.32)");
        g.addColorStop(0.76, "rgba(54,32,130,0.14)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 300; i++) {
          const r = 250 + Math.random() * 245;
          const start = Math.random() * Math.PI * 2;
          const len = 0.1 + Math.random() * 1.55;
          const warm = Math.random() > 0.55;
          ctx.beginPath();
          ctx.arc(0, 0, r, start, start + len);
          ctx.lineWidth = 0.5 + Math.random() * 5.2;
          ctx.strokeStyle = warm
            ? `rgba(255,240,232,${0.1 + Math.random() * 0.38})`
            : `rgba(178,90,255,${0.08 + Math.random() * 0.34})`;
          ctx.stroke();
        }

        /* Bright approaching side. */
        const beam = ctx.createLinearGradient(-512, 0, 512, 0);
        beam.addColorStop(0, "rgba(0,0,0,0)");
        beam.addColorStop(0.58, "rgba(80,40,170,0.08)");
        beam.addColorStop(0.78, "rgba(255,255,255,0.42)");
        beam.addColorStop(1, "rgba(255,108,255,0.18)");
        ctx.fillStyle = beam;
        ctx.fillRect(-512, -512, 1024, 1024);
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 36; i++) {
          const r = 262 + i * 6.5 + Math.random() * 5;
          ctx.beginPath();
          ctx.arc(0, 0, r, -0.28, 0.72);
          ctx.lineWidth = 2 + Math.random() * 5;
          ctx.strokeStyle = `rgba(255,255,255,${0.025 + Math.random() * 0.095})`;
          ctx.stroke();
        }
        ctx.restore();

        /* Carve the event horizon cleanly through the texture. */
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(cx, cy, 238, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
      }),
    []
  );

  const glowMap = useMemo(
    () =>
      makeTexture(512, 512, (ctx) => {
        const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        g.addColorStop(0, "rgba(255,255,255,0.28)");
        g.addColorStop(0.2, "rgba(222,176,255,0.32)");
        g.addColorStop(0.42, "rgba(137,91,255,0.22)");
        g.addColorStop(0.72, "rgba(85,48,180,0.1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
      }),
    []
  );

  const jetMap = useMemo(
    () =>
      makeTexture(256, 1024, (ctx) => {
        const core = ctx.createLinearGradient(128, 0, 128, 1024);
        core.addColorStop(0, "rgba(0,0,0,0)");
        core.addColorStop(0.2, "rgba(97,151,255,0.08)");
        core.addColorStop(0.5, "rgba(255,255,255,0.26)");
        core.addColorStop(0.8, "rgba(151,80,255,0.08)");
        core.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = core;
        ctx.fillRect(0, 0, 256, 1024);

        const side = ctx.createRadialGradient(128, 512, 0, 128, 512, 120);
        side.addColorStop(0, "rgba(255,255,255,0.32)");
        side.addColorStop(0.16, "rgba(160,110,255,0.18)");
        side.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = side;
        ctx.fillRect(0, 0, 256, 1024);
      }),
    []
  );

  useFrame((state) => {
    if (disk.current) disk.current.rotation.z = state.clock.elapsedTime * 0.08 + getScroll().progress * Math.PI * 0.35;
    if (lens.current) lens.current.rotation.z = -state.clock.elapsedTime * 0.025;
    if (jet.current) jet.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
  });

  return (
    <group position={[9.55, 0.45, -7.2]} rotation={[0, 0.05, -0.08]} scale={1.1}>
      {/* diffuse bloom field around the singularity */}
      <sprite scale={[20, 20, 1]}>
        <spriteMaterial map={glowMap} color="#9c6dff" transparent opacity={0.95} depthWrite={false} blending={AdditiveBlending} />
      </sprite>

      {/* faint polar jets, mostly hidden in bloom, for a more energetic object */}
      <group ref={jet} rotation={[0, 0, -0.1]}>
        <sprite position={[0, 4.9, -0.7]} scale={[1.05, 9.4, 1]}>
          <spriteMaterial map={jetMap} color="#b8cfff" transparent opacity={0.34} depthWrite={false} blending={AdditiveBlending} />
        </sprite>
        <sprite position={[0, -4.9, -0.7]} scale={[1.05, 9.4, 1]} rotation={[0, 0, Math.PI]}>
          <spriteMaterial map={jetMap} color="#b08cff" transparent opacity={0.22} depthWrite={false} blending={AdditiveBlending} />
        </sprite>
      </group>

      {/* Lensed image of the far side of the disk, arcing above and below the shadow. */}
      <group ref={lens} rotation={[0.05, 0.08, 0]}>
        <mesh scale={[1.15, 0.38, 1]}>
          <ringGeometry args={[3.35, 8.1, 260]} />
          <meshBasicMaterial
            map={diskMap}
            transparent
            opacity={0.76}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh scale={[1.35, 0.19, 1]} rotation={[0, 0, 0.05]}>
          <ringGeometry args={[4.15, 10.6, 260]} />
          <meshBasicMaterial
            map={diskMap}
            transparent
            opacity={0.34}
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Main accretion disk, flattened and tipped toward the camera. */}
      <group rotation={[0.58, -0.24, 0.12]} scale={[1.72, 0.31, 1]}>
        <mesh ref={disk}>
          <ringGeometry args={[3.25, 10.4, 320]} />
          <meshBasicMaterial
            map={diskMap}
            transparent
            side={DoubleSide}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Outer dust orbit, faint and wider than the hot disk. */}
      <mesh rotation={[0.58, -0.24, 0.12]} scale={[1.95, 0.23, 1]}>
        <ringGeometry args={[7.15, 12.6, 300]} />
        <meshBasicMaterial
          map={diskMap}
          transparent
          opacity={0.28}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[0.58, -0.24, 0.12]} scale={[2.35, 0.14, 1]}>
        <ringGeometry args={[9.8, 14.6, 320]} />
        <meshBasicMaterial
          map={diskMap}
          transparent
          opacity={0.12}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Photon rings hugging the event horizon. */}
      <mesh>
        <torusGeometry args={[3.18, 0.035, 16, 240]} />
        <meshBasicMaterial color="#fff8ff" toneMapped={false} transparent opacity={0.95} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[0, 0, 0.05]}>
        <torusGeometry args={[3.25, 0.09, 18, 260]} />
        <meshBasicMaterial color="#efe4ff" toneMapped={false} transparent opacity={0.22} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.18, 0.05, 0]}>
        <torusGeometry args={[3.46, 0.018, 12, 220]} />
        <meshBasicMaterial color="#9f77ff" toneMapped={false} transparent opacity={0.55} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.38, -0.1, 0.15]}>
        <torusGeometry args={[4.05, 0.012, 12, 220]} />
        <meshBasicMaterial color="#6f58ff" toneMapped={false} transparent opacity={0.24} blending={AdditiveBlending} />
      </mesh>

      {/* Event horizon and black shadow swallowing the center. */}
      <mesh>
        <sphereGeometry args={[3.15, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[3.15, 64, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.82} side={BackSide} />
      </mesh>
    </group>
  );
}

/* ---------------- About: violet nebula ---------------- */

function makeCloudSprite() {
  return makeTexture(256, 256, (ctx) => {
    for (let i = 0; i < 30; i++) {
      const x = 70 + Math.random() * 116;
      const y = 70 + Math.random() * 116;
      const r = 26 + Math.random() * 66;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${0.05 + Math.random() * 0.09})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
  });
}

function NebulaCloud({
  color,
  count,
  spread,
  size,
  opacity,
  spriteMap,
  spin,
}: {
  color: string;
  count: number;
  spread: number;
  size: number;
  opacity: number;
  spriteMap: CanvasTexture;
  spin: number;
}) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * spread * 1.6;
      arr[i + 1] = (Math.random() - 0.5) * spread;
      arr[i + 2] = (Math.random() - 0.5) * spread * 0.8;
    }
    return arr;
  }, [count, spread]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * spin;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={spriteMap}
        color={color}
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export function Nebula() {
  const cloudA = useMemo(makeCloudSprite, []);
  const cloudB = useMemo(makeCloudSprite, []);
  const starGlow = useMemo(
    () =>
      makeTexture(128, 128, (ctx) => {
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.3, "rgba(255,255,255,0.4)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
      }),
    []
  );
  return (
    <group position={ANCHOR}>
      <NebulaCloud spriteMap={cloudA} color="#6b66ff" count={46} spread={9} size={7} opacity={0.5} spin={0.01} />
      <NebulaCloud spriteMap={cloudB} color="#ce4fff" count={34} spread={7} size={6} opacity={0.4} spin={-0.014} />
      <NebulaCloud spriteMap={cloudA} color="#3777ff" count={26} spread={10.5} size={6.5} opacity={0.3} spin={0.008} />
      {/* newborn stars inside the cloud */}
      <NebulaCloud spriteMap={starGlow} color="#ffffff" count={30} spread={8} size={0.55} opacity={0.95} spin={0.01} />
      {/* bright stellar core */}
      <sprite scale={[4.5, 4.5, 1]}>
        <spriteMaterial map={starGlow} color="#e6dcff" transparent depthWrite={false} blending={AdditiveBlending} />
      </sprite>
    </group>
  );
}

/* ---------------- mount transition ---------------- */

/* Eases a freshly-swapped centerpiece in so route changes don't pop. */
export function ScaleIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const s = ref.current.scale.x;
    const next = Math.min(1, s + (1 - s) * Math.min(dt * 4, 1) + dt * 0.2);
    ref.current.scale.setScalar(next);
  });
  return (
    <group ref={ref} scale={0.35}>
      {children}
    </group>
  );
}
