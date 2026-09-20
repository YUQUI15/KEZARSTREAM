import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectionWrapper from '@/components/ProtectionWrapper';

const lexend = Lexend_Deca({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KEZARSTREAM - Tu plataforma de streaming',
  description: 'Las mejores películas y series en KEZARSTREAM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${lexend.className} bg-[#000814] text-white min-h-screen flex flex-col`}>
        <ProtectionWrapper>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ProtectionWrapper>
      </body>
    </html>
  );
}
