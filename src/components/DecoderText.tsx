"use client";
import { useEffect, useRef, useState, memo } from "react";

// Memoizando as letras para evitar recriação
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface DecoderTextProps {
    text: string;
    speed?: number;
    repeatInterval?: number;
    delayAfterComplete?: number;
}

const DecoderText = memo(function DecoderText({ 
    text, 
    speed = 80, 
    repeatInterval = 6000,
    delayAfterComplete = 6000 
}: DecoderTextProps) {
    // Iniciar com texto vazio
    const [displayedText, setDisplayedText] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);
    const [effectStarted, setEffectStarted] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasRunInitialEffect = useRef<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);
    const finalTextRef = useRef(text);

    // Função para executar o efeito de decodificação - otimizada
    const runDecodingEffect = () => {
        let iteration = 0;
        const finalText = finalTextRef.current;
        
        // Limpar qualquer intervalo anterior
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Criar novo intervalo para o efeito
        const interval = setInterval(() => {
            // Otimização: Criar o array apenas uma vez e modificá-lo
            const result = new Array(finalText.length);
            
            for (let i = 0; i < finalText.length; i++) {
                if (i < Math.floor(iteration)) {
                    result[i] = finalText[i];
                } else {
                    // Otimização: Usar índice pré-calculado para letras aleatórias
                    const randomIndex = Math.floor(Math.random() * letters.length);
                    result[i] = letters[randomIndex];
                }
            }
            
            setDisplayedText(result.join(""));
            
            if (iteration >= finalText.length) {
                clearInterval(interval);
                intervalRef.current = null;
                
                // Aguardar o delayAfterComplete antes de permitir que o efeito seja executado novamente
                const timeout = setTimeout(() => {
                    setEffectStarted(false);
                }, delayAfterComplete);
                
                // Limpar o timeout se o componente for desmontado
                return () => clearTimeout(timeout);
            }
            
            iteration += 1/3; // Velocidade ajustada para melhor visualização
        }, speed);
        
        intervalRef.current = interval;
    };

    // Iniciar o efeito imediatamente após a montagem
    useEffect(() => {
        // Atualizar a ref do texto quando o texto mudar
        finalTextRef.current = text;
        
        // Garantir que o texto comece vazio
        setDisplayedText("");
        
        // Iniciar o efeito após um pequeno atraso
        const startTimeout = setTimeout(() => {
            setIsVisible(true);
            setEffectStarted(true);
            runDecodingEffect();
        }, 500);
        
        return () => {
            clearTimeout(startTimeout);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (repeatTimerRef.current) {
                clearInterval(repeatTimerRef.current);
            }
        };
    }, [text]);

    // Configurar repetição do efeito se necessário
    useEffect(() => {
        if (repeatInterval > 0) {
            repeatTimerRef.current = setInterval(() => {
                if (!effectStarted && isVisible) {
                    setEffectStarted(true);
                    runDecodingEffect();
                }
            }, repeatInterval);
            
            return () => {
                if (repeatTimerRef.current) {
                    clearInterval(repeatTimerRef.current);
                }
            };
        }
    }, [isVisible, effectStarted, repeatInterval]);

    // Garantir que o texto final seja exibido mesmo se o efeito falhar
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            if (!displayedText || displayedText !== text) {
                setDisplayedText(text);
            }
        }, 3000);
        
        return () => clearTimeout(fallbackTimer);
    }, [displayedText, text]);

    return (
        <span 
            ref={elementRef} 
            className="decoder-box"
            style={{ willChange: effectStarted ? 'contents' : 'auto' }}
        >
            {displayedText || text} {/* Usar o texto original como fallback */}
        </span>
    );
});

export default DecoderText;
