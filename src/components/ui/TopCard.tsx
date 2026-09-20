"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Media } from '@/types/tmdb';

interface TopCardProps {
  media: Media;
  index: number;
}

export default function TopCard({ media, index }: TopCardProps) {
  const isMovie = media.media_type === 'movie' || !media.name;
  const title = isMovie ? media.title : media.name;
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${media.id}`;
  const posterUrl = media.poster_path 
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : '/placeholder-poster.png';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative flex-shrink-0 w-[200px] h-[250px] group mr-4"
    >
      <Link href={link} className="flex h-full w-full items-end">
        {/* Giant Number */}
        <div 
          className="absolute left-0 bottom-[-10px] text-[120px] font-black leading-none z-10 select-none"
          style={{
            color: '#000814',
            WebkitTextStroke: '2px #3b82f6',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          }}
        >
          {index + 1}
        </div>
        
        {/* Poster Image */}
        <div className="relative w-[130px] h-[195px] ml-12 rounded-lg overflow-hidden shadow-xl border border-gray-800 z-20 group-hover:border-blue-500/50 transition-colors">
          <Image
            src={posterUrl}
            alt={title || `Top ${index + 1}`}
            fill
            sizes="130px"
            className="object-cover"
          />
        </div>
      </Link>
    </motion.div>
  );
}
