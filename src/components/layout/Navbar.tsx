"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Menu, X, Dices, Star, Film, Tv, Flame, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import ThemeToggle from '@/components/theme/ThemeToggle';

const SUGGESTIONS = [
  "Busca 'Inception' para acción que te hará pensar",
  "Prueba 'Stranger Things' terror y ciencia ficción",
  "¿Buscas anime? Busca 'Demon Slayer'",
  "Mira 'Breaking Bad' clásico de drama",
  "Explora 'Interstellar' viaje en el espacio",
  "Prueba 'El Juego del Calamar' suspenso",
  "Busca 'Spider-Man' o películas de acción"
];

const NAV_LINKS = [
  { name: 'Inicio', path: '/', icon: Film },
  { name: 'Películas', path: '/peliculas', icon: Film },
  { name: 'Series', path: '/series', icon: Tv },
  { name: 'Tendencias', path: '/tendencias', icon: Flame },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Typewriter effect
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Random loading state
  const [isRandomLoading, setIsRandomLoading] = useState(false);

  // Online count
  const [onlineCount, setOnlineCount] = useState(1495);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Typewriter loop
  useEffect(() => {
    const currentFullText = SUGGESTIONS[placeholderIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length + 1));
        if (placeholderText.length + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length - 1));
        if (placeholderText.length === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, placeholderIndex]);

  // Online count flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Debounced live search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      setSearchModalOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSurpriseMe = async () => {
    setIsRandomLoading(true);
    try {
      const res = await fetch('/api/random');
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRandomLoading(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#000814]/95 backdrop-blur-md shadow-lg shadow-purple-900/5 dark:shadow-blue-950/30 border-b border-pastel-purple/30 dark:border-blue-950/40 py-2.5'
            : 'bg-gradient-to-b from-white/95 dark:from-[#000814]/90 via-white/60 dark:via-[#000814]/40 to-transparent py-3.5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-3 md:gap-4">
          
          {/* Brand Logo con emblema alado cristal */}
          <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 md:w-11 md:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(111,207,235,0.5)]">
                <Image
                  src="/logo-icon.png"
                  alt="KEZARSTREAM"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-white group-hover:opacity-95 transition-all">
                  KEZAR<span className="text-pastel-gradient">STREAM</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-[#C19ADE] dark:text-[#99E6D8] uppercase mt-0.5">
                  Streaming HD
                </span>
              </div>
            </Link>

            {/* Live Online Badge */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-blue-950/40 border border-pastel-purple/30 dark:border-blue-900/30 text-[11px] text-slate-700 dark:text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              <span><b>{onlineCount.toLocaleString()}</b> online</span>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-[#020b18]/60 p-1 rounded-full border border-slate-200/80 dark:border-gray-800/60 backdrop-blur-md flex-shrink-0">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-pastel-gradient text-slate-950 font-bold shadow-md shadow-pastel-blue/30'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Tablet & Desktop Search Bar with Animated Placeholder & Dropdown */}
          <div ref={searchBoxRef} className="hidden md:block relative flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                placeholder={placeholderText || "Buscar películas, series..."}
                className="w-full bg-slate-100/90 dark:bg-[#020b18]/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-xs pl-10 pr-9 py-2.5 rounded-full border border-slate-200 dark:border-gray-800 focus:border-pastel-purple dark:focus:border-blue-500 focus:ring-1 focus:ring-pastel-purple outline-none transition-all shadow-inner cursor-text"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 text-slate-400 dark:text-gray-400 hover:text-pastel-purple dark:hover:text-blue-400 transition-colors cursor-pointer"
                title="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
              {loading && (
                <div className="absolute right-9 top-2.5">
                  <Loader2 className="w-4 h-4 text-pastel-purple dark:text-blue-400 animate-spin" />
                </div>
              )}
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setShowDropdown(false);
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  className="absolute right-3 top-2.5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Search Dropdown (Adapted for Desktop & iPad screens) */}
            <AnimatePresence>
              {showDropdown && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-[420px] md:w-[480px] lg:w-[520px] max-w-[90vw] right-0 bg-white/98 dark:bg-[#051226]/98 backdrop-blur-xl border border-pastel-purple/30 dark:border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-gray-800/60"
                >
                  <div className="p-2 max-h-[70vh] overflow-y-auto space-y-1 scrollbar-thin">
                    {results.map((item: any) => {
                      const isMovie = item.media_type === 'movie' || !item.name;
                      const title = isMovie ? item.title : item.name;
                      const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${item.id}`;
                      const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                      return (
                        <Link
                          key={item.id}
                          href={link}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-purple-50/80 dark:hover:bg-blue-600/20 transition-colors group cursor-pointer"
                        >
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                            <SafeImage
                              rawPath={item.poster_path}
                              tmdbSize="w185"
                              alt={title || 'Póster'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-blue-400 line-clamp-1">
                              {title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-gray-400">
                              <span className="capitalize px-2 py-0.5 rounded-full bg-pastel-purple/20 text-purple-800 dark:bg-blue-950/80 dark:text-blue-300 text-[10px] font-semibold border border-pastel-purple/40 dark:border-blue-800/40">
                                {isMovie ? 'Película' : 'Serie'}
                              </span>
                              {year && <span className="text-slate-600 dark:text-gray-300 text-xs">{year}</span>}
                              {item.vote_average ? (
                                <span className="flex items-center gap-1 text-amber-500 dark:text-yellow-400 font-bold text-xs">
                                  <Star className="w-3 h-3 fill-current" />
                                  {Number(item.vote_average).toFixed(1)}
                                </span>
                              ) : null}
                            </div>
                            {item.overview && (
                              <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1 mt-1 font-light leading-relaxed">
                                {item.overview}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="p-2.5 text-center bg-slate-50 dark:bg-blue-950/40 border-t border-slate-100 dark:border-gray-800">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs text-purple-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                    >
                      Ver todos los resultados para &quot;{query}&quot; →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            
            {/* Theme Toggle (Modo Claro Pastel / Modo Oscuro) */}
            <ThemeToggle />

            {/* Surprise Me (Random Movie) con colores pastel vibrantes */}
            <button
              onClick={handleSurpriseMe}
              disabled={isRandomLoading}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-pastel-gradient text-slate-950 text-xs font-black transition-all shadow-md shadow-pastel-blue/40 hover:shadow-pastel-purple hover:scale-105 active:scale-95 cursor-pointer"
              title="Ver película aleatoria"
            >
              <Dices className={`w-4 h-4 text-slate-950 ${isRandomLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">¡Sorpréndeme!</span>
            </button>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors relative cursor-pointer"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-3 w-80 bg-white/98 dark:bg-[#051226]/95 backdrop-blur-xl border border-pastel-purple/30 dark:border-blue-900/50 rounded-2xl shadow-2xl p-4 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-blue-400" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Novedades KEZARSTREAM</h4>
                      </div>
                      <span className="text-[10px] bg-pastel-purple/20 text-purple-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">Hoy</span>
                    </div>
                    <div className="py-3 space-y-2.5 text-xs text-slate-600 dark:text-gray-300">
                      <p>
                        🎉 <b>¡Nuevo Modo Claro Pastel y Logo Oficial!</b> Disfruta de la mejor experiencia visual adaptada a tu preferencia.
                      </p>
                      <p className="text-slate-500 dark:text-gray-400">
                        Servidores 100% activos con películas y series en calidad Full HD y 4K con audio en Español Latino.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-full text-slate-600 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/98 dark:bg-[#000814]/95 backdrop-blur-xl border-t border-slate-200 dark:border-gray-800 px-4 py-4 space-y-2"
            >
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-pastel-gradient text-slate-950 font-bold' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Fullscreen Search Overlay (Optimized for Phones & iPads) */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f8fafd]/98 dark:bg-[#000814]/98 backdrop-blur-2xl p-4 md:hidden flex flex-col overflow-hidden"
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600 dark:text-blue-500" />
                <span>Buscar en KEZARSTREAM</span>
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-200 dark:bg-gray-900 text-slate-700 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input de Búsqueda Móvil */}
            <form onSubmit={handleSearchSubmit} className="mt-3 relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe el nombre de la película o serie..."
                className="w-full bg-white dark:bg-[#051226] text-slate-900 dark:text-white text-sm pl-11 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-blue-900/50 focus:border-pastel-purple outline-none cursor-text shadow-inner"
              />
              <button type="submit" className="absolute left-3.5 top-3.5 text-slate-400 dark:text-gray-400">
                <Search className="w-4 h-4" />
              </button>
              {loading && (
                <div className="absolute right-10 top-3.5">
                  <Loader2 className="w-4 h-4 text-pastel-purple dark:text-blue-400 animate-spin" />
                </div>
              )}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Chips de sugerencias rápidas cuando no hay búsqueda activa */}
            {query.trim().length < 2 && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-2 font-medium">Búsquedas populares hoy:</p>
                <div className="flex flex-wrap gap-2">
                  {['Inception', 'Stranger Things', 'Breaking Bad', 'Demon Slayer', 'Spider-Man', 'IntensaMente 2'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-blue-950/50 border border-slate-300/80 dark:border-blue-900/40 text-xs text-purple-700 dark:text-blue-300 hover:bg-slate-300 dark:hover:bg-blue-900/60 cursor-pointer font-medium"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de resultados adaptada a pantalla completa móvil */}
            <div className="flex-1 mt-4 overflow-y-auto divide-y divide-slate-200 dark:divide-gray-800/80 pb-20 scrollbar-thin">
              {results.map((item: any) => {
                const isMovie = item.media_type === 'movie' || !item.name;
                const title = isMovie ? item.title : item.name;
                const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${item.id}`;
                const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                return (
                  <Link
                    key={item.id}
                    href={link}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-start gap-3.5 py-3 hover:bg-slate-100 dark:hover:bg-white/5 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                      <SafeImage
                        rawPath={item.poster_path}
                        tmdbSize="w185"
                        alt={title || 'Póster'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-gray-400">
                        <span className="capitalize px-2 py-0.5 rounded-full bg-pastel-purple/20 text-purple-800 dark:bg-blue-950/80 dark:text-blue-300 text-[10px] font-semibold border border-pastel-purple/40 dark:border-blue-800/40">
                          {isMovie ? 'Película' : 'Serie'}
                        </span>
                        {year && <span>{year}</span>}
                        {item.vote_average ? (
                          <span className="flex items-center gap-1 text-amber-500 dark:text-yellow-400 font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {Number(item.vote_average).toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      {item.overview && (
                        <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 font-light">
                          {item.overview}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}

              {results.length > 0 && (
                <div className="pt-4 pb-6">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-3 bg-pastel-gradient rounded-xl text-xs font-black text-slate-950 shadow-lg shadow-pastel-blue/30 transition-all cursor-pointer text-center"
                  >
                    Ver todos los resultados para &quot;{query}&quot; →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
