'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import SystemInfo from './system-info';

type View = 'home' | 'skills' | 'projects' | 'contact' | 'hypr';
type SpecialCommand = 'hire';

interface TerminalProps {
  onClose: () => void;
  onExecuteCommand: (view: View) => void;
  onExecuteSpecialCommand: (command: SpecialCommand) => void;
}

const commands: { [key: string]: View | 'help' | 'clear' | 'system' | 'hire' } = {
  home: 'home',
  'home_node': 'home',
  skills: 'skills',
  'skills_db': 'skills',
  contact: 'contact',
  'secure_comms': 'contact',
  projects: 'projects',
  'project_net': 'projects',
  system: 'system',
  help: 'help',
  clear: 'clear',
  exit: 'clear',
  hire: 'hire',
  hypr: 'hypr',
};

const helpText = [
  'Available commands:',
  '  home         - Navigate to Home Node',
  '  skills_db    - Navigate to Skills Database',
  '  project_net  - Navigate to Project Network',
  '  secure_comms - Navigate to Secure Comms',
  '  system       - Display system information',
  '  hire         - Run special command',
  '  hypr         - Launch Hyprland-like OS environment',
  '  help         - Show this help message',
  '  clear        - Clear the terminal screen',
  '  exit         - Close the terminal',
];

const Terminal: React.FC<TerminalProps> = ({ onClose, onExecuteCommand, onExecuteSpecialCommand }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<(string | React.ReactNode)[]>(['Welcome to ctOS 2.1 Terminal. Type `help` for a list of commands.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const processCommand = () => {
    const trimmedInput = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`];

    if (trimmedInput in commands) {
      const command = commands[trimmedInput];
      if (command === 'help') {
        setHistory([...newHistory, ...helpText]);
      } else if (command === 'clear') {
        setHistory([]);
      } else if (trimmedInput === 'exit') {
        onClose();
      } else if (command === 'system') {
        setHistory([...newHistory, <SystemInfo key={Date.now()} />]);
      } else if (command === 'hire') {
        onExecuteSpecialCommand(command);
        setHistory([...newHistory, 'Executing special command: hire...']);
        onClose();
      } else {
        onExecuteCommand(command as View);
        onClose();
      }
    } else {
      setHistory([...newHistory, `Error: command not found: ${trimmedInput}`]);
    }
    setInput('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 md:inset-auto md:bottom-10 md:left-1/2 md:-translate-x-1/2 w-full md:w-[680px] h-full md:h-[420px] bg-black/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-2xl z-50 flex flex-col"
        onClick={() => inputRef.current?.focus()}
      >
        <header className="flex items-center justify-between p-2 border-b border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <TerminalIcon size={16} />
            <span className="font-mono text-sm">ctOS Terminal</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </header>
        <div ref={scrollAreaRef} className="flex-1 p-2 overflow-y-auto font-mono text-sm">
          {history.map((line, index) => (
            <div key={index} className={typeof line === 'string' && line.startsWith('Error:') ? 'text-destructive' : typeof line === 'string' && line.startsWith('>') ? 'text-primary' : 'text-foreground'}>
              {line}
            </div>
          ))}
          <div className="flex items-center">
            <ChevronRight size={16} className="text-primary" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent border-none outline-none w-full text-accent p-1"
              autoComplete="off"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Terminal;
