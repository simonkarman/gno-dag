import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { DateTime, Settings } from 'luxon';
import { GlobalStyle } from '../components/GlobalStyle';
import { activities } from '../content/Activities';
import { useLocalStorageInteger } from '../hooks/common/useTransformedStorage';
import { WelcomeMessage } from '../content/WelcomeMessage';

Settings.defaultLocale = 'nl';

// eslint-disable-next-line no-process-env
const useMocked = process.env.NODE_ENV === 'development' || DateTime.now() > DateTime.fromISO('2022-06-05T21:00:00.000');
const Landing: NextPage = () => {
  // State
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].start);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [selectedActivityIndex, setSelectedActivityIndex] = useLocalStorageInteger('general--selected', -1);
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

  // Make sure to hide the selected activitie if it 'now' is before it started.
  useEffect(() => {
    // Skip if no activity is selected
    if (selectedActivityIndex === -1) {
      return;
    }
    // Skip if selected activity is before now
    if (activities[selectedActivityIndex].start <= now) {
      return;
    }
    // Otherwise, hide it
    setSelectedActivityIndex(-1);
  }, [now]);

  const DevelopmentMode = () => <>
    {(useMocked && showDevelopmentMode) && (
      <div className='paper shadow letter'>
        <div style={{ width: '100%' }}>
          <h1 style={{ textAlign: 'center' }}>Development Mode ⚠️</h1>
          <div className='buttonrow'>
            <button onClick={() => setDevTimeMode(!devTimeMode)}>
              {`${devTimeMode ? 'dis' : 'en'}able dev time`}
            </button>
            <button
              className='danger'
              onClick={() => { window?.localStorage?.clear(); setSelectedActivityIndex(-1); }}
            >
              reset all
            </button>
          </div>
          {devTimeMode && (<div className='buttonrow'>
            <button onClick={() => setMockedDateTime(activities[0].start.minus({ minutes: 15 }))}>before</button>
            <button onClick={() => setMockedDateTime(mockedDateTime.minus({ minutes: 15 }))}>-15min</button>
            <button onClick={() => setMockedDateTime(mockedDateTime.plus({ minutes: 15 }))}>+15min</button>
            <button onClick={() => setMockedDateTime(activities[activities.length - 1].start)}>after</button>
          </div>)}
        </div>
      </div>
    )}
  </>;

  return (
    <>
      <GlobalStyle />
      <DevelopmentMode />
      <div className='paper shadow letter'>
        <div className='page left'>
          <h1 onClick={() => setShowDevelopmentMode(!showDevelopmentMode)}>GNO Dag 2022</h1>
          <p className='information'>
            <span className='key'>GNOs</span>
            <span className='value'>Jac. &amp; Govie</span>
          </p>
          <p className='information'>
            <span className='key'>Dag</span>
            <span className={isToday ? 'value' : 'value strikethrough'}>
              {now.toFormat('dd LLLL yyyy')}
            </span>
          </p>
          <p className='information'>
            <span className='key'>Tijd</span>
            <span className='value'>
              {now.toFormat('HH:mm:ss')}
            </span>
          </p>
          <p className='information'>
            <span className='key'>Aanwezigen</span>
            <span className='value'>GJSLMT</span>
          </p>
          <h2 onClick={() => setSelectedActivityIndex(-1)}>Tijdschema</h2>
          {activities.sort((a, b) => a.start.diff(b.start, 'minutes').minutes).map((activity, index) => {
            if (now < activity.start) {
              const r = (length: number, radix: number) => `${Math.random().toString(radix).slice(2, 2 + length)}`;
              return (
                <p className='schedule'>
                  <span className='time unknown'>
                    {`${r(2, 10)}:${r(2, 10)}-${r(2, 10)}:${r(2, 10)}`}
                  </span>
                  <span className='event unknown'>
                    {r(9, 36)}
                  </span>
                </p>
              );
            }
            const selected = index === selectedActivityIndex ? 'selected ' : '';
            return (
              <p key={activity.title} className='schedule' onClick={() => setSelectedActivityIndex(index)}>
                <span className='time known'>
                  {activity.start.toFormat('HH:mm')}
                  -
                  {(activity.end || activities[index + 1].start).toFormat('HH:mm')}
                </span>
                <span className={selected + 'event known'}>
                  {activity.title}
                </span>
              </p>
            );
          })}
        </div>
        <div className='page right'>
          <h2>
            {selectedActivityIndex === -1 ? 'Informatie' : activities[selectedActivityIndex].title}
          </h2>
          {(selectedActivityIndex === -1)
            ? <WelcomeMessage isEarly={isEarly} />
            : activities[selectedActivityIndex].Component
          }
        </div>
      </div>
      <DevelopmentMode />
    </>
  );
};

export default Landing;
