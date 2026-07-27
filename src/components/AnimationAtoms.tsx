'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from './TransitionProvider';
import { usePathname } from 'next/navigation';

// ==========================================
// 1. AnimatedButton
// ==========================================
interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onAnimationStart'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  glow?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className = '', variant = 'primary', glow = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold font-outfit uppercase tracking-wider text-xs py-2.5 px-5 rounded-xl transition-all duration-150 outline-none cursor-pointer select-none';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground shadow-premium-sm border border-primary/10 hover:bg-primary/95',
      secondary: 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/80',
      outline: 'bg-transparent border border-border text-foreground hover:bg-secondary/40',
      ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-secondary/30',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1, scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={`${baseStyles} ${variants[variant]} ${glow ? 'premium-hover-border' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton';


// ==========================================
// 2. AnimatedCard
// ==========================================
interface AnimatedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onAnimationStart'> {
  children: React.ReactNode;
  glow?: boolean;
}

export function AnimatedCard({ children, className = '', glow = true, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={`rounded-2xl border border-border bg-card p-6 shadow-premium-sm ${
        glow ? 'premium-hover-border' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}


// ==========================================
// 3. AnimatedNavLink (Intercepts standard links)
// ==========================================
interface AnimatedNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  showLoader?: boolean;
}

export function AnimatedNavLink({ href, children, className = '', showLoader = false, ...props }: AnimatedNavLinkProps) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href, showLoader);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`nav-link-underline cursor-pointer select-none relative transition-colors duration-200 ${
        isActive ? 'text-primary font-extrabold' : 'text-muted hover:text-foreground font-semibold'
      } ${className}`}
      {...props}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeNavDot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  );
}


// ==========================================
// 4. ScrollReveal (Staggered or simple sections entry)
// ==========================================
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  stagger?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  stagger = false,
}: ScrollRevealProps) {
  const getInitialY = () => {
    if (direction === 'up') return 20;
    if (direction === 'down') return -20;
    return 0;
  };

  const getInitialX = () => {
    if (direction === 'left') return 20;
    if (direction === 'right') return -20;
    return 0;
  };

  const variants = {
    hidden: {
      opacity: 0,
      y: getInitialY(),
      x: getInitialX(),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom premium ease-out
        delay,
        when: stagger ? 'beforeChildren' : undefined,
        staggerChildren: stagger ? 0.08 : undefined,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}


// ==========================================
// 5. TextReveal (Character stagger reveal)
// ==========================================
interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className = '' }: TextRevealProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const words = text.split(' ');

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`inline-block ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={charVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {/* Add spacing between words */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
}


// ==========================================
// 6. PageEntranceWrapper
// ==========================================
export function PageEntranceWrapper({ children }: { children: React.ReactNode }) {
  const { state, shouldReduceMotion } = usePageTransition();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: state === 'exiting' ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    );
  }

  // Smooth entrance: opacity + slide up + blur filter clear
  // Smooth exit: opacity + slide up + blur filter blur
  const variants = {
    idle: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exiting: {
      opacity: 0,
      y: -12,
      filter: 'blur(4px)',
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
    },
    loading: {
      opacity: 0,
      y: 12,
      filter: 'blur(4px)',
    },
    entering: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      initial="loading"
      animate={state}
      variants={variants}
      className="w-full"
      style={{ transform: state === 'idle' ? 'none' : undefined }}
    >
      {children}
    </motion.div>
  );
}
