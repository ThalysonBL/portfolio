"use client";

import DecoderText from "@/components/DecoderText";
import SplitText from "@/components/effects/SplitText";
import Sidebar from "@/components/sideBar";
import styles from "@/styles/page.module.css";
import { useInView } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import CodeWorldBackground from "@/components/CodeWorldBackground";
import TabsProjects from "@/components/TabsProjects";

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  // Valores de movimento para o efeito Tilt Card
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transformar os valores de movimento para rotação - ajustando para um efeito moderado
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

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
    [0.35, 0.2, 0.35]
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
    x.set(mouseX * 0.45);
    y.set(mouseY * 0.45);
  };

  const handleMouseLeave = () => {
    // Resetar a posição quando o mouse sair
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <header>
        <Sidebar />
      </header>
      <section className={styles.backgroundSection}>
        <div className={styles.contentAbout}>
          <div>
            <h1 className={styles.title}>Olá, Eu sou <br />
              <span> <DecoderText text="Desenvolvedor" /></span> <br />
              Crio sites, apps <br />
              e sistemas</h1>
            <div className="mt-10">
              <a href="" className={styles.buttonContact}>
                Entrar em contato
              </a>
            </div>
          </div>
          <motion.div
            ref={cardRef}
            className={`${styles.contentAboutText} relative perspective-1000 cursor-default`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.015 }}
          >
            <motion.div
              className="w-full h-full relative"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
                boxShadow: `
                  0 0 12px rgba(0, 255, 255, 0.35),
                  ${glowX.get()}px ${glowY.get()}px 18px rgba(0, 255, 255, ${glowOpacity.get()})
                `
              }}
            >
              <Image src="/imgThalyson.jpg" alt="Foto Thalyson" width={300} height={300} className={`${styles.imageProfile} z-10`} style={{ transform: "translateZ(20px)" }} />
              <p className={`${styles.aboutText} z-10`} style={{ transform: "translateZ(15px)" }}>
                Me chamo Thalyson Lima e sou desenvolvedor com 5 anos de experiência na
                criação de sites, aplicativos, sistemas e automações. <br /><br />
                Atuo com foco em performance, escalabilidade e boas práticas, utilizando
                tecnologias como React, React Native, Next.js, Laravel, C++ e Python. <br />
                Sou movido pelo desafio de transformar ideias em soluções inteligentes,
                combinando design, funcionalidade <br />
                e tecnologia para entregar resultados eficientes e modernos.
              </p>

              {/* Reflexo sutil */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-400/15 rounded-[10px] opacity-35"
                style={{
                  transform: "translateZ(5px)",
                  filter: "blur(2px)"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section ref={ref} className={styles.projectsSection}>
        <TabsProjects />
      </section>
      <CodeWorldBackground />
    </>
  );
}