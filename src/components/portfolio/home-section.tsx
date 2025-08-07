'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Terminal } from 'lucide-react';

const profileData = [
  { label: 'ALIAS', value: 'Digital Shadow' },
  { label: 'CLASS', value: 'Full-Stack Developer' },
  { label: 'STATUS', value: 'ACTIVE' },
  { label: 'LOCATION', value: '██████, ██' },
];

const HomeSection: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary text-3xl font-bold flex items-center gap-2">
              <User className="w-8 h-8 text-primary" />
              <span className="glitch" data-text="OPERATIVE_PROFILE">
                OPERATIVE_PROFILE
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 hex-clip border-2 border-primary mb-4">
                <Image
                  src="https://placehold.co/200x200.png"
                  alt="Operative"
                  layout="fill"
                  objectFit="cover"
                  className="hex-clip"
                  data-ai-hint="hacker portrait"
                />
                 <div className="absolute inset-0 bg-primary/20 mix-blend-hard-light hex-clip"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-glow">Digital Shadow</h3>
                <p className="text-accent">Master of the Digital Realm</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-4 mb-6">
                {profileData.map((item) => (
                  <div key={item.label} className="flex border-b border-dashed border-primary/20 pb-2">
                    <p className="w-1/3 text-muted-foreground font-semibold">{item.label}:</p>
                    <p className="w-2/3 text-primary font-mono">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2">
                    <Terminal size={20}/>
                    <span>Personal Dossier</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  A passionate developer with a knack for infiltrating complex systems and building robust digital solutions. Specializing in crafting immersive web experiences from the ground up, I thrive on turning complex problems into elegant, efficient code. My mission is to push the boundaries of technology, one line of code at a time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomeSection;
