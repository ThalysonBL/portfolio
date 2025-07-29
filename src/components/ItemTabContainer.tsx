import { ImageProjectProps, ItemTabContainerProps } from "@/types/types";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import ProjectModal from "./ProjectModal";

export default function ItemTabContainer({ items, typeList }: ItemTabContainerProps) {
    const [selectedProject, setSelectedProject] = useState<ImageProjectProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (project: ImageProjectProps) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    function TiltCard({ item }: { item: ImageProjectProps }) {
        const cardRef = useRef<HTMLDivElement>(null);
        const [imgError, setImgError] = useState(false);
        
        // Valores de movimento para rastrear a posição do mouse
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        
        // Transformar os valores de movimento para rotação - ajustando para um efeito moderado
        const rotateX = useTransform(y, [-100, 100], [8, -8]);
        const rotateY = useTransform(x, [-100, 100], [-8, 8]);
        
        // Adicionar spring para suavizar o movimento
        const springConfig = { damping: 25, stiffness: 150 };
        const springRotateX = useSpring(rotateX, springConfig);
        const springRotateY = useSpring(rotateY, springConfig);
        
        // Valores para o brilho dinâmico - ajustando para um efeito moderado
        const glowX = useTransform(x, [-100, 100], [-10, 10], { clamp: false });
        const glowY = useTransform(y, [-100, 100], [-10, 10], { clamp: false });
        const glowOpacity = useTransform(
            y, 
            [-100, 0, 100], 
            [0.25, 0.15, 0.25]
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
            x.set(mouseX * 0.4);
            y.set(mouseY * 0.4);
        };
        
        const handleMouseLeave = () => {
            // Resetar a posição quando o mouse sair
            x.set(0);
            y.set(0);
        };
        
        return (
            <motion.div 
                ref={cardRef}
                className="relative h-full perspective-1000 cursor-pointer group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal(item)}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d rounded-xl overflow-hidden"
                    style={{
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Imagem principal */}
                    <div className="w-full aspect-[16/12] relative bg-neutral-800">
                        {!imgError ? (
                            <Image
                                src={item.image}
                                alt={item.title || "Projeto"}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Tag do tipo de projeto */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary/90 text-white text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md backdrop-blur-sm">
                            {item.type === 'app' ? 'Aplicativo' : item.type === 'sites' ? 'Website' : 'Projeto'}
                        </div>
                    </div>
                    
                    {/* Conteúdo do card */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-z-10" style={{ transform: "translateZ(10px)" }}>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-1">
                            {item.title || "Projeto " + item.id}
                        </h3>
                        
                        {/* Tecnologias usadas */}
                        <div className="flex flex-wrap gap-1">
                            {item.technologies?.map((tech, index) => (
                                <span 
                                    key={index} 
                                    className="bg-neutral-800/80 text-neutral-300 text-[10px] sm:text-xs px-1.5 py-0.5 rounded"
                                >
                                    {tech}
                                </span>
                            )) || (
                                <>
                                    <span className="bg-neutral-800/80 text-neutral-300 text-[10px] sm:text-xs px-1.5 py-0.5 rounded">React</span>
                                    <span className="bg-neutral-800/80 text-neutral-300 text-[10px] sm:text-xs px-1.5 py-0.5 rounded">TypeScript</span>
                                </>
                            )}
                        </div>
                        
                        {/* Indicador de clique */}
                        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary/20 text-primary text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            <span>Detalhes</span>
                        </div>
                    </div>
                    
                    {/* Efeito de brilho na borda */}
                    <motion.div 
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                            boxShadow: `
                                0 0 10px rgba(59, 130, 246, 0.3),
                                ${glowX.get()}px ${glowY.get()}px 15px rgba(59, 130, 246, ${glowOpacity.get()})
                            `,
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                        }}
                    />
                </motion.div>
            </motion.div>
        );
    }
    
    function listItems(typeList: string) {
        let filteredItems;
        
        if (typeList === 'todos') {
            filteredItems = [...items]; // Cria uma cópia para não modificar o array original
        } else {
            filteredItems = items.filter((item: ImageProjectProps) => item.type === typeList);
        }
        
        // Ordenar os itens pelo ID para garantir a ordem correta
        filteredItems.sort((a, b) => a.id - b.id);
        
        return filteredItems.map((item: ImageProjectProps) => (
            <TiltCard key={item.id} item={item} />
        ));
    }
    
    // Verificar se há itens para exibir
    const filteredItems = typeList === 'todos' 
        ? items 
        : items.filter((item: ImageProjectProps) => item.type === typeList);
    
    return (
        <>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 grid-flow-row-dense">
                    {listItems(typeList)}
                </div>
            ) : (
                <motion.div 
                    className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-600 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-medium text-neutral-400 mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-neutral-500 max-w-md text-sm sm:text-base px-4">
                        Não há projetos disponíveis nesta categoria no momento. 
                        Por favor, verifique novamente em breve ou explore outras categorias.
                    </p>
                </motion.div>
            )}
            
            {/* Modal de projeto */}
            <ProjectModal 
                project={selectedProject} 
                isOpen={isModalOpen} 
                onClose={closeModal} 
            />
        </>
    );
}