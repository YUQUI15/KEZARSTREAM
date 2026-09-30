import { getTvShows, getTvByGenre, getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import CategoriesGrid from '@/components/ui/CategoriesGrid';
import { Tv } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

// Mapeo de IDs de género a nombres en español (películas + TV exclusivos)
const GENRE_NAMES: Record<number, string> = {
  28: 'Acción', 35: 'Comedia', 27: 'Terror', 18: 'Drama',
  12: 'Aventura', 16: 'Animación', 10751: 'Familiar', 14: 'Fantasía',
  878: 'Ciencia Ficción', 53: 'Suspenso', 10749: 'Romance', 80: 'Crimen',
  99: 'Documental', 36: 'Historia', 10752: 'Bélica', 37: 'Western',
  9648: 'Misterio',
  // TV exclusivos
  10762: 'Infantil', 10767: 'Talk Show', 10766: 'Telenovela',
  10764: 'Reality', 10763: 'Noticias', 10759: 'Acción y Aventura',
  10765: 'Ciencia Ficción y Fantasía', 10768: 'Política',
};

interface Props {
  searchParams: { genre?: string };
}

export default async function SeriesPage({ searchParams }: Props) {
  const genreId = searchParams.genre ? parseInt(searchParams.genre) : null;
  const genreName = genreId ? (GENRE_NAMES[genreId] || 'Categoría') : null;

  const [popular, topRated, onTheAir, trendingWeek, genreSeries] = await Promise.all([
    getTvShows('popular'),
    getTvShows('top_rated'),
    getTvShows('on_the_air'),
    getTrending('tv', 'week'),
    genreId ? getTvByGenre(genreId) : Promise.resolve([]),
  ]);

  return (
    <main className="min-h-screen bg-[#f8fafd] dark:bg-[#000814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero with featured series */}
      <HeroSlider items={(popular || []).slice(0, 6)} />

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-pastel-cyan font-bold border-b border-slate-200 dark:border-gray-800 pb-3">
          <Tv className="w-5 h-5 text-pastel-lavender dark:text-pastel-cyan" />
          <span className="uppercase tracking-wider">Catálogo Completo de Series de TV &amp; Streaming</span>
        </div>

        {/* Genre filter result */}
        {genreId && genreSeries.length > 0 && (
          <div className="space-y-3">
            {/* Breadcrumb chip */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/series"
                className="text-xs text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400 transition-colors"
              >
                ← Todas las series
              </Link>
              <span className="text-slate-300 dark:text-gray-700">/</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-pastel-gradient text-slate-950">
                📺 {genreName}
              </span>
            </div>
            <Carousel
              title={`Series de ${genreName}`}
              items={genreSeries}
              cardType="poster"
            />
          </div>
        )}

        {/* Standard carousels when no genre filter */}
        {!genreId && (
          <>
            <Carousel title="Series en Emisión &amp; Nuevos Capítulos" items={onTheAir || []} cardType="poster" />
            <Carousel title="Series Más Populares" items={popular || []} cardType="poster" />
            <Carousel title="Tendencias de Series esta Semana" items={trendingWeek || []} cardType="poster" />
            <Carousel title="Series Mejor Calificadas de la Historia" items={topRated || []} cardType="poster" />
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
