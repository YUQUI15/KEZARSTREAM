"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { MediaItem, Movie, TVShow } from '@/types/tmdb';

interface TopCardProps {
  media: Movie | TVShow | MediaItem | any;
  index: number;
}

export default function TopCard({ media, index }: TopCardProps) {
  const [imgError, setImgError] = useState(false);

  if (!media) return null;

  const isMovie = media.media_type === 'movie' || (!media.name && !!media.title);
  const title = (isMovie ? media.title : media.name) || 'Título';
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${media.id}`;
  
  const posterUrl = imgError
    ? '/placeholder-poster.svg'
    : media.poster_path
    ? `https://image.tmdb.org/t/p/w342${media.poster_path}`
    : media.backdrop_path
    ? `https://image.tmdb.org/t/p/w342${media.backdrop_path}`
    : '/placeholder-poster.svg';

  const ranking = index + 1;

  return (
    <div className="relative flex-shrink-0 w-[210px] md:w-[240px] h-[270px] md:h-[300px] group mr-4 transition-transform duration-300 ease-out hover:scale-[1.03] will-change-transform">
      <Link href={link} className="flex h-full w-full items-end relative">
        {/* Giant Ranking Number */}
        <div
          className="absolute left-0 bottom-[-8px] text-[110px] md:text-[140px] font-black leading-none select-none z-10 transition-all duration-300 group-hover:scale-105 group-hover:translate-x-1"
          style={{
            color: 'transparent',
            WebkitTextStroke: '3px #3b82f6',
            textShadow: '0 0 25px rgba(59, 130, 246, 0.4)'
          }}
        >
          {ranking}
        </div>

        {/* Poster Card behind/next to the number */}
        <div className="relative w-[145px] md:w-[165px] h-[210px] md:h-[240px] ml-16 md:ml-20 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 z-20 group-hover:border-blue-500 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300 bg-[#051226]">
          <Image
            src={posterUrl}
            alt={title || `Top ${ranking}`}
            fill
            unoptimized
            sizes="165px"
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Centered Play Button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none bg-black/30">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/50">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-0 inset-x-0 p-2.5 z-30">
            <h4 className="text-white text-xs font-bold truncate group-hover:text-blue-400 transition-colors">
              {title}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
              <span>★ {Number(media.vote_average || 0).toFixed(1)}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">#{ranking} TOP</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
