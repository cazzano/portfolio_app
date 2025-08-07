'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  appId: string;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  onFocus: () => void;
  isActive: boolean;
}

const Window: React.FC<WindowProps> = ({
  appId,
  children,
  title,
  onClose,
  onFocus,
  isActive,
}) => {
  return (
    <motion.div
      layout
      onClick={onFocus}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`w-full h-full bg-black/70 backdrop-blur-md border rounded-lg shadow-2xl flex flex-col ${isActive ? 'border-accent' : 'border-primary/30'}`}
    >
      <motion.div
        className={`h-8 px-2 flex items-center justify-between border-b cursor-default window-drag-handle flex-shrink-0 ${isActive ? 'border-accent' : 'border-primary/20'}`}
      >
        <p className={`text-sm font-bold truncate ${isActive ? 'text-accent' : 'text-primary'}`}>{title}</p>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
            <Minus size={14}/>
          </button>
          <button className="p-1 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
            <Square size={12}/>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 rounded-full hover:bg-destructive/80 text-muted-foreground hover:text-white transition-colors">
            <X size={14}/>
          </button>
        </div>
      </motion.div>
      <div className="flex-grow overflow-auto">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
