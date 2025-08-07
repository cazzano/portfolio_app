'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Eye, Github } from 'lucide-react';

const projects = [
  {
    title: 'Project Cypher',
    description: 'A decentralized communication platform using end-to-end encryption. Bypassed conventional data harvesting methods.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'abstract data',
    tags: ['React', 'Node.js', 'WebSockets', 'Cryptography'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Neuro-Grid',
    description: 'Data visualization tool for complex network analysis. Successfully mapped and exposed vulnerabilities in a simulated corporate network.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'network visualization',
    tags: ['D3.js', 'Next.js', 'GraphQL', 'Data Analysis'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Ghost Protocol',
    description: 'A stealth-focused state management library for React. Ensures untraceable state transitions and component interactions.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'code screen',
    tags: ['React', 'TypeScript', 'State Management', 'NPM'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const ProjectsSection: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl"
      >
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-primary/30 max-h-[90vh] overflow-y-auto">
          <CardHeader className="sticky top-0 bg-black/50 backdrop-blur-sm z-10">
            <CardTitle className="text-primary text-3xl font-bold flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-primary" />
              <span className="glitch" data-text="INFILTRATION_RECORDS">
                INFILTRATION_RECORDS
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="bg-secondary/30 rounded-lg border border-primary/20 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:border-primary">
                    <div className="relative overflow-hidden">
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={600}
                            height={400}
                            data-ai-hint={project.aiHint}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-screen group-hover:bg-primary/10 transition-all duration-300"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-glow">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-mono">{tag}</span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-auto pt-4 border-t border-primary/20">
                        <Button variant="outline" size="sm" asChild>
                           <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><Eye size={16}/> Live Demo</a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16}/> Source Code</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectsSection;
