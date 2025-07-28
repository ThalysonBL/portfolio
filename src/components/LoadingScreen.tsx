"use client"

import { useEffect, useState, useRef, memo } from 'react';
import styles from '@/styles/loadingScreen.module.css';

const LoadingScreen = memo(function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [bracketsOpen, setBracketsOpen] = useState(false);
  const [bracketsFullyOpen, setBracketsFullyOpen] = useState(false);
  const [bracketsClosing, setBracketsClosing] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [textAppearing, setTextAppearing] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  // Usar refs para os timers para evitar vazamentos de memória
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  // Função para limpar todos os timers
  const clearAllTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };
  
  useEffect(() => {
    // Iniciar abertura dos colchetes
    const timeout1 = setTimeout(() => {
      setBracketsOpen(true);
      setTextAppearing(true);
    }, 500);
    timeoutsRef.current.push(timeout1);
    
    // Quando os colchetes estiverem totalmente abertos
    const timeout2 = setTimeout(() => {
      setBracketsFullyOpen(true);
      setShowLoadingText(true);
      
      // Iniciar progresso - usando requestAnimationFrame para melhor performance
      let lastTime = performance.now();
      let progress = 0;
      
      const animate = (time: number) => {
        // Limitar a taxa de atualização para ~30fps para este tipo de animação
        if (time - lastTime > 33) {
          lastTime = time;
          progress += 1;
          
          if (progress >= 100) {
            // Só mostrar "COMPLETED" após a barra chegar a 100%
            setProgress(100);
            const timeout = setTimeout(() => {
              setLoadingComplete(true);
              setShowCompleted(true);
            }, 300);
            timeoutsRef.current.push(timeout);
            return;
          }
          
          setProgress(progress);
        }
        
        if (progress < 100) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, 1500); // Tempo para os colchetes abrirem completamente
    timeoutsRef.current.push(timeout2);
    
    // Limpar todos os timers quando o componente for desmontado
    return clearAllTimers;
  }, []);

  // Quando o progresso chegar a 100% e mostrar "COMPLETED"
  useEffect(() => {
    if (showCompleted) {
      // Aguardar um pouco antes de fechar os colchetes
      const timeout1 = setTimeout(() => {
        setShowLoadingText(false);
        setTextAppearing(false);
        setBracketsClosing(true);
      }, 1000);
      timeoutsRef.current.push(timeout1);

      // Aguardar a animação de fechamento antes de esconder o loading
      const timeout2 = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      timeoutsRef.current.push(timeout2);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [showCompleted]);

  // Se não estiver mais carregando, não renderizar o componente
  if (!isLoading) return null;

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <div className={styles.accessingContainer}>
          <div className={styles.bracketContainer}>
            <span className={`${styles.bracket} ${styles.leftBracket} ${bracketsOpen ? styles.open : ''} ${bracketsClosing ? styles.close : ''}`}>[</span>
            <span className={`${styles.accessingText} ${textAppearing ? styles.visible : ''} ${!textAppearing ? styles.hidden : ''}`}>
              Acessando
            </span>
            <span className={`${styles.bracket} ${styles.rightBracket} ${bracketsOpen ? styles.open : ''} ${bracketsClosing ? styles.close : ''}`}>]</span>
          </div>
        </div>

        {bracketsFullyOpen && (
          <div className={`${styles.loadingContainer} ${showLoadingText ? styles.visible : styles.hidden}`}>
            <div className={styles.progressBarContainer}>
              <div className={styles.loadingText}>
                {!loadingComplete ? 'LOADING...' : 'COMPLETED'}
              </div>
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: `${progress}%`,
                  willChange: 'width',
                  transform: 'translateZ(0)'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default LoadingScreen; 