import { DateTime } from 'luxon';

export interface Activity {
  start: DateTime,
  end?: DateTime,
  name: string;
  information: JSX.Element;
}

export const welcomeMessage = (<>
  Welkom. Dit is een digitaal boek speciaal voor GNO dag 2022.
  Op de linker pagina van dit boek, kan je in het tijdsschema op een activiteit klikken voor meer informatie.
</>);

const gnoDag2022 = DateTime.fromISO('2022-06-05T07:00:00.000');
const at = (hour: number, minute: number) => gnoDag2022.set({ hour, minute });
export const activities: Activity[] = [
  { start: at(9, 45), name: 'Ontbijten', information: <>We beginnen de dag met een goed ontbijt!</> },
  { start: at(10, 30), name: 'Tie Dye', information: <>Tie Dye</> },
  { start: at(11, 45), name: 'Puzzel', information: <>Puzzel</> },
  { start: at(12, 10), name: 'Lunch', information: <>Lunch</> },
  { start: at(13, 30), name: 'Middagdutje', information: <>Middagdutje</> },
  { start: at(14, 0), name: 'Speurtocht', information: <>Speurtocht</> },
  { start: at(15, 0), name: 'Stroopwafels', information: <>Stroopwafels</> },
  { start: at(16, 30), name: 'Bierproeverij', information: <>Bierproeverij</> },
  { start: at(18, 0), end: at(20, 0), name: 'Avond eten', information: <>Avondeten</> },
];

export const earlyInformation = (<p className='paragraph'>
  Maar... je bent er wel erg vroeg bij. Kijk nog eens in dit boek op
  {' '}
  <strong>
    {activities[0].start.toFormat('dd LLLL yyyy \'om\' HH:mm')}
  </strong>
  . Zorg dat je dan wakker bent en al hebt gedoucht.
</p>
);
