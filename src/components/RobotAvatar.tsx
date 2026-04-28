import React from 'react';
import { motion } from 'motion/react';

export const RobotAvatar = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={className + " flex items-center justify-center bg-indigo-600 rounded-xl overflow-hidden"}>
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-8 h-8"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Head */}
        <rect x="15" y="25" width="70" height="50" rx="15" fill="#f1f5f9" />
        <rect x="20" y="30" width="60" height="40" rx="12" fill="#0f172a" />
        
        {/* Eyes */}
        <motion.circle 
          cx="38" cy="50" r="4" 
          fill="#22d3ee"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle 
          cx="62" cy="50" r="4" 
          fill="#22d3ee"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        
        {/* Antenna */}
        <line x1="50" y1="25" x2="50" y2="15" stroke="#94a3b8" strokeWidth="4" />
        <circle cx="50" cy="12" r="3" fill="#6366f1" />
      </motion.svg>
    </div>
  );
};
