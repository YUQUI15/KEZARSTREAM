"use client";

import React, { useState } from 'react';
import { Zap, RotateCw, AlertTriangle, ShieldCheck, Film, Globe } from 'lucide-react';

interface VideoPlayerProps {
  type: 'movie' | 'tv' | 'pelicula' | 'serie';
  id: string | number;
  season?: string | number;
  episode?: string | number;
  title?: string;
}

interface StreamServer {
  id: number;
  name: string;
  langBadge: string;
  qualityBadge: string;
  category: 'latino' | '1080p' | '4k' | 'all';
  getUrl: (isMovie: boolean, tmdbId: string | number, s: string | number, e: string | number) => string;
}

// Exactly matching Modocine's real Latino streaming backends
const SERVERS: StreamServer[] = [
  {
    id: 1,
    name: 'NSRPLAY (Latino / Multi)',
    langBadge: 'Latino',
    qualityBadge: '1080p',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://nsrplay.space/embed/movie/${tmdbId}`
        : `https://nsrplay.space/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 2,
    name: 'MULTIEMBED (Español Latino)',
    langBadge: 'Latino',
    qualityBadge: 'HD',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://multiembed-clean.wptheme.site/embed/movie/${tmdbId}`
        : `https://multiembed-clean.wptheme.site/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 3,
    name: 'PELISPLUS HD (Audio Dual)',
    langBadge: 'Latino/Sub',
    qualityBadge: '1080p',
    category: '1080p',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 4,
    name: 'PLAYSTREAM (Castellano / Latino)',
    langBadge: 'Multi',
    qualityBadge: '4K',
    category: '4k',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://play.modocine.com/movie/${tmdbId}`
        : `https://play.modocine.com/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 5,
    name: 'CUEVANA PLAYER (Rápido)',
    langBadge: 'Latino',
    qualityBadge: 'HD',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://player.autoembed.cc/embed/movie/${tmdbId}`
        : `https://player.autoembed.cc/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 6,
    name: 'VIDLINK (Full HD Multi-Audio)',
    langBadge: 'Multi',
    qualityBadge: '1080p',
    category: '1080p',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}`
  }
];

export default function VideoPlayer({ type, id, season = 1, episode = 1 }: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'latino' | '1080p' | '4k'>('all');
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [reported, setReported] = useState<boolean>(false);

  const isMovie = type === 'movie' || type === 'pelicula';
  const currentServer = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
  const embedUrl = currentServer.getUrl(isMovie, id, season, episode);

  const filteredServers = SERVERS.filter((server) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'latino') return server.category === 'latino';
    if (activeFilter === '1080p') return server.qualityBadge === '1080p' || server.qualityBadge === 'HD';
    if (activeFilter === '4k') return server.qualityBadge === '4K' || server.qualityBadge === '1080p';
    return true;
  });

  return (
    <div className="w-full space-y-5 font-['Lexend_Deca']">
      {/* Video Container (16:9 aspect ratio matching Modocine) */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 group">
        <iframe
          key={`${selectedServer}-${reloadKey}-${id}-${season}-${episode}`}
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="origin"
        />

        {/* Protection watermark badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] text-white/80 opacity-70 group-hover:opacity-100 transition-opacity">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>KEZARSTREAM Latino</span>
        </div>
      </div>

      {/* Control buttons & Tip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051226]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-blue-900/40 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Reproduciendo en: <strong className="text-blue-400">{currentServer.name}</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-purple-600/80 text-white font-bold text-[10px]">
            {currentServer.langBadge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-gray-200 hover:text-white border border-blue-800/50 transition-all text-xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Recargar</span>
          </button>

          <button
            onClick={() => {
              setReported(true);
              setTimeout(() => setReported(false), 3000);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs ${
              reported
                ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300'
                : 'bg-black/40 border-gray-800 text-gray-400 hover:text-amber-400 hover:border-amber-500/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{reported ? '¡Reporte recibido!' : 'Reportar caído'}</span>
          </button>
        </div>
      </div>

      {/* Fuentes de vídeo (Exact styling of Modocine) */}
      <div className="bg-black/85 backdrop-blur-md border border-[#1a1c20]/80 rounded-2xl p-4 md:p-6 shadow-xl">
        
        {/* Header with blue vertical bar + filter pills */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3 shadow-lg shadow-blue-500/50"></div>
            <span>Fuentes de vídeo</span>
          </h3>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('latino')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                activeFilter === 'latino'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              Español Latino
            </button>
            <button
              onClick={() => setActiveFilter('1080p')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                activeFilter === '1080p'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              HD/1080p
            </button>
            <button
              onClick={() => setActiveFilter('4k')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                activeFilter === '4k'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              4K/Ultra HD
            </button>
          </div>
        </div>

        {/* Server Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredServers.map((server) => {
            const isActive = server.id === selectedServer;
            return (
              <div
                key={server.id}
                className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive ? 'ring-2 ring-blue-500 scale-[1.02] shadow-lg shadow-blue-500/20' : ''
                }`}
              >
                <button
                  onClick={() => setSelectedServer(server.id)}
                  className={`w-full h-full flex items-center justify-between transition-all duration-300 px-4 py-3 rounded-xl border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#020d20] to-[#051838] border-blue-500/60 text-white'
                      : 'bg-[#0a0a0a] hover:bg-[#121212] border-white/10 text-white/90 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 group-hover:text-blue-400'
                    }`}>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-xs md:text-sm">{server.name}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <span>Calidad: {server.qualityBadge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-600 text-white shadow-sm">
                      {server.langBadge}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
