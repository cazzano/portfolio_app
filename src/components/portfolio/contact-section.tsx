'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const protocols = [
  {
    name: 'GitHub',
    description: 'SYN/ACK with project repositories',
    icon: <Github className="w-8 h-8 text-primary" />,
    url: 'https://github.com',
  },
  {
    name: 'LinkedIn',
    description: 'Establish professional connection',
    icon: <Linkedin className="w-8 h-8 text-primary" />,
    url: 'https://linkedin.com',
  },
  {
    name: 'Email',
    description: 'Transmit encrypted message',
    icon: <Mail className="w-8 h-8 text-primary" />,
    url: 'mailto:user@example.com',
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

const ContactSection: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary text-3xl font-bold flex items-center gap-2">
              <Send className="w-8 h-8 text-primary" />
              <span className="glitch" data-text="CONTACT_PROTOCOLS">
                CONTACT_PROTOCOLS
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-8">
              // Initiate contact through one of the secure channels below.
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {protocols.map((protocol) => (
                <motion.a
                  key={protocol.name}
                  href={protocol.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className="block"
                >
                  <div className="h-full p-6 bg-secondary/30 rounded-lg border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-3">
                      {protocol.icon}
                      <h3 className="text-xl font-bold text-primary group-hover:text-glow">
                        {protocol.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {protocol.description}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContactSection;
