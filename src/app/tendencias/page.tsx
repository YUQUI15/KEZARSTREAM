import { getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import { Flame } from 'lucide-react';

export const revalidate = 1800;

export default async function TendenciasPage() {
  const [trendingDayMovies, trendingDayTv, trendingWeekMovies, trendingWeekTv] = await Promise.all([
    getTrending('movie', 'day'),
    getTrending('tv', 'day'),
    getTrending('movie', 'week'),
    getTrending('tv', 'week')
  ]);

  return (
    <main className="min-h-screen bg-[#000814] text-white">
      <HeroSlider items={(trendingDayMovies || []).slice(0, 5)} />

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
        <div className="flex items-center gap-2 text-sm text-blue-500 font-bold border-b border-gray-800 pb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="uppercase tracking-wider">Tendencias Globales Hoy & Esta Semana</span>
        </div>

        <Carousel title="🔥 Películas en Tendencia Hoy" items={trendingDayMovies || []} cardType="poster" />
        <Carousel title="📺 Series en Tendencia Hoy" items={trendingDayTv || []} cardType="poster" />
        <Carousel title="🌟 Películas más Vistas esta Semana" items={trendingWeekMovies || []} cardType="poster" />
        <Carousel title="✨ Series más Vistas esta Semana" items={trendingWeekTv || []} cardType="poster" />
      </div>
    </main>
  );
}
