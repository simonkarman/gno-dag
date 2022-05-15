import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { DateTime, Settings } from 'luxon';
import { activities, WelcomeMessage } from '../content';
import { paragraphFont, writingFont } from './_document';

Settings.defaultLocale = 'nl';

const tableColor = '#f4d69e';
const paperColor = '#fffaf5';
const darkPaperColor = '#cbcbcb';
const textColor = '#040b35';
const accentColor = '#41586d';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${tableColor};
    color: ${textColor};
    font-family: ${paragraphFont.name}, serif;
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
    font-size: 1.14em;
    cursor: default;
  }

  .paper h2 {
    line-height: 1.2rem;
    padding: 0rem 0.6rem 0;
    font-size: 0.75em;
    font-weight: 800;
    text-transform: uppercase;
    background-color: ${accentColor}dd;
    color: ${paperColor};
    cursor: default;
  }

  .buttonrow {
    display: flex;
    align-items: center;
    align-content: center;

    button {
      flex: 1;
      background-color: ${accentColor};
      color: ${paperColor};
      border-radius: 3px;
      border: none;
      margin: 1px;
      padding: 0.2rem;
      font-family: monospace;
    }

    .danger {
      background-color: red;
    }
  }

  .page {
    flex: 50%;
    border-radius: 3px;
    background-color: ${paperColor};
    padding-bottom: 0.5rem;

    /* Scrolling */
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
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
      padding: 0 0.4rem 0.5rem 1rem;
    }
    h2 {
      margin-left: -1px;
      padding-left: 1.3rem;
    }
    img {
      margin: 0 1.4em;
      width: 80%;
    }
    strong {
      text-decoration: underline;
    }
  }

  .page p {
    margin: 0.2rem 0;
    line-height: 1rem;
    font-size: 0.75em;
    cursor: default;
  }

  .paragraph {
    background: linear-gradient(to bottom,transparent 0.95rem, ${darkPaperColor}33 0.05rem);
    background-size: 100% 1rem;
  }

  .information {
    display: flex;

    .key {
      font-weight: bold;
      min-width: 30%;
      margin-right: 0.3rem;
    }

    .value {
      color: blue;
      font-family: ${writingFont.name}, cursive;
      padding: 0rem 0.2rem;
      border-bottom: 1px solid ${textColor}55;
      flex-grow: 1;
    }

    .strikethrough {
      color: red;
      text-decoration: line-through;
    }
  }

  .schedule {
    display: flex;
    align-items: flex-end;

    .time {
      font-size: 0.5rem;
      font-family: monospace;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .event {
      font-family: ${writingFont.name}, cursive;
      padding: 0rem 0.2rem;
      border-bottom: 1px solid ${textColor}55;
      flex-grow: 1;
    }

    .event.known {
      color: blue;
      cursor: pointer;
    }

    .event.unknown {
      color: ${textColor}3f;
      cursor: progress;
    }

    .event.selected {
      color: red;
    }
  }
`;

// eslint-disable-next-line no-process-env
const useMocked = process.env.NODE_ENV === 'development';
const Landing: NextPage = () => {
  // State
  const [mockedDateTime, setMockedDateTime] = useState(activities[activities.length - 1].start);
  const [realDateTime, setRealDateTime] = useState(DateTime.now());
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(-1);
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

  return (
    <>
      <GlobalStyle />
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
    </>
  );
};

export default Landing;
