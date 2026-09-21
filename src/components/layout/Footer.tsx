"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, Flame, Tv, Film, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const mobileNavItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Tendencias', path: '/tendencias', icon: Flame },
    { label: 'Películas', path: '/peliculas', icon: Film },
    { label: 'Series', path: '/series', icon: Tv },
  ];

  return (
    <footer className="bg-white/70 dark:bg-[#00040a] pt-14 pb-28 md:pb-12 border-t border-pastel-purple/20 dark:border-blue-950/60 text-slate-600 dark:text-gray-400 text-xs font-['Lexend_Deca'] transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-icon.png"
                  alt="KEZARSTREAM Logo"
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(111,207,235,0.4)]"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                KEZAR<span className="text-pastel-gradient">STREAM</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-gray-400 leading-relaxed text-xs max-w-sm">
              Tu portal multimedia para ver películas y series en calidad Full HD con audio en Español Latino y Subtitulado sin registros.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider border-l-2 border-pastel-purple dark:border-blue-500 pl-2.5">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-purple-600 dark:hover:text-blue-400 transition-colors">Inicio</Link></li>
              <li><Link href="/peliculas" className="hover:text-purple-600 dark:hover:text-blue-400 transition-colors">Películas</Link></li>
              <li><Link href="/series" className="hover:text-purple-600 dark:hover:text-blue-400 transition-colors">Series</Link></li>
              <li><Link href="/tendencias" className="hover:text-purple-600 dark:hover:text-blue-400 transition-colors">Tendencias</Link></li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider border-l-2 border-pastel-purple dark:border-blue-500 pl-2.5">
              Aviso Legal
            </h4>
            <p className="text-slate-500 dark:text-gray-500 leading-relaxed text-[11px]">
              KEZARSTREAM no almacena ningún video en sus servidores. Todo el contenido proviene de servicios externos de terceros no afiliados.
            </p>
            <div className="flex items-center gap-2 text-teal-600 dark:text-emerald-400/90 text-[11px] pt-1 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Navegación segura y sin registros</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-slate-500 dark:text-gray-500 text-[11px]">
          <p>© {new Date().getFullYear()} KEZARSTREAM. Todos los derechos reservados.</p>
          <p className="font-semibold text-pastel-gradient">Películas y Series gratis en HD</p>
        </div>

      </div>

      {/* Floating Mobile Bottom Navigation Pill */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-white/95 dark:bg-[#051237]/90 backdrop-blur-2xl border border-pastel-purple/30 dark:border-blue-900/50 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-xl shadow-purple-950/10 dark:shadow-blue-950/80">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-0.5 transition-all ${
                  isActive ? 'text-purple-600 dark:text-blue-400 scale-110 font-bold' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
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
