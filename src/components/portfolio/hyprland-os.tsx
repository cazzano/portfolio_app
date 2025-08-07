'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Window from './window';
import FileExplorer from './file-explorer';
import InAppTerminal from './in-app-terminal';
import Editor from './editor';
import WorkspaceBar from './workspace-bar';
import { Power } from 'lucide-react';
import useWindowManager from '@/hooks/useWindowManager';
import { FileSystemProvider } from '@/hooks/useFileSystem';

export type AppType = 'files' | 'terminal' | 'editor';

export interface AppInstance {
  id: string;
  type: AppType;
  title: string;
  props?: Record<string, any>;
}

interface HyprlandOSProps {
  onExit: () => void;
  onNavigate: (view: 'home' | 'skills' | 'projects' | 'contact') => void;
  onHire: () => void;
}

const HyprlandOSContent: React.FC<HyprlandOSProps> = ({ onExit, onNavigate, onHire }) => {
  const {
    workspaces,
    activeWorkspace,
    openApps,
    allApps,
    setActiveWorkspace,
    openApp,
    closeApp,
    bringToFront,
    getApp,
  } = useWindowManager();
  
  const activeWindows = allApps.filter(app => app.workspace === activeWorkspace);
  const activeApp = activeWindows.length > 0 ? activeWindows[activeWindows.length - 1] : null;
  const activeAppInstance = activeApp ? getApp(activeApp.id) : null;
  const activeAppTitle = activeAppInstance ? activeAppInstance.title : 'Desktop';
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'q') {
        if (activeApp) {
          closeApp(activeApp.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeApp, closeApp]);


  const getTileStyles = (index: number, count: number) => {
    if (count === 1) {
      return { top: '0%', left: '0%', width: '100%', height: '100%' };
    }
    if (index === 0) { // Master window
      return { top: '0%', left: '0%', width: '50%', height: '100%' };
    }
    // Tiled windows
    const tileHeight = 100 / (count - 1);
    return {
      top: `${(index - 1) * tileHeight}%`,
      left: '50%',
      width: '50%',
      height: `${tileHeight}%`
    };
  };

  const renderApp = (app: AppInstance) => {
    switch (app.type) {
      case 'files':
        return <FileExplorer onOpenFile={(filePath) => openApp({ type: 'editor', title: filePath, props: { filePath } })} />;
      case 'terminal':
        return <InAppTerminal onNavigate={onNavigate} onHire={onHire} onOpenFile={(filePath) => openApp({ type: 'editor', title: filePath, props: { filePath } })} onExit={onExit} />;
      case 'editor':
        return <Editor filePath={app.props?.filePath} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative w-full h-full bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent 60%)`
      }}></div>

      <WorkspaceBar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onOpenApp={openApp}
        activeAppTitle={activeAppTitle}
      />
      
      <div className="absolute top-12 bottom-20 left-0 right-0 p-2">
        <div className="relative w-full h-full">
            {activeWindows.map((app, index) => {
               const appInstance = getApp(app.id);
               if (!appInstance) return null;
               
               const zIndex = openApps.findIndex(a => a.id === app.id) + 1;
               const style = getTileStyles(index, activeWindows.length);

               return (
                <motion.div
                    key={app.id}
                    layoutId={app.id}
                    initial={false}
                    animate={{
                        ...style,
                        zIndex: app.id === openApps[openApps.length - 1]?.id ? 10 : zIndex,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute border-2 border-transparent focus-within:border-accent p-1"
                    onClick={() => bringToFront(app.id)}
                >
                    <Window
                        appId={app.id}
                        title={appInstance.title}
                        onClose={() => closeApp(app.id)}
                        onFocus={() => bringToFront(app.id)}
                        isActive={activeApp ? app.id === activeApp.id : false}
                    >
                        {renderApp(appInstance)}
                    </Window>
                </motion.div>
               )
            })}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/50 border border-primary/20 rounded-xl backdrop-blur-sm z-50">
        <button onClick={onExit} className="p-3 rounded-lg hover:bg-destructive/80 transition-colors text-destructive" title="Exit OS">
          <Power size={28} />
        </button>
      </div>
    </motion.div>
  );
};

const HyprlandOS: React.FC<HyprlandOSProps> = (props) => (
    <FileSystemProvider>
        <HyprlandOSContent {...props} />
    </FileSystemProvider>
);

export default HyprlandOS;
