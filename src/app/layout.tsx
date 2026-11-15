import type { Metadata, Viewport } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProtectionWrapper from '@/components/security/ProtectionWrapper';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import PWAInstall from '@/components/pwa/PWAInstall';
import ZaphyrelBadge from '@/components/brand/ZaphyrelBadge';

const lexend = Lexend_Deca({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KEZARSTREAM - Películas y Series Gratis en Full HD',
  description: 'Mira las mejores películas y series completas en Español Latino y Subtitulado en KEZARSTREAM.',
  applicationName: 'KEZARSTREAM',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'KEZARSTREAM',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#000814',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('kezar_theme') || 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${lexend.className} bg-[#f8fafd] dark:bg-[#000814] text-slate-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300 light-mesh-bg`}>
        <ThemeProvider>
          <ProtectionWrapper>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <PWAInstall />
            <ZaphyrelBadge />
          </ProtectionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
