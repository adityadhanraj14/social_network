import { motion } from 'motion/react';

interface PhaseCircleProps {
  name: string;
  color: string;
  position: { x: number; y: number };
  size: number;
}

export function PhaseCircle({ name, color, position, size }: PhaseCircleProps) {
  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity: 0.15,
        border: `3px solid ${color}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.15 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <motion.div
        className="px-4 py-2 rounded-full text-white shadow-lg"
        style={{
          backgroundColor: color,
          opacity: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {name}
      </motion.div>
    </motion.div>
  );
}
