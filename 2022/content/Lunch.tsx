import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Nou, inderdaad.
  Ik vroeg me al af wie of wat het was.
  Volgens mij zag ik net ook een wortel door de kamer vliegen.
</p>;

const C02 = <p className='paragraph'>
  Hallo allemaal!
  Ik ben <b>Koo</b> het konijn.
  Eten is mijn lievelings- activiteit, dus die wortel was van mij, hij was heerlijk.
  Vanmorgen heb ik jullie gevolgd.
  Zodat ik precies kon inspringen op het moment dat jullie honger begonnen te krijgen.
  Wellicht heb je dus al een vermoeden waarom ik te voorschijn ben gekomen.
  Het is namelijk zover... We gaan lunchen!
</p>;

const C03 = <p className='paragraph'>
  Oh wat lekker zeg!
  Ik heb er nu al zin in.
  Een olifant moet ook goed eten.
  Wist je wel dat ik gemiddeld zo&apos;n 160 kilo voedsel moet eten.
  Daarnaast moet ik ook nog tussen de 70 en 160 liter water drinken per dag.
  Wat staat er op het menu, <b>Koo</b>?
</p>;

const C04 = <p className='paragraph'>
  Dat zal ik jullie vertellen!
  Ik heb een heerlijke lunch voor jullie gemaakt.
  Maar het is nog niet helemaal af, jullie moeten natuurlijk wel scherp blijven.
  Daarom moeten jullie zelf jullie eigen lunch afmaken.
  Maak met de ingredienten die op tafel staan een lekkere clubsandwich!
</p>;

const C05 = <p className='paragraph'>
  Ohja, dat was ik bijna vergeten.
  Ik heb voor jullie ook een leuke rebus gemaakt.
  Die kunnen jullie tijdens de lunch oplossen.
  Eet smakelijk en veel plezier!
</p>;

const Puzzel = () => {
  const [answer, setAnswer] = useLocalStorage<string>('lunch--answer', '');
  const isCorrect = answer === 'belangrijke';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      De puzzel voor tijdens de lunch is een rebus. Vogel de oplossing uit, en het antwoord zal duidelijk zijn.
    </p>
    <img src='puzzle/rebus.svg' />
    <p className='paragraph'>
      Vul hieronder je antwoord in.
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        Correct!
        Een belangrijke herinnering wil je niet vergeten tweede woord.
    </p>}
  </>;
};

export function Lunch() {
  return (
    <>
      <p>
        Is het jullie ook opgevallen dat er al de hele ochtend iets achter jullie aan heeft gehopt?
      </p>
      <Story shortName={'lunch'} Puzzle={<Puzzel />} sections={[
        {
          title: 'Wortel?',
          animalName: 'elephant',
          Component: C01,
        },
        {
          title: 'Gesnapt',
          animalName: 'rabbit',
          Component: C02,
        },
        {
          title: 'Hongerig',
          animalName: 'elephant',
          Component: C03,
        },
        {
          title: 'Het menu',
          animalName: 'rabbit',
          Component: C04,
        },
        {
          title: 'Rebus',
          animalName: 'rabbit',
          Component: C05,
        },
      ]} />
    </>
  );
};
