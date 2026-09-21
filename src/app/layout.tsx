import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProtectionWrapper from '@/components/security/ProtectionWrapper';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const lexend = Lexend_Deca({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KEZARSTREAM - Películas y Series Gratis en Full HD',
  description: 'Mira las mejores películas y series completas en Español Latino y Subtitulado en KEZARSTREAM.',
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
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
          </ProtectionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
