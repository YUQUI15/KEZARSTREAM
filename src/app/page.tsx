import { getTrending, getMovies, getTvShows, getTrendingDay } from '@/lib/tmdb';
import HeroSlider from '@/components/ui/HeroSlider';
import Carousel from '@/components/ui/Carousel';
import Link from 'next/link';
import { Send, Sparkles, ShieldCheck, Flame, Film, Tv, Trophy } from 'lucide-react';

export const revalidate = 3600;

export default async function Home() {
  const [trendingDay, nowPlayingMovies, popularTv, trendingTv, topRatedMovies] = await Promise.all([
    getTrendingDay(),
    getMovies('now_playing'),
    getTvShows('popular'),
    getTrending('tv', 'day'),
    getMovies('top_rated')
  ]);

  return (
    <main className="min-h-screen bg-[#000814] text-white">
      {/* Hero Slider with Autoplay */}
      <HeroSlider items={trendingDay.slice(0, 7)} />

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-10">
        
        {/* Películas más vistas */}
        <Carousel
          title="Películas más vistas"
          items={nowPlayingMovies || []}
          cardType="poster"
        />

        {/* TOP PELÍCULAS HOY (Numbered 1-10) */}
        <div className="py-4">
          <div className="flex items-center gap-3 mb-2 px-4 md:px-8">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-blue-500">
              TOP 10
            </span>
            <div className="border-l-2 border-gray-700 pl-3">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                Películas en Tendencia Hoy
              </h2>
              <p className="text-xs text-gray-400">Lo más visto por la comunidad en las últimas 24 horas</p>
            </div>
          </div>
          <Carousel
            items={trendingDay.slice(0, 10)}
            cardType="top"
          />
        </div>

        {/* Telegram Banner Promo */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-[#051226] to-indigo-950 border border-blue-900/50 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#229ED9]/20 text-[#229ED9] text-xs font-bold border border-[#229ED9]/30">
              <Send className="w-3.5 h-3.5" />
              <span>COMUNIDAD OFICIAL</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              ¿No encuentras lo que buscas? ¡Pídelo en Telegram!
            </h3>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl font-light">
              Únete a miles de miembros en nuestro canal para recibir enlaces directos de estrenos, reportar caídas y solicitar tus películas y series favoritas gratis.
            </p>
          </div>

          <a
            href="https://t.me/modocine_com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-bold text-sm shadow-xl shadow-[#229ED9]/30 hover:scale-105 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Unirse a Telegram</span>
          </a>
        </div>

        {/* Series más vistas */}
        <Carousel
          title="Series más vistas"
          items={popularTv || []}
          cardType="poster"
        />

        {/* TOP SERIES HOY (Numbered 1-10) */}
        <div className="py-4">
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

        {/* Películas Mejor Valoradas */}
        <Carousel
          title="Películas Aclamadas por la Crítica"
          items={topRatedMovies || []}
          cardType="poster"
        />

      </div>
    </main>
  );
}
