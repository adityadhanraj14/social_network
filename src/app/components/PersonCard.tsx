import { motion } from 'motion/react';
import { useState } from 'react';
import { MoveDown } from 'lucide-react';

interface PersonCardProps {
  name: string;
  image: string;
  phases: string[];
  position: { x: number; y: number };
  size?: number;
  phaseColors: { [key: string]: string };
  onEdit?: () => void;
}

export function PersonCard({ name, image, phases, position, size = 60, phaseColors, onEdit }: PersonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: Math.random() * 0.3
      }}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
    >
      <div className="relative flex flex-col items-center">
        <img
          src={image}
          alt={name}
          className="rounded-full border-4 border-white shadow-lg object-cover"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
        
        {/* Arrow indicators */}
        <div className="flex gap-1 mt-1">
          <div
            className="flex flex-col items-center"
            style={{ 
              color: phases.length > 1 
                ? '#666' 
                : (phaseColors[phases[0]] || '#666') 
            }}
          >
            <MoveDown className="w-4 h-4" />
          </div>
        </div>
        
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-8 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50"
          >
            <div className="text-sm">{name}</div>
            <div className="text-xs text-gray-300 mt-1">
              {phases.join(', ')}
            </div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}