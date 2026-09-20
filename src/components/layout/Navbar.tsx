"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Menu, X, Dices, Send, Star, Film, Tv, Flame, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  "Busca 'Inception' para acción y misterio",
  "Mira 'Stranger Things' terror y sci-fi",
  "¿Buscas anime? Prueba 'Demon Slayer'",
  "Mira 'Breaking Bad' clásico de drama",
  "Explora 'Interstellar' viaje en el espacio",
  "Prueba 'El Juego del Calamar' suspenso",
  "Busca películas de Marvel o DC"
];

const NAV_LINKS = [
  { name: 'Inicio', path: '/', icon: Film },
  { name: 'Películas', path: '/peliculas', icon: Film },
  { name: 'Series', path: '/series', icon: Tv },
  { name: 'Tendencias', path: '/tendencias', icon: Flame },
  { name: 'Explorar', path: '/explorar', icon: Compass },
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

  // Online count randomizer for realism
  const [onlineCount, setOnlineCount] = useState(1482);

  const searchBoxRef = useRef<HTMLDivElement>(null);

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

  // Online count slight flicker
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
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

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
            ? 'bg-[#000814]/95 backdrop-blur-md shadow-2xl shadow-blue-950/30 border-b border-blue-950/40 py-2.5'
            : 'bg-gradient-to-b from-[#000814]/90 via-[#000814]/40 to-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                K
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                KEZAR<span className="text-blue-500">STREAM</span>
              </span>
            </Link>

            {/* Live Online Badge */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-900/30 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span><b>{onlineCount.toLocaleString()}</b> online</span>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#020b18]/60 p-1 rounded-full border border-gray-800/60 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search Bar with Animated Placeholder & Dropdown */}
          <div ref={searchBoxRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                placeholder={placeholderText || "Buscar películas, series..."}
                className="w-full bg-[#020b18]/80 text-white placeholder-gray-400 text-xs pl-10 pr-9 py-2.5 rounded-full border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Search Dropdown */}
            <AnimatePresence>
              {showDropdown && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full bg-[#051226]/95 backdrop-blur-xl border border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-800/60"
                >
                  <div className="p-2.5 max-h-96 overflow-y-auto space-y-1">
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
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-600/20 transition-colors group"
                        >
                          <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                            {item.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                alt={title || 'Póster'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                                Sin foto
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 truncate">
                              {title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                              <span className="capitalize px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 text-[10px]">
                                {isMovie ? 'Película' : 'Serie'}
                              </span>
                              {year && <span>{year}</span>}
                              {item.vote_average ? (
                                <span className="flex items-center gap-0.5 text-yellow-400">
                                  <Star className="w-3 h-3 fill-current" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="p-2 text-center bg-blue-950/30">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Ver todos los resultados para &quot;{query}&quot; →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Surprise Me (Random Movie) */}
            <button
              onClick={handleSurpriseMe}
              disabled={isRandomLoading}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              title="Ver película aleatoria"
            >
              <Dices className={`w-4 h-4 ${isRandomLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">¡Sorpréndeme!</span>
            </button>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Telegram Channel Button */}
            <a
              href="https://t.me/modocine_com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-full bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] text-xs font-semibold transition-all"
              title="Canal oficial de Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors relative"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-3 w-80 bg-[#051226]/95 backdrop-blur-xl border border-blue-900/50 rounded-2xl shadow-2xl p-4 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-bold text-white">Novedades KEZARSTREAM</h4>
                      </div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Hoy</span>
                    </div>
                    <div className="py-3 space-y-2.5 text-xs text-gray-300">
                      <p>
                        🎉 <b>¡Lanzamiento de KEZARSTREAM!</b> Disfruta de películas y series en calidad 1080p con audio en Español Latino y subtítulos.
                      </p>
                      <p className="text-gray-400">
                        Si un reproductor no carga, usa las pestañas de <b>Servidor 1 o Servidor 2</b> para cambiar de fuente al instante.
                      </p>
                    </div>
                    <a
                      href="https://t.me/modocine_com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                    >
                      Unirse al Canal de Telegram 🚀
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
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
              className="lg:hidden bg-[#000814]/95 backdrop-blur-xl border-t border-gray-800 px-4 py-4 space-y-2"
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
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
                <a
                  href="https://t.me/modocine_com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#229ED9]/20 text-[#229ED9] text-xs font-bold border border-[#229ED9]/30"
                >
                  <Send className="w-4 h-4" />
                  <span>Canal Oficial de Telegram</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Fullscreen Search Overlay */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#000814]/95 backdrop-blur-2xl p-4 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <span className="text-sm font-bold text-gray-300">Buscar contenido</span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Película, serie, anime..."
                className="w-full bg-[#051226] text-white text-base pl-11 pr-10 py-3.5 rounded-2xl border border-blue-900/50 focus:border-blue-500 outline-none"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-4" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Quick search chips */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2 font-medium">Búsquedas populares:</p>
              <div className="flex flex-wrap gap-2">
                {['Inception', 'Stranger Things', 'Breaking Bad', 'Demon Slayer', 'Avengers', 'Spider-Man'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuery(item);
                    }}
                    className="px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/40 text-xs text-blue-300 hover:bg-blue-900/50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Search results in mobile */}
            <div className="flex-1 mt-4 overflow-y-auto divide-y divide-gray-800">
              {results.map((item: any) => {
                const isMovie = item.media_type === 'movie' || !item.name;
                const title = isMovie ? item.title : item.name;
                const link = `/ver/${isMovie ? 'pelicula' : 'serie'}/${item.id}`;

                return (
                  <Link
                    key={item.id}
                    href={link}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900">
                      {item.poster_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={title || 'Póster'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isMovie ? 'Película' : 'Serie'} • {item.vote_average?.toFixed(1) || 'NR'} ★
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
