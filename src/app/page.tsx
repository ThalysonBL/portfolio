"use client";

import dynamic from 'next/dynamic';
import { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useInView } from "motion/react";
import styles from "@/styles/page.module.css";

// Importações dinâmicas para melhorar o carregamento inicial
const DecoderText = dynamic(() => import("@/components/DecoderText"), { ssr: false });
const SplitText = dynamic(() => import("@/components/effects/SplitText"), { ssr: false });
const ScrollReveal = dynamic(() => import("@/components/effects/ScrollReveal"), { ssr: false });
const ParticlesBackground = dynamic(() => import("@/components/effects/ParticlesBackground"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-neutral-950" />
});
const Sidebar = dynamic(() => import("@/components/sideBar"), { ssr: false });
const CodeWorldBackground = dynamic(() => import("@/components/CodeWorldBackground"), { ssr: false });
const TabsProjects = dynamic(() => import("@/components/TabsProjects"), { ssr: false });

export default function Home() {
  // Refs para seções
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Observadores de visibilidade para animações
  // Removendo a variável não utilizada e mantendo apenas o que é necessário
  const isContactInView = useInView(contactRef, { once: true, margin: "-10% 0px" });

  // Valores de movimento para o efeito Tilt Card
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transformações - todos os hooks no nível superior
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Configuração de spring
  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Valores para o brilho dinâmico
  const glowX = useTransform(x, [-100, 100], [-10, 10], { clamp: false });
  const glowY = useTransform(y, [-100, 100], [-10, 10], { clamp: false });
  const glowOpacity = useTransform(y, [-100, 0, 100], [0.25, 0.15, 0.25]);

  // Otimizar handlers de eventos com useCallback
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calcular a posição do mouse relativa ao centro do card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalizar valores para o intervalo -100 a 100
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Ajustar a sensibilidade - para um efeito moderado
    x.set(mouseX * 0.35);
    y.set(mouseY * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    // Resetar a posição quando o mouse sair
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Estilo de sombra para o card
  const shadowStyle = {
    boxShadow: `
      0 0 10px rgba(59, 130, 246, 0.3),
      ${glowX.get()}px ${glowY.get()}px 15px rgba(59, 130, 246, ${glowOpacity.get()})
    `
  };

  return (
    <>
      <Sidebar />
      <ParticlesBackground
        count={25} // Valor otimizado para performance em todos os dispositivos
        color="var(--primary)"
        minSize={1}
        maxSize={2}
        speed={0.25} // Velocidade reduzida para melhor performance
        linked={true}
        linkDistance={120} // Distância reduzida para menos cálculos
        linkOpacity={0.1}
      />

      {/* Seção Início */}
      <section id="home" ref={homeRef} className={styles.backgroundSection}>
        <div className={styles.contentAbout}>
          <ScrollReveal direction="right" delay={0.2} className="w-full md:w-1/2">
            <h1 className={styles.title}>
              Olá, Eu sou <br />
              <span><DecoderText text="Thalyson Lima" /></span>
            </h1>
            <h2 className={styles.title}>
              Desenvolvedor <br />
              Full Stack
            </h2>
            <p className={styles.subtitle}>
              Transformo ideias em soluções digitais de alto desempenho,
              com foco em escalabilidade, usabilidade e resultados reais.
            </p>
            <div>
              <a 
                href="https://wa.link/kdad56" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.buttonContact}
              >
                Entrar em contato
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.4} className="w-full md:w-1/2">
            <motion.div
              ref={cardRef}
              className={`${styles.contentAboutText} relative perspective-1000 cursor-default`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.01 }}
              style={{ willChange: 'transform' }}
            >
              <motion.div
                className="w-full h-full relative"
                style={{
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformStyle: "preserve-3d",
                  ...shadowStyle
                }}
              >
                <Image
                  src="/imgThalyson.jpg"
                  alt="Foto Thalyson"
                  width={150}
                  height={150}
                  className={styles.imageProfile}
                  style={{ transform: "translateZ(15px)" }}
                  priority
                />
                <p className={styles.aboutText} style={{ transform: "translateZ(10px)" }}>
                  Sou Thalyson Lima, desenvolvedor com 5 anos de experiência na criação de sites,
                  sistemas, aplicativos e automações personalizadas. <br />

                  Minha atuação é guiada por performance, escalabilidade e
                  boas práticas de código, utilizando tecnologias como React, Next.js, React Native, Laravel, C++ e Python. <br />

                  Tenho paixão por transformar ideias em soluções inteligentes, aliando design,
                  tecnologia e funcionalidade para gerar valor real. <br />

                </p>

                {/* Reflexo sutil */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 rounded-lg opacity-30"
                  style={{
                    transform: "translateZ(5px)",
                    filter: "blur(2px)"
                  }}
                />
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="about" ref={aboutRef} className={styles.backgroundSection}>
        <div className="w-full max-w-6xl mx-auto py-10">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className={styles.titleProjects}>
              <SplitText
                text="Sobre Mim"
                initial="hidden"
                animate="show"
                delay={0.2}
              />
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <ScrollReveal direction="right" delay={0.3} className="w-full">
              <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 h-full">
                <h3 className="text-xl font-bold text-primary mb-4">Minha Jornada</h3>
                <p className="text-neutral-200 leading-relaxed">
                  Minha jornada na tecnologia começou aos 18 anos, quando tive meu primeiro contato com programação. 
                  Desde então, venho me especializando continuamente, buscando as melhores práticas, 
                  ferramentas e metodologias de desenvolvimento.
                  <br /><br />
                  Tive a oportunidade de participar de projetos desafiadores — de aplicativos móveis a 
                  sistemas de gestão empresarial — sempre com o compromisso de entregar soluções eficientes, 
                  escaláveis e com alto valor agregado.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.4} className="w-full">
              <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 h-full">
                <h3 className="text-xl font-bold text-accent mb-4">Minha Abordagem</h3>
                <p className="text-neutral-200 leading-relaxed">
                  Para mim, desenvolvimento de software é mais do que escrever código: 
                  é resolver problemas reais com soluções que entregam valor.

                  <br /><br />
                  Minha abordagem é baseada em:
                </p>
                <ul className="mt-4 space-y-2 text-neutral-200">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Código limpo, legível e bem estruturado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Design orientado à experiência do usuário </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Performance e escalabilidade como pilares</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Comunicação clara e colaboração com o cliente</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Seção Projetos */}
      <section id="projects" ref={projectsRef} className={styles.projectsSection}>
        <ScrollReveal direction="up" delay={0.1}>
          <TabsProjects />
        </ScrollReveal>
      </section>

      {/* Seção Contato */}
      <section id="contact" ref={contactRef} className={styles.contactSection}>
        <ScrollReveal direction="up" delay={0.1} className="w-full max-w-3xl">
          <h2 className={styles.titleProjects}>
            <SplitText
              text="Entre em Contato"
              initial="hidden"
              animate={isContactInView ? "show" : "hidden"}
              delay={0.2}
            />
          </h2>

          <div className="bg-neutral-800/50 p-6 rounded-lg border border-neutral-700/50 mt-10 text-center">
            <motion.p 
              className="text-neutral-300 mb-6 text-base sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Estou disponível para novos projetos e parcerias. Entre em contato pelo WhatsApp para conversarmos sobre suas necessidades.
            </motion.p>
            
            <ScrollReveal direction="up" delay={0.4}>
              <a
                href="https://wa.link/kdad56"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white font-medium rounded-lg text-sm px-6 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Conversar no WhatsApp
              </a>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </section>

      <CodeWorldBackground />
    </>
  );
}