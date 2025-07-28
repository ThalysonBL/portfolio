import { ImageProjectProps, ItemTabContainerProps } from "@/types/types";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ItemTabContainer({ items, typeList }: ItemTabContainerProps) {
    function TiltCard({ item }: { item: ImageProjectProps }) {
        const cardRef = useRef<HTMLDivElement>(null);
        
        // Valores de movimento para rastrear a posição do mouse
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        
        // Transformar os valores de movimento para rotação - ajustando para um efeito moderado
        const rotateX = useTransform(y, [-100, 100], [20, -20]);
        const rotateY = useTransform(x, [-100, 100], [-20, 20]);
        
        // Adicionar spring para suavizar o movimento
        const springConfig = { damping: 20, stiffness: 150 };
        const springRotateX = useSpring(rotateX, springConfig);
        const springRotateY = useSpring(rotateY, springConfig);
        
        // Valores para o brilho dinâmico - ajustando para um efeito moderado
        const glowX = useTransform(x, [-100, 100], [-15, 15], { clamp: false });
        const glowY = useTransform(y, [-100, 100], [-15, 15], { clamp: false });
        const glowOpacity = useTransform(
            y, 
            [-100, 0, 100], 
            [0.35, 0.25, 0.35]
        );
        
        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cardRef.current) return;
            
            const rect = cardRef.current.getBoundingClientRect();
            
            // Calcular a posição do mouse relativa ao centro do card
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Normalizar valores para o intervalo -100 a 100
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Ajustar a sensibilidade - para um efeito moderado
            x.set(mouseX * 0.6);
            y.set(mouseY * 0.6);
        };
        
        const handleMouseLeave = () => {
            // Resetar a posição quando o mouse sair
            x.set(0);
            y.set(0);
        };
        
        return (
            <motion.div 
                ref={cardRef}
                className="flex-shrink-0 w-[300px] h-[300px] relative cursor-pointer perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    style={{
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Card com borda e efeito de brilho */}
                    <motion.div 
                        className="absolute inset-0 border-[1px] border-[#00FFFF] rounded-[5px] transition-all duration-300 hover:border-[2px]"
                        style={{
                            boxShadow: `
                                0 0 12px rgba(0, 255, 255, 0.35),
                                ${glowX.get()}px ${glowY.get()}px 18px rgba(0, 255, 255, ${glowOpacity.get()})
                            `,
                            transformStyle: "preserve-3d",
                        }}
                    />
                    
                    {/* Imagem */}
                    <div className="w-full h-full relative z-10" style={{ transform: "translateZ(25px)" }}>
                        <Image
                            src={item.image}
                            alt="Imagem do projeto"
                            fill
                            sizes="300px"
                            className="object-cover rounded-[4px] p-2"
                        />
                    </div>
                    
                    {/* Reflexo */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-400/15 rounded-[5px] opacity-35"
                        style={{
                            transform: "translateZ(5px)",
                            filter: "blur(2px)"
                        }}
                    />
                </motion.div>
            </motion.div>
        );
    }
    
    function listItems(typeList: string) {
        if (typeList === 'todos') {
            return items.map((item: ImageProjectProps) => (
                <TiltCard key={item.id} item={item} />
            ));
        } else {
            return items
                .filter((item: ImageProjectProps) => item.type === typeList)
                .map((item: ImageProjectProps) => (
                    <TiltCard key={item.id} item={item} />
                ));
        }
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center w-full">
            {listItems(typeList)}
        </div>
    )
}