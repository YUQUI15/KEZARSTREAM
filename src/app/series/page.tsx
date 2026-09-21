import { getTvShows, getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import { Tv } from 'lucide-react';

export const revalidate = 3600;

export default async function SeriesPage() {
  const [popular, topRated, onTheAir, trendingWeek] = await Promise.all([
    getTvShows('popular'),
    getTvShows('top_rated'),
    getTvShows('on_the_air'),
    getTrending('tv', 'week')
  ]);

  return (
    <main className="min-h-screen bg-[#f8fafd] dark:bg-[#000814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Hero with featured series */}
      <HeroSlider items={(popular || []).slice(0, 6)} />

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-pastel-cyan font-bold border-b border-slate-200 dark:border-gray-800 pb-3">
          <Tv className="w-5 h-5 text-pastel-lavender dark:text-pastel-cyan" />
          <span className="uppercase tracking-wider">Catálogo Completo de Series de TV & Streaming</span>
        </div>

        <Carousel title="Series en Emisión & Nuevos Capítulos" items={onTheAir || []} cardType="poster" />
        <Carousel title="Series Más Populares" items={popular || []} cardType="poster" />
        <Carousel title="Tendencias de Series esta Semana" items={trendingWeek || []} cardType="poster" />
        <Carousel title="Series Mejor Calificadas de la Historia" items={topRated || []} cardType="poster" />
      </div>
    </main>
  );
}
