"use client";

import React, { useState } from 'react';
import { Server, RotateCw, AlertTriangle, ShieldCheck, Maximize2 } from 'lucide-react';

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
  badge: string;
  badgeColor: string;
  getUrl: (isMovie: boolean, tmdbId: string | number, s: string | number, e: string | number) => string;
}

const SERVERS: StreamServer[] = [
  {
    id: 1,
    name: 'Servidor 1 (Multi/Latino)',
    badge: 'Recomendado',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: 2,
    name: 'Servidor 2 (Rápido HD)',
    badge: 'Ultra Rápido',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://player.autoembed.cc/embed/movie/${tmdbId}`
        : `https://player.autoembed.cc/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 3,
    name: 'Servidor 3 (VidLink Pro)',
    badge: '1080p',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 4,
    name: 'Servidor 4 (VidSrc)',
    badge: 'Multi-Idioma',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://vidsrc.cc/v2/embed/movie/${tmdbId}`
        : `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 5,
    name: 'Servidor 5 (2Embed)',
    badge: 'Alternativo',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${s}&e=${e}`
  },
  {
    id: 6,
    name: 'Servidor 6 (Smashy)',
    badge: 'Backup',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://player.smashystream.com/movie/${tmdbId}`
        : `https://player.smashystream.com/tv/${tmdbId}?s=${s}&e=${e}`
  }
];

export default function VideoPlayer({ type, id, season = 1, episode = 1 }: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [reported, setReported] = useState<boolean>(false);

  const isMovie = type === 'movie' || type === 'pelicula';
  const currentServer = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
  const embedUrl = currentServer.getUrl(isMovie, id, season, episode);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 4000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Server Selector Tabs */}
      <div className="bg-[#051226]/80 backdrop-blur-md p-3 rounded-2xl border border-blue-950/60 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Servidores disponibles:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 px-3 py-1.5 rounded-lg transition-all"
              title="Recargar reproductor"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Recargar</span>
            </button>

            <button
              onClick={handleReport}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                reported
                  ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                  : 'text-gray-300 hover:text-amber-400 bg-black/40 border-gray-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{reported ? '¡Reporte enviado!' : 'Reportar caído'}</span>
            </button>
          </div>
        </div>

        {/* Server Buttons */}
        <div className="flex flex-wrap gap-2">
          {SERVERS.map((server) => {
            const isActive = server.id === selectedServer;
            return (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                    : 'bg-[#020b18] hover:bg-blue-950/40 text-gray-300 hover:text-white border border-gray-800/60'
                }`}
              >
                <span>{server.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isActive ? 'bg-white/20 border-white/30 text-white' : server.badgeColor
                  }`}
                >
                  {server.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-[#00040a] rounded-2xl overflow-hidden shadow-2xl border border-blue-900/40 group">
        <iframe
          key={`${selectedServer}-${reloadKey}-${id}-${season}-${episode}`}
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="origin"
        />

        {/* Ad blocker hint banner */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-gray-800 text-[11px] text-gray-300 opacity-60 group-hover:opacity-100 transition-opacity">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reproducción protegida</span>
        </div>
      </div>

      {/* Helper notice */}
      <div className="flex items-center justify-between text-xs text-gray-400 bg-blue-950/20 border border-blue-900/30 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">💡 Consejo:</span>
          <span>Si el video se detiene, cambia al <b>Servidor 1</b> o <b>Servidor 2</b> arriba. La mayoría incluye doblaje en Español Latino.</span>
        </div>
      </div>
    </div>
  );
}
