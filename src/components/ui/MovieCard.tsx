"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Media } from '@/types/tmdb';

interface MovieCardProps {
  media: Media;
}

export default function MovieCard({ media }: MovieCardProps) {
  const isMovie = media.media_type === 'movie' || !media.name;
  const title = isMovie ? media.title : media.name;
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${media.id}`;
  const posterUrl = media.poster_path 
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : '/placeholder-poster.png'; // Fallback
    
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'NR';
  const ratingColor = Number(rating) >= 7 ? 'text-green-500' : Number(rating) >= 5 ? 'text-yellow-500' : 'text-red-500';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden group shadow-lg"
    >
      <Link href={link} className="block aspect-[2/3] relative">
        <Image 
          src={posterUrl}
          alt={title || 'Poster'}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center border border-gray-700/50">
          <span className={`text-xs font-bold ${ratingColor}`}>{rating}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2">{title}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
