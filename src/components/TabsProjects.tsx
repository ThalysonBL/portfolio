"use client";
import { useEffect, useRef, useState } from "react";
import ItemTabContainer from "./ItemTabContainer";
import { ImageProjectProps } from "@/types/types";
import SplitText from "./effects/SplitText";

export default function TabsProjects() {
    const imageProjects = require('../utils/imageProjects.json');
    const tabs = [
        { id: 'todos', label: 'Todos' },
        { id: 'app', label: 'App' },
        { id: 'sites', label: 'Sites' },
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

    function listItems(typeList: string) {
        return <ItemTabContainer items={imageProjects} typeList={typeList} />
    }

    return (
        <div className="w-full mx-auto mt-10">
            {/* Título com efeito de split */}
            <div ref={titleRef} className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cyan-400 flex justify-center">
                    <SplitText
                        text="Projetos"
                        initial="hidden"
                        animate={isVisible ? "show" : "hidden"}
                        delay={0.2}
                    />
                </h2>
            </div>

            {/* Botões das abas */}
            <div className="flex w-full justify-center border-b rounded-sm border-gray-700 ">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-semibold transition duration-200 ${activeTab === tab.id
                            ? 'border-b-2 border-cyan-400 text-cyan-400'
                            : 'text-gray-400 hover:text-cyan-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo da aba */}
            <div className="p-4 bg-gray-900/10 text-gray-200 rounded-sm w-full">
                {activeTab === 'todos' && (
                    <>{listItems('todos')}</>
                )}
                {activeTab === 'app' && (
                    <>{listItems('app')}</>
                )}
                {activeTab === 'sites' && (
                    <>{listItems('sites')}</>
                )}
            </div>
        </div>
    )
}