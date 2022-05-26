import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Tekst deel 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>;

const C02 = <p className='paragraph'>
  Tekst deel 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>;

const C03 = <p className='paragraph'>
  Tekst deel 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>;

const C04 = <p className='paragraph'>
  Tekst deel 4. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>;

const Puzzel = () => {
  const [answer, setAnswer] = useLocalStorage<string>('diner--answer', '');
  const isCorrect = answer.trim() === 'de garage';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Welk woord komt er uit?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        Zoek in de garage naar het antwoord!
    </p>}
  </>;
};
export function Diner() {
  return (
    <>
      <p className='paragraph'>
        Tijd voor een diner!
      </p>
      <Story shortName={'diner'} Puzzle={<Puzzel />} sections={[
        { title: '1', animalName: 'crocodile', Component: C01 },
        { title: '2', animalName: 'elephant', Component: C02 },
        { title: '3', animalName: 'elephant', Component: C03 },
        { title: '4', animalName: 'crocodile', Component: C04 },
      ]} />
    </>
  );
};
