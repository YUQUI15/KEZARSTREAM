"use client";

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { MediaItem, Movie, TVShow } from '@/types/tmdb';
import SafeImage from '@/components/ui/SafeImage';

interface MovieCardProps {
  media: Movie | TVShow | MediaItem | any;
}

export default function MovieCard({ media }: MovieCardProps) {
  if (!media) return null;

  const isMovie = media.media_type === 'movie' || (!media.name && !!media.title);
  const title = (isMovie ? media.title : media.name) || 'Título no disponible';
  const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${media.id}`;

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
        className="block relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#051226] border border-slate-200 dark:border-blue-950/60 shadow-md dark:shadow-xl group-hover:shadow-[0_0_25px_rgba(193,154,222,0.45)] dark:group-hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] group-hover:border-pastel-purple dark:group-hover:border-blue-500/50 transition-all duration-300"
      >
        <SafeImage
          rawPath={media.poster_path || media.backdrop_path}
          tmdbSize="w342"
          alt={title}
          fill
          sizes="(max-width: 640px) 140px, 180px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Circular SVG Rating Badge */}
        <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-white/90 dark:bg-[#000814]/85 backdrop-blur-md flex items-center justify-center shadow-lg border border-slate-200 dark:border-gray-800/80 z-20 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r={radius}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="transparent"
              className="opacity-30"
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
          <span className="absolute text-[10px] font-black text-slate-900 dark:text-white">{ratingFormatted}</span>
        </div>

        {/* Media Type Badge con paleta pastel */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pastel-gradient text-slate-950 shadow-md">
            {isMovie ? 'Película' : 'Serie'}
          </span>
        </div>

        {/* Centered Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-pastel-gradient flex items-center justify-center text-slate-950 shadow-lg shadow-pastel-blue/60 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Gradient shadow at bottom for title contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10" />

        {/* Bottom details on poster */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-20 transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white text-xs md:text-sm font-bold truncate group-hover:text-pastel-yellow transition-colors drop-shadow-md">
            {title}
          </h3>
          <div className="flex items-center justify-between text-[10px] text-gray-300 mt-0.5 font-medium">
            <span>{year || 'HD'}</span>
            <span className="text-[#99E6D8] font-bold">GRATIS</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
