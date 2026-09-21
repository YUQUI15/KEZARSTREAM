"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

interface SeasonSelectorProps {
  tvId: string | number;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
}

export default function SeasonSelector({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
}: SeasonSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  
  useEffect(() => {
    setSelectedSeason(currentSeason);
  }, [currentSeason]);

  const activeSeason = seasons.find((s) => s.season_number === selectedSeason);
  const episodeCount = activeSeason?.episode_count || 0;
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="mt-8 font-['Lexend_Deca']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Episodios</h3>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-white dark:bg-[#000814] text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-pastel-lavender dark:focus:border-pastel-cyan transition-colors"
        >
          {seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {episodes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {episodes.map((ep) => {
            const isActive = selectedSeason === currentSeason && ep === currentEpisode;
            return (
              <Link
                key={ep}
                href={`/ver/serie/${tvId}?season=${selectedSeason}&episode=${ep}`}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FEAEBB] via-[#F3B2DB] to-[#C19ADE] text-slate-950 font-bold shadow-pastel-pink border-transparent'
                    : 'bg-white/80 dark:bg-gray-900/80 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-pastel-lavender/60 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider mb-1 opacity-75">Episodio</span>
                <span className="text-2xl font-black">{ep}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-gray-500 italic">No hay episodios disponibles para esta temporada.</p>
      )}
    </div>
  );
}
