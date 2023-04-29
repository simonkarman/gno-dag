import Head from 'next/head';
import {useEffect, useState} from 'react';
import { DateTime, Settings } from 'luxon';
import {useMemo} from 'react';
import scrollSvg from '../assets/scroll.svg';
import rumSvg from '../assets/rum.svg';
import parrotSvg from '../assets/parrot.svg';
import Image from 'next/image';
import { Ontbijt } from '@/activities/Ontbijt'

Settings.defaultLocale = 'nl';

interface Activity {
  start: DateTime,
  end: DateTime,
  title: string;
  Component: JSX.Element;
}

const gnoDag2023 = DateTime.fromISO('2023-05-06T09:00:00.000');
const at = (hour: number, minute: number) => gnoDag2023.set({ hour, minute });

const activities: Activity[] = [
  { start: at(9, 0), title: 'Ontbijt', Component: <Ontbijt /> },
  { start: at(10, 15), title: 'Aanstalte maken', Component: <p>Jas aan!</p> },
  { start: at(10, 30), title: 'Reis', Component: <p>Daar gaan we! Op weg naar ...?</p> },
  { start: at(11, 30), title: 'Keukenhof', Component: <p>We zijn er!</p> },
  { start: at(15, 15), title: 'Terug naar de auto', Component: <p>Tijd om weer naar de auto te gaan!</p> },
  { start: at(15, 30), title: 'Tochtje', Component: <p>En nu gaan we naar ...?</p> },
  { start: at(15, 45), title: 'Smederij', Component: <p>We zijn er!</p> },
  { start: at(18, 30), title: 'Bier', Component: <p>Is het gelukt? En smaakte het bier?</p> },
  { start: at(18, 45), title: 'Terugreis', Component: <p>Op weg naar ... huis!</p> },
  { start: at(19, 30), title: 'Diner', Component: <p>En dan het wel verdiende avond eten. Smakelijk!</p> },
].map((activity, index, arr) => {
  const isLast = index === arr.length - 1;
  return {
    ...activity,
    end: isLast ? at(22, 0) : arr[index + 1].start,
  };
});

const useMocked = process.env.NODE_ENV === 'development' || DateTime.now() > DateTime.fromISO('2023-05-06T22:00:00.000');
export default function Home() {
  // Preview SVG
  const previewSVG = useMemo(() => {
    const options = [scrollSvg, rumSvg, parrotSvg];
    return <Image
      src={options[Math.floor(Math.random() * options.length)]}
      className="animate-spin-slow"
      alt="a pirate logo that is spinning"
    />;
  }, []);

  // State
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].start);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(true);
  const [devTimeMode, setDevTimeMode] = useState(true);
  const [forceActive, setForceActive] = useState<boolean[]>(new Array(activities.length).fill(false));

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
            onClick={() => { window?.localStorage?.clear(); setForceActive(new Array(activities.length).fill(false)); }}
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
            ? <>
                <p className="text-center mb-4">
                  Op zaterdag 6 mei vieren we GNO Dag 2023. Het is bijna zo ver, we beginnen namelijk al
                  {' '}
                  <strong>{gnoDag2023.toRelative({base: now})}</strong>
                  .
                </p>
                <p className="text-center text-sm mb-4">
                  Let op: De dikgedrukte tijd wordt preciezer naarmate het moment dichter bij komt.
                  Wanneer deze timer op 0 seconden staat, zorg dan dat je gedoucht aan de eettafel in Bodegraven zit.
                </p>
                <p className="text-center">
                  Tot dan! Wij hebben er zin in!
                </p>
                <hr className="my-4"/>
                <p className='text-center'>Kan je al raden wat het thema dit jaar gaat zijn?</p>
                <div className="w-36 h-36 mx-auto my-10">
                  {previewSVG}
                </div>
                <hr className="my-4"/>
                <p className="text-center">
                  Kan je niet wachten? Kijk dan nog eens terug naar
                  {' '}
                  <a className="underline text-gray-600 hover:text-gray-800 visited:text-gray-600" href="https://gno-2022.karman.dev">
                    wat we in 2022 gedaan hebben
                  </a>.
                </p>
              </>
            : <>
              <div className='flex justify-between items-end'>
                <h1>Activiteiten</h1>
                <div className='flex-0 bg-blue-100 text-blue-800 font-medium px-4 py-1 rounded-full'>
                  Klok: {now.toFormat('HH:mm:ss')}
                </div>
              </div>
              <hr className='my-4'/>
              {activities.filter(activity => activity.start <= now).reverse().map((activity, index) => {
                const isNow = now < activity.end;
                const isOpen = isNow || forceActive[index];
                return (
                  <>
                    <div
                      key={activity.start.toISO()}
                      className={`${isNow ? 'bg-green-200' : ''} px-4 py-3 rounded-lg border my-2`}
                      onClick={() => {
                        const newForceActive = [...forceActive];
                        newForceActive[index] = !newForceActive[index]
                        setForceActive(newForceActive);
                      }}
                    >
                      <div className='flex justify-between items-start'>
                        <h1 className={`${isNow ? 'font-bold' : 'text-gray-700'} text-2xl`}>{activity.title}</h1>
                        <p
                          className='flex-0 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full'
                        >{activity.start.toFormat('HH:mm')} - {activity.end.toFormat('HH:mm')}</p>
                      </div>
                      {isOpen && activity.Component}
                    </div>
                  </>
                );
                })}
            </>
          }
        </main>
        <DevelopmentMode />
      </div>
    </>
  )
}
