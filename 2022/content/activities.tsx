import { DateTime } from 'luxon';

export interface Activity {
  start: DateTime,
  end?: DateTime,
  name: string;
  message: JSX.Element;
}

const gnoDag2022 = DateTime.fromISO('2022-06-05T07:00:00.000');
const at = (hour: number, minute: number) => gnoDag2022.set({ hour, minute });
export const activities: Activity[] = [
  { start: at(9, 45), name: 'Ontbijten', message: <p className='paragraph'>We beginnen de dag met een goed ontbijt!</p> },
  { start: at(10, 30), name: 'Tie Dye', message: <>
    <p className='paragraph'>
      Tie Dye. Hier komt echt een hele lap tekst te staan. Dit is een goede test om te kijken of het mooi er uit ziet op het moment dat deze
      informatie te lang wordt om netjes op
      {' '}
      <strong>
        1 pagina
      </strong>
      {' '}
      te laten zien. Het zou nu toch ongeveer al wel op een tweede paginauit moeten komen?
    </p>
    <h2>Een plaatje</h2>
    <p className='paragraph'>
      Hier volgt nog een heel stuk tekst en er staat zelfs een plaatje. Leuk hea?
    </p>
    <img src="https://www.simonkarman.nl/simonkarman.png" />
    <h2>En toen?</h2>
    <p className='paragraph'>
      Tie Dye. Hier komt echt een hele lap tekst te staan. Dit is een goede test om te kijken of het mooi er uit ziet op het moment dat deze
      informatie te lang wordt om netjes op
      {' '}
      <strong>
        1 pagina
      </strong>
      {' '}
      te laten zien. Het zou nu toch ongeveer al wel op een tweede paginauit moeten komen?
    </p>
  </> },
  { start: at(11, 45), name: 'Puzzel', message: <p className='paragraph'>Puzzel</p> },
  { start: at(12, 10), name: 'Lunch', message: <p className='paragraph'>Lunch</p> },
  { start: at(13, 30), name: 'Middagdutje', message: <p className='paragraph'>Middagdutje</p> },
  { start: at(14, 0), name: 'Speurtocht', message: <p className='paragraph'>Speurtocht</p> },
  { start: at(15, 0), name: 'Stroopwafel', message: <p className='paragraph'>Stroopwafels</p> },
  { start: at(16, 30), name: 'Bierproeverij', message: <p className='paragraph'>Bierproeverij</p> },
  { start: at(18, 0), end: at(20, 0), name: 'Avond eten', message: <p className='paragraph'>Avondeten</p> },
];

export const welcomeMessage = (<p className='paragraph'>
  Welkom. Dit is een digitaal boek speciaal voor GNO dag 2022.
  Op de linker pagina van dit boek, kan je in het tijdschema op een activiteit klikken voor meer informatie.
</p>);

export const earlyInformation = (<p className='paragraph'>
  Maar... je bent er wel erg vroeg bij. Kijk nog eens in dit boek op
  {' '}
  <strong>
    {activities[0].start.toFormat('dd LLLL yyyy \'om\' HH:mm')}
  </strong>
  . Zorg dat je dan wakker bent en al hebt gedoucht.
</p>
);
