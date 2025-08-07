'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Server, Cog } from 'lucide-react';

const skillCategories = [
  {
    name: 'Frontend Exploits',
    icon: <Code className="w-6 h-6 text-primary" />,
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'TailwindCSS', level: 98 },
      { name: 'Framer Motion', level: 85 },
    ],
  },
  {
    name: 'Backend Infiltration',
    icon: <Server className="w-6 h-6 text-primary" />,
    skills: [
      { name: 'Node.js / Express', level: 92 },
      { name: 'Python / Django', level: 80 },
      { name: 'REST & GraphQL APIs', level: 88 },
      { name: 'Authentication', level: 90 },
    ],
  },
  {
    name: 'Database Manipulation',
    icon: <Database className="w-6 h-6 text-primary" />,
    skills: [
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'Firebase', level: 95 },
      { name: 'Redis', level: 75 },
    ],
  },
   {
    name: 'System Operations',
    icon: <Cog className="w-6 h-6 text-primary" />,
    skills: [
      { name: 'Docker', level: 80 },
      { name: 'CI/CD Pipelines', level: 85 },
      { name: 'Git & Version Control', level: 98 },
      { name: 'Cloud Services (GCP/AWS)', level: 78 },
    ],
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
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
    },
  },
};

const SignalBar: React.FC<{ level: number }> = ({ level }) => {
  const segments = 10;
  return (
    <div className="flex w-full h-4 gap-1 items-center">
      {Array.from({ length: segments }).map((_, i) => {
        const segmentLevel = (i + 1) * (100 / segments);
        const isActive = level >= segmentLevel;
        return (
          <motion.div
            key={i}
            className={`w-full h-full rounded-sm transition-colors ${isActive ? 'bg-primary' : 'bg-primary/20'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          />
        );
      })}
    </div>
  );
};


const SkillsSection: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-5xl"
        >
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-primary/30 max-h-[90vh] overflow-y-auto">
          <CardHeader className="sticky top-0 bg-black/50 backdrop-blur-sm z-10">
            <CardTitle className="text-primary text-3xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.4l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.4l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span className="glitch" data-text="SYSTEM_PROFICIENCY">
                SYSTEM_PROFICIENCY
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-8">
              // Core competencies and exploited system vulnerabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skillCategories.map((category) => (
                <motion.div key={category.name} variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h3 className="text-xl font-bold text-primary">{category.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {category.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1 text-sm font-mono">
                          <span className="text-muted-foreground">{skill.name}</span>
                          <span className="text-accent">{skill.level}%</span>
                        </div>
                        <SignalBar level={skill.level} />
                      </div>
                    ))}
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

export default SkillsSection;
