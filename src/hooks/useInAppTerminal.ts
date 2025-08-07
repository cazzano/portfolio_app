'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useFileSystem } from './useFileSystem';
import SystemInfo from '@/components/portfolio/system-info';
import { Folder, File as FileIcon } from 'lucide-react';

type View = 'home' | 'skills' | 'projects' | 'contact';
interface InAppTerminalProps {
  onNavigate: (view: View) => void;
  onHire: () => void;
  onOpenFile: (filePath: string) => void;
  onExit: () => void;
}

const useInAppTerminal = ({ onOpenFile, onHire, onNavigate, onExit }: InAppTerminalProps) => {
    const { findNode, createFile, createDirectory } = useFileSystem();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<(string | React.ReactNode)[]>(['Welcome to Hypr-Terminal.', 'Type `help` for a list of commands.']);
    const [currentPath, setCurrentPath] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [history]);

    const resolvePath = (path: string): string => {
        if (path.startsWith('/')) return path;
        const newPath = currentPath ? `${currentPath}/${path}` : path;
        const parts = newPath.split('/');
        const resolved: string[] = [];
        for (const part of parts) {
            if (part === '..') {
                resolved.pop();
            } else if (part !== '.' && part !== '') {
                resolved.push(part);
            }
        }
        return `/${resolved.join('/')}`;
    }

    const processCommand = (command: string, args: string[]) => {
        const fullPathArg = args.length > 0 ? resolvePath(args[0]).substring(1) : '';

        switch (command) {
            case 'ls':
                const dirToList = args[0] ? resolvePath(args[0]).substring(1) : currentPath.substring(1);
                const node = findNode(dirToList);
                if (node && node.type === 'folder' && node.children) {
                    return node.children.map(item => {
                      const icon = item.type === 'folder' 
                        ? React.createElement(Folder, { className: "w-4 h-4 text-primary" }) 
                        : React.createElement(FileIcon, { className: "w-4 h-4 text-muted-foreground" });
                      
                      return React.createElement('div', { key: item.name, className: "flex items-center gap-2" },
                        icon,
                        React.createElement('span', null, item.name)
                      );
                    });
                }
                return `Error: directory not found: ${dirToList || '/'}`;

            case 'cd':
                if (args.length === 0) {
                    setCurrentPath('');
                    return;
                }
                const newPath = resolvePath(args[0]);
                if (newPath === '/') {
                  setCurrentPath('');
                  return;
                }
                const targetNode = findNode(newPath.substring(1));
                if (targetNode && targetNode.type === 'folder') {
                    setCurrentPath(newPath);
                } else {
                    return `Error: directory not found: ${args[0]}`;
                }
                return;

            case 'edit':
                if (args.length === 0) return 'Error: a file path is required. Usage: edit <file_path>';
                const fileNode = findNode(fullPathArg);
                if (fileNode && fileNode.type === 'file') {
                    onOpenFile(fullPathArg);
                    return `Opening ${fullPathArg} in editor...`;
                }
                return `Error: file not found: ${args[0]}`;
            
            case 'mkfile':
                if (args.length === 0) return 'Error: a file name is required. Usage: mkfile <file_name>';
                const createdFile = createFile(currentPath.substring(1), args[0]);
                return createdFile ? `File created: ${args[0]}`: `Error: File '${args[0]}' already exists.`;

            case 'mkdir':
                if (args.length === 0) return 'Error: a directory name is required. Usage: mkdir <dir_name>';
                const createdDir = createDirectory(currentPath.substring(1), args[0]);
                return createdDir ? `Directory created: ${args[0]}`: `Error: Directory '${args[0]}' already exists.`;

            case 'home':
            case 'skills':
            case 'projects':
            case 'contact':
                onNavigate(command);
                return `Navigating to ${command.toUpperCase()}_NODE...`;
            
            case 'hire':
                onHire();
                return 'Executing special command: hire...';

            case 'system':
                return React.createElement(SystemInfo, { key: Date.now() });
            
            case 'shutdown':
                onExit();
                return 'Shutting down...';

            case 'help':
                return [
                  'Available commands:',
                  '  ls [path]      - List directory contents',
                  '  cd <path>      - Change directory',
                  '  edit <path>    - Open a file in the editor',
                  '  mkfile <name>  - Create a new file',
                  '  mkdir <name>   - Create a new directory',
                  '  home           - Navigate to Home Node',
                  '  skills         - Navigate to Skills Database',
                  '  projects       - Navigate to Project Network',
                  '  contact        - Navigate to Secure Comms',
                  '  system         - Display system information',
                  '  hire           - Run special command',
                  '  shutdown       - Exit the OS',
                  '  help           - Show this help message',
                  '  clear          - Clear the terminal screen',
                ];

            default:
                return `Error: command not found: ${command}`;
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const executeCommand = useCallback(() => {
        const trimmedInput = input.trim();
        const newHistory = [...history, React.createElement('div', {key: history.length}, React.createElement('span', {className: "text-primary"}, `ds@hypr:~${currentPath}$ `), React.createElement('span', null, input))];
        
        if (trimmedInput === '') {
          setHistory(newHistory);
          setInput('');
          return;
        }
        
        const [command, ...args] = trimmedInput.split(' ');
    
        if (command.toLowerCase() === 'clear') {
          setHistory([]);
        } else {
          const result = processCommand(command.toLowerCase(), args);
          if (Array.isArray(result)) {
            setHistory([...newHistory, ...result]);
          } else if(result) {
            setHistory([...newHistory, result]);
          } else {
            setHistory(newHistory);
          }
        }
        setInput('');
      }, [input, history, processCommand, currentPath]);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeCommand();
        }
    };

    return {
        input,
        history,
        currentPath,
        inputRef,
        scrollAreaRef,
        handleInputChange,
        handleInputKeyDown,
    };
};

export default useInAppTerminal;
