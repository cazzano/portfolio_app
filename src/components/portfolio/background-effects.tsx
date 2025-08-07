'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DataStream: React.FC = () => {
  const [binaryString, setBinaryString] = useState('');

  useEffect(() => {
    const generateBinary = () => {
      let str = '';
      for (let i = 0; i < 50; i++) {
        str += Math.round(Math.random());
      }
      setBinaryString(str);
    };
    generateBinary();
    const interval = setInterval(generateBinary, 100 + Math.random() * 200);
    return () => clearInterval(interval);
  }, []);

  const duration = Math.random() * 10 + 15;
  const topStart = Math.random() * 100;

  return (
    <motion.div
      className="absolute text-accent/20 font-mono text-xs"
      style={{
        top: `${topStart}%`,
        left: '-300px',
        width: '300px',
        whiteSpace: 'nowrap',
      }}
      animate={{
        x: '100vw',
        
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {binaryString}
    </motion.div>
  );
};

const BackgroundEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      {/* Data streams */}
      {[...Array(10)].map((_, i) => (
        <DataStream key={i} />
      ))}
    </div>
  );
};

export default BackgroundEffects;
