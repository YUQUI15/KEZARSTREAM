import React from 'react';

interface VideoPlayerProps {
  type: 'movie' | 'tv' | 'pelicula' | 'serie';
  id: string | number;
  season?: string | number;
  episode?: string | number;
}

export default function VideoPlayer({ type, id, season, episode }: VideoPlayerProps) {
  let embedUrl = '';
  const isMovie = type === 'movie' || type === 'pelicula';
  
  if (isMovie) {
    embedUrl = `https://vidsrc.xyz/embed/movie/${id}`;
  } else {
    embedUrl = `https://vidsrc.xyz/embed/tv/${id}?season=${season || 1}&episode=${episode || 1}`;
  }

  return (
    <div className="w-full aspect-video bg-[#00040a] rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
      <iframe
        src={embedUrl}
        className="w-full h-full absolute inset-0"
        frameBorder="0"
        allowFullScreen
        referrerPolicy="origin"
      ></iframe>
    </div>
  );
}
