"use client";

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export default function Home() {
  const getRemainingSeconds = () => DateTime.fromISO('2024-06-16T09:00:00').toRelative({ locale: 'nl', unit: 'seconds' });
  const [time, setTime] = useState<string | null>('over veel seconden');
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRemainingSeconds());
    }, 250);
    return () => clearInterval(interval);
  });
  const content = (time !== null && time.endsWith('geleden'))
    ? <Programma />
    : <>
      <p className="text-center text-white font-bold text-3xl">
        start {time}
      </p>
      <p className="text-center text-green-300 font-bold text-xl">
        in Bodegraven.
      </p>
    </>
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-between bg-green-500">
      <main
        className={'flex-grow flex flex-col items-center justify-center gap-8 md:gap-12 p-8 md:p-24'}
      >
        <h1 className="text-center text-green-300 font-bold text-4xl">
          GNO Dag 2024
        </h1>
        {content}
      </main>
      <footer className="flex-grow-0 text-green-700 text-xs text-center">
        <a className='underline' href={'https://gno-2023.karman.dev'}>GNO Dag 2023</a> | <a className='underline'
                                                                                            href={'https://gno-2022.karman.dev'}>GNO Dag 2022</a> | <a
        className='underline' href={'https://gno-2021.karman.dev'}>GNO Dag 2021</a><br/>
        Georganiseerd door: <a href='https://www.simonkarman.nl'>Simon Karman</a> & Marjolein Karman<br/>
      </footer>
    </div>
  );
}

const items = [
  { start: '09:00', end: '10:00', title: 'Thuis ontbijt' },
  { start: '10:00', end: '11:00', title: 'Reizen' },
  { start: '11:00', end: '13:15', title: 'Mini Golf Lage Vuursche' },
  { start: '13:30', end: '14:30', title: 'Lunchen in het bos' },
  { start: '14:30', end: '15:30', title: 'Reizen' },
  { start: '15:30', end: '16:30', title: 'Rusten' },
  { start: '16:30', end: '18:30', title: 'Zelf pasta maken' },
  { start: '18:00', end: '21:00', title: 'Avondeten' },
]

const Programma = () => {
  return <div>
    <p className="text-green-100 underline mb-3 font-bold text-xl">
      Programma!
    </p>
    <ul className='flex flex-col gap-2'>
      {items.map((item, index) => (
        <li key={index} className='flex items-center gap-4'>
          <p className='text-center text-green-100 font-bold tracking-tight px-2 py-1 w-36 bg-green-600 rounded'>{item.start} - {item.end}</p>
          <p className='text-center text-white text-xl font-bold'>{item.title}</p>
        </li>
      ))}
    </ul>
  </div>
}
