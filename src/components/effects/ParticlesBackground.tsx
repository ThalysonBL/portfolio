'use client';

import { useCallback, useEffect, useRef, memo } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
};

type ParticlesBackgroundProps = {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  linked?: boolean;
  linkDistance?: number;
  linkOpacity?: number;
  className?: string;
};

// Usando memo para evitar re-renderizações desnecessárias
const ParticlesBackground = memo(function ParticlesBackground({
  count = 25, // Valor otimizado para dispositivos antigos
  color = 'var(--primary)',
  minSize = 1,
  maxSize = 2,
  speed = 0.25, // Velocidade reduzida para melhor performance
  linked = true,
  linkDistance = 120, // Distância reduzida para menos cálculos
  linkOpacity = 0.1,
  className = '',
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 }); // Raio reduzido
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const devicePerformanceRef = useRef<'low' | 'medium' | 'high'>('medium');

  // Inicializar partículas com detecção de performance
  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Detectar performance do dispositivo
    const start = performance.now();
    let iterations = 0;
    
    // Teste rápido de performance
    while (performance.now() - start < 5 && iterations < 1000) {
      iterations++;
      Math.sqrt(Math.random() * 1000);
    }
    
    // Ajustar configurações com base na performance
    let adjustedCount = count;
    let adjustedLinkDistance = linkDistance;
    
    if (iterations < 200) {
      // Dispositivo de baixa performance
      devicePerformanceRef.current = 'low';
      adjustedCount = Math.floor(count * 0.5); // 50% menos partículas
      adjustedLinkDistance = linkDistance * 0.7; // 30% menos distância de conexão
    } else if (iterations < 500) {
      // Dispositivo de média performance
      devicePerformanceRef.current = 'medium';
      adjustedCount = Math.floor(count * 0.8); // 20% menos partículas
    } else {
      // Dispositivo de alta performance
      devicePerformanceRef.current = 'high';
    }
    
    // Garantir um mínimo de partículas
    adjustedCount = Math.max(10, adjustedCount);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    particlesRef.current = [];
    
    for (let i = 0; i < adjustedCount; i++) {
      const size = Math.random() * (maxSize - minSize) + minSize;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = (Math.random() - 0.5) * speed;
      const speedY = (Math.random() - 0.5) * speed;
      const opacity = Math.random() * 0.5 + 0.3;
      
      particlesRef.current.push({
        x,
        y,
        size,
        speedX,
        speedY,
        color,
        opacity,
      });
    }
  }, [count, color, minSize, maxSize, speed, linkDistance]);

  // Animar partículas com throttling para melhorar performance
  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current || !isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Throttle para limitar a taxa de frames com base na performance do dispositivo
    const frameDelay = devicePerformanceRef.current === 'low' ? 33.33 : // ~30fps
                      devicePerformanceRef.current === 'medium' ? 25 : // ~40fps
                      16.67; // ~60fps para dispositivos de alta performance
    
    if (timestamp - lastTimeRef.current < frameDelay) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastTimeRef.current = timestamp;
    frameCountRef.current++;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar e desenhar cada partícula
    particlesRef.current.forEach((particle, index) => {
      // Atualizar posição
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Verificar limites da tela
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY = -particle.speedY;
      }
      
      // Interação com o mouse - apenas a cada 3 frames para melhorar performance
      if (frameCountRef.current % 3 === 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          
          particle.x -= forceDirectionX * force * speed * 2;
          particle.y -= forceDirectionY * force * speed * 2;
        }
      }
      
      // Desenhar partícula
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      // Desenhar linhas entre partículas próximas - apenas a cada 2 frames e com otimização
      // Pular desenho de linhas em dispositivos de baixa performance a cada 2 frames
      if (linked && (devicePerformanceRef.current !== 'low' || frameCountRef.current % 2 === 0)) {
        // Limitar o número de conexões para melhorar performance
        const maxConnections = devicePerformanceRef.current === 'low' ? 1 : 
                              devicePerformanceRef.current === 'medium' ? 2 : 3;
        let connections = 0;
        
        // Verificar apenas partículas próximas (otimização)
        const checkRange = Math.min(particlesRef.current.length, index + 10);
        
        for (let j = index + 1; j < checkRange && connections < maxConnections; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          // Otimização: usar distância ao quadrado para evitar cálculo de raiz quadrada
          const distanceSquared = dx * dx + dy * dy;
          const linkDistanceSquared = linkDistance * linkDistance;
          
          if (distanceSquared < linkDistanceSquared) {
            connections++;
            const distance = Math.sqrt(distanceSquared); // Agora calculamos a raiz apenas quando necessário
            const opacity = (1 - distance / linkDistance) * linkOpacity;
            ctx.beginPath();
            ctx.strokeStyle = `${particle.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }
      }
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [color, linked, linkDistance, linkOpacity, speed]);

  // Manipular eventos de redimensionamento com debounce
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    
    initParticles();
  }, [initParticles]);

  // Manipular movimento do mouse com throttle
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  // Verificar visibilidade da página para pausar animação quando não estiver visível
  const handleVisibilityChange = useCallback(() => {
    isVisibleRef.current = document.visibilityState === 'visible';
  }, []);

  useEffect(() => {
    initParticles();
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    // Usar ResizeObserver em vez de evento de resize para melhor performance
    const resizeObserver = new ResizeObserver(handleResize);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }
    
    // Throttle para o evento de mousemove - mais agressivo em dispositivos de baixa performance
    let throttleTimeout: ReturnType<typeof setTimeout> | null = null;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleMouseMove(e);
          throttleTimeout = null;
        }, devicePerformanceRef.current === 'low' ? 50 : 25); // Throttle mais agressivo em dispositivos de baixa performance
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current);
      }
      window.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate, handleResize, handleMouseMove, handleVisibilityChange]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
});

export default ParticlesBackground; 