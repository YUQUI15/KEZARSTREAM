import { searchMulti } from '@/lib/tmdb';
import { MediaItem } from '@/types/tmdb';
import MovieCard from '@/components/ui/MovieCard';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const results = query ? await searchMulti(query) : [];

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Resultados para "${query}"` : 'Busca películas y series'}
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item: MediaItem) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      ) : query ? (
        <p className="text-gray-400">No se encontraron resultados.</p>
      ) : null}
    </div>
  );
}
