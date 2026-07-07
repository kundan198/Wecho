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
        <meshStandardMaterial map={surfaceMap} color="#a8f0e0" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* thin atmosphere limb */}
      <mesh scale={1.012}>
        <sphereGeometry args={[4.3, 64, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.06} side={BackSide} />
      </mesh>
      <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          map={ringMap}
          color="#bff0e6"
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
  const disk = useRef<Mesh>(null);
  const disk2 = useRef<Mesh>(null);

  /* Accretion disk: a clean temperature ramp from a white-hot inner wall out
     through cyan → emerald, textured with fine orbital streaks and a Doppler
     beam that brightens the approaching (left) side so it reads as spinning
     plasma rather than a flat ring. The center is punched out for the horizon. */
  const diskMap = useMemo(
    () =>
      makeTexture(1024, 1024, (ctx) => {
        const cx = 512;
        const cy = 512;

        const g = ctx.createRadialGradient(cx, cy, 196, cx, cy, 512);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.05, "rgba(255,255,255,1)");
        g.addColorStop(0.12, "rgba(198,255,248,0.98)");
        g.addColorStop(0.26, "rgba(74,238,208,0.82)");
        g.addColorStop(0.46, "rgba(26,200,150,0.5)");
        g.addColorStop(0.68, "rgba(13,128,116,0.22)");
        g.addColorStop(0.86, "rgba(8,70,74,0.08)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 1024);

        /* fine orbital streaks for turbulent plasma detail */
        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 440; i++) {
          const r = 205 + Math.random() * 300;
          const start = Math.random() * Math.PI * 2;
          const len = 0.04 + Math.random() * 1.2;
          const hot = Math.random() > 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, r, start, start + len);
          ctx.lineWidth = 0.4 + Math.random() * 3.6;
          ctx.strokeStyle = hot
            ? `rgba(232,255,250,${0.05 + Math.random() * 0.3})`
            : `rgba(44,224,186,${0.05 + Math.random() * 0.26})`;
          ctx.stroke();
        }

        /* Doppler beaming — approaching side runs hotter and brighter. */
        const beam = ctx.createLinearGradient(-512, 0, 512, 0);
        beam.addColorStop(0, "rgba(255,255,255,0.4)");
        beam.addColorStop(0.32, "rgba(150,255,240,0.14)");
        beam.addColorStop(0.6, "rgba(0,0,0,0)");
        beam.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = beam;
        ctx.fillRect(-512, -512, 1024, 1024);
        ctx.restore();

        /* Carve the event horizon cleanly through the texture. */
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(cx, cy, 196, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
      }),
    []
  );

  /* Camera-facing halo: the gravitationally-lensed light bent up and over the
     shadow. A sprite so it always reads as a perfect ring around the horizon
     no matter how the world rotates on scroll. */
  const haloMap = useMemo(
    () =>
      makeTexture(512, 512, (ctx) => {
        const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.66, "rgba(0,0,0,0)");
        g.addColorStop(0.74, "rgba(80,240,214,0.28)");
        g.addColorStop(0.83, "rgba(255,255,255,0.95)");
        g.addColorStop(0.9, "rgba(150,255,242,0.5)");
        g.addColorStop(0.97, "rgba(30,190,170,0.12)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
      }),
    []
  );

  /* Soft diffuse bloom field feeding the post-process Bloom pass. */
  const glowMap = useMemo(
    () =>
      makeTexture(512, 512, (ctx) => {
        const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        g.addColorStop(0, "rgba(150,255,238,0.3)");
        g.addColorStop(0.28, "rgba(30,204,166,0.18)");
        g.addColorStop(0.6, "rgba(12,110,102,0.08)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const spin = t * 0.09 + getScroll().progress * Math.PI * 0.4;
    if (disk.current) disk.current.rotation.z = spin;
    if (disk2.current) disk2.current.rotation.z = spin * 0.6 + 0.4;
  });

  return (
    <group position={[8.7, 0.5, -6.6]} rotation={[0, 0.05, -0.1]} scale={1.12}>
      {/* diffuse bloom field around the singularity */}
      <sprite scale={[26, 26, 1]}>
        <spriteMaterial map={glowMap} color="#1fd4a8" transparent opacity={0.9} depthWrite={false} blending={AdditiveBlending} />
      </sprite>

      {/* Accretion disk tipped to a dramatic 3/4 view — the plasma plane. */}
      <mesh ref={disk} rotation={[1.02, 0, 0.16]}>
        <ringGeometry args={[3.2, 9.6, 320]} />
        <meshBasicMaterial
          map={diskMap}
          transparent
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Second, wider, cooler disk band drifting at a different rate for depth. */}
      <mesh ref={disk2} rotation={[1.02, 0, 0.16]} scale={1.34}>
        <ringGeometry args={[3.4, 9.6, 320]} />
        <meshBasicMaterial
          map={diskMap}
          transparent
          opacity={0.3}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Lensed halo — the bright ring of light bent around the black hole,
          always facing the camera. Two layers: sharp ring + soft aura. */}
      <sprite scale={[8.4, 8.4, 1]}>
        <spriteMaterial map={haloMap} color="#ffffff" transparent opacity={0.95} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite scale={[9.6, 9.6, 1]}>
        <spriteMaterial map={haloMap} color="#2ee6c0" transparent opacity={0.4} depthWrite={false} blending={AdditiveBlending} />
      </sprite>

      {/* Event horizon — the black shadow swallowing the center. */}
      <mesh>
        <sphereGeometry args={[3.1, 64, 64]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
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
      <NebulaCloud spriteMap={cloudA} color="#12c2b0" count={46} spread={9} size={7} opacity={0.5} spin={0.01} />
      <NebulaCloud spriteMap={cloudB} color="#2ee6a0" count={34} spread={7} size={6} opacity={0.4} spin={-0.014} />
      <NebulaCloud spriteMap={cloudA} color="#16b6d8" count={26} spread={10.5} size={6.5} opacity={0.3} spin={0.008} />
      {/* newborn stars inside the cloud */}
      <NebulaCloud spriteMap={starGlow} color="#ffffff" count={30} spread={8} size={0.55} opacity={0.95} spin={0.01} />
      {/* bright stellar core */}
      <sprite scale={[4.5, 4.5, 1]}>
        <spriteMaterial map={starGlow} color="#dcf0ea" transparent depthWrite={false} blending={AdditiveBlending} />
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
