import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-cyan-500/30 border-t-cyan-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Chargement..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center atomic-fade-in">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-400 text-lg">{message}</p>
        <div className="mt-2 text-cyan-400 text-sm">ATOMIC FLIX</div>
      </div>
    </div>
  );
}

interface SectionLoadingProps {
  message?: string;
  className?: string;
}

export function SectionLoading({ message = "Chargement...", className = '' }: SectionLoadingProps) {
  return (
    <div className={`flex items-center justify-center p-8 atomic-fade-in ${className}`}>
      <div className="text-center">
        <LoadingSpinner className="mb-3" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}