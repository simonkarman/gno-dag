'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { DisplayClient } from '@/components/display-client';
import { ControllerClient } from '@/components/controller-client';

function EnsureLargeScreen({ width, children }: { width: number, children: React.ReactNode }) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : width + 1
  );

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
    <div className={`w-[1100px] mx-auto relative mt-5 ${isLargeScreen ? '' : 'hidden'}`}>{children}</div>
    <div className={`text-center space-y-4 p-8 ${isLargeScreen ? 'hidden' : ''}`}>
      <h1 className="text-4xl font-bold drop-shadow">GNO Dag 2025</h1>
      <p><b>Open deze pagina op een groot scherm!</b> Scan daarna de QR code met je mobiel om deel te nemen.</p>
    </div>
  </div>;
}

export default function MyApp() {
  const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL || `ws://localhost:8082/krmx?version=0.1.0`;
  const displayId = useSearchParams().get("d");

  return (displayId == null)
    ? <EnsureLargeScreen width={1200}>
      <DisplayClient serverUrl={serverUrl} />
  </EnsureLargeScreen>
    : <ControllerClient serverUrl={serverUrl} displayId={displayId} />;
}
