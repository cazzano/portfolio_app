'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Server, Shield, Globe, UserCheck } from 'lucide-react';

interface HireMeAnimationProps {
  onComplete: () => void;
}

const targets = [
  { ip: '192.168.1.101', name: 'corp-firewall-main', icon: <Shield className="w-6 h-6 text-red-500" /> },
  { ip: '10.0.5.23', name: 'data-server-alpha', icon: <Server className="w-6 h-6 text-yellow-500" /> },
  { ip: '203.0.113.8', name: 'global-node-7', icon: <Globe className="w-6 h-6 text-blue-500" /> },
  { ip: '172.16.31.4', name: 'internal-comms-hub', icon: <Wifi className="w-6 h-6 text-green-500" /> },
];

const messages = [
  'SCANNING GLOBAL NETWORKS...',
  'IDENTIFYING KEY PERSONNEL...',
  'DEPLOYING PERSUASION ALGORITHM...',
  'INFILTRATING HR SYSTEMS...',
  'BYPASSING RECRUITMENT PROTOCOLS...',
  'ELEVATING CANDIDATE PROFILE...',
];

const HireMeAnimation: React.FC<HireMeAnimationProps> = ({ onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hackedTargets, setHackedTargets] = useState<number[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1));
    }, 1500);

    const targetInterval = setInterval(() => {
      setHackedTargets(prev => {
        if (prev.length < targets.length) {
          return [...prev, prev.length];
        }
        return prev;
      });
    }, 1000);

    if(currentMessageIndex >= messages.length -1) {
       clearInterval(messageInterval);
    }
    
    if (hackedTargets.length >= targets.length && currentMessageIndex >= messages.length - 1) {
      clearInterval(targetInterval);
      setTimeout(() => setShowFinalMessage(true), 1000);
      setTimeout(onComplete, 5000);
    }

    return () => {
      clearInterval(messageInterval);
      clearInterval(targetInterval);
    };
  }, [onComplete, hackedTargets.length, currentMessageIndex]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[100] flex flex-col items-center justify-center text-primary p-4 overflow-hidden"
    >
        <AnimatePresence>
            {!showFinalMessage && (
                <motion.div 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                >
                    <div className="w-full max-w-4xl text-center mb-8">
                        <h2 className="text-2xl md:text-4xl font-bold glitch" data-text={messages[currentMessageIndex % messages.length]}>
                            {messages[currentMessageIndex % messages.length]}
                        </h2>
                    </div>

                    <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {targets.map((target, index) => (
                        <motion.div
                            key={target.ip}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: hackedTargets.includes(index) ? 1 : 0.3 }}
                            className="p-4 border border-primary/30 bg-secondary/20 rounded-lg text-center"
                        >
                            {target.icon}
                            <p className="font-mono text-sm mt-2">{target.name}</p>
                            <p className="text-xs text-muted-foreground">{target.ip}</p>
                            <AnimatePresence>
                            {hackedTargets.includes(index) && (
                                <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-accent mt-1 text-sm accent-glow"
                                >
                                BREACHED
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                        ))}
                    </div>
                     <div className="w-full max-w-4xl h-48 bg-black border border-primary/20 rounded-lg p-2 font-mono text-xs text-green-400 overflow-y-scroll">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <p key={i} style={{ animationDelay: `${i * 100}ms` }} className="animate-pulse">
                                {`> 0x${Math.random().toString(16).substr(2, 8)}: ${messages[Math.floor(Math.random() * messages.length)]}`}
                            </p>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
         <AnimatePresence>
            {showFinalMessage && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                className="text-center"
            >
                <UserCheck className="w-24 h-24 text-accent mx-auto mb-4" />
                <h1 className="text-6xl md:text-8xl font-black text-accent accent-glow mb-2">HIRE ME</h1>
                <p className="text-xl md:text-2xl text-muted-foreground">MISSION_ACCOMPLISHED: Candidate profile has been successfully submitted.</p>
            </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default HireMeAnimation;
