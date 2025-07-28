"use client"

import { useEffect, useState } from 'react';
import styles from '@/styles/loadingScreen.module.css';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [bracketsOpen, setBracketsOpen] = useState(false);
  const [bracketsFullyOpen, setBracketsFullyOpen] = useState(false);
  const [bracketsClosing, setBracketsClosing] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [textAppearing, setTextAppearing] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  useEffect(() => {
    // Iniciar abertura dos colchetes
    setTimeout(() => {
      setBracketsOpen(true);
      setTextAppearing(true);
    }, 500);
    
    // Quando os colchetes estiverem totalmente abertos
    setTimeout(() => {
      setBracketsFullyOpen(true);
      setShowLoadingText(true);
      
      // Iniciar progresso
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            // Só mostrar "COMPLETED" após a barra chegar a 100%
            setTimeout(() => {
              setLoadingComplete(true);

              setShowCompleted(true);
            }, 300);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 30);
      
      // Limpar interval quando componente for desmontado
      return () => clearInterval(progressInterval);
    }, 1500); // Tempo para os colchetes abrirem completamente
    
  }, []);

  // Quando o progresso chegar a 100% e mostrar "COMPLETED"
  useEffect(() => {
    if (showCompleted) {
      // Aguardar um pouco antes de fechar os colchetes
      setTimeout(() => {
        setShowLoadingText(false);
        setTextAppearing(false);
        setBracketsClosing(true);
      }, 1000);

      // Aguardar a animação de fechamento antes de esconder o loading
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
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
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 