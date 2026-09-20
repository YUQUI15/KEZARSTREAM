import React from 'react';
import Link from 'next/link';
import { Compass, Film, Tv, Flame, Star, Sparkles } from 'lucide-react';
import MovieCard from '@/components/ui/MovieCard';
import { getMovies, getTvShows, getTrending } from '@/lib/tmdb';

interface ExplorarPageProps {
  searchParams: {
    tipo?: string;
    sort?: string;
    time?: string;
  };
}

export const revalidate = 1800;

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  const tipo = searchParams.tipo || 'pelicula';
  const sort = searchParams.sort || 'popular';
  const time = searchParams.time || 'day';

  let items: any[] = [];

  try {
    if (sort === 'trending') {
      items = await getTrending(tipo === 'pelicula' ? 'movie' : 'tv', time);
    } else if (tipo === 'pelicula') {
      items = await getMovies(sort === 'now-playing' ? 'now_playing' : sort === 'top-rated' ? 'top_rated' : 'popular');
    } else {
      items = await getTvShows(sort === 'on-the-air' ? 'on_the_air' : sort === 'top-rated' ? 'top_rated' : 'popular');
    }
  } catch (err) {
    console.error('Explorar fetch error:', err);
    items = [];
  }

  const tipoFilters = [
    { label: 'Películas', value: 'pelicula', icon: Film },
    { label: 'Series', value: 'serie', icon: Tv },
  ];

  const sortFilters = [
    { label: '🔥 Tendencias', value: 'trending' },
    { label: '⭐ Populares', value: 'popular' },
    { label: '🏆 Mejor Valoradas', value: 'top-rated' },
    ...(tipo === 'pelicula'
      ? [{ label: '🍿 En Cartelera', value: 'now-playing' }]
      : [{ label: '📡 En Emisión', value: 'on-the-air' }]),
  ];

  return (
    <main className="min-h-screen bg-[#000814] text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800/80">
          <div>
            <div className="flex items-center gap-2.5 text-blue-500 font-bold mb-1 text-sm">
              <Compass className="w-4 h-4" />
              <span>EXPLORADOR MULTIMEDIA</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Explorar Catálogo
            </h1>
          </div>

          <p className="text-gray-400 text-xs md:text-sm max-w-md">
            Filtra películas y series por popularidad, estrenos y tendencias globales actualizadas al instante.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#051226]/80 backdrop-blur-xl border border-blue-950/80 rounded-2xl p-4 md:p-6 mb-10 shadow-xl space-y-4">
          
          {/* Tipo Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 min-w-16">Tipo:</span>
            <div className="flex flex-wrap gap-2">
              {tipoFilters.map((tf) => {
                const Icon = tf.icon;
                const isActive = tipo === tf.value;
                return (
                  <Link
                    key={tf.value}
                    href={`/explorar?tipo=${tf.value}&sort=${sort}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-[#000814] hover:bg-gray-800 text-gray-300 border border-gray-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tf.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 min-w-16">Ordenar:</span>
            <div className="flex flex-wrap gap-2">
              {sortFilters.map((sf) => {
                const isActive = sort === sf.value;
                return (
                  <Link
                    key={sf.value}
                    href={`/explorar?tipo=${tipo}&sort=${sf.value}`}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-[#000814] hover:bg-gray-800 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {sf.label}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Results Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {items.map((item) => (
              <MovieCard key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-gray-400 text-base">No se encontraron títulos disponibles para esta selección.</p>
          </div>
        )}

      </div>
    </main>
  );
}
