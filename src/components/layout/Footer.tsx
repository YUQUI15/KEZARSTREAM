"use client";

import Link from 'next/link';
import { Home, Flame, Tv, Film, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Clean navigation without Explorar
  const mobileNavItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Tendencias', path: '/tendencias', icon: Flame },
    { label: 'Películas', path: '/peliculas', icon: Film },
    { label: 'Series', path: '/series', icon: Tv },
  ];

  return (
    <footer className="bg-[#00040a] pt-14 pb-28 md:pb-12 border-t border-blue-950/60 text-gray-400 text-xs font-['Lexend_Deca']">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
                K
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                KEZAR<span className="text-blue-500">STREAM</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-xs max-w-sm">
              Tu portal multimedia para ver películas y series en calidad Full HD con audio en Español Latino, Castellano y Subtitulado sin suscripciones.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
              <li><Link href="/peliculas" className="hover:text-blue-400 transition-colors">Películas</Link></li>
              <li><Link href="/series" className="hover:text-blue-400 transition-colors">Series</Link></li>
              <li><Link href="/tendencias" className="hover:text-blue-400 transition-colors">Tendencias</Link></li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              Aviso Legal
            </h4>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              KEZARSTREAM no almacena ningún video en sus servidores. Todo el contenido proviene de servicios externos de terceros no afiliados.
            </p>
            <div className="flex items-center gap-2 text-emerald-400/90 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Navegación segura y sin registros</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-gray-500 text-[11px]">
          <p>© {new Date().getFullYear()} KEZARSTREAM. Todos los derechos reservados.</p>
          <p>Películas y Series gratis en HD</p>
        </div>

      </div>

      {/* Floating Mobile Bottom Navigation Pill matching Modocine */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-[#051237]/90 backdrop-blur-2xl border border-blue-900/50 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-2xl shadow-blue-950/80">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-0.5 transition-all ${
                  isActive ? 'text-blue-400 scale-110' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
