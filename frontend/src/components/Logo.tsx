import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ variant = 'full', size = 'md', className = '' }: LogoProps) => {
  const sizes = {
    sm: {
      icon: 'h-5 w-5',
      text: 'text-lg',
      spacing: 'gap-1.5'
    },
    md: {
      icon: 'h-7 w-7',
      text: 'text-xl',
      spacing: 'gap-2'
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-3xl',
      spacing: 'gap-3'
    }
  };

  if (variant === 'icon') {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur-md opacity-70" />
        <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg">
          <Zap className={`${sizes[size].icon} text-white fill-white/30`} />
        </div>
      </motion.div>
    );
  }

  if (variant === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`font-display font-bold tracking-tight ${className}`}
      >
        <span className="text-foreground">TECH</span>
        <span className="text-primary">SPARK</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center ${sizes[size].spacing} ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur-sm opacity-70" />
        <div className="relative bg-gradient-to-br from-primary to-primary/80 p-1.5 rounded-lg">
          <Zap className={`${sizes[size].icon} text-white fill-white/30`} />
        </div>
      </motion.div>
      <div className={`font-display font-bold tracking-tight ${sizes[size].text}`}>
        <span className="text-foreground">TECH</span>
        <span className="text-primary">SPARK</span>
      </div>
    </motion.div>
  );
};

export default Logo;