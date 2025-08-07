'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HackingAnimationProps {
  onComplete: () => void;
}

const randomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>?/`~';
  return chars[Math.floor(Math.random() * chars.length)];
};

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchedText(
        text
          .split('')
          .map((char) => (Math.random() > 0.8 ? randomChar() : char))
          .join('')
      );
    }, 50);

    const resetTimeout = setTimeout(() => {
      clearInterval(interval);
      setGlitchedText(text);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(resetTimeout);
    };
  }, [text]);

  return <>{glitchedText}</>;
};

const HackingAnimation: React.FC<HackingAnimationProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const sequence = [
            () => setPhase(1), // Initial glitch
            () => setPhase(2), // Signal Lost text
            () => setPhase(3), // Rerouting text
            () => { // Completion
                setPhase(4);
                setTimeout(onComplete, 300);
            }
        ];
        
        let currentIndex = 0;
        const delays = [0, 200, 600, 500];

        function nextPhase() {
            if (currentIndex < sequence.length) {
                sequence[currentIndex]();
                currentIndex++;
                setTimeout(nextPhase, delays[currentIndex]);
            }
        }

        nextPhase();

    }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      <AnimatePresence>
        {phase > 0 && phase < 4 && (
          <motion.div
            key="glitch-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0"
          >
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,hsla(var(--primary)/0.2)_50%)] bg-[size:100%_4px] animate-pulse"></div>
            {/* Vertical glitch lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsla(var(--accent)/0.2)_1px,transparent_1px)] bg-[size:50px_100%] animate-[pulse_500ms_infinite_ease-in-out]"></div>
            
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-black"
              animate={{ y: ['0%', '2%', '-2%', '0%'] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-full h-1/2 bg-black"
              animate={{ y: ['0%', '-2%', '2%', '0%'] }}
              transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 text-center p-8 bg-black/50 rounded-lg">
        <AnimatePresence>
          {phase === 2 && (
            <motion.h1
              key="signal-lost"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              className="text-4xl md:text-6xl font-black text-destructive glitch"
            >
              <GlitchText text=">> SIGNAL LOST <<" />
            </motion.h1>
          )}
          {phase === 3 && (
            <motion.h1
              key="rerouting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              className="text-4xl md:text-6xl font-black text-accent accent-glow"
            >
              <GlitchText text="...REROUTING..." />
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HackingAnimation;
