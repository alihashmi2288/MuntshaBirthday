import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  animationDelay?: number;
}

export default function FloatingElement({ 
  children, 
  className = '', 
  animationDelay = 0 
}: FloatingElementProps) {
  return (
    <div 
      className={`animate-float hover-elevate ${className}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {children}
    </div>
  );
}