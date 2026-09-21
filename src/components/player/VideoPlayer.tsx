"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  RotateCw,
  AlertTriangle,
  ShieldCheck,
  Maximize,
  Minimize,
  Sparkles,
  Loader2,
  X,
  Crown,
  Star,
  Languages,
  Subtitles,
  HelpCircle,
  CheckCircle2,
  Tv,
  Film
} from 'lucide-react';

interface VideoPlayerProps {
  type: 'movie' | 'tv' | 'pelicula' | 'serie';
  id: string | number;
  imdbId?: string;
  season?: string | number;
  episode?: string | number;
  title?: string;
  backdropUrl?: string;
  posterUrl?: string;
}

interface StreamServer {
  id: number;
  name: string;
  rank: number;
  rankBadge: string;
  category: 'latino' | 'subtitulado';
  langBadge: string;
  qualityBadge: string;
  speedBadge: string;
  description: string;
  getUrl: (
    isMovie: boolean,
    tmdbId: string | number,
    imdbId: string,
    s: string | number,
    e: string | number,
    meta: { title: string; backdrop: string; thumb: string }
  ) => string;
}

// 16 Servidores de alta disponibilidad organizados jerárquicamente en orden descendente
const SERVERS: StreamServer[] = [
  // ==========================================
  // SECCIÓN 1: 🇲🇽 ESPAÑOL LATINO (Servidores 100% con Audio Latino)
  // ==========================================
  {
    id: 1,
    name: 'PLAYSTREAM (Modocine 4K Latino VIP)',
    rank: 1,
    rankBadge: '#1 Recomendado Latino',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '4K Ultra HD',
    speedBadge: 'Ultra Rápido',
    description: 'Motor principal con 8 servidores nativos en Español Latino (Vimeos, Goodstream, Streamwish, Filemoon, Vidara).',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://play.modocine.com/embed/movie/${tmdbId}${q}`
        : `https://play.modocine.com/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 2,
    name: 'NSRPLAY (Latino Directo HLS)',
    rank: 2,
    rankBadge: '#2 Alta Velocidad',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '1080p Full HD',
    speedBadge: 'Instantáneo',
    description: 'Transmisión HLS nativa en español latino directo sin cortes (Vimeos LAT, Nsr Play LAT, Streamwish LAT).',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://nsrplay.space/embed/movie/${tmdbId}${q}`
        : `https://nsrplay.space/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 3,
    name: 'UNLIMPLAY (SoloLatino Cloud Pro)',
    rank: 3,
    rankBadge: '#3 SoloLatino Pro',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '1080p HD',
    speedBadge: 'Rápido',
    description: 'Multi-scraper oficial de SoloLatino con AdBlocker integrado y selección automática de doblaje latino.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://unlimplay.com/f/embed/movie/${tmdbId}`
        : `https://unlimplay.com/f/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 4,
    name: 'MULTIEMBED (Modo Latino Clean)',
    rank: 4,
    rankBadge: '#4 Reproductor Limpio',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '1080p HD',
    speedBadge: 'Fluido',
    description: 'Motor limpio de alta disponibilidad, enfocado en catálogo latino para estrenos y series completas.',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://multiembed-clean.wptheme.site/embed/movie/${tmdbId}${q}`
        : `https://multiembed-clean.wptheme.site/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 5,
    name: 'EMBED69 (Latino Premier Scraper)',
    rank: 5,
    rankBadge: '#5 Base de Datos Latino',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: 'HD Directo',
    speedBadge: 'Excelente',
    description: 'Base de datos especializada en recolección de audio en español latino (PelisPlus y Cuevana).',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://embed69.org/f/${tmdbId}`
        : `https://unlimplay.com/f/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 6,
    name: 'PLAYSTREAM DIRECT (Espejo Modocine)',
    rank: 6,
    rankBadge: '#6 Espejo Rápido',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '4K Ultra HD',
    speedBadge: 'Alta Velocidad',
    description: 'Ruta directa sin intermediarios con auto-arranque inmediato del reproductor en español latino.',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://play.modocine.com/movie/${tmdbId}${q}`
        : `https://play.modocine.com/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 7,
    name: 'NSRPLAY DIRECT (Buffer Cero Latino)',
    rank: 7,
    rankBadge: '#7 Baja Latencia',
    category: 'latino',
    langBadge: '100% Audio Latino',
    qualityBadge: '1080p HD',
    speedBadge: 'Buffer Cero',
    description: 'Conexión directa ligera a fuentes en español latino para conexiones residenciales y móviles sin pausas.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://nsrplay.space/embed/movie/${tmdbId}`
        : `https://nsrplay.space/embed/tv/${tmdbId}/${s}/${e}`
  },

  // ==========================================
  // SECCIÓN 2: 💬 SUBTITULADO AL ESPAÑOL (Audio Original + Subtítulos en Español)
  // ==========================================
  {
    id: 8,
    name: 'VIDLINK SUB (Sub Español Oficial)',
    rank: 1,
    rankBadge: '#1 Recomendado Sub',
    category: 'subtitulado',
    langBadge: 'Sub Español Oficial',
    qualityBadge: '1080p Full HD',
    speedBadge: 'Ultra Rápido',
    description: 'Audio original con subtítulos sincronizados oficiales en español (?sub=es), tipografía legible y 1080p.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}?sub=es`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}?sub=es`
  },
  {
    id: 9,
    name: 'AUTOEMBED SUB (Subtitulado Inteligente)',
    rank: 2,
    rankBadge: '#2 Subtitulado Pro',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p HD',
    speedBadge: 'Instantáneo',
    description: 'Carga rápida con selector de subtítulos en español y reproductor optimizado.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://autoembed.co/movie/tmdb/${tmdbId}`
        : `https://autoembed.co/tv/tmdb/${tmdbId}-${s}-${e}`
  },
  {
    id: 10,
    name: 'VIDSRC PRO SUB (Audio Original VIP)',
    rank: 3,
    rankBadge: '#3 Audio Original VIP',
    category: 'subtitulado',
    langBadge: 'Sub Español / Multi',
    qualityBadge: '1080p HD',
    speedBadge: 'Alta Velocidad',
    description: 'Audio en máxima fidelidad con selector multilingüe de subtítulos en español e inglés.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.pm/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.pm/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  },
  {
    id: 11,
    name: 'VIDSRC IN SUB (Buffer Cero Subtitulado)',
    rank: 4,
    rankBadge: '#4 Buffer Cero',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p HD',
    speedBadge: 'Rápido',
    description: 'Red CDN global para reproducción fluida con subtítulos en español sin pausas.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.in/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.in/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  },
  {
    id: 12,
    name: 'VIDEASY SUB (Reproductor Limpio)',
    rank: 5,
    rankBadge: '#5 Reproductor Rápido',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p HD',
    speedBadge: 'Muy Fluido',
    description: 'Interfaz moderna y rápida con subtítulos flotantes de alta legibilidad.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://player.videasy.net/movie/${tmdbId}`
        : `https://player.videasy.net/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 13,
    name: '2EMBED GLOBAL (Catálogo Mundial Sub)',
    rank: 6,
    rankBadge: '#6 Catálogo Total',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Estable',
    description: 'Disponibilidad universal para producciones internacionales, cine asiático, europeo y anime.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://www.2embed.cc/embed/${imdbId || tmdbId}`
        : `https://www.2embed.cc/embedtv/${imdbId || tmdbId}&s=${s}&e=${e}`
  },
  {
    id: 14,
    name: 'SUPEREMBED MULTI (Respaldo Sub)',
    rank: 7,
    rankBadge: '#7 Respaldo Multi',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Estable',
    description: 'Servidor de contingencia mundial con subtítulos multi-idioma asegurados.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: 15,
    name: 'SMASHYSTREAM SUB (Alternativa Rápida)',
    rank: 8,
    rankBadge: '#8 Alternativa Sub',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Ligero',
    description: 'Servidor ligero para conexiones de velocidad media con subtítulos en español.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
        : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${s}&episode=${e}`
  },
  {
    id: 16,
    name: 'VIDSRC NET (Contingencia Sub)',
    rank: 9,
    rankBadge: '#9 Contingencia Sub',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Respaldo',
    description: 'Nodo global de respaldo para títulos extranjeros y series con subtítulos.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.net/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.net/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  }
];

export default function VideoPlayer({
  type,
  id,
  imdbId = '',
  season = 1,
  episode = 1,
  title = '',
  backdropUrl = '',
  posterUrl = ''
}: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'latino' | 'subtitulado' | 'all'>('latino');
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [reported, setReported] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const isMovie = type === 'movie' || type === 'pelicula';
  const currentServer = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
  const embedUrl = currentServer.getUrl(isMovie, id, imdbId, season, episode, {
    title,
    backdrop: backdropUrl,
    thumb: posterUrl
  });

  // Listener para estado nativo de Fullscreen
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

  // Función nativa para activar pantalla completa total
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
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleTabChange = (tab: 'latino' | 'subtitulado' | 'all') => {
    setActiveTab(tab);
    // Al cambiar de pestaña, auto-selecciona el servidor #1 de esa categoría
    if (tab === 'latino' && currentServer.category !== 'latino') {
      setSelectedServer(1);
      setIsLoading(true);
    } else if (tab === 'subtitulado' && currentServer.category !== 'subtitulado') {
      setSelectedServer(8);
      setIsLoading(true);
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

  const displayedServers = SERVERS.filter((server) => {
    if (activeTab === 'all') return true;
    return server.category === activeTab;
  });

  const latinoCount = SERVERS.filter(s => s.category === 'latino').length;
  const subCount = SERVERS.filter(s => s.category === 'subtitulado').length;

  return (
    <div className="w-full space-y-5 font-['Lexend_Deca']">
      
      {/* Video Container con soporte nativo de Pantalla Completa Total */}
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
              <p className="text-xs text-blue-400">
                {currentServer.category === 'latino'
                  ? 'Optimizando audio en Español Latino'
                  : 'Sincronizando subtítulos en Español'}
              </p>
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
          <span>KEZARSTREAM {currentServer.category === 'latino' ? 'Latino' : 'Sub'}</span>
        </div>
      </div>

      {/* Action Bar: Estado activo, Pantalla Completa, Recargar, Reportar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-[#051226]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-pastel-purple/30 dark:border-blue-900/40 text-xs shadow-sm">
        
        {/* Info del servidor activo */}
        <div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
          <span>Reproduciendo en: <strong className="text-purple-700 dark:text-blue-400">{currentServer.name}</strong></span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            currentServer.category === 'latino' ? 'bg-[#C19ADE] text-purple-950' : 'bg-[#6FCFEB] text-slate-950'
          }`}>
            {currentServer.langBadge}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-blue-950 text-slate-700 dark:text-blue-300 font-semibold text-[10px] border border-slate-300 dark:border-blue-800/40">
            {currentServer.qualityBadge}
          </span>
        </div>

        {/* Botonera de acciones */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BOTÓN PANTALLA COMPLETA TOTAL (100% Pantalla) */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pastel-gradient text-slate-950 font-black shadow-md shadow-pastel-blue/40 hover:shadow-pastel-purple transition-all text-xs cursor-pointer active:scale-95"
            title="Poner en pantalla completa que ocupe todo el monitor, iPad o celular"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-blue-950/60 hover:bg-slate-200 dark:hover:bg-blue-900/60 text-slate-700 dark:text-gray-200 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-blue-800/50 transition-all text-xs cursor-pointer active:scale-95 font-medium"
            title="Recargar el reproductor si el video tarda en iniciar"
          >
            <RotateCw className={`w-3.5 h-3.5 text-purple-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>

          {/* Botón Reportar caído */}
          <button
            onClick={() => {
              setReported(true);
              setTimeout(() => setReported(false), 3000);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs cursor-pointer active:scale-95 font-medium ${
              reported
                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{reported ? '¡Reporte recibido!' : 'Reportar caído'}</span>
          </button>
        </div>
      </div>

      {/* APARTADO EXPANDIDO DE SERVIDORES CON PESTAÑAS DEDICADAS (LATINO vs SUBTITULADO) */}
      <div className="bg-white/95 dark:bg-black/85 backdrop-blur-md border border-pastel-purple/30 dark:border-[#1a1c20]/80 rounded-2xl p-4 md:p-6 shadow-xl">
        
        {/* Header con Pestañas de Idioma */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-pastel-gradient rounded-full shadow-md shadow-pastel-purple/50"></div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl flex items-center gap-2">
                <span>Servidores de Transmisión</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pastel-purple/20 text-purple-800 dark:bg-blue-900/40 dark:text-blue-300 border border-pastel-purple/40 dark:border-blue-800/40">
                  {displayedServers.length} activos
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Ordenados de mayor a menor fiabilidad, velocidad y compatibilidad</p>
            </div>
          </div>

          {/* Pestañas de Selección de Idioma */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 dark:bg-[#020b18]/80 p-1.5 rounded-2xl border border-slate-200 dark:border-gray-800">
            
            {/* Pestaña Español Latino */}
            <button
              onClick={() => handleTabChange('latino')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'latino'
                  ? 'bg-pastel-gradient text-slate-950 shadow-md shadow-pastel-rose/40 scale-102'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
              }`}
            >
              <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Español Latino</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-black/40 text-slate-950 dark:text-blue-200 font-black">
                {latinoCount}
              </span>
            </button>

            {/* Pestaña Subtitulado al Español */}
            <button
              onClick={() => handleTabChange('subtitulado')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'subtitulado'
                  ? 'bg-pastel-gradient text-slate-950 shadow-md shadow-pastel-blue/40 scale-102'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
              }`}
            >
              <Subtitles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Subtitulado (Sub Español)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-black/40 text-slate-950 dark:text-blue-200 font-black">
                {subCount}
              </span>
            </button>

            {/* Pestaña Todos */}
            <button
              onClick={() => handleTabChange('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-300 dark:bg-blue-600 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Ver Todos ({SERVERS.length})
            </button>
          </div>
        </div>

        {/* Banner de Asistencia Inteligente */}
        <div className="mb-5 p-3.5 rounded-xl bg-purple-50/80 dark:bg-blue-950/30 border border-pastel-purple/40 dark:border-blue-900/40 flex items-start gap-3 text-xs text-slate-700 dark:text-gray-300">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          {activeTab === 'latino' ? (
            <p>
              <b>🇲🇽 Servidores 100% en Español Latino:</b> Todos los {latinoCount} servidores de esta pestaña están conectados directamente a motores nativos de doblaje en español latino (Modocine, NSRPlay, SoloLatino, MultiEmbed y Embed69). Si un título extranjero o estreno muy reciente no tiene doblaje latino oficial grabado, puedes cambiar a la pestaña <b>&quot;Subtitulado (Sub Español)&quot;</b> para disfrutarlo en su audio original con subtítulos sincronizados.
            </p>
          ) : activeTab === 'subtitulado' ? (
            <p>
              <b>💬 Servidores Subtitulados al Español ({subCount} opciones):</b> Reproducción en idioma original con subtítulos en español sincronizados de alta legibilidad. Cobertura del 99.9% de títulos mundiales (cine internacional, anime, festivales y estrenos).
            </p>
          ) : (
            <p>
              Visualizando todos los {SERVERS.length} servidores de transmisión organizados por idioma y velocidad.
            </p>
          )}
        </div>

        {/* Cuadrícula de Servidores Ordenados Descendentemente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedServers.map((server) => {
            const isActive = server.id === selectedServer;
            const isFirst = server.rank === 1;

            return (
              <div
                key={server.id}
                className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'ring-2 ring-pastel-purple dark:ring-blue-500 scale-[1.02] shadow-xl shadow-pastel-purple/25 dark:shadow-blue-500/25'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <button
                  onClick={() => handleServerChange(server.id)}
                  className={`w-full h-full text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-[#020d20] dark:via-[#051838] dark:to-[#0a2550] border-pastel-purple dark:border-blue-500/80 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-[#080b11] hover:bg-purple-50/60 dark:hover:bg-[#0d121c] border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 hover:text-slate-950 dark:hover:text-white hover:border-pastel-purple/60 dark:hover:border-gray-700'
                  }`}
                >
                  {/* Top Bar: Rango y Estado Online */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-1.5">
                      {isFirst ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-gradient text-slate-950 font-black text-[10px] shadow-sm">
                          <Crown className="w-3 h-3 fill-current" />
                          {server.rankBadge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-pastel-purple/20 dark:bg-blue-950 text-purple-900 dark:text-blue-300 font-bold text-[10px] border border-pastel-purple/40 dark:border-blue-800/50">
                          {server.rankBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{server.speedBadge}</span>
                    </div>
                  </div>

                  {/* Centro: Nombre del Servidor */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-pastel-gradient text-slate-950' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-gray-400 group-hover:text-purple-700'
                      }`}>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">
                        {server.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-snug line-clamp-2 pl-8 font-light">
                      {server.description}
                    </p>
                  </div>

                  {/* Bottom: Badges de Calidad e Idioma */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5 w-full text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold shadow-sm ${
                        server.category === 'latino' ? 'bg-[#C19ADE] text-purple-950' : 'bg-[#6FCFEB] text-slate-950'
                      }`}>
                        {server.langBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/5 text-slate-700 dark:text-gray-300 font-medium border border-slate-300 dark:border-white/10">
                        {server.qualityBadge}
                      </span>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-purple-700 dark:text-blue-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Activo</span>
                      </span>
                    )}
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
