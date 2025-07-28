"use client";
import { useEffect, useRef, useState } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface DecoderTextProps {
    text: string;
    speed?: number;
    repeatInterval?: number;
    delayAfterComplete?: number;
}

export default function DecoderText({ 
    text, 
    speed = 80, 
    repeatInterval = 30000,
    delayAfterComplete = 10000 
}: DecoderTextProps) {
    // Iniciar com texto vazio
    const [displayedText, setDisplayedText] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);
    const [effectStarted, setEffectStarted] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasRunInitialEffect = useRef<boolean>(false);

    // Função para executar o efeito de decodificação
    const runDecodingEffect = () => {
        let iteration = 0;
        const finalText = text;
        
        // Limpar qualquer intervalo anterior
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Criar novo intervalo para o efeito
        const interval = setInterval(() => {
            setDisplayedText(
                finalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return finalText[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("")
            );
            
            if (iteration >= finalText.length) {
                clearInterval(interval);
                
                // Aguardar o delayAfterComplete antes de permitir que o efeito seja executado novamente
                setTimeout(() => {
                    setEffectStarted(false);
                }, delayAfterComplete);
                
                return;
            }
            
            iteration += 1/5; // Mais lento: 1/5 em vez de 1/3
        }, speed);
        
        intervalRef.current = interval;
    };

    // Detectar quando o elemento estiver visível na tela e o componente for montado
    useEffect(() => {
        // Garantir que o texto comece vazio
        setDisplayedText("");
        
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasRunInitialEffect.current) {
                    setIsVisible(true);
                    // Marcar que o efeito inicial foi executado
                    hasRunInitialEffect.current = true;
                } else if (!entry.isIntersecting) {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px 0px 0px" }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) observer.unobserve(elementRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Executar o efeito quando o elemento se tornar visível
    useEffect(() => {
        if (isVisible && !effectStarted) {
            // Marcar que o efeito começou
            setEffectStarted(true);
            
            // Pequeno atraso para garantir que o efeito comece após a página estar visível
            setTimeout(() => {
                runDecodingEffect();
            }, 800);
            
            // Configurar repetição do efeito com intervalo muito maior
            const repeatTimer = setInterval(() => {
                if (!effectStarted) {
                    setEffectStarted(true);
                    runDecodingEffect();
                }
            }, repeatInterval);
            
            return () => clearInterval(repeatTimer);
        }
    }, [isVisible, effectStarted, text, speed, repeatInterval]);

    return (
        <span ref={elementRef} className="decoder-box">
            {displayedText || "\u00A0"} {/* Usar espaço não-quebrável se texto estiver vazio */}
        </span>
    );
}
