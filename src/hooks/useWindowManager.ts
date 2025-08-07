'use client';

import { useState, useCallback } from 'react';
import type { AppInstance } from '@/components/portfolio/hyprland-os';

interface AppState extends AppInstance {
  workspace: number;
}

const useWindowManager = () => {
  const [workspaces] = useState([1, 2, 3, 4, 5]);
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [apps, setApps] = useState<AppState[]>([]);
  const [appCounter, setAppCounter] = useState(0);

  const openApp = useCallback((appData: Omit<AppInstance, 'id'>) => {
    const newId = `${appData.type}-${appCounter}`;
    setAppCounter(c => c + 1);
    
    // Prevent opening duplicate file editors in the same workspace
    if(appData.type === 'editor') {
        const existingEditor = apps.find(app => app.type === 'editor' && app.props?.filePath === appData.props?.filePath && app.workspace === activeWorkspace);
        if(existingEditor) {
            bringToFront(existingEditor.id);
            return;
        }
    }

    const newApp: AppState = {
      ...appData,
      id: newId,
      workspace: activeWorkspace,
    };
    setApps(prev => [...prev, newApp]);
  }, [activeWorkspace, appCounter, apps]);

  const closeApp = useCallback((appId: string) => {
    setApps(prev => prev.filter(app => app.id !== appId));
  }, []);

  const bringToFront = useCallback((appId: string) => {
    setApps(prev => {
      const appToMove = prev.find(app => app.id === appId);
      if (!appToMove) return prev;
      const otherApps = prev.filter(app => app.id !== appId);
      return [...otherApps, appToMove];
    });
  }, []);
  
  const getApp = useCallback((appId: string) => {
    return apps.find(app => app.id === appId);
  }, [apps]);

  return {
    workspaces,
    activeWorkspace,
    openApps: apps.filter(app => app.workspace === activeWorkspace),
    allApps: apps,
    setActiveWorkspace,
    openApp,
    closeApp,
    bringToFront,
    getApp,
  };
};

export default useWindowManager;
