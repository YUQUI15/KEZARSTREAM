"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Media } from '@/types/tmdb';
import SafeImage from '@/components/ui/SafeImage';

interface HeroSliderProps {
  items: Media[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const activeItem = items[currentIndex];
  const isMovie = activeItem.media_type === 'movie' || (!activeItem.name && !!activeItem.title);
  const title = isMovie ? activeItem.title : activeItem.name;
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${activeItem.id}`;
  const backdropPath = activeItem.backdrop_path || activeItem.poster_path;

  const rating = Number(activeItem.vote_average || 0).toFixed(1);
  const year = (activeItem.release_date || activeItem.first_air_date || '').substring(0, 4);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative w-full h-[75vh] md:h-[88vh] overflow-hidden bg-slate-900 dark:bg-[#000814] select-none">
      {/* Background with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          {backdropPath && (
            <SafeImage
              rawPath={backdropPath}
              tmdbSize="original"
              alt={title || 'Hero'}
              fill
              priority
              className="object-cover object-top md:object-center"
              sizes="100vw"
            />
          )}

          {/* Gradients adaptados a modo claro (f8fafd) y oscuro (000814) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafd] dark:from-[#000814] via-[#000814]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000814]/90 via-[#000814]/60 md:via-[#000814]/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#f8fafd] dark:from-[#000814] to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Info */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-12 lg:px-16 pb-20 md:pb-28 z-20">
        <div className="max-w-3xl">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Badges con tonos pastel */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="flex items-center gap-1 bg-pastel-gradient text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-pastel-blue/30">
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>{isMovie ? 'PELÍCULA DESTACADA' : 'SERIE DESTACADA'}</span>
              </span>

              {rating !== '0.0' && (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#F3EFA1] border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{rating} TMDB</span>
                </div>
              )}

              {year && (
                <span className="bg-black/40 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                  {year}
                </span>
              )}

              <span className="bg-[#99E6D8]/30 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-[#99E6D8]/50">
                Full HD 1080p
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl leading-tight">
              {title}
            </h1>

            {/* Overview */}
            <p className="text-gray-200 text-sm md:text-base mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow leading-relaxed font-normal">
              {activeItem.overview || 'Disfruta de esta increíble producción en audio latino, castellano y subtitulado sin interrupciones en KEZARSTREAM.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={link}
                className="flex items-center gap-2.5 bg-pastel-gradient text-slate-950 px-7 py-3.5 rounded-full font-black text-sm md:text-base transition-all shadow-xl shadow-pastel-blue/40 hover:shadow-pastel-purple hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Ver ahora</span>
              </Link>

              <Link
                href={link}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3.5 rounded-full font-bold text-sm md:text-base backdrop-blur-md transition-all border border-white/30 hover:border-white/60"
              >
                <Info className="w-5 h-5 text-[#6FCFEB]" />
                <span>Detalles y Servidores</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Manual Left/Right Arrow Controls */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 inset-x-4 justify-between pointer-events-none z-30">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md border border-gray-800 hover:border-blue-500 transition-all hover:scale-110 active:scale-95"
          title="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 hover:bg-pastel-gradient text-white hover:text-slate-950 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
          title="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Thumbnails Selector on Desktop Bottom-Right */}
      <div className="hidden lg:flex absolute bottom-8 right-12 z-30 items-end gap-3 bg-black/50 p-2 rounded-2xl backdrop-blur-md border border-white/20">
        {items.slice(0, 5).map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                isActive
                  ? 'w-16 h-24 ring-2 ring-[#6FCFEB] shadow-xl shadow-cyan-500/40 scale-105'
                  : 'w-12 h-18 opacity-50 hover:opacity-100 hover:scale-100'
              }`}
            >
              <SafeImage
                rawPath={item.poster_path}
                tmdbSize="w185"
                alt="Miniatura"
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
