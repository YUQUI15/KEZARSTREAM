import { searchMulti, getTrendingDay } from '@/lib/tmdb';
import MovieCard from '@/components/ui/MovieCard';
import { Search, Flame } from 'lucide-react';

interface SearchPageProps {
  searchParams: { q?: string };
}

export const revalidate = 60;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  let results: any[] = [];
  let trending: any[] = [];

  if (query.trim()) {
    results = await searchMulti(query.trim());
  } else {
    trending = await getTrendingDay();
  }

  return (
    <main className="min-h-screen bg-[#f8fafd] dark:bg-[#000814] text-slate-900 dark:text-white pt-24 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-gray-800/80">
          <div className="flex items-center gap-2 text-purple-600 dark:text-pastel-cyan text-xs font-bold uppercase tracking-wider mb-2">
            <Search className="w-4 h-4" />
            <span>BÚSQUEDA DE CONTENIDO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {query ? (
              <span>Resultados para: <span className="text-pastel-pink">&ldquo;{query}&rdquo;</span></span>
            ) : (
              <span>Explora títulos recomendados</span>
            )}
          </h1>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item: any) => (
              <MovieCard key={item.id} media={item} />
            ))}
          </div>
        ) : query ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-xl font-bold text-slate-800 dark:text-gray-300">No encontramos resultados para &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-slate-500 dark:text-gray-500 max-w-md mx-auto">
              Verifica que el nombre esté bien escrito o prueba buscando en nuestro catálogo con palabras clave generales.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-pastel-yellow">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Lo más buscado y visto hoy:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {trending.map((item: any) => (
                <MovieCard key={item.id} media={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
