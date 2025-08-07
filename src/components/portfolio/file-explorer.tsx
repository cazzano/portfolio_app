'use client';

import React from 'react';
import { useFileSystem } from '@/hooks/useFileSystem';
import { FileSystemItem } from '@/lib/file-system';
import { Folder, File as FileIcon } from 'lucide-react';

interface FileItemProps {
  name: string;
  type: string;
  level?: number;
  onOpenFile: (path: string) => void;
  path: string;
}

const FileItem: React.FC<FileItemProps> = ({ name, type, level = 0, onOpenFile, path }) => {
    const icon = type === 'folder' 
        ? <Folder className="w-4 h-4 text-primary" /> 
        : <FileIcon className="w-4 h-4 text-muted-foreground" />;

    return (
        <div 
            className="flex items-center gap-2 p-1 hover:bg-primary/10 rounded-sm cursor-pointer" 
            style={{ paddingLeft: `${level * 1.5 + 0.25}rem`}}
            onClick={() => type === 'file' && onOpenFile(path)}
        >
            <div className="text-primary w-4 h-4">{icon}</div>
            <span className="text-sm text-foreground">{name}</span>
        </div>
    )
}

interface DirectoryProps {
    items: FileSystemItem[];
    level?: number;
    onOpenFile: (path: string) => void;
    basePath?: string;
}

const DirectoryView: React.FC<DirectoryProps> = ({ items, level = 0, onOpenFile, basePath = '' }) => {
    return (
        <div>
            {items.map(item => {
                const currentPath = basePath ? `${basePath}/${item.name}` : item.name;
                return (
                    <div key={currentPath}>
                        <FileItem name={item.name} type={item.type} level={level} onOpenFile={onOpenFile} path={currentPath} />
                        {item.children && item.children.length > 0 && (
                            <DirectoryView items={item.children} level={level + 1} onOpenFile={onOpenFile} basePath={currentPath} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}


interface FileExplorerProps {
    onOpenFile: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onOpenFile }) => {
  const { fileSystem } = useFileSystem();
  return (
    <div className="w-full h-full bg-black/50 p-2 font-mono text-sm overflow-y-auto">
        <DirectoryView items={fileSystem} onOpenFile={onOpenFile}/>
    </div>
  );
};

export default FileExplorer;
