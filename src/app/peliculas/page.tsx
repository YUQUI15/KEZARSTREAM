import { getMovies, getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import { Film } from 'lucide-react';

export const revalidate = 3600;

export default async function PeliculasPage() {
  const [nowPlaying, popular, topRated, trendingWeek] = await Promise.all([
    getMovies('now_playing'),
    getMovies('popular'),
    getMovies('top_rated'),
    getTrending('movie', 'week')
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

        <Carousel title="En Cartelera & Estrenos Recientes" items={nowPlaying || []} cardType="poster" />
        <Carousel title="Películas Más Populares" items={popular || []} cardType="poster" />
        <Carousel title="Tendencias de la Semana" items={trendingWeek || []} cardType="poster" />
        <Carousel title="Aclamadas y Mejor Calificadas" items={topRated || []} cardType="poster" />
      </div>
    </main>
  );
}
