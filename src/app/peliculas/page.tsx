import { getMovies, getMoviesByGenre, getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import CategoriesGrid from '@/components/ui/CategoriesGrid';
import { Film } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

// Mapeo de IDs de género a nombres en español
const GENRE_NAMES: Record<number, string> = {
  28: 'Acción', 35: 'Comedia', 27: 'Terror', 18: 'Drama',
  12: 'Aventura', 16: 'Animación', 10751: 'Familiar', 14: 'Fantasía',
  878: 'Ciencia Ficción', 53: 'Suspenso', 10749: 'Romance', 80: 'Crimen',
  99: 'Documental', 36: 'Historia', 10752: 'Bélica', 37: 'Western',
  10770: 'Película de TV', 9648: 'Misterio',
};

interface Props {
  searchParams: { genre?: string };
}

export default async function PeliculasPage({ searchParams }: Props) {
  const genreId = searchParams.genre ? parseInt(searchParams.genre) : null;
  const genreName = genreId ? (GENRE_NAMES[genreId] || 'Categoría') : null;

  const [nowPlaying, popular, topRated, trendingWeek, genreMovies] = await Promise.all([
    getMovies('now_playing'),
    getMovies('popular'),
    getMovies('top_rated'),
    getTrending('movie', 'week'),
    genreId ? getMoviesByGenre(genreId) : Promise.resolve([]),
  ]);

  return (
    <main className="min-h-screen bg-[#f8fafd] dark:bg-[#000814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero with featured movie */}
      <HeroSlider items={(popular || []).slice(0, 6)} />

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-pastel-cyan font-bold border-b border-slate-200 dark:border-gray-800 pb-3">
          <Film className="w-5 h-5 text-pastel-lavender dark:text-pastel-cyan" />
          <span className="uppercase tracking-wider">Catálogo Completo de Películas</span>
        </div>

        {/* Genre filter result */}
        {genreId && genreMovies.length > 0 && (
          <div className="space-y-3">
            {/* Breadcrumb chip */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/peliculas"
                className="text-xs text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400 transition-colors"
              >
                ← Todas las películas
              </Link>
              <span className="text-slate-300 dark:text-gray-700">/</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-pastel-gradient text-slate-950">
                🎬 {genreName}
              </span>
            </div>
            <Carousel
              title={`Películas de ${genreName}`}
              items={genreMovies}
              cardType="poster"
            />
          </div>
        )}

        {/* Standard carousels when no genre filter active */}
        {!genreId && (
          <>
            <Carousel title="En Cartelera &amp; Estrenos Recientes" items={nowPlaying || []} cardType="poster" />
            <Carousel title="Películas Más Populares" items={popular || []} cardType="poster" />
            <Carousel title="Tendencias de la Semana" items={trendingWeek || []} cardType="poster" />
            <Carousel title="Aclamadas y Mejor Calificadas" items={topRated || []} cardType="poster" />
          </>
        )}

        {/* Categories grid — always visible */}
        <div className="py-4">
          <CategoriesGrid />
        </div>
      </div>
    </main>
  );
}
