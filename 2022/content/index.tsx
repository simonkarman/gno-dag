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
      Welkom. Dit is een digitaal boek speciaal voor GNO dag 2022.
      Op de linker pagina van dit boek, kan je in het tijdschema op een activiteit klikken voor meer informatie.
    </p>
    {isEarly && (
      <p className='paragraph'>
        Maar... je bent er wel erg vroeg bij. Kom hier terug op
        {' '}
        <strong>
          {activities[0].start.toFormat('dd LLLL yyyy \'om\' HH:mm')}
        </strong>
        {' '}
        en zie hoe het verhaal zich zal onthullen. Zorg dat je dan wakker bent en nog lege maag hebt. Gaat dat lukken?
      </p>
    )}
    <h2>Vorig jaar</h2>
    <p className='paragraph'>
      Kijk nog eens terug naar wat we vorig jaar gedaan hebben:
      {' '}
      <a href="https://gno-2021.karman.dev" target="_blank" rel="noreferrer">terug naar GNO Dag 2021</a>
    </p>
  </>);
}