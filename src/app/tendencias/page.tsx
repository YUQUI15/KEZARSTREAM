import { getTrending } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';

export default async function TendenciasPage() {
  const [trendingDay, trendingWeek] = await Promise.all([
    getTrending('all', 'day'),
    getTrending('all', 'week')
  ]);

  return (
    <div>
      <HeroSlider items={trendingDay.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Carousel title="Tendencias de Hoy" items={trendingDay} />
        <Carousel title="Tendencias de la Semana" items={trendingWeek} />
      </div>
    </div>
  );
}
