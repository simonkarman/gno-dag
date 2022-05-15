import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { DateTime } from 'luxon';
import { earlyInformation, activities, welcomeMessage } from '../content/activities';

const paperColor = '#ebebeb';
const darkPaperColor = '#cbcbcb';
const accentColor = '#41586d';
const tableColor = '#f4d69e';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${tableColor};
    font-family: Book Antiqua,Palatino,Palatino Linotype,Palatino LT STD,Georgia,serif;
  }

  .paper {
    text-align: justify;
    position: relative;
    background: ${paperColor};
    width: 90%;
    max-width: 345px;
    margin: 0.5em auto;
    padding: 0 0.2em;
    display: flex;
  }

  .paper h1 {
    line-height: 1.5rem;
    padding: 0.3rem 0.3rem 0;
    font-size: 1.2em;
    cursor: default;
  }

  .paper h2 {
    line-height: 1.5rem;
    padding: 0.3rem 0.6rem 0;
    font-size: 0.75em;
    font-weight: 800;
    text-transform: uppercase;
    background-color: ${accentColor}dd;
    color: white;
    cursor: default;
  }

  .page {
    flex: 50%;
    border-radius: 3px;
    background-color: ${paperColor};
    padding-bottom: 0.5rem;
  }

  .pageNumber {
    text-align: right;
  }

  .left {
    padding-left: 0.3em;
    border-right: 1px solid ${accentColor};
    background: linear-gradient(to right,transparent 95%,${darkPaperColor});
    background-repeat: no-repeat;
    p {
      padding: 0 1rem 0 0.4rem;
    }
    h2 {
      margin-right: -1px;
    }
  }

  .right {
    padding-right: 0.3em;
    border-left: 1px solid ${accentColor};
    background: linear-gradient(to left,transparent 95%,${darkPaperColor});
    background-repeat: no-repeat;
    p {
      padding: 0 0.4rem 0 1rem;
    }
    h2 {
      margin-left: -1px;
      padding-left: 1.3rem;
    }
  }

  .page p {
    margin: 0.2rem 0;
    line-height: 1rem;
    font-size: 0.75em;
    cursor: default;
  }

  .paragraph {
    background: linear-gradient(to bottom,transparent 0.95rem, ${darkPaperColor}88 0.05rem);
    background-size: 100% 1rem;
  }

  .information {
    display: flex;
  }

  .information .key {
    font-weight: bold;
    min-width: 30%;
    margin-right: 0.3rem;
  }

  .information .value {
    color: blue;
    font-family: cursive;
    padding: 0rem 0.2rem;
    border-bottom: 1px solid ${accentColor}aa;
    flex-grow: 1;
  }

  .schedule {
    display: flex;
    align-items: flex-end;
  }

  .schedule .time {
    font-size: 0.5rem;
    font-family: monospace;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .schedule .event {
    font-family: cursive;
    padding: 0rem 0.2rem;
    border-bottom: 1px solid ${accentColor}aa;
    flex-grow: 1;
  }

  .event.known {
    color: blue;
    cursor: pointer;
  }

  .unknown {
    color: #5755556f;
    cursor: progress;
  }
`;

// eslint-disable-next-line no-process-env
const useMocked = process.env.NODE_ENV === 'development';

const Landing: NextPage = () => {
  // State
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].start);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [message, setMessage] = useState(<></>);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(-1);

  // Computed properties
  const now = useMocked ? mockedDateTime : realDateTime;
  const beforeFirstActivity = now < activities[0].start;

  // Every second update the real date time
  useEffect(() => {
    const interval = setInterval(() => {
      setRealDateTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // When selecting an activity, show the corresponding information.
  useEffect(() => {
    if (selectedActivityIndex === -1) {
      setMessage(welcomeMessage);
    } else {
      setMessage(activities[selectedActivityIndex].information);
    }
  }, [selectedActivityIndex]);

  // Make sure to hide the selected activitie if it 'now' is before it started.
  useEffect(() => {
    if (selectedActivityIndex !== -1 && now < activities[selectedActivityIndex].start) {
      setSelectedActivityIndex(-1);
    }
  }, [now]);

  return (
    <>
      <GlobalStyle />
      <div className='paper shadow letter'>
        <div className='page left'>
          <h1>GNO Dag 2022</h1>
          <p className='information'>
            <span className='key'>GNOs</span>
            <span className='value'>Jac. &amp; Govie</span>
          </p>
          <p className='information'>
            <span className='key'>Dag</span>
            <span className='value'>
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
                    {r(10, 36)}
                  </span>
                </p>
              );
            }
            return (
              <p key={activity.name} className='schedule' onClick={() => setSelectedActivityIndex(index)}>
                <span className='time known'>
                  {activity.start.toFormat('HH:mm')}
                  -
                  {(activity.end || activities[index + 1].start).toFormat('HH:mm')}
                </span>
                <span className='event known'>
                  {activity.name}
                </span>
              </p>
            );
          })}
        </div>
        <div className='page right'>
          <h2>Informatie</h2>
          <p className='paragraph'>
            {message}
          </p>
          {beforeFirstActivity && earlyInformation}
        </div>
      </div>
      {useMocked && (
        <>
          <button onClick={() => setMockedDateTime(activities[0].start.minus({ minutes: 15 }))}>before</button>
          <button onClick={() => setMockedDateTime(mockedDateTime.minus({ minutes: 15 }))}>-15min</button>
          <button onClick={() => setMockedDateTime(mockedDateTime.plus({ minutes: 15 }))}>+15min</button>
          <button onClick={() => setMockedDateTime(activities[activities.length - 1].start)}>after</button>
        </>
      )}
    </>
  );
};

export default Landing;
