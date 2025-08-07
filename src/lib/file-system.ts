import { Folder, File, Server, Shield, HardDrive } from 'lucide-react';
import React from 'react';

export interface FSItem {
  name: string;
  type: 'folder' | 'file' | 'server';
  children?: FSItem[];
}
export interface FileSystemItem extends FSItem {
  icon: React.ReactNode;
  children?: FileSystemItem[];
}

export const fileSystem: FileSystemItem[] = [
    { name: 'bin', type: 'folder', icon: React.createElement(Folder), children: [
        { name: 'exploit.sh', type: 'file', icon: React.createElement(File) },
        { name: 'nmap', type: 'file', icon: React.createElement(File) },
        { name: 'metasploit', type: 'file', icon: React.createElement(File) },
    ]},
    { name: 'data', type: 'folder', icon: React.createElement(HardDrive), children: [
        { name: 'passwords.db', type: 'file', icon: React.createElement(File) },
        { name: 'intel_corp.zip', type: 'file', icon: React.createElement(File) },
        { name: 'blueprints', type: 'folder', icon: React.createElement(Folder), children: [
            { name: 'ctOS_v3.pdf', type: 'file', icon: React.createElement(File) },
        ]},
    ]},
    { name: 'logs', type: 'folder', icon: React.createElement(Folder), children: [
        { name: 'access.log', type: 'file', icon: React.createElement(File) },
        { name: 'firewall.log', type: 'file', icon: React.createElement(File) },
    ]},
    { name: 'remote_nodes', type: 'folder', icon: React.createElement(Server), children: [
        { name: 'corp-mainframe', type: 'server', icon: React.createElement(Server) },
        { name: 'secure-bank-db', type: 'server', icon: React.createElement(Server) },
    ]},
    { name: 'README.md', type: 'file', icon: React.createElement(File)},
    { name: 'secure_vault', type: 'folder', icon: React.createElement(Shield), children: []}
];
