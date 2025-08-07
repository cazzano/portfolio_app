'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Folder, Bell, Wifi, Activity } from 'lucide-react';
import type { AppInstance, AppType } from './hyprland-os';

interface WorkspaceBarProps {
  workspaces: number[];
  activeWorkspace: number;
  onSelectWorkspace: (ws: number) => void;
  onOpenApp: (app: Omit<AppInstance, 'id'>) => void;
  activeAppTitle: string;
}

const WorkspaceBar: React.FC<WorkspaceBarProps> = ({ workspaces, activeWorkspace, onSelectWorkspace, onOpenApp, activeAppTitle }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const openDefaultApp = (type: AppType) => {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    onOpenApp({ type, title });
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 h-10 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-between px-4 border-b border-primary/30 text-sm font-mono text-primary">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <motion.button 
              onClick={() => openDefaultApp('terminal')}
              className="p-2 rounded-md hover:bg-primary/20"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              title="Open Terminal"
          >
            <Terminal size={18} />
          </motion.button>
          <motion.button 
              onClick={() => openDefaultApp('files')}
              className="p-2 rounded-md hover:bg-primary/20"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              title="Open File Explorer"
          >
            <Folder size={18} />
          </motion.button>
        </div>
        <div className="w-[1px] h-6 bg-primary/30"></div>
        <div className="flex items-center gap-2 text-muted-foreground">
            <Activity size={16} />
            <span>{activeAppTitle}</span>
        </div>
      </div>
      
      {/* Center */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex items-center gap-2">
            <Bell size={16} className="text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
            {workspaces.map(ws => (
            <button 
                key={ws}
                onClick={() => onSelectWorkspace(ws)}
                className={`w-6 h-6 text-xs rounded-md border-2 transition-colors ${
                activeWorkspace === ws 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'border-primary/30 hover:bg-primary/20'
                }`}
            >
                {ws}
            </button>
            ))}
        </div>
        <div className="font-bold text-lg text-glow">{time}</div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Wifi size={16} />
        <span>SECURE_NET</span>
      </div>
    </div>
  );
};

export default WorkspaceBar;
