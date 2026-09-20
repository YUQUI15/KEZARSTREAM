"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Media } from '@/types/tmdb';

interface HeroSliderProps {
  items: Media[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const activeItem = items[currentIndex];
  const isMovie = activeItem.media_type === 'movie' || !activeItem.name;
  const title = isMovie ? activeItem.title : activeItem.name;
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${activeItem.id}`;
  const backdropUrl = activeItem.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${activeItem.backdrop_path}`
    : '';

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#000814]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={title || 'Hero'}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#000814] via-[#000814]/80 md:via-[#000814]/40 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-12 pb-24 md:pb-32">
        <div className="max-w-3xl z-10">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {activeItem.vote_average && (
              <div className="flex items-center gap-2 mb-3 text-yellow-500 font-medium bg-black/40 w-max px-3 py-1 rounded-full backdrop-blur-md border border-gray-800">
                <Star className="w-4 h-4 fill-current" />
                <span>{activeItem.vote_average.toFixed(1)} Rating</span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
              {title}
            </h1>
            
            <p className="text-gray-300 text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-md">
              {activeItem.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={link} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 md:px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-1">
                <Play className="w-5 h-5 fill-current" />
                Ver ahora
              </Link>
              <button className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white px-6 md:px-8 py-3 rounded-full font-medium backdrop-blur-md transition-colors border border-gray-700">
                <Info className="w-5 h-5" />
                Más info
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-8 right-4 md:right-12 hidden md:flex gap-3 z-20">
        {items.slice(0, 5).map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-24 h-14 rounded-md overflow-hidden transition-all duration-300 border-2 ${currentIndex === idx ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`}
              alt="Thumbnail"
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
