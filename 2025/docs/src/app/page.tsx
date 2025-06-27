import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({
  weight: '400',
});

function Blank(props: { short?: boolean, multiline?: boolean, text?: string }) {
  const line = props.multiline ? '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _' : (props.short ? '___' : '_ _ _ _ _ _ _ _');
  return <span className="relative font-mono text-gray-300 bg-gray-50 px-1">
    <span className={`absolute left-4 text-blue-600 tracking-widest text-xl ${greatVibes.className}`}>{props.text}</span>
    {line}
  </span>;
}

function Card(props: { title: string, children?: React.ReactNode }) {
  return <div className="relative border rounded-lg w-80 break-inside-avoid-page text-justify">
    <span className="absolute left-4 top-4 w-3 h-3 bg-gray-600 rounded-full"></span>
    {/*<span className="absolute right-4 top-4 w-3 h-3 bg-purple-800 rounded-full"></span>*/}
    <div className='p-3 space-y-4'>
      <h2 className="font-bold border-b border-gray-200 pb-1 mb-3 text-center">{props.title}</h2>
      {props.children}
    </div>
    <p className="p-1 text-gray-600 text-center text-xs">GNO Dag 2025</p>
  </div>;
}

// Hint: Bewaarde Opgeslagen Momenten

const attendees = ['Govie', 'Jac.', 'Simon', 'Lisa', 'Marjolein', 'Tim'];
const cardTypes = [
  'Afgelopen jaar heb jij',
  'Je gebruikt vaak het woord',
  'Je kunt geen dag zonder',
  'Jouw go-to snack is',
  'Je reageert op berichten altijd',
];

export default function Home() {
  return (
    <div className="flex items-start flex-wrap gap-3">
      {attendees.map(attendee => (<Card key={attendee} title={'Van ' + attendee + ' aan ' + attendee}>
        <p>Als ik thuis kom, doe ik het liefste <Blank multiline /> en momenteel ben ik helemaal weg van <Blank multiline /></p>
        <p>Mijn favorite app op dit moment is <Blank /> en ik ben het gelukkigste als <Blank multiline /></p>
      </Card>))}
      {attendees.map(attendee => <Card key={attendee + '2'} title={'Van ' + attendee + ' aan ' + attendee} >
        <p>Over 5 jaar hoop ik <Blank multiline /></p>
      </Card>)}
      {attendees.flatMap((a, ai) => attendees.filter(b => a !== b).map((b, bi) => <Card key={cardTypes[(ai + bi + 1) % cardTypes.length] + a + b + bi} title={`Van ${a} aan ${b}`}>
        <p>{cardTypes[(ai + bi + 1) % cardTypes.length]} <Blank multiline /></p>
      </Card> )).sort(((a, b) => a.key?.localeCompare(b.key ?? '') || 0))}
    </div>
  );
}
