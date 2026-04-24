"use client"

import { motion } from "framer-motion"

// Componente reutilizable que anima cualquier elemento al entrar en pantalla
export default function FadeIn({
  children,
  delay = 0,
  direction = "up", // "up", "down", "left", "right"
  className = "",
}) {
  // Definimos de dónde viene el elemento según la dirección
  const directions = {
    up:    { y: 40, x: 0 },
    down:  { y: -40, x: 0 },
    left:  { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}