"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis */
  max?: number;
  /** Scale applied while hovering */
  scale?: number;
}

/**
 * Wraps children in a surface that tilts in 3D toward the cursor.
 * Also publishes --mx / --my (as percentages) so children can render a
 * cursor-following spotlight. Disabled when the user prefers reduced motion.
 */
export function Tilt({ children, className = "", max = 12, scale = 1.04 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * max * 2;
    const rotateY = (px - 0.5) * max * 2;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
