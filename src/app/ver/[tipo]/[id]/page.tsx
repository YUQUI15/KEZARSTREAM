import React from 'react';
import { notFound } from 'next/navigation';
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
      if (data) title = `${data.title} - Ver Película | KEZARSTREAM`;
    } else if (tipo === 'serie' || tipo === 'tv') {
      const data = await getTVDetails(id);
      if (data) title = `${data.name} - Ver Serie | KEZARSTREAM`;
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

  return (
    <main className="min-h-screen bg-[#000814] text-white pt-24 pb-16 font-['Lexend_Deca']">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Player Container */}
        <div className="mb-10 lg:mb-12">
          <VideoPlayer
            type={mediaType as 'movie' | 'tv'}
            id={id}
            season={season}
            episode={episode}
          />
        </div>

        {/* Info Container */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            {details.release_date || details.first_air_date ? (
              <span className="bg-gray-800 px-3 py-1 rounded-md text-white">
                {(details.release_date || details.first_air_date).substring(0, 4)}
              </span>
            ) : null}
            
            {details.vote_average ? (
              <span className="flex items-center gap-1 text-blue-500 font-semibold bg-blue-900/20 px-3 py-1 rounded-md">
                ★ {Number(details.vote_average).toFixed(1)}
              </span>
            ) : null}

            {details.runtime ? (
              <span className="text-gray-300">{details.runtime} min</span>
            ) : null}

            {details.genres && details.genres.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {details.genres.map((g: { id: number; name: string }) => (
                  <span key={g.id} className="text-gray-400 border border-gray-700 px-3 py-1 rounded-full text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl font-light">
            {details.overview || 'No hay descripción disponible para este título en este momento.'}
          </p>
        </div>

        {/* Series Seasons & Episodes */}
        {mediaType === 'tv' && details.seasons && (
          <div className="mb-16 border-t border-gray-800 pt-8">
            <SeasonSelector
              tvId={id}
              seasons={details.seasons.filter((s: { season_number: number }) => s.season_number > 0)}
              currentSeason={season}
              currentEpisode={episode}
            />
          </div>
        )}

        {/* Similar Carousel */}
        {similar && similar.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Podría Gustarte</h2>
            <Carousel title="Contenido Similar" items={similar} cardType="poster" />
          </div>
        )}

      </div>
    </main>
  );
}
