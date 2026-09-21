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
  CheckCircle2
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

// 12 Servidores de alta disponibilidad organizados jerárquicamente en orden descendente
const SERVERS: StreamServer[] = [
  // ==========================================
  // SECCIÓN 1: 🇲🇽 ESPAÑOL LATINO (Orden Descendente #1 a #6)
  // ==========================================
  {
    id: 1,
    name: 'NSRPLAY (Latino VIP)',
    rank: 1,
    rankBadge: '#1 Recomendado',
    category: 'latino',
    langBadge: 'Español Latino',
    qualityBadge: '1080p Full HD',
    speedBadge: 'Ultra Rápido',
    description: 'Servidor principal con la mayor biblioteca de audio latino y sincronización perfecta.',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://nsrplay.space/embed/movie/${tmdbId}${q}`
        : `https://nsrplay.space/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 2,
    name: 'MULTIEMBED (Español Latino Pro)',
    rank: 2,
    rankBadge: '#2 Alta Velocidad',
    category: 'latino',
    langBadge: 'Español Latino',
    qualityBadge: '1080p HD',
    speedBadge: 'Rápido',
    description: 'Motor limpio de alta disponibilidad, ideal para estrenos recientes y series populares.',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://multiembed-clean.wptheme.site/embed/movie/${tmdbId}${q}`
        : `https://multiembed-clean.wptheme.site/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 3,
    name: 'PLAYSTREAM (Latino 4K)',
    rank: 3,
    rankBadge: '#3 Ultra HD 4K',
    category: 'latino',
    langBadge: 'Audio Latino / 4K',
    qualityBadge: '4K Ultra HD',
    speedBadge: 'Alta Calidad',
    description: 'Transmisión en resolución 4K con tasa de bits cinematográfica y audio latino.',
    getUrl: (isMovie, tmdbId, imdbId, s, e, { title, backdrop, thumb }) => {
      const q = `?title=${encodeURIComponent(title)}&backdrop=${encodeURIComponent(backdrop)}&thumb=${encodeURIComponent(thumb)}`;
      return isMovie
        ? `https://play.modocine.com/embed/movie/${tmdbId}${q}`
        : `https://play.modocine.com/embed/tv/${tmdbId}/${s}/${e}${q}`;
    }
  },
  {
    id: 4,
    name: 'CUEVANA CLOUD (Latino Directo)',
    rank: 4,
    rankBadge: '#4 Respaldo Rápido',
    category: 'latino',
    langBadge: 'Español Latino',
    qualityBadge: '1080p',
    speedBadge: 'Excelente',
    description: 'Servidor optimizado para conexiones móviles y redes residenciales sin interrupciones.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://autoembed.co/movie/tmdb/${tmdbId}`
        : `https://autoembed.co/tv/tmdb/${tmdbId}-${s}-${e}`
  },
  {
    id: 5,
    name: 'PELISPLUS VIP (Audio Dual)',
    rank: 5,
    rankBadge: '#5 Audio Dual',
    category: 'latino',
    langBadge: 'Latino / Dual',
    qualityBadge: '1080p HD',
    speedBadge: 'Estable',
    description: 'Opción alternativa con pistas de audio latino y selector de pistas integrado.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 6,
    name: 'LATINOMAX (Respaldo Contingencia)',
    rank: 6,
    rankBadge: '#6 Respaldo',
    category: 'latino',
    langBadge: 'Multi-Latino',
    qualityBadge: 'HD',
    speedBadge: 'Estable',
    description: 'Línea de contingencia para títulos clásicos o películas con servidores saturados.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.pm/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.pm/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  },

  // ==========================================
  // SECCIÓN 2: 💬 SUBTITULADO AL ESPAÑOL (Orden Descendente #1 a #6)
  // ==========================================
  {
    id: 7,
    name: 'VIDLINK SUB (Sub Español Oficial)',
    rank: 1,
    rankBadge: '#1 Recomendado Sub',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p Full HD',
    speedBadge: 'Ultra Rápido',
    description: 'El mejor motor de subtítulos en español: tipografía nítida, sincronización perfecta y 1080p.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidlink.pro/movie/${tmdbId}?sub=es`
        : `https://vidlink.pro/tv/${tmdbId}/${s}/${e}?sub=es`
  },
  {
    id: 8,
    name: 'AUTOEMBED SUB (Subtitulado Automático)',
    rank: 2,
    rankBadge: '#2 Subtitulado Pro',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p HD',
    speedBadge: 'Instantáneo',
    description: 'Carga inmediata con subtítulos en español preseleccionados y reproductor fluido.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://autoembed.co/movie/tmdb/${tmdbId}`
        : `https://autoembed.co/tv/tmdb/${tmdbId}-${s}-${e}`
  },
  {
    id: 9,
    name: 'VIDSRC PRO (Audio Original + Sub)',
    rank: 3,
    rankBadge: '#3 Audio Original VIP',
    category: 'subtitulado',
    langBadge: 'Sub Español / Multi',
    qualityBadge: '1080p HD',
    speedBadge: 'Alta Velocidad',
    description: 'Audio original en máxima fidelidad con selector de subtítulos en español e inglés.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.pm/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.pm/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  },
  {
    id: 10,
    name: 'VIDSRC IN (Buffer Cero Subtitulado)',
    rank: 4,
    rankBadge: '#4 Buffer Cero',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: '1080p HD',
    speedBadge: 'Rápido',
    description: 'Infraestructura CDN optimizada para reproducción continua sin pausas ni buffering.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://vidsrc.in/embed/movie/${imdbId || tmdbId}`
        : `https://vidsrc.in/embed/tv/${imdbId || tmdbId}/${s}/${e}`
  },
  {
    id: 11,
    name: '2EMBED GLOBAL (Catálogo Mundial Sub)',
    rank: 5,
    rankBadge: '#5 Catálogo Total',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Estable',
    description: 'Garantiza disponibilidad para producciones independientes, anime y festivales de cine.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://www.2embed.cc/embed/${imdbId || tmdbId}`
        : `https://www.2embed.cc/embedtv/${imdbId || tmdbId}&s=${s}&e=${e}`
  },
  {
    id: 12,
    name: 'SUPEREMBED MULTI (Respaldo Sub)',
    rank: 6,
    rankBadge: '#6 Respaldo Sub',
    category: 'subtitulado',
    langBadge: 'Sub Español',
    qualityBadge: 'HD',
    speedBadge: 'Estable',
    description: 'Servidor de contingencia mundial con subtítulos multi-idioma asegurados.',
    getUrl: (isMovie, tmdbId, imdbId, s, e) =>
      isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
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

  // Función nativa para activar pantalla completa en cualquier dispositivo
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
    // Si el servidor actual no está en la pestaña seleccionada, selecciona automáticamente el #1 de esa categoría
    if (tab === 'latino' && currentServer.category !== 'latino') {
      setSelectedServer(1);
      setIsLoading(true);
    } else if (tab === 'subtitulado' && currentServer.category !== 'subtitulado') {
      setSelectedServer(7);
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#051226]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-blue-900/40 text-xs">
        
        {/* Info del servidor activo */}
        <div className="flex flex-wrap items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Reproduciendo en: <strong className="text-blue-400">{currentServer.name}</strong></span>
          <span className={`px-2 py-0.5 rounded-full text-white font-bold text-[10px] ${
            currentServer.category === 'latino' ? 'bg-purple-600' : 'bg-cyan-600'
          }`}>
            {currentServer.langBadge}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-semibold text-[10px] border border-blue-800/40">
            {currentServer.qualityBadge}
          </span>
        </div>

        {/* Botonera de acciones */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BOTÓN PANTALLA COMPLETA TOTAL (100% Pantalla) */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all text-xs cursor-pointer active:scale-95"
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

      {/* APARTADO DE SERVIDORES CON PESTAÑAS DEDICADAS (LATINO vs SUBTITULADO) */}
      <div className="bg-black/85 backdrop-blur-md border border-[#1a1c20]/80 rounded-2xl p-4 md:p-6 shadow-xl">
        
        {/* Header con Pestañas de Idioma */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl flex items-center gap-2">
                <span>Servidores de Transmisión</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-800/40">
                  {displayedServers.length} activos
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Ordenados de mayor a menor fiabilidad y velocidad</p>
            </div>
          </div>

          {/* Pestañas de Selección de Idioma */}
          <div className="flex flex-wrap items-center gap-2 bg-[#020b18]/80 p-1.5 rounded-2xl border border-gray-800">
            
            {/* Pestaña Español Latino */}
            <button
              onClick={() => handleTabChange('latino')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'latino'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 scale-102'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              <span>Español Latino</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-blue-200">
                Top 6
              </span>
            </button>

            {/* Pestaña Subtitulado al Español */}
            <button
              onClick={() => handleTabChange('subtitulado')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'subtitulado'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 scale-102'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Subtitles className="w-4 h-4 text-cyan-400" />
              <span>Subtitulado (Sub Español)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-blue-200">
                Top 6
              </span>
            </button>

            {/* Pestaña Todos */}
            <button
              onClick={() => handleTabChange('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Ver Todos (12)
            </button>
          </div>
        </div>

        {/* Banner de Asistencia Inteligente */}
        <div className="mb-5 p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-start gap-3 text-xs text-gray-300">
          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          {activeTab === 'latino' ? (
            <p>
              <b>¿Buscas audio en Español Latino?</b> Estos 6 servidores están ordenados de mejor a menor efectividad. Si un título en particular no cuenta con doblaje latino oficial, cambia arriba a la pestaña <b>&quot;Subtitulado (Sub Español)&quot;</b> para disfrutarlo en audio original con subtítulos sincronizados.
            </p>
          ) : activeTab === 'subtitulado' ? (
            <p>
              <b>Servidores Subtitulados al Español garantizados:</b> Ideales para estrenos de cine, anime, películas de festivales o cuando prefieras escuchar las voces originales con subtítulos en español de alta calidad y sin cortes.
            </p>
          ) : (
            <p>
              Visualizando todos los 12 servidores disponibles clasificados por orden de velocidad y compatibilidad de audio.
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
                    ? 'ring-2 ring-blue-500 scale-[1.02] shadow-xl shadow-blue-500/25'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <button
                  onClick={() => handleServerChange(server.id)}
                  className={`w-full h-full text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-[#020d20] via-[#051838] to-[#0a2550] border-blue-500/80 text-white'
                      : 'bg-[#080b11] hover:bg-[#0d121c] border-white/10 text-white/90 hover:text-white hover:border-gray-700'
                  }`}
                >
                  {/* Top Bar: Rango y Estado Online */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-1.5">
                      {isFirst ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] shadow-md shadow-yellow-500/30">
                          <Crown className="w-3 h-3 fill-current" />
                          {server.rankBadge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-800/50">
                          {server.rankBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-emerald-400 font-semibold">{server.speedBadge}</span>
                    </div>
                  </div>

                  {/* Centro: Nombre del Servidor */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400 group-hover:text-blue-400'
                      }`}>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <h4 className="font-bold text-sm md:text-base text-white truncate">
                        {server.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 pl-8 font-light">
                      {server.description}
                    </p>
                  </div>

                  {/* Bottom: Badges de Calidad e Idioma */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 w-full text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-white shadow-sm ${
                        server.category === 'latino' ? 'bg-purple-600/90' : 'bg-cyan-600/90'
                      }`}>
                        {server.langBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 font-medium border border-white/10">
                        {server.qualityBadge}
                      </span>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-blue-400 font-bold">
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
