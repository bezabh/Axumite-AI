import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GoldCheckAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

export const GoldCheckAnimation: React.FC<GoldCheckAnimationProps> = ({
  size = 'md',
  title,
  subtitle,
  className = '',
  onAnimationComplete,
}) => {
  const sizeMap = {
    sm: {
      wrapper: 'w-7 h-7',
      svg: 22,
      stroke: 2.5,
      glow: 'shadow-[0_0_12px_rgba(197,160,89,0.35)]',
      titleSize: 'text-xs',
      subSize: 'text-[10px]',
    },
    md: {
      wrapper: 'w-10 h-10',
      svg: 32,
      stroke: 2.8,
      glow: 'shadow-[0_0_20px_rgba(197,160,89,0.45)]',
      titleSize: 'text-sm',
      subSize: 'text-xs',
    },
    lg: {
      wrapper: 'w-14 h-14',
      svg: 44,
      stroke: 3.2,
      glow: 'shadow-[0_0_30px_rgba(197,160,89,0.55)]',
      titleSize: 'text-base',
      subSize: 'text-xs',
    },
  };

  const config = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onAnimationComplete={onAnimationComplete}
      className={`flex items-center space-x-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#1E180C]/90 via-[#2A2110]/95 to-[#161208]/90 border border-[#C5A059]/60 backdrop-blur-md ${config.glow} ${className}`}
    >
      {/* Outer Glow Pulse Container */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient Gold Halo Wave */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.9, 1.35, 1.1], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-[#C5A059]/30 blur-sm pointer-events-none"
        />

        {/* Outer Circular Medallion */}
        <motion.div
          initial={{ rotate: -45, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={`${config.wrapper} rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#C5A059] to-[#8E6D28] p-[1.5px] shadow-lg flex items-center justify-center`}
        >
          <div className="w-full h-full rounded-full bg-[#120E07] flex items-center justify-center relative overflow-hidden">
            {/* Inner Gold Shimmer Gradient */}
            <div className="absolute inset-0 bg-radial from-[#C5A059]/25 via-transparent to-transparent pointer-events-none" />

            {/* SVG Animated Gold Checkmark */}
            <svg
              width={config.svg}
              height={config.svg}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              {/* Circular Gold Path Outline */}
              <motion.circle
                cx="20"
                cy="20"
                r="16"
                stroke="url(#goldGradientCircle)"
                strokeWidth={config.stroke - 0.8}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              />

              {/* Dynamic Checkmark Path */}
              <motion.path
                d="M12 20.5L17.5 26L28.5 14.5"
                stroke="url(#goldGradientCheck)"
                strokeWidth={config.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.4, ease: 'easeOut' }}
              />

              <defs>
                <linearGradient id="goldGradientCircle" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F3E5AB" />
                  <stop offset="0.5" stopColor="#C5A059" />
                  <stop offset="1" stopColor="#8E6D28" />
                </linearGradient>
                <linearGradient id="goldGradientCheck" x1="12" y1="14" x2="28" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF9DF" />
                  <stop offset="0.4" stopColor="#F3E5AB" />
                  <stop offset="1" stopColor="#C5A059" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Text Info */}
      {(title || subtitle) && (
        <div className="flex-1 min-w-0">
          {title && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className={`font-bold font-serif text-[#F3E5AB] flex items-center space-x-1.5 ${config.titleSize}`}
            >
              <span>{title}</span>
              <Sparkles className="w-3 h-3 text-[#E1C47D] animate-pulse shrink-0" />
            </motion.div>
          )}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className={`text-[#D8C7A0] font-sans font-medium mt-0.5 leading-tight ${config.subSize}`}
            >
              {subtitle}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};
