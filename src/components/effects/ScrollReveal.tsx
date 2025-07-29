'use client';

import { useRef, useEffect, useState, ReactNode, memo, CSSProperties } from 'react';
import { motion, Transition, cubicBezier } from 'framer-motion';

type ScrollRevealProps = {
  children: ReactNode;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  once?: boolean;
  className?: string;
};

// Usando memo para evitar re-renderizações desnecessárias
const ScrollReveal = memo(function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 0.6,
  once = true,
  className = '',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Desconectar o observer anterior se existir
    if (observerRef.current && ref.current) {
      observerRef.current.unobserve(ref.current);
    }
    
    // Criar um novo observer com opções otimizadas
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current && observerRef.current) {
            observerRef.current.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        // Adicionar rootMargin para carregar um pouco antes de entrar na viewport
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, once]);

  // Configurações de animação baseadas na direção
  const getAnimationProps = () => {
    let initial = {};
    
    switch (direction) {
      case 'up':
        initial = { y: distance, opacity: 0 };
        break;
      case 'down':
        initial = { y: -distance, opacity: 0 };
        break;
      case 'left':
        initial = { x: distance, opacity: 0 };
        break;
      case 'right':
        initial = { x: -distance, opacity: 0 };
        break;
      case 'none':
        initial = { opacity: 0 };
        break;
    }

    // Definir a transição com tipos corretos
    const transition: Transition = {
      duration,
      delay,
      ease: cubicBezier(0.25, 0.1, 0.25, 1)
    };
    
    return {
      initial,
      animate: isVisible 
        ? { y: 0, x: 0, opacity: 1 } 
        : initial,
      transition
    };
  };

  // Estilo separado para evitar problemas de tipagem
  const customStyle: CSSProperties = {
    willChange: isVisible ? 'opacity, transform' : 'auto',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={customStyle}
      {...getAnimationProps()}
    >
      {children}
    </motion.div>
  );
});

export default ScrollReveal; 