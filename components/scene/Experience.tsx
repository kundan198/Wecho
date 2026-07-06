"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Color,
  SRGBColorSpace,
  Vector2,
  type Group,
  type Mesh,
  type Points,
} from "three";
import { getScroll, damp } from "@/lib/scroll";
import { GasGiant, BlackHole, Nebula, ScaleIn } from "./centerpieces";

/* ------------------------------------------------------------------ *
 * A realistic deep-space scene around a photoreal Earth: a textured
 * Moon, drifting asteroids, a distant sun, satellite orbits and a
 * layered starfield. The globe spins as the page scrolls; the whole
 * field parallax-drifts for depth.
 * ------------------------------------------------------------------ */

const CYAN = "#8fd0ff";
const BLUE = "#3777ff";
const VIOLET = "#6b66ff";
const MAGENTA = "#ce4fff";

/* Cursor position in NDC, tracked on window — the canvas sits behind all
   page content, so it never receives pointer events itself. */
const cursor = { x: 0, y: 0 };

/* ---------------- Earth ---------------- */

const R = 7.4;

function Earth() {
  const earth = useRef<Mesh>(null);
  const clouds = useRef<Mesh>(null);

  const [dayMap, specMap, cloudMap, normalMap, lightsMap] = useTexture([
    "/textures/planet/earth_atmos_2048.jpg",
    "/textures/planet/earth_specular_2048.jpg",
    "/textures/planet/earth_clouds_1024.png",
    "/textures/planet/earth_normal_2048.jpg",
    "/textures/planet/earth_lights_2048.png",
  ]);

  useMemo(() => {
    dayMap.colorSpace = SRGBColorSpace;
    lightsMap.colorSpace = SRGBColorSpace;
    cloudMap.colorSpace = SRGBColorSpace;
  }, [dayMap, lightsMap, cloudMap]);

  useFrame((state) => {
    // scroll spins the globe (~1.5 turns down the page) over a slow idle drift
    const spin = getScroll().progress * Math.PI * 3;
    if (earth.current) earth.current.rotation.y = 2.2 + state.clock.elapsedTime * 0.02 + spin;
    if (clouds.current) clouds.current.rotation.y = 2.2 + state.clock.elapsedTime * 0.028 + spin * 1.02;
  });

  return (
    <group position={[8.9, 0.3, -6.5]} rotation={[0, 0, 0.41]}>
      <mesh ref={earth}>
        <sphereGeometry args={[R, 96, 96]} />
        <meshStandardMaterial
          map={dayMap}
          color="#c2b4ff"
          normalMap={normalMap}
          normalScale={new Vector2(0.85, 0.85)}
          metalnessMap={specMap}
          metalness={0.85}
          roughness={0.66}
          emissiveMap={lightsMap}
          emissive="#a95bff"
          emissiveIntensity={3.1}
        />
      </mesh>

      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.85} depthWrite={false} roughness={1} />
      </mesh>

      {/* satellite orbits + a travelling satellite */}
      <group rotation={[0.4, 0, 0]}>
        {[R + 1.5, R + 2.9].map((rad, i) => (
          <mesh key={i} rotation={[Math.PI / 2, i * 0.5, i * 0.35]}>
            <torusGeometry args={[rad, 0.01, 8, 180]} />
            <meshBasicMaterial color="#9fc0ff" transparent opacity={0.16} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[R + 2.9, 0.5, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- Moon ---------------- */

function Moon() {
  const mesh = useRef<Mesh>(null);
  const map = useTexture("/textures/planet/moon_1024.jpg");
  useMemo(() => {
    map.colorSpace = SRGBColorSpace;
  }, [map]);
  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * 0.02;
  });
  return (
    <Float speed={0.6} floatIntensity={0.6} rotationIntensity={0.2}>
      <mesh ref={mesh} position={[-6.6, 3.7, -11]}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>
    </Float>
  );
}

/* ---------------- asteroids ---------------- */

function Asteroids() {
  const rocks = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        position: [
          -7 + Math.random() * 12,
          -4 + Math.random() * 8,
          -2 - Math.random() * 8,
        ] as [number, number, number],
        rotation: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [number, number, number],
        scale: 0.12 + Math.random() * 0.32,
        speed: 0.4 + Math.random() * 1.1,
        detail: i % 3 === 0 ? 1 : 0,
      })),
    []
  );
  return (
    <group>
      {rocks.map((r, i) => (
        <Float key={i} speed={r.speed} floatIntensity={1.2} rotationIntensity={1.4}>
          <mesh position={r.position} rotation={r.rotation} scale={r.scale}>
            <icosahedronGeometry args={[1, r.detail]} />
            <meshStandardMaterial color="#5f5d66" roughness={0.95} metalness={0.1} flatShading />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ---------------- distant sun ---------------- */

function DistantSun() {
  return (
    <mesh position={[-15, 9, -24]}>
      <sphereGeometry args={[0.9, 24, 24]} />
      <meshBasicMaterial color="#fff2d0" toneMapped={false} />
    </mesh>
  );
}

/* ---------------- layered starfield ---------------- */

function StarLayer({
  count,
  size,
  color,
  opacity,
  spin,
}: {
  count: number;
  size: number;
  color: string;
  opacity: number;
  spin: number;
}) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 48;
      arr[i + 1] = (Math.random() - 0.5) * 32;
      arr[i + 2] = 6 - Math.random() * 46;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * spin;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={opacity} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function Starfield() {
  return (
    <group>
      <StarLayer count={1600} size={0.04} color="#c7d0ff" opacity={0.65} spin={0.004} />
      <StarLayer count={150} size={0.11} color="#ffffff" opacity={0.95} spin={0.006} />
      <StarLayer count={60} size={0.09} color="#a9c6ff" opacity={0.9} spin={0.005} />
    </group>
  );
}

/* ---------------- scroll-driven world + camera ---------------- */

/* One celestial hero per route; the rest of the field is shared.
   Contact gets plain open space — just the shared field. */
function Centerpiece({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/services")) return <GasGiant />;
  if (pathname.startsWith("/work")) return <BlackHole />;
  if (pathname.startsWith("/about")) return <Nebula />;
  if (pathname.startsWith("/contact")) return null;
  return <Earth />;
}

function World({ pathname }: { pathname: string }) {
  const group = useRef<Group>(null);
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const { progress } = getScroll();
    if (!group.current) return;
    group.current.rotation.y = damp(group.current.rotation.y, progress * 0.5 - 0.05, 2.5, dt);
    group.current.position.x = damp(group.current.position.x, progress * -2.6, 2.5, dt);
    group.current.position.z = damp(group.current.position.z, progress * 2.6, 2.5, dt);
  });
  return (
    <group ref={group}>
      <ScaleIn key={pathname}>
        <Centerpiece pathname={pathname} />
      </ScaleIn>
      <Moon />
      <Asteroids />
      <DistantSun />
      <Starfield />
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    camera.position.x = damp(camera.position.x, cursor.x * 1.5, 2.2, dt);
    camera.position.y = damp(camera.position.y, cursor.y * 0.9, 2.2, dt);
    camera.lookAt(0, 0, -4);
  });
  return null;
}

/* ---------------- root ---------------- */

export default function Experience() {
  const pathname = usePathname() ?? "/";
  const isWork = pathname.startsWith("/work");

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 130 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#03030d"]} />
      <fog attach="fog" args={[new Color("#03030d"), 26, 70]} />

      <ambientLight intensity={0.16} />
      {/* the sun grazes Earth's left limb → a bright glowing sunrise crescent */}
      <directionalLight position={[-2, 4, -2]} intensity={4.2} color="#dcc0ff" />
      {/* violet fill tints the night side + haze; cool + magenta accents for depth */}
      <pointLight position={[5, 1, -1]} intensity={30} color={VIOLET} />
      <pointLight position={[3, 5, 6]} intensity={10} color={BLUE} />
      <pointLight position={[-4, -2, 5]} intensity={12} color={MAGENTA} />

      <CameraRig />
      <Suspense fallback={null}>
        <World pathname={pathname} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={isWork ? 1.55 : 1.05}
          luminanceThreshold={isWork ? 0.12 : 0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={isWork ? 0.95 : 0.8}
        />
        <Vignette eskil={false} offset={0.28} darkness={isWork ? 0.86 : 0.92} />
      </EffectComposer>
    </Canvas>
  );
}
