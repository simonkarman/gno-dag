import { DateTime } from 'luxon';
import { Bierproeverij } from './Bierproeverij';
import { Diner } from './Diner';
import { Lunch } from './Lunch';
import { Middagdutje } from './Middagdutje';
import { Ontbijt } from './Ontbijt';
import { Puzzel } from './Puzzel';
import { Speurtocht } from './Speurtocht';
import { Stroopwafel } from './Stroopwafel';
import { TieDye } from './TieDye';

export interface Activity {
  start: DateTime,
  end?: DateTime,
  title: string;
  Component: JSX.Element;
}

const gnoDag2022 = DateTime.fromISO('2022-06-05T07:00:00.000');
const at = (hour: number, minute: number) => gnoDag2022.set({ hour, minute });
export const activities: Activity[] = [
  { start: at(9, 45), title: Ontbijt.name, Component: <Ontbijt/> },
  { start: at(10, 30), title: TieDye.name, Component: <TieDye/> },
  { start: at(11, 45), title: Puzzel.name, Component: <Puzzel/> },
  { start: at(12, 10), title: Lunch.name, Component: <Lunch/> },
  { start: at(13, 30), title: Middagdutje.name, Component: <Middagdutje/> },
  { start: at(14, 0), title: Speurtocht.name, Component: <Speurtocht/> },
  { start: at(15, 0), title: Stroopwafel.name, Component: <Stroopwafel/> },
  { start: at(16, 30), title: Bierproeverij.name, Component: <Bierproeverij/> },
  { start: at(18, 0), end: at(20, 0), title: Diner.name, Component: <Diner/> },
];

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
