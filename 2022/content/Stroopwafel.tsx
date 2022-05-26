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
  const [answer, setAnswer] = useLocalStorage<string>('stroopwafel--answer', '');
  const isCorrect = answer === 'het';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Introductie van het raadsel. Wat is het antwoord?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        Het antwoord!
    </p>}
  </>;
};

export function Stroopwafel() {
  return (
    <>
      <p className='paragraph'>
        Tijd voor een stroopwafel!
      </p>
      <Story shortName={'stroopwafel'} Puzzle={<Puzzel />} sections={[
        { title: '1', animalName: 'buffalo', Component: C01 },
        { title: '2', animalName: 'elephant', Component: C02 },
        { title: '3', animalName: 'elephant', Component: C03 },
        { title: '4', animalName: 'buffalo', Component: C04 },
      ]} />
    </>
  );
};
