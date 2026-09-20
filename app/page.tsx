import { getTrending, getMovies, getTvShows } from '@/lib/tmdb';
import HeroSlider from '@/components/HeroSlider';
import Carousel from '@/components/Carousel';

export default async function Home() {
  const [trendingDay, nowPlayingMovies, popularTv] = await Promise.all([
    getTrending('all', 'day'),
    getMovies('now_playing'),
    getTvShows('popular')
  ]);

  return (
    <div>
      <HeroSlider items={trendingDay.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Carousel title="Tendencias de hoy" items={trendingDay} />
        <Carousel title="Películas en cines" items={nowPlayingMovies} />
        <Carousel title="Series populares" items={popularTv} />
      </div>
    </div>
  );
}
