import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';

interface InteractiveRobotProps {
  isWatchingLogin?: boolean;
  dragConstraints?: React.RefObject<any>;
}

export const InteractiveRobot = ({ 
  isWatchingLogin = false,
  dragConstraints
}: InteractiveRobotProps) => {
  const [isJumping, setIsJumping] = useState(false);
  const [isSaluting, setIsSaluting] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const robotRef = useRef<HTMLDivElement>(null);
  
  // Motion values for rotation (360 degree drag)
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);

  // Smooth springs for rotation
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });

  // Mouse tracking for eyes and proximity alert
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (robotRef.current) {
        const rect = robotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        setIsAlert(distance < 250);

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        setMousePos({
          x: Math.cos(angle) * 8,
          y: Math.sin(angle) * 8,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Recurring salute every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaluting(true);
      setTimeout(() => setIsSaluting(false), 2000); // Salute lasts 2 seconds
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onDrag = (_: any, info: any) => {
    rotateY.set(rotateY.get() + info.delta.x * 0.8);
    rotateX.set(rotateX.get() - info.delta.y * 0.8);
  };

  const onDragEnd = () => {
    rotateY.set(0);
    rotateX.set(0);
  };

  const handleClick = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
  };

  return (
    <motion.div 
      ref={robotRef}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      animate={{
        y: [0, -30, 0], // Medium floating motion
      }}
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }}
      className="z-50 cursor-grab active:cursor-grabbing relative scale-50 origin-center"
      style={{ perspective: '1500px' }}
    >
      <motion.div
        style={{ 
          rotateY: smoothRotateY,
          rotateX: smoothRotateX,
          transformStyle: 'preserve-3d',
          y: isJumping ? -80 : 0
        }}
        className="relative"
      >
        {/* Shadow */}
        <div 
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/5 rounded-full blur-lg pointer-events-none"
          style={{ transform: 'rotateX(90deg) translateZ(-80px)' }}
        />

        {/* Robot Body */}
        <div className="relative w-40 h-72 flex flex-col items-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* HEAD */}
          <div className="relative w-32 h-28 mb-4" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-slate-300 rounded-[2rem] border-2 border-slate-400" style={{ transform: 'translateZ(-15px)' }} />
            <div className="absolute inset-0 bg-slate-100 rounded-[2rem] border-2 border-slate-200 shadow-md" style={{ transform: 'translateZ(0px)' }} />

            {/* Face */}
            <div 
              className="absolute inset-2 bg-slate-900 rounded-[1.5rem] border-b-4 border-slate-800 flex items-center justify-center gap-4"
              style={{ transform: 'translateZ(20px)' }}
            >
              {[0, 1].map((i) => (
                <div key={i} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <motion.div 
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 ${
                      isAlert 
                        ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]'
                        : isWatchingLogin 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]' 
                          : 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TORSO */}
          <div className="relative w-28 h-32" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-blue-800 rounded-2xl" style={{ transform: 'translateZ(-10px)' }} />
            <div className="absolute inset-0 bg-blue-600 rounded-2xl border-2 border-blue-500 shadow-lg" style={{ transform: 'translateZ(0px)' }} />
            {/* Waist Detail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-700 rounded-full" style={{ transform: 'translateZ(5px)' }} />
          </div>

          {/* ARMS */}
          <div className="absolute top-36 flex w-56 justify-between" style={{ transformStyle: 'preserve-3d' }}>
            {/* Left Arm & Hand */}
            <motion.div
              animate={isJumping ? { rotate: -35 } : { rotate: -15 }}
              className="w-6 h-24 bg-slate-100 rounded-full border border-slate-200 origin-top shadow-sm relative"
              style={{ translateZ: '-20px' }}
            >
              <div className="w-full h-6 bg-blue-500 rounded-t-full" />
              {/* Hand Detail */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 flex flex-col items-center">
                <div className="w-8 h-6 bg-slate-200 rounded-md border border-slate-300 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
                  <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
                  <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Right Arm & Hand (Salute) */}
            <motion.div
              animate={
                isSaluting 
                  ? { 
                      rotate: 150, 
                      x: -20, 
                      y: -25,
                      rotateZ: -20,
                    } 
                  : isJumping ? { rotate: 35 } : { rotate: 15 }
              }
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-6 h-24 bg-slate-100 rounded-full border border-slate-200 origin-top shadow-sm relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-full h-6 bg-blue-500 rounded-t-full" />
              {/* Hand Detail for Salute */}
              <motion.div 
                animate={isSaluting ? { rotate: -40, translateZ: 40 } : { rotate: 0, translateZ: 0 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-200 rounded-md border border-slate-300 flex items-center justify-center gap-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
                <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
                <div className="w-1.5 h-3 bg-slate-400 rounded-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* LEGS & FEET */}
          <div className="flex w-24 justify-between gap-6 mt-4" style={{ transformStyle: 'preserve-3d' }}>
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={isJumping ? { scaleY: 0.8, y: -5 } : { scaleY: 1, y: 0 }}
                className="w-9 h-16 relative flex flex-col items-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Thigh */}
                <div className="w-full h-8 bg-slate-700 rounded-t-lg border border-slate-600" />
                {/* Shin */}
                <div className="w-8 h-8 bg-slate-800 border-x border-slate-700" />
                {/* Boot/Foot */}
                <div 
                  className="absolute -bottom-3 w-12 h-5 bg-slate-900 rounded-lg border-b-4 border-slate-950 shadow-md" 
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <div className="absolute top-1 left-2 w-3 h-1 bg-slate-700 rounded-full opacity-50" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
