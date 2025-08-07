'use client';

import React, { useState, useEffect } from 'react';
import { useFileSystem } from '@/hooks/useFileSystem';
import { Save, Zap, XCircle } from 'lucide-react';

interface EditorProps {
  filePath: string;
}

const Editor: React.FC<EditorProps> = ({ filePath }) => {
  const { getFileContent, updateFileContent } = useFileSystem();
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('NORMAL');
  const [cursor, setCursor] = useState({ line: 0, col: 0 });
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const fileContent = getFileContent(filePath);
    setContent(fileContent);
    setIsSaved(true);
  }, [filePath, getFileContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setMode('INSERT');
    setIsSaved(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setMode('NORMAL');
      e.currentTarget.blur();
    }
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
    }
  };

  const handleSave = () => {
    updateFileContent(filePath, content);
    setIsSaved(true);
    setMode('NORMAL');
  };

  const lines = content?.split('\n') || [];

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono flex flex-col text-sm">
      <div className="flex-grow p-2 relative">
        <div className="absolute inset-0 p-2 flex">
          <div className="w-10 text-right pr-4 text-gray-500 shrink-0">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setMode('INSERT')}
            spellCheck="false"
            className="w-full h-full bg-transparent text-inherit resize-none border-none outline-none p-0 m-0"
          />
        </div>
      </div>
      <div className="flex-shrink-0 h-8 bg-[#252526] flex items-center justify-between px-4 border-t border-primary/20">
        <div className="flex items-center gap-4">
          <span className={`font-bold px-2 rounded ${mode === 'NORMAL' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{mode}</span>
          <span className="text-primary">{filePath}</span>
          {!isSaved && <span className="text-yellow-400">[+]</span>}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleSave}>
            <Save size={14} /> W
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} />
            <span>LazyVim</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
