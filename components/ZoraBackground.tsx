"use client";

import { useEffect, useRef } from "react";

export default function ZoraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles = Array.from(
      { length: 80 },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.4 + 0.1,
      })
    );

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

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

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /* PARTICLES */

      particles.forEach((particle) => {
        particle.y -= particle.speed;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x =
            Math.random() * width;
        }

        ctx.beginPath();

        ctx.fillStyle =
          "rgba(34, 211, 238, 0.65)";

        ctx.shadowBlur = 15;

        ctx.shadowColor =
          "rgba(34, 211, 238, 0.8)";

        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
      });

      /* ORBIT */

      const time =
        performance.now() * 0.0003;

      drawOrbit(
        width * 0.15,
        height * 0.25,
        130,
        time
      );

      drawOrbit(
        width * 0.82,
        height * 0.3,
        170,
        -time
      );

      drawOrbit(
        width * 0.7,
        height * 0.8,
        200,
        time * 0.7
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    const drawOrbit = (
      x: number,
      y: number,
      radius: number,
      rotation: number
    ) => {
      ctx.save();

      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        radius,
        radius * 0.3,
        0,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(34, 211, 238, 0.35)";

      ctx.lineWidth = 1;

      ctx.shadowBlur = 20;

      ctx.shadowColor =
        "rgba(34, 211, 238, 0.5)";

      ctx.stroke();

      ctx.restore();

      ctx.shadowBlur = 0;
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 1,
      }}
    />
  );
}