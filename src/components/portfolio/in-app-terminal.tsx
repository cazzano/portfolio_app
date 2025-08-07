'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import SystemInfo from './system-info';
import useInAppTerminal from '@/hooks/useInAppTerminal';
import { fileSystem } from '@/lib/file-system';

type View = 'home' | 'skills' | 'projects' | 'contact';
interface InAppTerminalProps {
  onNavigate: (view: View) => void;
  onHire: () => void;
  onOpenFile: (filePath: string) => void;
  onExit: () => void;
}

const InAppTerminal: React.FC<InAppTerminalProps> = ({ onNavigate, onHire, onOpenFile, onExit }) => {
  const {
    input,
    history,
    inputRef,
    scrollAreaRef,
    handleInputChange,
    handleInputKeyDown,
    currentPath,
  } = useInAppTerminal({ onOpenFile, onHire, onNavigate, onExit });

  return (
    <div className="w-full h-full bg-black/80 flex flex-col font-mono text-sm" onClick={() => inputRef.current?.focus()}>
        <div ref={scrollAreaRef} className="flex-1 p-2 overflow-y-auto">
          {history.map((line, index) => (
            <div key={index} className={typeof line === 'string' && line.startsWith('Error:') ? 'text-destructive' : 'text-foreground'}>
              {line}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-primary">ds@hypr:~{currentPath}$&nbsp;</span>
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
    </div>
  );
};

export default InAppTerminal;
