import Preview from '@/components/preview';
import Head from 'next/head';
import {useEffect, useState} from 'react';
import { DateTime, Settings } from 'luxon';

interface Activity {
  start: DateTime,
  end?: DateTime,
  title: string;
  Component: JSX.Element;
}

const gnoDag2023 = DateTime.fromISO('2023-05-06T07:00:00.000');
const at = (hour: number, minute: number) => gnoDag2023.set({ hour, minute });
const activities: Activity[] = [
  { start: at(7, 0), title: 'Example', Component: <p>Hello!</p> },
];

const useMocked = process.env.NODE_ENV === 'development' || DateTime.now() > DateTime.fromISO('2023-05-06T22:00:00.000');
export default function Home() {
  // State
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].start);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(true);
  const [devTimeMode, setDevTimeMode] = useState(true);

  // Computed properties
  const now = (useMocked && devTimeMode) ? mockedDateTime : realDateTime;
  const isToday = now.toFormat('yyyyMMdd') === activities[0].start.toFormat('yyyyMMdd');
  const isEarly = now < activities[0].start;

  // Every second; update the real date time
  useEffect(() => {
    const interval = setInterval(() => {
      setRealDateTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const DevelopmentMode = () => <>
    {(useMocked && showDevelopmentMode) && (
      <div className="bg-white max-w-lg mx-auto px-8 py-4 my-10 rounded-lg shadow-2xl">
        <h1 className="font-bold text-center text-xl">Development Mode ⚠️</h1>
        <hr className="mt-2 mb-4"/>
        <div className='flex gap-4 mb-4'>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setDevTimeMode(!devTimeMode)}
          >
            {`${devTimeMode ? 'dis' : 'en'}able dev time`}
          </button>
          <button
            className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => { window?.localStorage?.clear(); }}
          >
            reset all
          </button>
        </div>
        {devTimeMode && (<div className='flex gap-4'>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setMockedDateTime(activities[0].start.minus({ minutes: 15 }))}
          >
            before
          </button>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setMockedDateTime(mockedDateTime.minus({ minutes: 15 }))}
          >
            -15min
          </button>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setMockedDateTime(mockedDateTime.plus({ minutes: 15 }))}
          >
            +15min
          </button>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setMockedDateTime(activities[activities.length - 1].start)}
          >
            after
          </button>
        </div>)}
      </div>
    )}
  </>;

  return (
    <>
      <Head>
        <title>GNO Dag 2023</title>
        <meta property="og:title" content="GNO Dag 2023" key="title"/>
      </Head>
      <div className="body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
        <header className="max-w-lg mx-auto">
          <h1 onClick={() => setShowDevelopmentMode(!showDevelopmentMode)} className="text-4xl font-bold text-white text-center">GNO Dag 2023</h1>
        </header>
        <DevelopmentMode />
        <main className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          {isEarly
            ? <Preview />
            : activities[0].Component
          }
        </main>
        <DevelopmentMode />
      </div>
    </>
  )
}
