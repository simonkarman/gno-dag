import type { Metadata, Viewport } from 'next';
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
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'GNO Dag',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Let content extend under the status bar / home indicator so the map can fill
  // the whole screen in standalone mode; safe-area insets keep the UI clear.
  viewportFit: 'cover',
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
        <footer className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.25rem)] right-[calc(env(safe-area-inset-right)+0.5rem)] z-10 flex items-center gap-2 pointer-events-none">
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
