'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Renderizar um placeholder durante a hidratação para evitar erros
  if (!mounted) {
    return (
      <div className="relative p-2 rounded-full w-12 h-6 flex items-center bg-neutral-700">
        <div className="absolute w-5 h-5 rounded-full bg-primary left-1"></div>
      </div>
    );
  }
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full w-12 h-6 flex items-center ${
        theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'
      } transition-colors duration-300`}
      aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute w-5 h-5 rounded-full ${
          theme === 'dark' ? 'bg-primary' : 'bg-accent'
        }`}
        animate={{
          left: theme === 'dark' ? '4px' : 'calc(100% - 24px)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Ícone do Sol ou Lua */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white"
          initial={false}
          animate={{ opacity: 1 }}
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z"
              />
            </svg>
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
} 