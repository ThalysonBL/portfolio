import { ImageProjectProps } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

type ProjectModalProps = {
    project: ImageProjectProps | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    // Estado para controlar fallback de imagem
    const [imgError, setImgError] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Montar o componente apenas no cliente
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Fechar o modal ao pressionar ESC e gerenciar scroll
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
            document.body.style.overflow = "hidden";
            setImgError(false);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    // Função para garantir que o modal feche ao clicar fora
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Conteúdo do modal
    const modalContent = (
        <AnimatePresence>
            {isOpen && project && (
                <>
                    {/* Overlay de fundo semitransparente */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Container do modal */}
                    <motion.div
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleBackdropClick}
                    >
                        <motion.div
                            ref={modalRef}
                            className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden w-full max-w-4xl mx-auto flex flex-col shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botão de fechar */}
                            <button
                                className="absolute top-3 right-3 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                onClick={onClose}
                                aria-label="Fechar modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {/* Imagem do projeto */}
                            <div className="relative w-full flex justify-center bg-neutral-100 dark:bg-neutral-900">
                                {!imgError ? (
                                    <div className="w-full flex justify-center">
                                        <Image
                                            src={project.image}
                                            alt={project.title || "Projeto"}
                                            width={1200}
                                            height={800}
                                            className="w-auto h-auto object-contain max-h-[50vh] max-w-full"
                                            priority
                                            onError={() => setImgError(true)}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-[40vh] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="absolute bottom-4 text-center text-neutral-500 text-sm">Imagem não disponível</p>
                                    </div>
                                )}
                            </div>

                            {/* Conteúdo do modal */}
                            <div className="p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">{project.title}</h2>
                                    <span className="bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-md">
                                        {project.type === 'app' ? 'Aplicativo' : project.type === 'sites' ? 'Website' : 'Projeto'}
                                    </span>
                                </div>

                                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                                    {project.description || "Um projeto desenvolvido com tecnologias modernas para oferecer a melhor experiência ao usuário."}
                                </p>

                                {/* Tecnologias usadas */}
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Tecnologias utilizadas:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs px-2 py-1 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    // Usar createPortal para renderizar o modal no nível raiz do DOM
    return mounted && isOpen ? createPortal(modalContent, document.body) : null;
}