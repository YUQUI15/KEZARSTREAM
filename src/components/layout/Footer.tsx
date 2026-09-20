import Link from 'next/link';
import { Home, Flame, Tv, Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000814] pt-12 pb-24 md:pb-8 border-t border-gray-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold tracking-tighter text-white mb-4">
            <span className="text-blue-500">KEZAR</span>STREAM
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Tu plataforma de streaming favorita con las mejores películas y series.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/terminos" className="hover:text-blue-400 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-blue-400 transition-colors">Privacidad</Link>
          </div>
          <p className="mt-8 text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} KEZARSTREAM. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#000a18]/90 backdrop-blur-xl border border-gray-800 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-blue-900/20 z-50">
        <Link href="/" className="text-gray-400 hover:text-blue-500 transition-colors flex flex-col items-center">
          <Home className="w-5 h-5" />
        </Link>
        <Link href="/tendencias" className="text-gray-400 hover:text-blue-500 transition-colors flex flex-col items-center">
          <Flame className="w-5 h-5" />
        </Link>
        <Link href="/series" className="text-gray-400 hover:text-blue-500 transition-colors flex flex-col items-center">
          <Tv className="w-5 h-5" />
        </Link>
        <Link href="/peliculas" className="text-gray-400 hover:text-blue-500 transition-colors flex flex-col items-center">
          <Film className="w-5 h-5" />
        </Link>
      </div>
    </footer>
  );
}
