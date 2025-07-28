"use client";
import { useEffect, useRef, useState } from "react";
import ItemTabContainer from "./ItemTabContainer";
import { ImageProjectProps } from "@/types/types";
import SplitText from "./effects/SplitText";
import { motion, AnimatePresence } from "framer-motion";

export default function TabsProjects() {
    const imageProjects = require('../utils/imageProjects.json');
    const tabs = [
        { id: 'todos', label: 'Todos' },
        { id: 'app', label: 'Aplicativos' },
        { id: 'sites', label: 'Sites' },
        { id: 'outros', label: 'Outros' }
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [isVisible, setIsVisible] = useState(false);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        return () => {
            if (titleRef.current) observer.unobserve(titleRef.current);
        };
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            {/* Título com efeito de split */}
            <div ref={titleRef} className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50">
                    <SplitText
                        text="Projetos"
                        initial="hidden"
                        animate={isVisible ? "show" : "hidden"}
                        delay={0.2}
                    />
                </h2>
                <motion.p 
                    className="text-neutral-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Confira uma seleção dos meus projetos mais recentes, 
                    que envolvem desenvolvimento web, mobile e soluções digitais sob medida.
                </motion.p>
            </div>

            {/* Botões das abas */}
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 gap-2">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                                : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-neutral-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Conteúdo da aba com animação */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {activeTab === 'todos' && (
                        <ItemTabContainer items={imageProjects} typeList="todos" />
                    )}
                    {activeTab === 'app' && (
                        <ItemTabContainer items={imageProjects} typeList="app" />
                    )}
                    {activeTab === 'sites' && (
                        <ItemTabContainer items={imageProjects} typeList="sites" />
                    )}
                    {activeTab === 'outros' && (
                        <ItemTabContainer items={imageProjects} typeList="outros" />
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Botão para ver mais */}
            <motion.div 
                className="flex justify-center mt-8 sm:mt-12"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <a 
                    href="#" 
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                >
                    Ver mais projetos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a>
            </motion.div>
        </div>
    )
}