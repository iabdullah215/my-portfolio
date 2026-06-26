"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface BinaryRainProps {
  className?: string;
}

/**
 * Matrix-style falling 0/1 rain rendered on a canvas, sized to its parent.
 * Theme-aware (dark vs light trail), DPI-correct, and falls back to a static
 * field of bits when the user prefers reduced motion.
 */
export function BinaryRain({ className = "" }: BinaryRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isDark = resolvedTheme !== "light";
    const trail = isDark ? "rgba(9, 9, 11, 0.16)" : "rgba(255, 255, 255, 0.22)";
    const dim = isDark ? "rgba(16, 185, 129, 0.45)" : "rgba(5, 150, 105, 0.35)";
    const bright = isDark ? "rgba(52, 211, 153, 0.95)" : "rgba(5, 150, 105, 0.85)";
    const fontSize = 14;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      // Measure the canvas's own rendered box so it works whether it's
      // absolutely filling a section or fixed to the whole viewport.
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / fontSize)
      );
    };

    resize();

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      ctx.fillStyle = dim;
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y * fontSize < height; y += 2) {
          if (Math.random() > 0.5) {
            ctx.fillText(
              Math.random() > 0.5 ? "1" : "0",
              x * fontSize,
              y * fontSize
            );
          }
        }
      }
      return;
    }

    let raf = 0;
    let last = 0;
    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - last < 55) return;
      last = time;

      ctx.fillStyle = trail;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ui-monospace, monospace`;

      for (let i = 0; i < columns; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.96 ? bright : dim;
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
