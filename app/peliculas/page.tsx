import { getMovies } from '@/lib/tmdb';
import HeroSlider from '@/components/HeroSlider';
import Carousel from '@/components/Carousel';

export default async function PeliculasPage() {
  const [nowPlaying, popular, topRated] = await Promise.all([
    getMovies('now_playing'),
    getMovies('popular'),
    getMovies('top_rated')
  ]);

  return (
    <div>
      <HeroSlider items={nowPlaying.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Carousel title="Populares" items={popular} />
        <Carousel title="En Cines" items={nowPlaying} />
        <Carousel title="Mejor Valoradas" items={topRated} />
      </div>
    </div>
  );
}
