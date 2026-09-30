"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { ChevronDown, ChevronUp, Grip } from 'lucide-react';

const GENRES_DATA = [
  { id: 28,    name: 'Acción',          img: '/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg', tv: false },
  { id: 35,    name: 'Comedia',         img: '/7GOW6jod9lLurW5utokAatxg7ql.jpg', tv: false },
  { id: 27,    name: 'Terror',          img: '/3icyRAqgakNcQn6aDVz9libFmBA.jpg', tv: false },
  { id: 18,    name: 'Drama',           img: '/k22XyPbce7zvzzf5OnT4uaY8ZD1.jpg', tv: false },
  { id: 12,    name: 'Aventura',        img: '/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg', tv: false },
  { id: 16,    name: 'Animación',       img: '/4D1pdB27uph7J8HQzNf8QvvH9bn.jpg', tv: false },
  { id: 10751, name: 'Familiar',        img: '/7GOW6jod9lLurW5utokAatxg7ql.jpg', tv: false },
  { id: 14,    name: 'Fantasía',        img: '/bulFtfy3oBQtCnAMSi7g6DSSds3.jpg', tv: false },
  { id: 878,   name: 'Sci-Fi',          img: '/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg', tv: false },
  { id: 53,    name: 'Suspenso',        img: '/b9q9VmbXDvJmTziRqkwdEmFdwhr.jpg', tv: false },
  { id: 10749, name: 'Romance',         img: '/o7Oy9Gbx1CCyaweL8xUhtMW4Puq.jpg', tv: false },
  { id: 80,    name: 'Crimen',          img: '/58D9nalUYW5L5K0guw7hcpsEJBH.jpg', tv: false },
  { id: 9648,  name: 'Misterio',        img: '/b9q9VmbXDvJmTziRqkwdEmFdwhr.jpg', tv: false },
  { id: 36,    name: 'Historia',        img: '/y0reRTsewsPh0ePtgvDeLIsb5Wk.jpg', tv: false },
  { id: 10752, name: 'Bélica',          img: '/1ebY06Gc1eUZcCoO7IoD4tWCFxm.jpg', tv: false },
  { id: 37,    name: 'Western',         img: '/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg', tv: false },
  { id: 99,    name: 'Documental',      img: '/dUbP1HNdI0aCq1zgRJw28PWSqmk.jpg', tv: false },
  { id: 10770, name: 'TV Movie',        img: '/hDwl0YMxwGhNe7u8wgHHk2Hyw3W.jpg', tv: false },
  // Exclusivos de TV
  { id: 10759, name: 'Acción TV',       img: '/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg', tv: true },
  { id: 10765, name: 'Sci-Fi TV',       img: '/c2oiRa7V3bQzof4wVGzLXtWJ5QU.jpg', tv: true },
  { id: 10768, name: 'Política',        img: '/mU7l9UaEItxHbg2YBNs0sHjoFVY.jpg', tv: true },
  { id: 10762, name: 'Infantil',        img: '/c2oiRa7V3bQzof4wVGzLXtWJ5QU.jpg', tv: true },
  { id: 10767, name: 'Talk Show',       img: '/hINekSpbcBxjnjGqmIm6I4bz2ab.jpg', tv: true },
  { id: 10766, name: 'Telenovela',      img: '/ksNrsIkIwFKpetIyiUA7kBSBKvC.jpg', tv: true },
  { id: 10764, name: 'Reality',         img: '/wsHj4oHQJoe7DMYaqNFwVoyLiAh.jpg', tv: true },
  { id: 10763, name: 'Noticias',        img: '/qLMfcvdCcCGD2BNLH8b6ZCBuO7D.jpg', tv: true },
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
