"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { ChevronDown, ChevronUp, Grip } from 'lucide-react';

const GENRES_DATA = [
  { id: 28,    name: 'Acción',          img: '/xg27NrZa7TBaDPmqglrvS4M77c0.jpg', tv: false },
  { id: 35,    name: 'Comedia',         img: '/qjGrUmKW78MCFG8PTLIdpT83n4P.jpg', tv: false },
  { id: 27,    name: 'Terror',          img: '/5fzN52qZTibEVlgBZZQO4bH4iT6.jpg', tv: false },
  { id: 18,    name: 'Drama',           img: '/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg', tv: false },
  { id: 12,    name: 'Aventura',        img: '/xJHokMbljvjX5LSX1h124WLNxtO.jpg', tv: false },
  { id: 16,    name: 'Animación',       img: '/okMptAQGuOMKU6GQh2wPeMif34E.jpg', tv: false },
  { id: 10751, name: 'Familiar',        img: '/3Rfvhy1Nl6sSGJ251J5F18dE7Wq.jpg', tv: false },
  { id: 14,    name: 'Fantasía',        img: '/xXHZeb1yhJvnSHPzZDqee0jf6JG.jpg', tv: false },
  { id: 878,   name: 'Sci-Fi',          img: '/8rpDcsfLJypbO6vtec04f98xIX0.jpg', tv: false },
  { id: 53,    name: 'Suspenso',        img: '/6xKCYgZ39sN55D8o89OqD46261Y.jpg', tv: false },
  { id: 10749, name: 'Romance',         img: '/c9XwX7N0Z6y7zSAm5J4BntbHntH.jpg', tv: false },
  { id: 80,    name: 'Crimen',          img: '/89XqL01L0lG3yAUBmDblv16xI8r.jpg', tv: false },
  { id: 9648,  name: 'Misterio',        img: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', tv: false },
  { id: 36,    name: 'Historia',        img: '/38UuQeE9f4nLp0W6bI1L7mB5q6G.jpg', tv: false },
  { id: 10752, name: 'Bélica',          img: '/cqa3saYc4epX2BfBAn1Fk6Vv21M.jpg', tv: false },
  { id: 37,    name: 'Western',         img: '/pXU20L0FexBpeN9lH2gP1xI2h9L.jpg', tv: false },
  { id: 99,    name: 'Documental',      img: '/r1U7oK1zB6c9TtbL8W0xJ7D0L0X.jpg', tv: false },
  { id: 10770, name: 'TV Movie',        img: '/k15oX9U9z305t9Z5z8c8zY8Xb2w.jpg', tv: false },
  // Exclusivos de TV
  { id: 10759, name: 'Acción TV',       img: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg', tv: true },
  { id: 10765, name: 'Sci-Fi TV',       img: '/56v2KjBlU4aCpSKUoxAjpw11dG1.jpg', tv: true },
  { id: 10768, name: 'Política',        img: '/xVzvD5BPAU4HpleFSo8QOdHkndo.jpg', tv: true },
  { id: 10762, name: 'Infantil',        img: '/sF4l76A28T4N7k78A5Z8W6vYp3R.jpg', tv: true },
  { id: 10767, name: 'Talk Show',       img: '/3q3jY0FqDq5H8G5sM8Q2E1G6p5c.jpg', tv: true },
  { id: 10766, name: 'Telenovela',      img: '/7vT1w2E8H9d1H8q5v2L3Z4V5C6.jpg', tv: true },
  { id: 10764, name: 'Reality',         img: '/8e8v1Q7W4m1h1w9eX2x2X3r4V5s.jpg', tv: true },
  { id: 10763, name: 'Noticias',        img: '/1r5V9v2Q8W4m1h1w9eX2x2X3r4V5s.jpg', tv: true },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function CategoriesGrid() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full relative z-10 mt-2">
      {/* Botón Desplegable */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-pastel-cyan font-bold">
          <Grip className="w-5 h-5 text-pastel-purple dark:text-pastel-cyan" />
          <span className="uppercase tracking-wider">Explorar por Categoría</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-blue-950/40 text-slate-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-blue-900/60 dark:hover:text-blue-300 transition-all font-bold text-xs shadow-sm cursor-pointer"
        >
          {isOpen ? 'Ocultar' : 'Ver todas'}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Grid Desplegable */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 py-2 pb-6"
            >
              {GENRES_DATA.map((genre) => (
                <motion.div key={genre.id} variants={itemVariants}>
                  <Link
                    href={`/${genre.tv ? 'series' : 'peliculas'}?genre=${genre.id}`}
                    className="group relative block w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md shadow-slate-200 dark:shadow-none bg-slate-200 dark:bg-gray-900 border border-slate-200 dark:border-gray-800"
                  >
                    {/* Imagen de Fondo (Mejor película representativa) */}
                    <SafeImage
                      rawPath={genre.img}
                      tmdbSize="w500"
                      alt={genre.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradiente de oscurecimiento siempre presente para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/60 transition-colors duration-300" />

                    {/* Badge TV */}
                    {genre.tv && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-bold tracking-wider uppercase border border-blue-400/50 backdrop-blur-md">
                        TV
                      </span>
                    )}

                    {/* Nombre del Género */}
                    <div className="absolute inset-0 flex items-end justify-center p-2.5">
                      <span className="text-white text-xs sm:text-sm font-black tracking-wide text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] group-hover:text-pastel-cyan transition-colors duration-300">
                        {genre.name}
                      </span>
                    </div>

                    {/* Glow Border on Hover */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-pastel-cyan/50 transition-colors pointer-events-none" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
