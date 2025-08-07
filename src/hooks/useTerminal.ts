'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

type CommandProcessor = (command: string, args: string[]) => string | (string | React.ReactNode)[] | React.ReactNode;

const useTerminal = (processCommand: CommandProcessor, initialMessage: string[] = ['Welcome to ctOS 2.1 Terminal.', 'Type `help` for a list of commands.']) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<(string | React.ReactNode)[]>(initialMessage);
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

  const executeCommand = useCallback(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') {
      setHistory(prev => [...prev, `> ${input}`]);
      setInput('');
      return;
    }

    const newHistory = [...history, `> ${input}`];
    const [command, ...args] = trimmedInput.split(' ');

    if (command.toLowerCase() === 'clear') {
      setHistory([]);
    } else {
      const result = processCommand(command.toLowerCase(), args);
      if (Array.isArray(result)) {
        setHistory([...newHistory, ...result]);
      } else {
        setHistory([...newHistory, result]);
      }
    }
    setInput('');
  }, [input, history, processCommand]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    }
  }, [executeCommand]);

  return {
    input,
    history,
    inputRef,
    scrollAreaRef,
    handleInputChange,
    handleInputKeyDown,
    setHistory,
    setInput,
  };
};

export default useTerminal;
