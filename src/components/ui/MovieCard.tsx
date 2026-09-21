"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { MediaItem, Movie, TVShow } from '@/types/tmdb';

interface MovieCardProps {
  media: Movie | TVShow | MediaItem | any;
}

export default function MovieCard({ media }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  if (!media) return null;

  const isMovie = media.media_type === 'movie' || (!media.name && !!media.title);
  const title = (isMovie ? media.title : media.name) || 'Título no disponible';
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${media.id}`;
  
  const posterUrl = imgError
    ? '/placeholder-poster.svg'
    : media.poster_path
    ? `https://image.tmdb.org/t/p/w342${media.poster_path}`
    : media.backdrop_path
    ? `https://image.tmdb.org/t/p/w342${media.backdrop_path}`
    : '/placeholder-poster.svg';

  const rawRating = Number(media.vote_average) || 0;
  const ratingFormatted = rawRating > 0 ? rawRating.toFixed(1) : 'NR';
  const percentage = Math.min(Math.round(rawRating * 10), 100);

  // SVG Circular values
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#22c55e'; // Verde
  if (rawRating < 7 && rawRating >= 5) strokeColor = '#eab308'; // Amarillo
  if (rawRating > 0 && rawRating < 5) strokeColor = '#ef4444'; // Rojo

  const year = (media.release_date || media.first_air_date || '').substring(0, 4);

  return (
    <div className="group relative flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] will-change-transform">
      <Link
        href={link}
        className="block relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#051226] border border-blue-950/60 shadow-xl group-hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] group-hover:border-blue-500/50 transition-all duration-300"
      >
        <Image
          src={posterUrl}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 640px) 140px, 180px"
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Circular SVG Rating Badge */}
        <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-[#000814]/85 backdrop-blur-md flex items-center justify-center shadow-lg border border-gray-800/80 z-20 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r={radius}
              stroke="#2a3342"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="16"
              cy="16"
              r={radius}
              stroke={strokeColor}
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-black text-white">{ratingFormatted}</span>
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/80 text-white backdrop-blur-md border border-blue-400/30">
            {isMovie ? 'Película' : 'Serie'}
          </span>
        </div>

        {/* Centered Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/50 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Gradient shadow at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity z-10" />

        {/* Bottom details on poster */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-20 transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white text-xs md:text-sm font-bold truncate group-hover:text-blue-400 transition-colors drop-shadow-md">
            {title}
          </h3>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
            <span>{year || 'HD'}</span>
            <span className="text-emerald-400 font-semibold">GRATIS</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
