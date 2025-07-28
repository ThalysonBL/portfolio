'use client';

import { useState, useEffect, memo } from 'react';
import { itensSideBar } from '@/utils/itensSideBar';
import styles from '@/styles/sideBar.module.css';
import dynamic from 'next/dynamic';

// Importação dinâmica do ThemeToggle para evitar problemas de hidratação
const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

const Sidebar = memo(function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Detectar seção ativa durante a rolagem
  useEffect(() => {
    const sections = itensSideBar.map(item => item.href.substring(1));
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset para melhor detecção
      
      // Encontrar a seção atual com base na posição de rolagem
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificar a seção ativa no carregamento inicial
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false); // Fechar o menu após clicar em um item
    
    // Extrair o ID da seção do href
    const sectionId = href.substring(1);
    setActiveSection(sectionId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <span>TL</span>
      </div>

      {/* Botão de menu para dispositivos móveis */}
      <button 
        className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Menu de navegação"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu de navegação */}
      <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.navList}>
          {itensSideBar.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a 
                href={item.href} 
                onClick={() => handleNavClick(item.href)}
                className={activeSection === item.href.substring(1) ? styles.active : ''}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Toggle de tema */}
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
});

export default Sidebar;