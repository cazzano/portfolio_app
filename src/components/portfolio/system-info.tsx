'use client';

import React, { useEffect, useState } from 'react';

const SystemInfo: React.FC = () => {
    const [uptime, setUptime] = useState('');

    useEffect(() => {
        const startTime = Date.now() - (Math.random() * 1000 * 3600 * 24 * 5); // Random start time within last 5 days
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - startTime;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setUptime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const dedsecAscii = `
    ██████╗ ███████╗██████╗ ███████╗███████╗ ██████╗ 
    ██╔═══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██╔════╝ 
    ██║   ██║█████╗  ██║  ██║█████╗  █████╗  ██║  ███╗
    ██║   ██║██╔══╝  ██║  ██║██╔══╝  ██╔══╝  ██║   ██║
    ╚██████╔╝███████╗██████╔╝██║     ███████╗╚██████╔╝
     ╚═════╝ ╚══════╝╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ 
    `;

    const stats = [
        { label: 'OS', value: 'ctOS v2.1' },
        { label: 'Host', value: 'digital_shadow@dedsec_network' },
        { label: 'Kernel', value: '5.4.0-ctos-generic' },
        { label: 'Uptime', value: uptime },
        { label: 'Shell', value: 'zsh (dedsec_edition)' },
        { label: 'Resolution', value: 'Dynamic' },
        { label: 'Terminal', value: 'ctOS_Terminal' },
        { label: 'CPU', value: 'Quantum Entanglement Processor @ 4.20GHz' },
        { label: 'GPU', value: 'Neuro-Link Visual Synthesizer' },
        { label: 'Memory', value: '42.0GiB / 133.7GiB' },
    ];

    return (
        <div className="font-mono text-xs flex gap-4">
            <pre className="text-primary text-[8px] leading-[7px] self-center">
                {dedsecAscii}
            </pre>
            <div className="flex-grow">
                <div className="text-accent font-bold">digital_shadow@dedsec_network</div>
                <div className="border-t border-dashed border-primary/30 my-1"></div>
                {stats.map(stat => (
                    <div key={stat.label} className="flex">
                        <span className="w-24 text-primary font-bold">{stat.label}</span>
                        <span className="text-foreground">{stat.value}</span>
                    </div>
                ))}
                 <div className="flex mt-2 gap-1">
                    <div className="w-3 h-3 bg-black border border-muted-foreground"></div>
                    <div className="w-3 h-3 bg-red-600"></div>
                    <div className="w-3 h-3 bg-green-500"></div>
                    <div className="w-3 h-3 bg-yellow-400"></div>
                    <div className="w-3 h-3 bg-blue-600"></div>
                    <div className="w-3 h-3 bg-purple-500"></div>
                    <div className="w-3 h-3 bg-cyan-400"></div>
                    <div className="w-3 h-3 bg-white"></div>
                </div>
            </div>
        </div>
    );
};

export default SystemInfo;
