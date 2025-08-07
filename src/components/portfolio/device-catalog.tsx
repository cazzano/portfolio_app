'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Briefcase, Send, Signal, Lock, Unlock, X } from 'lucide-react';

type View = 'home' | 'skills' | 'projects' | 'contact';

interface DeviceCatalogProps {
  onSelectView: (view: View) => void;
  onClose: () => void;
  currentView: View;
}

const nodes = [
  { id: 'home', name: 'HOME_NODE', icon: <Home /> },
  { id: 'skills', name: 'SKILLS_DB', icon: <User /> },
  { id: 'projects', name: 'PROJECT_NET', icon: <Briefcase /> },
  { id: 'contact', name: 'SECURE_COMMS', icon: <Send /> },
] as const;

const DeviceCatalog: React.FC<DeviceCatalogProps> = ({ onSelectView, onClose, currentView }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-full max-w-2xl p-8 bg-black/50 border-2 border-primary/30 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-primary mb-6 glitch" data-text="DEVICE_CATALOG">
            DEVICE_CATALOG
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectView(node.id)}
                className="p-4 bg-secondary/30 rounded-md border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-primary">{node.icon}</div>
                  <span className="font-bold text-lg text-primary group-hover:text-glow">
                    {node.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Signal size={16} className={currentView === node.id ? 'text-accent' : 'text-muted-foreground'} />
                        <span>{currentView === node.id ? 'CONNECTED' : 'IDLE'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {currentView === node.id ? <Unlock size={16} className="text-accent"/> : <Lock size={16} className="text-muted-foreground" />}
                        <span>{currentView === node.id ? 'UNLOCKED' : 'LOCKED'}</span>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeviceCatalog;
