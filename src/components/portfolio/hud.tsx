'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HudProps {
  currentView: string;
}

const SurveillanceFeed: React.FC = () => {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
        }, Math.random() * 5000 + 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-48 h-32 bg-black border-2 border-primary/50 p-1">
            <Image
                src="https://placehold.co/192x128.png"
                alt="Surveillance Feed"
                width={192}
                height={128}
                className={`object-cover w-full h-full transition-all duration-100 ${isGlitching ? 'opacity-50 scale-105' : 'opacity-80'}`}
                data-ai-hint="security camera"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-2 left-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-500 font-mono text-sm font-bold">REC</span>
            </div>
            <span className="absolute bottom-2 right-2 font-mono text-xs text-primary">CAM_04</span>
             {isGlitching && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
        </div>
    );
};

const Hud: React.FC<HudProps> = ({ currentView }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top-left corner */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 text-primary font-mono text-sm hidden md:block z-10"
      >
        <p>USER: digital_shadow</p>
        <p>STATUS: <span className="text-accent">SECURE</span></p>
        <p>NODE: {currentView.toUpperCase()}_SYSTEM</p>
      </motion.div>

      {/* Top-right corner */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4 hidden md:block z-10"
      >
        <SurveillanceFeed />
      </motion.div>

      {/* Bottom-left corner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-4 left-4 text-primary font-mono text-sm hidden md:block z-10"
      >
        <p>SYSTEM TIME: {time}</p>
        <p>ctOS v2.1 // HACK THE PLANET</p>
      </motion.div>
      
      {/* Bottom-right corner for Q-key hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="absolute bottom-4 right-4 text-primary font-mono text-lg hidden md:flex items-center gap-2 z-10"
      >
        <span className="border-2 border-primary rounded-md px-3 py-1 font-bold">Q</span>
        <span>DEVICE CATALOG</span>
      </motion.div>
    </>
  );
};

export default Hud;
