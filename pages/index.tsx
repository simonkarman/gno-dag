import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  Container, Main, Title, Subtitle, Grid, CardContainer, CardContent, CardHeader, Timestamp
} from '../components/general';
import { Spinner } from '../components/spinner';
import { Card, cards } from '../content/cards';

export default function Home() {
  const [intervalId, setIntervalId] = useState<any>(0);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    setIntervalId(setInterval(() => {
      setTime(Date.now());
    }, 1000));
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const byTimestamp = (cardA: Card, cardB: Card): number => {
    return cardA.timestamp.toISOString().localeCompare(cardB.timestamp.toISOString());
  };

  const beforeNow = (card: Card): boolean => {
    return card.timestamp <= new Date();
  };

  const isLessThanOneMinutesAgo = (card: Card): boolean => {
    return card.timestamp >= new Date(Date.now() - 60 * 1000);
  };

  const visibleCards = [...cards]
    .sort(byTimestamp)
    .filter(beforeNow)
    .reverse()
    .map(card => (
      <CardContainer key={card.timestamp.toISOString()} $alert={isLessThanOneMinutesAgo(card)}>
        <CardHeader>
          <Image src={card.icon} width={64} height={64} />
        </CardHeader>
        <CardContent>
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <Timestamp>{card.timestamp.toLocaleString()}</Timestamp>
        </CardContent>
      </CardContainer>
    ));
  
  const showSpinner = visibleCards.length !== cards.length;

  return (
    <Container>
      <Head>
        <title>GNO 2021</title>
        <meta name="description" content="GNO Dag 2021" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>
          GNO Dag 2021
        </Title>
        <Subtitle>
          Het is voor Jac. en Govie al weer (bijna) tijd voor de leukste dag van het jaar.
          De <b>gender neutrale ouderdag</b> valt dit jaar namelijk op 2e pinksterdag (24 mei 2021).
          Op deze website kunnen jullie weer langzaam ontdekken wat er allemaal op het programma staat.
          Houd je telefoon dus bij de hand en volg de hints goed!
        </Subtitle>
        <Grid>
          {showSpinner && (
            <CardContainer>
              <CardHeader>
                <Spinner />
              </CardHeader>
              <CardContent>
                <h2>Er staat nog meer op het programma</h2>
                <p>Het is nog even wachten tot hint {visibleCards.length + 1} van de {cards.length} zichtbaar wordt</p>
                <Timestamp>{new Date(time).toLocaleString()}</Timestamp>
              </CardContent>
            </CardContainer>
          )}
          {visibleCards}
        </Grid>
      </Main>
    </Container>
  )
}
