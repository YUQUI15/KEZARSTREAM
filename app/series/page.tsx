import { getTvShows } from '@/lib/tmdb';
import HeroSlider from '@/components/HeroSlider';
import Carousel from '@/components/Carousel';

export default async function SeriesPage() {
  const [popular, topRated, onTheAir] = await Promise.all([
    getTvShows('popular'),
    getTvShows('top_rated'),
    getTvShows('on_the_air')
  ]);

  return (
    <div>
      <HeroSlider items={popular.slice(0, 5)} />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Carousel title="Series Populares" items={popular} />
        <Carousel title="En Emisión" items={onTheAir} />
        <Carousel title="Mejor Valoradas" items={topRated} />
      </div>
    </div>
  );
}
