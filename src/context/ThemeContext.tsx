'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  systemTheme: Theme | null;
}

// Valor padrão para o contexto para evitar erros quando usado fora do Provider
const defaultContextValue: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
  systemTheme: null
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado para o tema atual
  const [theme, setTheme] = useState<Theme>('dark');
  // Estado para armazenar a preferência do sistema
  const [systemTheme, setSystemTheme] = useState<Theme | null>(null);
  // Estado para controlar se o tema já foi inicializado
  const [mounted, setMounted] = useState(false);

  // Detectar preferência do sistema e tema salvo
  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      // Verificar se há um tema salvo no localStorage
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      
      // Verificar a preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemPreference: Theme = prefersDark ? 'dark' : 'light';
      
      setSystemTheme(systemPreference);
      
      // Usar o tema salvo ou o tema do sistema
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(systemPreference);
      }
      
      // Marcar como montado
      setMounted(true);
    }
  }, []);

  // Aplicar o tema ao documento HTML
  useEffect(() => {
    if (!mounted) return;
    
    // Atualizar o atributo data-theme no elemento HTML
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualizar as classes do body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Salvar a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Evitar flash de conteúdo não estilizado durante SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o contexto de tema
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
} 