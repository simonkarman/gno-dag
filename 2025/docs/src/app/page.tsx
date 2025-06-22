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
  return <div className="relative border rounded-lg w-80 break-inside-avoid-page">
    <span className="absolute left-4 top-4 w-3 h-3 bg-purple-800 rounded-full"></span>
    <span className="absolute right-4 top-4 w-3 h-3 bg-purple-800 rounded-full"></span>
    <div className='p-3 space-y-4'>
      <h2 className="font-bold border-b border-gray-200 pb-1 mb-3 text-center">{props.title}</h2>
      {props.children}
    </div>
    <p className="p-1 text-gray-600 text-center text-xs">GNO Dag 2025</p>
  </div>;
}

const attendees = ['Govie', 'Jac.', 'Simon', 'Lisa', 'Marjolein', 'Tim'];
const cardTypes = [
  'Ik wens jou',
  'Als ik aan jou denk, dan denk ik aan',
  'Jij bent goed in',
  'Als ik een eigenschap met jou zou willen ruilen dan zou ik',
  'Wat ik aan jouw bewonder is',
];

export default function Home() {
  return (
    <div className="flex items-start flex-wrap gap-3">
      {attendees.map(attendee => (<Card key={attendee} title={attendee}>
        <p><Blank short />. Ik ben <Blank short /> jaar oud en ik woon in <Blank />.</p>
        <p>Als ik mezelf zou omschrijven in drie woorden, dan zouden dat zijn: <Blank />, <Blank /> en <Blank />.</p>
        <p>Op een vrije zaterdag doe ik het liefste <Blank multiline /></p>
      </Card>))}
      {attendees.flatMap(a => attendees.filter(b => a !== b).map((b, i) => <Card key={a + b + i} title={`${a} -> ${b}`}>
        <p>{cardTypes[i]} <Blank multiline /></p>
      </Card> ))}
      {attendees.map(attendee => <Card key={attendee} title={attendee + ' aan ' + attendee} >
        <p>Over 5 jaar hoop ik <Blank multiline /></p>
      </Card>)}
    </div>
  );
}
