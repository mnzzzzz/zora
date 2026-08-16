"use client";

import { useEffect, useRef } from "react";

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  size: number;
};

export default function ZoraCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouse = useRef({
    x: -100,
    y: -100,
  });

  const trail = useRef<TrailPoint[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      /* Add glowing point */
      trail.current.push({
        x: event.clientX,
        y: event.clientY,
        life: 1,
        size: Math.random() * 5 + 5,
      });

      /* Keep trail small */
      if (trail.current.length > 35) {
        trail.current.shift();
      }
    };

    const handleMouseLeave = () => {
      trail.current = [];
    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener(
      "mousemove",
      handleMouseMove
    );
    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /* =================================
         DRAW TRAIL
      ================================= */

      trail.current.forEach(
        (point, index) => {
          point.life -= 0.035;

          const progress =
            index / trail.current.length;

          const alpha =
            point.life *
            progress *
            0.55;

          if (alpha <= 0) return;

          const radius =
            point.size *
            (0.5 + progress);

          const gradient =
            ctx.createRadialGradient(
              point.x,
              point.y,
              0,
              point.x,
              point.y,
              radius * 4
            );

          gradient.addColorStop(
            0,
            `rgba(165, 243, 252, ${alpha})`
          );

          gradient.addColorStop(
            0.25,
            `rgba(34, 211, 238, ${alpha * 0.7})`
          );

          gradient.addColorStop(
            0.6,
            `rgba(59, 130, 246, ${alpha * 0.25})`
          );

          gradient.addColorStop(
            1,
            "rgba(34, 211, 238, 0)"
          );

          ctx.beginPath();

          ctx.fillStyle = gradient;

          ctx.arc(
            point.x,
            point.y,
            radius * 4,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      );

      /* Remove dead particles */

      trail.current =
        trail.current.filter(
          (point) => point.life > 0
        );

      animationFrame =
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}