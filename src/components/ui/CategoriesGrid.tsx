"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

// Todas las categorías de TMDB con sus IDs, emojis, colores pastel y URL de exploración
const MOVIE_GENRES = [
  { id: 28,    name: 'Acción',          emoji: '💥', color: 'from-red-400 to-orange-400',     shadow: 'shadow-red-300/40 dark:shadow-red-900/40',     border: 'border-red-300/60 dark:border-red-900/40' },
  { id: 35,    name: 'Comedia',         emoji: '😂', color: 'from-yellow-300 to-amber-400',   shadow: 'shadow-yellow-300/40 dark:shadow-yellow-900/40', border: 'border-yellow-300/60 dark:border-yellow-900/40' },
  { id: 27,    name: 'Terror',          emoji: '👻', color: 'from-purple-500 to-indigo-600',  shadow: 'shadow-purple-300/40 dark:shadow-purple-900/40', border: 'border-purple-300/60 dark:border-purple-900/40' },
  { id: 18,    name: 'Drama',           emoji: '🎭', color: 'from-blue-400 to-cyan-500',      shadow: 'shadow-blue-300/40 dark:shadow-blue-900/40',     border: 'border-blue-300/60 dark:border-blue-900/40' },
  { id: 12,    name: 'Aventura',        emoji: '🗺️', color: 'from-emerald-400 to-teal-500',  shadow: 'shadow-emerald-300/40 dark:shadow-emerald-900/40', border: 'border-emerald-300/60 dark:border-emerald-900/40' },
  { id: 16,    name: 'Animación',       emoji: '🎨', color: 'from-pink-400 to-rose-400',      shadow: 'shadow-pink-300/40 dark:shadow-pink-900/40',     border: 'border-pink-300/60 dark:border-pink-900/40' },
  { id: 10751, name: 'Familiar',        emoji: '👨‍👩‍👧‍👦', color: 'from-lime-400 to-green-500',  shadow: 'shadow-lime-300/40 dark:shadow-lime-900/40',     border: 'border-lime-300/60 dark:border-lime-900/40' },
  { id: 14,    name: 'Fantasía',        emoji: '🧙‍♂️', color: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-300/40 dark:shadow-violet-900/40', border: 'border-violet-300/60 dark:border-violet-900/40' },
  { id: 878,   name: 'Ciencia Ficción', emoji: '🚀', color: 'from-sky-400 to-blue-500',       shadow: 'shadow-sky-300/40 dark:shadow-sky-900/40',       border: 'border-sky-300/60 dark:border-sky-900/40' },
  { id: 53,    name: 'Suspenso',        emoji: '🔪', color: 'from-slate-500 to-gray-600',     shadow: 'shadow-slate-300/40 dark:shadow-slate-900/40',   border: 'border-slate-300/60 dark:border-slate-900/40' },
  { id: 10749, name: 'Romance',         emoji: '💖', color: 'from-rose-400 to-pink-500',      shadow: 'shadow-rose-300/40 dark:shadow-rose-900/40',     border: 'border-rose-300/60 dark:border-rose-900/40' },
  { id: 80,    name: 'Crimen',          emoji: '🕵️', color: 'from-zinc-500 to-neutral-600',  shadow: 'shadow-zinc-300/40 dark:shadow-zinc-900/40',     border: 'border-zinc-300/60 dark:border-zinc-900/40' },
  { id: 99,    name: 'Documental',      emoji: '🎬', color: 'from-stone-400 to-amber-500',    shadow: 'shadow-stone-300/40 dark:shadow-stone-900/40',   border: 'border-stone-300/60 dark:border-stone-900/40' },
  { id: 36,    name: 'Historia',        emoji: '📜', color: 'from-amber-500 to-orange-600',   shadow: 'shadow-amber-300/40 dark:shadow-amber-900/40',   border: 'border-amber-300/60 dark:border-amber-900/40' },
  { id: 10752, name: 'Bélica',          emoji: '⚔️', color: 'from-red-600 to-rose-700',       shadow: 'shadow-red-300/40 dark:shadow-red-900/40',       border: 'border-red-300/60 dark:border-red-900/40' },
  { id: 37,    name: 'Western',         emoji: '🤠', color: 'from-orange-500 to-red-500',     shadow: 'shadow-orange-300/40 dark:shadow-orange-900/40', border: 'border-orange-300/60 dark:border-orange-900/40' },
  { id: 10770, name: 'Película de TV',  emoji: '📺', color: 'from-indigo-400 to-blue-500',    shadow: 'shadow-indigo-300/40 dark:shadow-indigo-900/40', border: 'border-indigo-300/60 dark:border-indigo-900/40' },
  { id: 9648,  name: 'Misterio',        emoji: '🔍', color: 'from-teal-400 to-cyan-500',      shadow: 'shadow-teal-300/40 dark:shadow-teal-900/40',     border: 'border-teal-300/60 dark:border-teal-900/40' },
];

const TV_GENRES_EXTRA = [
  { id: 10762, name: 'Infantil',        emoji: '🧸', color: 'from-yellow-300 to-pink-400',    shadow: 'shadow-yellow-300/40 dark:shadow-yellow-900/40', border: 'border-yellow-300/60 dark:border-yellow-900/40', tv: true },
  { id: 10767, name: 'Talk Show',       emoji: '🎙️', color: 'from-cyan-400 to-teal-500',     shadow: 'shadow-cyan-300/40 dark:shadow-cyan-900/40',     border: 'border-cyan-300/60 dark:border-cyan-900/40',     tv: true },
  { id: 10766, name: 'Telenovela',      emoji: '🌹', color: 'from-pink-500 to-rose-600',      shadow: 'shadow-pink-300/40 dark:shadow-pink-900/40',     border: 'border-pink-300/60 dark:border-pink-900/40',     tv: true },
  { id: 10764, name: 'Reality',         emoji: '🏆', color: 'from-amber-400 to-yellow-500',   shadow: 'shadow-amber-300/40 dark:shadow-amber-900/40',   border: 'border-amber-300/60 dark:border-amber-900/40',   tv: true },
  { id: 10763, name: 'Noticias',        emoji: '📰', color: 'from-gray-400 to-slate-500',     shadow: 'shadow-gray-300/40 dark:shadow-gray-900/40',     border: 'border-gray-300/60 dark:border-gray-900/40',     tv: true },
  { id: 10759, name: 'Acción/Aventura TV', emoji: '🏃', color: 'from-red-400 to-orange-500', shadow: 'shadow-red-300/40 dark:shadow-red-900/40',       border: 'border-red-300/60 dark:border-red-900/40',       tv: true },
  { id: 10765, name: 'Sci-Fi/Fantasía TV', emoji: '🌌', color: 'from-violet-500 to-sky-500', shadow: 'shadow-violet-300/40 dark:shadow-violet-900/40', border: 'border-violet-300/60 dark:border-violet-900/40', tv: true },
  { id: 10768, name: 'Política',        emoji: '🏛️', color: 'from-blue-600 to-indigo-600',   shadow: 'shadow-blue-300/40 dark:shadow-blue-900/40',     border: 'border-blue-300/60 dark:border-blue-900/40',     tv: true },
];

const ALL_GENRES = [
  ...MOVIE_GENRES.map(g => ({ ...g, tv: false })),
  ...TV_GENRES_EXTRA,
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 22 } },
};

export default function CategoriesGrid() {
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="w-1.5 h-8 rounded-full bg-pastel-gradient shadow-md" />
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Explorar por Categoría
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            {ALL_GENRES.length} géneros disponibles — películas y series
          </p>
        </div>
      </div>

      {/* Grid responsive: 3 cols mobile · 4 tablet · 6 desktop */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 md:gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {ALL_GENRES.map((genre) => {
          // TV-exclusive genres use /series page with genre filter
          // Movie genres use /peliculas page with genre filter
          const href = genre.tv
            ? `/series?genre=${genre.id}`
            : `/peliculas?genre=${genre.id}`;

          return (
            <motion.div key={`${genre.id}-${genre.tv}`} variants={itemVariants}>
              <Link
                href={href}
                className={`
                  group relative flex flex-col items-center justify-center gap-1.5
                  aspect-square rounded-2xl border
                  bg-white/80 dark:bg-[#0a0e1a]/80 backdrop-blur-sm
                  ${genre.border}
                  ${genre.shadow} shadow-sm
                  hover:shadow-lg hover:scale-105 active:scale-95
                  transition-all duration-200 cursor-pointer
                  overflow-hidden p-2
                `}
              >
                {/* Gradient background on hover */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    bg-gradient-to-br ${genre.color}
                  `}
                />

                {/* Soft gradient tint always visible */}
                <div
                  className={`
                    absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity duration-300
                    bg-gradient-to-br ${genre.color}
                  `}
                />

                {/* Emoji */}
                <span
                  className="relative z-10 text-2xl md:text-3xl select-none transition-transform duration-200 group-hover:scale-110"
                  role="img"
                  aria-label={genre.name}
                >
                  {genre.emoji}
                </span>

                {/* Genre name */}
                <span
                  className={`
                    relative z-10 text-[10px] md:text-xs font-bold text-center leading-tight
                    text-slate-700 dark:text-gray-200
                    group-hover:text-white transition-colors duration-200
                    line-clamp-2
                  `}
                >
                  {genre.name}
                </span>

                {/* TV badge */}
                {genre.tv && (
                  <span className="relative z-10 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-black/20 group-hover:bg-white/20 text-slate-600 dark:text-gray-400 group-hover:text-white transition-colors">
                    TV
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
