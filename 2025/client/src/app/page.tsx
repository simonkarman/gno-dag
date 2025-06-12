'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { DisplayClient } from '@/components/display-client';
import { ControllerClient } from '@/components/controller-client';
import { Random } from '@/utils/random';

function EnsureLargeScreen({ width, children }: { width: number, children: React.ReactNode }) {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isLargeScreen = windowWidth >= width;

  return <div className={``}>
    <div className={`w-[1000px] mx-auto relative mt-5 ${isLargeScreen ? '' : 'hidden'}`}>{children}</div>
    <div className={`text-center space-y-4 p-8 ${isLargeScreen ? 'hidden' : ''}`}>
      <h1 className="text-4xl font-bold drop-shadow">GNO Dag 2025</h1>
      <p><b>Open deze pagina op een groot scherm!</b> Scan daarna de QR code met je mobiel om deel te nemen.</p>
    </div>
  </div>;
}

export default function MyApp() {
  const localhostReplacement = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const serverUrl = (process.env.NEXT_PUBLIC_KRMX_SERVER_URL || `ws://localhost:8082/krmx?version=0.1.0`).replace('localhost', localhostReplacement ?? 'localhost');
  const displayId = useSearchParams().get("d");
  const r = Random.fromSeed('abc123');

  return (displayId == null)
    ? <>
      <div className="time-particles">
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="particle" style={{
            left: `${r.next() * 100}%`,
            animationDelay: `${r.next() * 10}s`,
          }} />
        ))}
      </div>
      <EnsureLargeScreen width={1020}>
          <DisplayClient serverUrl={serverUrl} />
      </EnsureLargeScreen>
    </>
    : <ControllerClient serverUrl={serverUrl} displayId={displayId} />;
}
