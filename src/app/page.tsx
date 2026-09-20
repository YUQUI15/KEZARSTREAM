import { getTrendingDay, getNowPlayingMovies, getPopularTV } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';

export const revalidate = 3600;

export default async function Home() {
  const [trendingDay, nowPlayingMovies, popularTv] = await Promise.all([
    getTrendingDay(),
    getNowPlayingMovies(1),
    getPopularTV(1)
  ]);

  return (
    <div>
      <HeroSlider items={trendingDay.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Carousel title="Tendencias de hoy" items={trendingDay} cardType="poster" />
        <Carousel title="Películas en cines" items={nowPlayingMovies.results} cardType="poster" />
        <Carousel title="Series populares" items={popularTv.results} cardType="poster" />
      </div>
    </div>
  );
}
