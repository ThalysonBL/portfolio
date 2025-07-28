'use client';

import { useRef, useEffect, useState, memo } from 'react';

// Reduzindo a quantidade de snippets para melhor performance
const codeSnippets = [
  `function helloWorld() {\n  console.log("Hello, world!");\n}`,
  `const add = (a, b) => a + b;`,
  `for (let i = 0; i < 10; i++) {\n  console.log(i);\n}`,
  `async function fetchData() {\n  const res = await fetch('/api');\n  return await res.json();\n}`,
  `class Developer {\n  constructor(name) {\n    this.name = name;\n  }\n}`,
  `if (user.isAdmin) {\n  showPanel();\n}`,
  `useEffect(() => {\n  loadData();\n}, []);`
];

const CodeWorldBackground = memo(function CodeWorldBackground() {
  const rotate = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const lastTimeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const devicePerformanceRef = useRef<'low' | 'medium' | 'high'>('medium');

  // Verificar visibilidade da página e detectar performance do dispositivo
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    // Verificar se o elemento está visível na viewport
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    // Detectar performance do dispositivo
    const start = performance.now();
    let iterations = 0;
    
    // Teste rápido de performance
    while (performance.now() - start < 5 && iterations < 1000) {
      iterations++;
      Math.sqrt(Math.random() * 1000);
    }
    
    // Ajustar configurações com base na performance
    if (iterations < 200) {
      // Dispositivo de baixa performance
      devicePerformanceRef.current = 'low';
    } else if (iterations < 500) {
      // Dispositivo de média performance
      devicePerformanceRef.current = 'medium';
    } else {
      // Dispositivo de alta performance
      devicePerformanceRef.current = 'high';
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Animação otimizada com requestAnimationFrame e throttling
  useEffect(() => {
    const animate = (timestamp: number) => {
      // Não animar se não estiver visível ou fora da viewport
      if (!isVisibleRef.current || !isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Throttle para limitar a taxa de frames com base na performance do dispositivo
      const frameDelay = devicePerformanceRef.current === 'low' ? 50 : // ~20fps
                        devicePerformanceRef.current === 'medium' ? 33.33 : // ~30fps
                        16.67; // ~60fps para dispositivos de alta performance

      if (timestamp - lastTimeRef.current < frameDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTimeRef.current = timestamp;
      
      // Ajustar a velocidade de rotação com base na performance
      const rotationSpeed = devicePerformanceRef.current === 'low' ? 0.01 : 
                           devicePerformanceRef.current === 'medium' ? 0.02 : 
                           0.03;
      
      rotate.current += rotationSpeed;
      
      if (divRef.current) {
        divRef.current.style.transform = `rotateY(${rotate.current}deg)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  // Determinar o número de snippets a renderizar com base na performance
  const snippetsToRender = devicePerformanceRef.current === 'low' ? codeSnippets.slice(0, 4) :
                          devicePerformanceRef.current === 'medium' ? codeSnippets.slice(0, 6) :
                          codeSnippets;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden -z-10">
      <div className="w-full h-full flex items-end justify-center pb-[2vh] perspective-[1200px]">
        <div
          className="relative w-[400px] h-[400px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            ref={divRef}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {snippetsToRender.map((code, i) => {
              const angle = (i / snippetsToRender.length) * 360;
              const radius = devicePerformanceRef.current === 'low' ? 600 : 700;

              return (
                <pre
                  key={i}
                  className="absolute text-[#00ffff] text-sm sm:text-base font-mono opacity-25"
                  style={{
                    transform: `
                      rotateY(${angle}deg)
                      translateZ(${radius}px)
                    `,
                    whiteSpace: 'pre-wrap',
                    textShadow: devicePerformanceRef.current === 'low' ? '0 0 10px #00ffff' : '0 0 10px #00ffff, 0 0 20px #00ffff',
                    willChange: 'transform',
                  }}
                >
                  {code}
                </pre>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CodeWorldBackground;
