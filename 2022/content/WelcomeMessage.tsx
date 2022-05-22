import React from 'react';
import { activities } from './Activities';

export function WelcomeMessage(props: { isEarly: boolean }) {
  const { isEarly } = props;
  return (<>
    <p className='paragraph'>
      Welkom in het digitale logboek van GNO dag 2022.
      In een logboek kan je bijhouden wat je allemaal op een dag meemaakt.
      Helaas is er met dit logboek iets mis.
    </p>
    {isEarly ? (<>
      <p className='paragraph'>
        Op de linker pagina van dit logboek vind je een tijdschema.
        Maar huh, het tijdschema is niet goed leesbaar.
        Vandaag lijkt niet de goede dag.
      </p>
      <p className='paragraph'>
        Wellicht dat er op
        {' '}
        <strong>
          {activities[0].start.toFormat('dd LLLL yyyy')}
        </strong>
        {' '}
        meer duidelijk zal worden?
        Zorg dat je om
        {' '}
        <strong>
          {activities[0].start.toFormat('HH:mm')}
        </strong>
        {' '}
        in Bodegraven bent met een lege maag. Gaat dat lukken?
      </p>
    </>) : (<>
      <p className='paragraph'>
        Op de linker pagina van dit logboek vind je een tijdschema.
        Klik op een van de activiteiten in het tijdschema voor meer informatie.
      </p>
    </>)}
    <h2>Vorig jaar</h2>
    <p className='paragraph'>
      Spanned hea! Kan je ook niet wachten? Kijk dan nog eens terug naar wat we vorig jaar gedaan hebben:
      {' '}
      <a href="https://gno-2021.karman.dev" target="_blank" rel="noreferrer">ga nu naar GNO Dag 2021</a>
      .
    </p>
  </>);
}
