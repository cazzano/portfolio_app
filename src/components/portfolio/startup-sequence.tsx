'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StartupSequenceProps {
  onComplete: () => void;
}

const lines = [
  { text: 'ctOS v2.1 INITIALIZING...', delay: 1000 },
  { text: 'Loading neural network drivers...', delay: 1500 },
  { text: 'Establishing encrypted connections... [OK]', delay: 2000 },
  { text: 'Syncing with satellite uplink... [OK]', delay: 2500 },
  { text: 'Compiling core modules... ', delay: 3500 },
  { text: 'HACK THE PLANET - System Ready', delay: 1000 },
];

const BlinkingCursor = () => (
  <motion.span
    className="inline-block w-2 h-5 bg-accent"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1, repeat: Infinity }}
  />
);

const TypingText: React.FC<{ text: string; onFinished: () => void }> = ({ text, onFinished }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timeoutId);
    } else {
      onFinished();
    }
  }, [displayedText, text, onFinished]);

  return <span>{displayedText}</span>;
};

const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
        setShowCursor(true);
        if (lines[currentLine].text.includes('Compiling')) {
            setShowProgressBar(true);
        }
      }, lines[currentLine].delay);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  useEffect(() => {
    if (showProgressBar) {
      const interval = setInterval(() => {
        setProgress(prev => {
            const next = prev + 25;
            if (next >= 100) {
                clearInterval(interval);
            }
            return next;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [showProgressBar]);

  const handleTypingFinished = () => {
    setShowCursor(false);
    if(currentLine === lines.length - 1) {
        setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500);
        }, 1000);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black flex items-center justify-center font-mono text-accent z-50"
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        {lines.slice(0, currentLine + 1).map((line, index) => (
          <div key={index} className="text-lg">
            <span className="text-primary">&gt; </span>
            {index === currentLine ? (
              <>
                <TypingText text={line.text} onFinished={handleTypingFinished} />
                {showCursor && <BlinkingCursor />}
              </>
            ) : (
              <span>{line.text}</span>
            )}
             {line.text.includes('Compiling') && showProgressBar && (
                <div className="w-full bg-accent/20 h-4 mt-2 p-0.5 border border-accent/50">
                    <motion.div
                        className="bg-accent h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%`}}
                        transition={{ duration: 0.2, ease: "linear" }}
                    />
                </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StartupSequence;
