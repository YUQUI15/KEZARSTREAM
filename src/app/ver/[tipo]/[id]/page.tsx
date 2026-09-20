import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Calendar, Film, Send, ShieldCheck, Share2, Play } from 'lucide-react';
import VideoPlayer from '@/components/player/VideoPlayer';
import SeasonSelector from '@/components/player/SeasonSelector';
import Carousel from '@/components/ui/Carousel';
import { getMovieDetails, getTVDetails, getSimilar } from '@/lib/tmdb';

interface PageProps {
  params: { tipo: string; id: string };
  searchParams: { season?: string; episode?: string };
}

export async function generateMetadata({ params }: PageProps) {
  const { tipo, id } = params;
  let title = 'Ver | KEZARSTREAM';

  try {
    if (tipo === 'pelicula' || tipo === 'movie') {
      const data = await getMovieDetails(id);
      if (data) title = `${data.title} - Ver Película Online Gratis | KEZARSTREAM`;
    } else if (tipo === 'serie' || tipo === 'tv') {
      const data = await getTVDetails(id);
      if (data) title = `${data.name} - Ver Serie Online Gratis | KEZARSTREAM`;
    }
  } catch (error) {
    console.error(error);
  }

  return { title };
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { tipo, id } = params;
  const season = parseInt(searchParams.season || '1', 10);
  const episode = parseInt(searchParams.episode || '1', 10);

  if (tipo !== 'movie' && tipo !== 'tv' && tipo !== 'pelicula' && tipo !== 'serie') {
    notFound();
  }

  const mediaType = tipo === 'pelicula' ? 'movie' : tipo === 'serie' ? 'tv' : tipo;

  let details: any = null;
  let similar: any[] = [];

  try {
    if (mediaType === 'movie') {
      details = await getMovieDetails(id);
      similar = await getSimilar('movie', id);
    } else {
      details = await getTVDetails(id);
      similar = await getSimilar('tv', id);
    }
  } catch (error) {
    console.error("Error fetching media details:", error);
    notFound();
  }

  if (!details) {
    notFound();
  }

  const title = details.title || details.name;
  const isMovie = mediaType === 'movie';
  const year = (details.release_date || details.first_air_date || '').substring(0, 4);
  const rating = Number(details.vote_average || 0).toFixed(1);
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : '';
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : '/placeholder-poster.png';

  return (
    <main className="min-h-screen bg-[#000814] text-white pt-20 pb-20 relative overflow-hidden">
      
      {/* Ambient backdrop glow */}
      {backdropUrl && (
        <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden opacity-25 pointer-events-none">
          <Image
            src={backdropUrl}
            alt="Backdrop glow"
            fill
            priority
            className="object-cover blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000814]/80 to-[#000814]" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs text-gray-400 py-4 mb-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href={isMovie ? '/peliculas' : '/series'} className="hover:text-blue-400 transition-colors">
            {isMovie ? 'Películas' : 'Series'}
          </Link>
          <span>/</span>
          <span className="text-white font-medium truncate max-w-xs">{title}</span>
          {!isMovie && (
            <span className="text-blue-400 font-semibold">• T{season} : E{episode}</span>
          )}
        </div>

        {/* Multi-Server Video Player Container */}
        <div className="mb-8">
          <VideoPlayer
            type={mediaType as 'movie' | 'tv'}
            id={id}
            season={season}
            episode={episode}
            title={title}
          />
        </div>

        {/* Media Details Banner */}
        <div className="bg-[#051226]/80 backdrop-blur-xl border border-blue-950/80 rounded-3xl p-6 md:p-8 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            
            {/* Poster thumbnail */}
            <div className="relative w-36 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-blue-900/40 flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={posterUrl}
                alt={title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                1080p
              </div>
            </div>

            {/* Info and metadata */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-600/30 text-blue-400 border border-blue-500/40">
                    {isMovie ? 'Película' : 'Serie'}
                  </span>
                  
                  {year && (
                    <span className="flex items-center gap-1 text-xs text-gray-300 bg-gray-900 px-2.5 py-0.5 rounded-full border border-gray-800">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {year}
                    </span>
                  )}

                  {details.runtime ? (
                    <span className="flex items-center gap-1 text-xs text-gray-300 bg-gray-900 px-2.5 py-0.5 rounded-full border border-gray-800">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {details.runtime} min
                    </span>
                  ) : null}

                  {rating !== '0.0' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                      <Star className="w-3 h-3 fill-current" />
                      {rating} TMDB
                    </span>
                  )}

                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Audio Dual / Sub
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h1>

                {details.tagline && (
                  <p className="text-sm italic text-blue-400/90 mt-1">&ldquo;{details.tagline}&rdquo;</p>
                )}
              </div>

              {/* Genre chips */}
              {details.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((g: { id: number; name: string }) => (
                    <span
                      key={g.id}
                      className="text-xs font-medium text-gray-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-900/40 px-3 py-1 rounded-full transition-colors"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview / Sinopsis */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Sinopsis</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                  {details.overview || 'Sin descripción disponible para este título en español.'}
                </p>
              </div>

              {/* Cast Members */}
              {details.credits?.cast && details.credits.cast.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Reparto Principal</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.credits.cast.slice(0, 6).map((actor: any) => (
                      <span
                        key={actor.id}
                        className="text-xs bg-gray-900 text-gray-300 px-2.5 py-1 rounded-lg border border-gray-800"
                      >
                        {actor.name} <span className="text-gray-500">({actor.character})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Banner */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800/80">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Calidad verificada sin virus ni registro obligatorio</span>
                </div>

                <a
                  href="https://t.me/modocine_com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/40 text-[#229ED9] text-xs font-bold transition-all shadow-md shadow-[#229ED9]/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Pedir en Telegram</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Series Season and Episode Selector */}
        {!isMovie && details.seasons && (
          <div className="mb-14">
            <SeasonSelector
              tvId={id}
              seasons={details.seasons.filter((s: any) => s.season_number > 0)}
              currentSeason={season}
              currentEpisode={episode}
            />
          </div>
        )}

        {/* Similar Titles Carousel */}
        {similar && similar.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-800/80">
            <Carousel title="Títulos Similares que te pueden gustar" items={similar} cardType="poster" />
          </div>
        )}

      </div>
    </main>
  );
}
