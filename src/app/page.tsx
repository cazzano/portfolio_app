'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartupSequence from '@/components/portfolio/startup-sequence';
import Hud from '@/components/portfolio/hud';
import BackgroundEffects from '@/components/portfolio/background-effects';
import HomeSection from '@/components/portfolio/home-section';
import SkillsSection from '@/components/portfolio/skills-section';
import ProjectsSection from '@/components/portfolio/projects-section';
import ContactSection from '@/components/portfolio/contact-section';
import DeviceCatalog from '@/components/portfolio/device-catalog';
import HackingAnimation from '@/components/portfolio/hacking-animation';
import Terminal from '@/components/portfolio/terminal';
import { Button } from '@/components/ui/button';
import HireMeAnimation from '@/components/portfolio/HireMeAnimation';
import HyprlandOS from '@/components/portfolio/hyprland-os';

type View = 'home' | 'skills' | 'projects' | 'contact' | 'hypr';
const views: View[] = ['home', 'skills', 'projects', 'contact'];

export default function Home() {
  const [startupComplete, setStartupComplete] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [targetView, setTargetView] = useState<View>('home');
  const [isHacking, setIsHacking] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const qPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isQPressed = useRef(false);

  useEffect(() => {
    // Initialize AudioContext after user interaction (e.g., component mount)
    // Browsers often require user gesture to enable audio.
    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
          console.error("Web Audio API is not supported in this browser");
        }
      }
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);
    
    return () => {
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
    }
  }, []);

  const playGlitchSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const audioCtx = audioContextRef.current;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    // Main oscillator for the core sound
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, now);

    // LFO to create a vibrato/tremolo effect on the frequency
    const lfo = audioCtx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(15, now);

    // Gain for the LFO to control modulation depth
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(20, now); // Modulate frequency by +/- 20 Hz
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    
    // Main gain node to control overall volume and create troughs/crests
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    masterGain.gain.linearRampToValueAtTime(0.6, now + 0.15);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    masterGain.gain.linearRampToValueAtTime(0.7, now + 0.35);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    masterGain.gain.linearRampToValueAtTime(0.4, now + 0.55);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    // Distortion for a grittier, more "hacked" sound
    const distortion = audioCtx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        const x = i * 2 / 255 - 1;
        curve[i] = (Math.PI + 15) * x / (Math.PI + 15 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    // Connecting the audio graph
    oscillator.connect(distortion);
    distortion.connect(masterGain);
    masterGain.connect(audioCtx.destination);
    
    // Start and stop everything
    lfo.start(now);
    oscillator.start(now);

    oscillator.stop(now + 0.8);
    lfo.stop(now + 0.8);
  }, []);
  
  const changeView = (view: View) => {
    if (view === currentView || isHacking || isHiring) return;
    if (view === 'hypr') {
      setCurrentView('hypr');
      setIsHacking(false);
      return;
    }
    setIsCatalogOpen(false);
    setIsTerminalOpen(false);
    setTargetView(view);
    playGlitchSound();
    setIsHacking(true);
  };

  const handleHackingComplete = () => {
    setCurrentView(targetView);
    setIsHacking(false);
  };

  const handleHireCommand = () => {
    if (isHacking || isHiring) return;
    setIsTerminalOpen(false);
    setIsCatalogOpen(false);
    setCurrentView('home');
    setIsHiring(true);
  };
  
  const handleHyprlandHire = () => {
    setCurrentView('home');
    setTimeout(() => setIsHiring(true), 100);
  }

  const handleHireComplete = () => {
    setIsHiring(false);
  };
  
  const handleQCycle = useCallback(() => {
    const currentIndex = views.indexOf(currentView as View);
    if(currentIndex === -1) {
      changeView('home');
      return;
    }
    const nextIndex = (currentIndex + 1) % views.length;
    changeView(views[nextIndex]);
  }, [currentView, changeView]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (currentView === 'hypr') return;

    if (e.shiftKey && e.key.toLowerCase() === 't' && startupComplete && !isHacking && !isHiring) {
      e.preventDefault();
      if (isCatalogOpen) setIsCatalogOpen(false);
      setIsTerminalOpen(prev => !prev);
      return;
    }

    if (e.key.toLowerCase() !== 'q' || !startupComplete || isHacking || isHiring || isQPressed.current || isTerminalOpen) return;
    isQPressed.current = true;
    
    qPressTimer.current = setTimeout(() => {
      handleQCycle();
      qPressTimer.current = null;
    }, 2000);
  }, [startupComplete, isHacking, isHiring, handleQCycle, isTerminalOpen, isCatalogOpen, currentView]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (currentView === 'hypr') return;
    if (e.key.toLowerCase() !== 'q' || !startupComplete || isTerminalOpen || isHiring) return;
    isQPressed.current = false;

    if (qPressTimer.current) {
      clearTimeout(qPressTimer.current);
      qPressTimer.current = null;
      setIsCatalogOpen(prev => !prev);
    }
  }, [startupComplete, isTerminalOpen, isHiring, currentView]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (qPressTimer.current) clearTimeout(qPressTimer.current);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleHyprNavigation = (view: 'home' | 'skills' | 'projects' | 'contact') => {
    setCurrentView(view);
  };
  
  const renderContent = () => {
    if(currentView === 'hypr'){
      return <HyprlandOS onExit={() => setCurrentView('home')} onNavigate={handleHyprNavigation} onHire={handleHyprlandHire} />;
    }
    switch (currentView) {
      case 'home':
        return <HomeSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return null;
    }
  };
  
  if (!startupComplete) {
    return <StartupSequence onComplete={() => setStartupComplete(true)} />;
  }

  return (
    <main className="relative w-screen h-screen bg-black text-cyan-300 font-code overflow-hidden">
      {currentView !== 'hypr' && <BackgroundEffects />}
      {currentView !== 'hypr' && <Hud currentView={currentView} />}
      
      <AnimatePresence>
        {isHacking && <HackingAnimation onComplete={handleHackingComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {isHiring && <HireMeAnimation onComplete={handleHireComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {isCatalogOpen && <DeviceCatalog onSelectView={changeView} onClose={() => setIsCatalogOpen(false)} currentView={currentView as View}/>}
      </AnimatePresence>

      <AnimatePresence>
        {isTerminalOpen && <Terminal onClose={() => setIsTerminalOpen(false)} onExecuteCommand={changeView} onExecuteSpecialCommand={handleHireCommand} />}
      </AnimatePresence>
      
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: isHiring ? -10 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        {renderContent()}
      </motion.div>
      
      {currentView !== 'hypr' && (
        <div className="absolute bottom-4 right-4 md:hidden z-50">
            <Button 
              className="hex-clip w-20 h-20 bg-primary/20 border-2 border-primary text-primary text-2xl font-bold hover:bg-primary/40 active:bg-primary/60"
              onTouchStart={() => {
                isQPressed.current = true;
                qPressTimer.current = setTimeout(() => {
                  handleQCycle();
                  qPressTimer.current = null;
                }, 2000);
              }}
              onTouchEnd={() => {
                isQPressed.current = false;
                if (qPressTimer.current) {
                  clearTimeout(qPressTimer.current);
                  qPressTimer.current = null;
                  setIsCatalogOpen(prev => !prev);
                }
              }}
            >
              Q
            </Button>
        </div>
      )}
    </main>
  );
}
