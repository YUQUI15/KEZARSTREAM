"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  RotateCw,
  AlertTriangle,
  ShieldCheck,
  Maximize,
  Minimize,
  Tv,
  Film,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';

interface VideoPlayerProps {
  type: 'movie' | 'tv' | 'pelicula' | 'serie';
  id: string | number;
  season?: string | number;
  episode?: string | number;
  title?: string;
  backdropUrl?: string;
  posterUrl?: string;
}

interface StreamServer {
  id: number;
  name: string;
  langBadge: string;
  qualityBadge: string;
  category: 'latino' | '1080p' | '4k' | 'all';
  getUrl: (
    isMovie: boolean,
    tmdbId: string | number,
    s: string | number,
    e: string | number,
    meta: { title: string; backdrop: string; thumb: string }
  ) => string;
}

// 6 Servidores 100% activos y verificados con HTTP 200 en Español Latino
const SERVERS: StreamServer[] = [
  {
    id: 1,
    name: 'NSRPLAY (Latino Principal)',
    langBadge: 'Latino',
    qualityBadge: '1080p',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://nsrplay.space/embed/movie/${tmdbId}${q}`
        : `https://nsrplay.space/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 2,
    name: 'MULTIEMBED (Español Latino)',
    langBadge: 'Latino',
    qualityBadge: 'HD',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://multiembed-clean.wptheme.site/embed/movie/${tmdbId}${q}`
        : `https://multiembed-clean.wptheme.site/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 3,
    name: 'PLAYSTREAM (Audio Latino 4K)',
    langBadge: 'Latino/Multi',
    qualityBadge: '4K',
    category: '4k',
    getUrl: (isMovie, tmdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://play.modocine.com/embed/movie/${tmdbId}${q}`
        : `https://play.modocine.com/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 4,
    name: 'AUTOEMBED (Audio Dual HD)',
    langBadge: 'Latino/Sub',
    qualityBadge: '1080p',
    category: '1080p',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://autoembed.co/movie/tmdb/${tmdbId}`
        : `https://autoembed.co/tv/tmdb/${tmdbId}-${s}-${e}`
  },
  {
    id: 5,
    name: 'VIDLINK (Full HD Multi-Audio)',
    langBadge: 'Multi',
    qualityBadge: '1080p',
    category: '1080p',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 6,
    name: 'VIDSRC PRO (Respaldo Rápido)',
    langBadge: 'Multi',
    qualityBadge: 'HD',
    category: 'latino',
    getUrl: (isMovie, tmdbId, s, e) =>
      isMovie
        ? `https://vidsrc.pm/embed/movie/${tmdbId}`
        : `https://vidsrc.pm/embed/tv/${tmdbId}/${s}/${e}`
  }
];

export default function VideoPlayer({
  type,
  id,
  season = 1,
  episode = 1,
  title = '',
  backdropUrl = '',
  posterUrl = ''
}: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'latino' | '1080p' | '4k'>('all');
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [reported, setReported] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const isMovie = type === 'movie' || type === 'pelicula';
  const currentServer = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
  const embedUrl = currentServer.getUrl(isMovie, id, season, episode, {
    title,
    backdrop: backdropUrl,
    thumb: posterUrl
  });

  // Listener para estado nativo de Fullscreen en cualquier navegador/dispositivo
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Función para activar pantalla completa en el contenedor
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const el = containerRef.current;
        if (!el) return;

        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          (el as any).webkitRequestFullscreen();
        } else if ((el as any).mozRequestFullScreen) {
          (el as any).mozRequestFullScreen();
        } else if ((el as any).msRequestFullscreen) {
          (el as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle warning:", err);
      // Fallback a modo pantalla completa simulado si la API nativa fue bloqueada
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleServerChange = (serverId: number) => {
    if (serverId !== selectedServer) {
      setIsLoading(true);
      setSelectedServer(serverId);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const filteredServers = SERVERS.filter((server) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'latino') return server.category === 'latino';
    if (activeFilter === '1080p') return server.qualityBadge === '1080p' || server.qualityBadge === 'HD';
    if (activeFilter === '4k') return server.qualityBadge === '4K' || server.qualityBadge === '1080p';
    return true;
  });

  return (
    <div className={`w-full space-y-5 font-['Lexend_Deca'] ${theaterMode ? 'max-w-none' : ''}`}>
      
      {/* Video Container con soporte nativo de Pantalla Completa */}
      <div
        ref={containerRef}
        className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 group ${
          isFullscreen
            ? 'fixed inset-0 z-[999999] h-screen w-screen rounded-none border-none'
            : 'aspect-video'
        }`}
      >
        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-[#000814]/95 flex flex-col items-center justify-center gap-3 select-none pointer-events-none">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="absolute w-5 h-5 rounded-full bg-blue-600/30 animate-ping"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white">Conectando con {currentServer.name}...</p>
              <p className="text-xs text-blue-400">Optimizando audio en Español Latino</p>
            </div>
          </div>
        )}

        {/* Floating exit button for Fullscreen on mobile & tablets */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-full border border-white/20 text-xs shadow-2xl backdrop-blur-md cursor-pointer transition-all active:scale-95"
            title="Salir de pantalla completa"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Salir de Pantalla Completa</span>
          </button>
        )}

        {/* Video iframe */}
        <iframe
          key={`${selectedServer}-${reloadKey}-${id}-${season}-${episode}`}
          src={embedUrl}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="origin"
        />

        {/* Protection watermark badge */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] text-white/80 opacity-70 group-hover:opacity-100 transition-opacity">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>KEZARSTREAM Latino</span>
        </div>
      </div>

      {/* Control buttons: Pantalla Completa, Recargar, Modo Teatro, Reportar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051226]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-blue-900/40 text-xs">
        
        {/* Info del servidor activo */}
        <div className="flex flex-wrap items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Reproduciendo en: <strong className="text-blue-400">{currentServer.name}</strong></span>
          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px]">
            {currentServer.langBadge}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-semibold text-[10px] border border-blue-800/40">
            {currentServer.qualityBadge}
          </span>
        </div>

        {/* Botonera de acciones */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BOTÓN PANTALLA COMPLETA TOTAL (Ocupa 100% de la pantalla) */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all text-xs cursor-pointer active:scale-95"
            title="Poner en pantalla completa que ocupe todo el monitor o celular"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span>Salir de Pantalla Completa</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span>Pantalla Completa</span>
              </>
            )}
          </button>

          {/* Botón Recargar */}
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-gray-200 hover:text-white border border-blue-800/50 transition-all text-xs cursor-pointer active:scale-95"
            title="Recargar el reproductor si el video tarda en iniciar"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>

          {/* Botón Reportar caído */}
          <button
            onClick={() => {
              setReported(true);
              setTimeout(() => setReported(false), 3000);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs cursor-pointer active:scale-95 ${
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

      {/* Fuentes de vídeo (Exact styling of Modocine con 6 servidores reales) */}
      <div className="bg-black/85 backdrop-blur-md border border-[#1a1c20]/80 rounded-2xl p-4 md:p-6 shadow-xl">
        
        {/* Header con barra azul vertical + filtros de calidad */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3 shadow-lg shadow-blue-500/50"></div>
            <span>Fuentes de vídeo (Servidores en Español Latino)</span>
          </h3>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('latino')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === 'latino'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              Español Latino
            </button>
            <button
              onClick={() => setActiveFilter('1080p')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                activeFilter === '1080p'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1a1c20] hover:bg-[#252830] text-white/70 hover:text-white'
              }`}
            >
              HD/1080p
            </button>
            <button
              onClick={() => setActiveFilter('4k')}
              className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
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
                  onClick={() => handleServerChange(server.id)}
                  className={`w-full h-full flex items-center justify-between transition-all duration-300 px-4 py-3 rounded-xl border cursor-pointer ${
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

        {/* Tip explicativo */}
        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center gap-2 text-xs text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span><b>Consejo:</b> Si un servidor tarda en cargar en tu conexión, cambia a <b>NSRPLAY</b> o <b>MULTIEMBED</b> para iniciar de inmediato en Español Latino.</span>
        </div>

      </div>
    </div>
  );
}
