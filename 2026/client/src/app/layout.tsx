import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GNO Dag 2026',
  description: 'Gender Neutrale Ouderdag 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased app-bg min-h-screen`}>
        {children}
        {/* Credit — pinned to the bottom-right corner. Fixed, so it never moves
            while the page scrolls (just like the other corner overlays). Low
            z-index keeps it under overlays such as the puzzle panel (z-20), and
            pointer-events are limited to the text so it never blocks the map. */}
        <footer className="fixed bottom-1 right-2 z-10 flex items-center gap-2 pointer-events-none">
          <p className="text-right text-xs text-zinc-500 pointer-events-auto">
            <span>Built with</span>{' '}
            <a href="https://github.com/simonkarman/krmx" className="font-semibold tracking-wide text-zinc-400 hover:underline">Krmx</a>
            {' '}by{' '}
            <a href="https://www.simonkarman.nl" className="text-zinc-400 tracking-wide font-bold hover:underline">simonkarman</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
