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
        <div className="flex min-h-[100svh] flex-col items-center justify-between">
          <div className="w-full grow">
            {children}
          </div>
          <footer className="mb-1 flex items-center gap-2 px-3 py-1">
            <p className="text-center text-xs text-zinc-500">
              <span>Built with</span>{' '}
              <a href="https://github.com/simonkarman/krmx" className="font-semibold tracking-wide text-zinc-400 hover:underline">Krmx</a>
              {' '}by{' '}
              <a href="https://www.simonkarman.nl" className="text-zinc-400 tracking-wide font-bold hover:underline">simonkarman</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
