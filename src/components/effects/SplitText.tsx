import { motion } from "framer-motion";
import { memo } from "react";

interface SplitTextProps {
    text: string;
    delay?: number;
    initial?: "hidden" | "show";
    animate?: "hidden" | "show";
}

// Definindo as variantes de animação fora do componente
const childVariant = {
    hidden: { y: 40, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

// Usando memo para evitar re-renderizações desnecessárias
const SplitText = memo(function SplitText({
    text,
    delay = 0,
    initial = "hidden",
    animate = "show",
}: SplitTextProps) {
    // Dividir o texto em caracteres
    const letters = text.split("");

    // Configurar o container com o delay específico
    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.div
            className="flex flex-wrap overflow-hidden"
            variants={container}
            initial={initial}
            animate={animate}
            style={{ willChange: animate === "show" ? "transform, opacity" : "auto" }}
        >
            {letters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={childVariant}
                    className="inline-block"
                    style={{ 
                        willChange: animate === "show" ? "transform, opacity" : "auto",
                        // Usar hardware acceleration para animações mais suaves
                        backfaceVisibility: "hidden" as const,
                        WebkitBackfaceVisibility: "hidden" as const
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
});

export default SplitText;
