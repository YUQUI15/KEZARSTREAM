"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full border border-gray-700/50 bg-black/20 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Activar modo claro pastel" : "Activar modo oscuro"}
      title={isDark ? "Cambiar a Modo Claro Pastel" : "Cambiar a Modo Oscuro"}
      className={`relative group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all duration-300 ${
        isDark
          ? "bg-blue-950/40 border border-blue-900/50 hover:border-pastel-yellow hover:shadow-[0_0_15px_rgba(243,239,161,0.4)] text-pastel-yellow"
          : "bg-white/80 border border-pastel-purple/50 hover:border-pastel-purple hover:shadow-[0_0_15px_rgba(193,154,222,0.45)] text-purple-700 shadow-sm"
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 md:w-5 md:h-5 text-[#F3EFA1] group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-[#C19ADE] group-hover:-rotate-12 transition-transform" />
        )}
      </motion.div>
    </button>
  );
}
