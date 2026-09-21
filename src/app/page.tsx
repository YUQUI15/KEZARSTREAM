import {
  getTrendingDay,
  getMovies,
  getTvShows,
  getTrending,
  getMoviesByGenre,
  getTvByGenre,
  getKoreanMovies,
  getNetflixSeries
} from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';

export const revalidate = 3600;

export default async function Home() {
  const [
    trendingDay,
    nowPlayingMovies,
    netflixSeries,
    topRatedTv,
    trendingTv,
    koreanMovies,
    actionMovies,
    comedyMovies,
    horrorMovies,
    adventureMovies,
    fantasyMovies,
    actionTv,
    scifiTv,
    kidsTv
  ] = await Promise.all([
    getTrendingDay(),
    getMovies('now_playing'),
    getNetflixSeries(),
    getTvShows('top_rated'),
    getTrending('tv', 'day'),
    getKoreanMovies(),
    getMoviesByGenre(28),    // Acción
    getMoviesByGenre(35),    // Comedia
    getMoviesByGenre(27),    // Terror
    getMoviesByGenre(12),    // Aventura
    getMoviesByGenre(14),    // Fantasía
    getTvByGenre(10759),     // Acción y Aventura TV
    getTvByGenre(10765),     // Ciencia Ficción y Fantasía TV
    getTvByGenre(10762)      // Niños / Infantil TV
  ]);

  return (
    <main className="min-h-screen bg-[#000814] text-white pb-16">
      {/* Hero Slider with Autoplay & featured titles */}
      <HeroSlider items={trendingDay.slice(0, 7)} />

      {/* Main Content Sections (matching Modocine exact layout) */}
      <div className="container mx-auto px-4 md:px-8 py-6 space-y-12">
        
        {/* 1. Películas más vistas */}
        <Carousel
          title="Películas más vistas"
          items={nowPlayingMovies || []}
          cardType="poster"
        />

        {/* 2. TOP 10 Películas Hoy */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-2 px-4 md:px-8">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-blue-500">
              TOP 10
            </span>
            <div className="border-l-2 border-gray-700 pl-3">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                Películas en Tendencia Hoy
              </h2>
              <p className="text-xs text-gray-400">Lo más visto por la comunidad hoy</p>
            </div>
          </div>
          <Carousel
            items={trendingDay.slice(0, 10)}
            cardType="top"
          />
        </div>

        {/* 3. Series de Netflix */}
        {netflixSeries && netflixSeries.length > 0 && (
          <Carousel
            title="Series de Netflix"
            items={netflixSeries}
            cardType="poster"
          />
        )}

        {/* 4. Series mejores valoradas */}
        <Carousel
          title="Series mejores valoradas"
          items={topRatedTv || []}
          cardType="poster"
        />

        {/* 5. TOP 10 Series Hoy */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-2 px-4 md:px-8">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-blue-500">
              TOP 10
            </span>
            <div className="border-l-2 border-gray-700 pl-3">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                Series más Populares Hoy
              </h2>
              <p className="text-xs text-gray-400">Las series con mayor audiencia el día de hoy</p>
            </div>
          </div>
          <Carousel
            items={(trendingTv || []).slice(0, 10)}
            cardType="top"
          />
        </div>

        {/* 6. Películas coreanas */}
        {koreanMovies && koreanMovies.length > 0 && (
          <Carousel
            title="Películas coreanas"
            items={koreanMovies}
            cardType="poster"
          />
        )}

        {/* 7. Películas de acción */}
        {actionMovies && actionMovies.length > 0 && (
          <Carousel
            title="Películas de acción"
            items={actionMovies}
            cardType="poster"
          />
        )}

        {/* 8. Películas de comedia */}
        {comedyMovies && comedyMovies.length > 0 && (
          <Carousel
            title="Películas de comedia"
            items={comedyMovies}
            cardType="poster"
          />
        )}

        {/* 9. Películas de terror */}
        {horrorMovies && horrorMovies.length > 0 && (
          <Carousel
            title="Películas de terror"
            items={horrorMovies}
            cardType="poster"
          />
        )}

        {/* 10. Películas de aventuras */}
        {adventureMovies && adventureMovies.length > 0 && (
          <Carousel
            title="Películas de aventuras"
            items={adventureMovies}
            cardType="poster"
          />
        )}

        {/* 11. Películas de fantasía */}
        {fantasyMovies && fantasyMovies.length > 0 && (
          <Carousel
            title="Películas de fantasía"
            items={fantasyMovies}
            cardType="poster"
          />
        )}

        {/* 12. Series de acción y aventuras */}
        {actionTv && actionTv.length > 0 && (
          <Carousel
            title="Series de acción y aventuras"
            items={actionTv}
            cardType="poster"
          />
        )}

        {/* 13. Series de ciencia ficción y fantasía */}
        {scifiTv && scifiTv.length > 0 && (
          <Carousel
            title="Series de ciencia ficción y fantasía"
            items={scifiTv}
            cardType="poster"
          />
        )}

        {/* 14. Series para niños/as */}
        {kidsTv && kidsTv.length > 0 && (
          <Carousel
            title="Series para niños/as"
            items={kidsTv}
            cardType="poster"
          />
        )}

      </div>
    </main>
  );
}
