import {ThuisOntbijt} from '@/activities/01_ThuisOntbijt';
import {ThuisVerhaal} from '@/activities/02_ThuisVerhaal';
import {ThuisTandenpoetsen} from '@/activities/03_ThuisTandenpoetsen';
import {Heenreis} from '@/activities/04_Heenreis';
import {HeenreisPuzzel} from '@/activities/05_HeenreisPuzzel';
import {KeukenhofAankomst} from '@/activities/06_KeukenhofAankomst';
import {KeukenhofOpdrachten} from '@/activities/07_KeukenhofOpdrachten';
import {KeukenhofLunch} from '@/activities/08_KeukenhofLunch';
import {KeukenhofUitgangZoeken} from '@/activities/09_KeukenhofUitgangZoeken';
import {Terugreis} from '@/activities/10_Terugreis';
import {ThuisAankomst} from '@/activities/11_ThuisAankomst';
import {ThuisRaadsels} from '@/activities/12_ThuisRaadsels';
import {ThuisKnutselen} from '@/activities/13_ThuisKnutselen';
import {ThuisDiner} from '@/activities/14_ThuisDiner';
import {ThuisEinde} from '@/activities/15_ThuisEinde';
import Head from 'next/head';
import {useEffect, useState} from 'react';
import { DateTime, Settings } from 'luxon';
import {useMemo} from 'react';
import scrollSvg from '../assets/scroll.svg';
import rumSvg from '../assets/rum.svg';
import parrotSvg from '../assets/parrot.svg';
import Image from 'next/image';

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
  { start: at(9, 0), title: 'Ontbijt', Component: <ThuisOntbijt /> },
  { start: at(9, 15), title: 'Spanning stijgt', Component: <ThuisVerhaal /> },
  { start: at(10, 10), title: 'Oh nee!', Component: <ThuisTandenpoetsen /> },
  { start: at(10, 30), title: 'Erachteraan', Component: <Heenreis /> },
  { start: at(10, 40), title: 'Heg', Component: <HeenreisPuzzel /> },
  { start: at(11, 30), title: 'Aankomst', Component: <KeukenhofAankomst /> },
  { start: at(11, 45), title: 'Inspiratie', Component: <KeukenhofOpdrachten /> },
  { start: at(13, 30), title: 'Lunch', Component: <KeukenhofLunch /> },
  { start: at(15, 0), title: 'Uitgang', Component: <KeukenhofUitgangZoeken /> },
  { start: at(15, 15), title: 'Reis', Component: <Terugreis /> },
  { start: at(16, 15), title: 'Thuis', Component: <ThuisAankomst /> },
  { start: at(16, 30), title: 'Raadsels', Component: <ThuisRaadsels /> },
  { start: at(16, 40), title: 'Knutselen', Component: <ThuisKnutselen /> },
  { start: at(19, 15), title: 'Diner', Component: <ThuisDiner /> },
  { start: at(20, 30), title: 'Einde', Component: <ThuisEinde /> },
].map((activity, index, arr) => {
  const isLast = index === arr.length - 1;
  return {
    ...activity,
    end: isLast ? at(22, 0) : arr[index + 1].start,
  };
});

const useMocked = process.env.NODE_ENV === 'development' || DateTime.now() > gnoDag2023.set({ hour: 22, minute: 0 });
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
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].end);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(true);
  const [devTimeMode, setDevTimeMode] = useState(true);
  const [forceActive, setForceActive] = useState<boolean[]>(new Array(activities.length).fill(false));

  // Computed properties
  const now = (useMocked && devTimeMode) ? mockedDateTime : realDateTime;
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
      <div className="bg-white max-w-lg mx-auto px-6 py-4 my-10 rounded-lg shadow-2xl text-xs">
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
      <div className="min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
        <header className="max-w-lg mx-auto">
          <h1 onClick={() => setShowDevelopmentMode(!showDevelopmentMode)} className="text-4xl font-bold text-white text-center">GNO Dag 2023</h1>
        </header>
        <DevelopmentMode />
        <main className="bg-white max-w-lg mx-auto py-4 px-3 md:p-8 my-10 rounded-lg shadow-2xl">
          {isEarly
            ? <>
                <p className="text-center mb-4">
                  Op zaterdag 6 mei vieren we GNO Dag 2023. Het is bijna zo ver, we beginnen namelijk al
                  {' '}
                  <strong>{gnoDag2023.toRelative({base: now, unit: ['days', 'hours', 'minutes', 'seconds'] })}</strong>
                  .
                </p>
                <p className="text-center text-xs mb-4">
                  Let op: De bovenstaande dikgedrukte tekst is een timer die aftelt tot het begin van GNO Dag 2023.
                  De indicatie wordt preciezer naarmate het moment dichterbij komt.
                  Wanneer de timer om is, zorg dan dat je gedoucht aan de eettafel in Bodegraven zit.
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
                <h1 className="font-bold">Activiteiten</h1>
                <div className='flex-0 bg-blue-100 text-blue-800 font-medium px-4 py-1 rounded-full'>
                  Klok: {now.toFormat('HH:mm:ss')}
                </div>
              </div>
              <hr className='my-4'/>
              {activities.filter(activity => activity.start <= now).map((activity, index) => {
                const isNow = now < activity.end;
                const isOpen = isNow || forceActive[index];
                return (
                  <div
                    key={activity.start.toISO()}
                    className={`${isNow ? 'border-2 border-green-500 border-solid' : 'border-2 border-gray border-striped'} px-3 py-2 rounded-lg mt-2`}
                  >
                    <div
                      className='flex justify-between items-center'
                      onClick={() => {
                        const newForceActive = [...forceActive];
                        newForceActive[index] = !newForceActive[index]
                        setForceActive(newForceActive);
                      }}
                    >
                      <h1 className={`${isNow ? 'text-green-500' : 'text-gray-700'} font-bold text-xl`}>{activity.title}</h1>
                      <p
                        className='flex-0 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full'
                      >{activity.start.toFormat('HH:mm')} - {activity.end.toFormat('HH:mm')}</p>
                    </div>
                    {isOpen && <><hr className='my-1'/><div className="mt-2 text-justify">
                      {activity.Component}
                    </div></>}
                  </div>
                );
                }).reverse()}
            </>
          }
        </main>
        <DevelopmentMode />
      </div>
    </>
  )
}
