"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 90,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <motion.div
        initial={{
          x: "-120%",
          opacity: 0,
        }}
        whileInView={{
          x: "120%",
          opacity: [0, 0.35, 0],
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 1.1,
          delay: delay + 0.15,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-y-0 z-10 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"
      />

      {children}
    </motion.div>
  );
}