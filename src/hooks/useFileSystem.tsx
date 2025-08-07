'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fileSystem as initialFileSystem, FileSystemItem, FSItem } from '@/lib/file-system';
import { fileContent as initialFileContent } from '@/components/portfolio/file-content';
import { Folder, File as FileIcon } from 'lucide-react';

interface FileSystemContextType {
  fileSystem: FSItem[];
  fileContent: Record<string, string>;
  findNode: (path: string) => FSItem | null;
  getFileContent: (path: string) => string;
  updateFileContent: (path: string, content: string) => void;
  createFile: (path: string, fileName: string) => boolean;
  createDirectory: (path: string, dirName: string) => boolean;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const findNodeRecursive = (path: string, fs: FSItem[]): FSItem | null => {
  const parts = path.split('/').filter(p => p);
  let currentNode: FSItem | { children: FSItem[] } | undefined = { children: fs };

  for (const part of parts) {
    if (currentNode && 'children' in currentNode && currentNode.children) {
      currentNode = (currentNode.children as FSItem[]).find(item => item.name === part);
    } else {
      return null;
    }
  }
  return currentNode as FSItem || null;
}

const initialFileSystemData: FSItem[] = initialFileSystem.map(({icon, ...rest}) => rest);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fileSystem, setFileSystem] = useState<FSItem[]>(initialFileSystemData);
  const [fileContent, setFileContent] = useState<Record<string, string>>(initialFileContent);

  const findNode = useCallback((path: string): FSItem | null => {
    if (path === '' || path === '/') return { name: '/', type: 'folder', children: fileSystem };
    return findNodeRecursive(path, fileSystem);
  }, [fileSystem]);
  
  const getFileContent = useCallback((path: string) => {
    return fileContent[path] ?? `// File not found: ${path}`;
  }, [fileContent]);

  const updateFileContent = useCallback((path: string, content: string) => {
    setFileContent(prev => ({ ...prev, [path]: content }));
  }, []);
  
  const modifyFileSystem = (path: string, newItem: FSItem): boolean => {
    let success = false;
    setFileSystem(currentFileSystem => {
        const newFileSystem = JSON.parse(JSON.stringify(currentFileSystem));
        const parentNode = findNodeRecursive(path, newFileSystem);
        
        if (parentNode && parentNode.type === 'folder') {
            if (!parentNode.children) parentNode.children = [];
            if (parentNode.children.some(child => child.name === newItem.name)) {
                success = false; 
                return currentFileSystem;
            }
            parentNode.children.push(newItem);
            success = true;
            return newFileSystem;
        }
        success = false;
        return currentFileSystem;
    });
    return success;
  };
  
  const createFile = (path: string, fileName: string): boolean => {
    const newFile: FSItem = { name: fileName, type: 'file' };
    if(modifyFileSystem(path, newFile)) {
        updateFileContent(`${path ? path + '/' : ''}${fileName}`, '');
        return true;
    }
    return false;
  }

  const createDirectory = (path: string, dirName: string): boolean => {
    const newDir: FSItem = { name: dirName, type: 'folder', children: [] };
    return modifyFileSystem(path, newDir);
  };
  
  return (
    <FileSystemContext.Provider value={{ fileSystem, fileContent, findNode, getFileContent, updateFileContent, createFile, createDirectory }}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = (): FileSystemContextType => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
