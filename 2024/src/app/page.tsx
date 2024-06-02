"use client";

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export default function Home() {
  const getRemainingSeconds = () => DateTime.fromISO('2024-06-16T09:00:00Z').toRelative({ locale: 'nl', unit: 'seconds' });
  const [time, setTime] = useState(getRemainingSeconds());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRemainingSeconds());
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-green-500">
      <main
        className={'flex-grow flex flex-col items-center justify-center gap-8 md:gap-24 p-8 md:p-24'}
      >
        <h1 className='text-center text-green-300 font-bold text-4xl'>
          GNO Dag 2024
        </h1>
        <p className='text-center text-green-200 text-2xl'>
          start {time}
        </p>
      </main>
      <footer className='flex-grow-0 text-green-700'>
        🚩 Georganiseerd door: Simon Karman & Marjolein Karman 🚩
      </footer>
    </div>
  );
}
