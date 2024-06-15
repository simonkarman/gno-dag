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
        <h1 className="text-center text-green-300 font-bold text-5xl">
          GNO Dag 2024
        </h1>
        {content}
      </main>
      <footer className="flex-grow-0 text-green-700 text-xs text-center pb-0.5">
        <a className='underline' href={'https://gno-2023.karman.dev'}>GNO Dag 2023</a> | <a className='underline'
                                                                                            href={'https://gno-2022.karman.dev'}>GNO Dag 2022</a> | <a
        className='underline' href={'https://gno-2021.karman.dev'}>GNO Dag 2021</a><br/>
        Georganiseerd door: <a href='https://www.simonkarman.nl'>Simon Karman</a> & Marjolein Karman<br/>
      </footer>
    </div>
  );
}

const items = [
  { start: '09:00', end: '10:00', title: 'Ontbijt' },
  { start: '10:00', end: '11:00', title: '🚗 🛻' },
  { start: '11:00', end: '13:15', title: 'Mini Golf Lage Vuursche' },
  { start: '13:15', end: '14:30', title: 'Lunchen in het bos' },
  { start: '14:30', end: '15:30', title: '🛻 🚗' },
  { start: '15:30', end: '16:30', title: 'Rusten' },
  { start: '16:30', end: '18:30', title: 'Kookworkshop Ravioli' },
  { start: '18:30', end: '21:00', title: 'Avondeten' },
];

const isNowLaterThan = (time: string) => {
  const now = DateTime.now().setZone('Europe/Amsterdam');
  const [hours, minutes] = time.split(':').map(Number);
  const then = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  return now > then;
}

const Programma = () => {
  return <div>
    <p className="text-green-100 underline mb-3 font-bold text-xl">
      Programma!
    </p>
    <ul className='flex flex-col gap-2'>
      {items.map((item, index) => {
        const show = isNowLaterThan(item.start);
        return (
          <li key={index} className="flex items-center gap-4">
            <p
              className={`text-center font-bold tracking-tight px-2 py-1 w-32 rounded-xl ${show ? 'bg-green-600 text-green-100' : 'bg-green-300 text-green-500'}`}
            >
              {item.start} - {item.end}
            </p>
            <p
              className={`text-center text-xl font-bold ${show ? 'text-white' : 'text-green-300'}`}
            >
              {show ? item.title : '???'}
            </p>
          </li>
        );
      })}
    </ul>
  </div>
}
