"use client";

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export default function Home() {
  const getRemainingSeconds = () => DateTime.fromISO('2024-06-16T09:00:00Z').toRelative({ locale: 'nl', unit: 'seconds' });
  const [time, setTime] = useState<string | null>('over veel seconden');
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRemainingSeconds());
    }, 250);
    return () => clearInterval(interval);
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-green-500">
      <main
        className={'flex-grow flex flex-col items-center justify-center gap-8 md:gap-12 p-8 md:p-24'}
      >
        <h1 className="text-center text-green-300 font-bold text-2xl">
          GNO Dag 2024
        </h1>
        <p className="text-center text-white font-bold text-3xl">
          start {time}
        </p>
        <p className="text-center text-green-300 font-bold text-xl">
          in Bodegraven.
        </p>
      </main>
      <footer className="flex-grow-0 text-green-600 text-center">
        <a href={'https://gno-2023.karman.dev'}>GNO Dag 2023</a> | <a href={'https://gno-2022.karman.dev'}>GNO Dag 2022</a> | <a href={'https://gno-2021.karman.dev'}>GNO Dag 2021</a><br/>
        Georganiseerd door: Simon Karman & Marjolein Karman<br/>
      </footer>
    </div>
  );
}
