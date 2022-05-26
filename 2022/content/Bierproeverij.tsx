import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Walvis Red
  Geniet van het leven
  Reis veel rond over de wereld
  Toch het liefst naar Europe voor het lekker speciaal bier
  Uit slovenie geimporteerd, naar de Nederlandse kust gekomen
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
  const [answer, setAnswer] = useLocalStorage<string>('bierproeverij--answer', '');
  const isCorrect = answer === 'zagreb';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Kunnen jullie na al dit bier nog nadenken?
      Hoe heet de hoofdstad van het land dat ten zuiden ligt van het land waar deze biertjes vandaan komen?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        De biertjes komen uit Slovenië.
        Ten zuiden van Slovenië ligt Kroatië.
        De hoofdstad van Kroatië is Zagreb.
    </p>}
  </>;
};
export function Bierproeverij() {
  return (
    <>
      <p className='paragraph'>
        Tijd voor een bierproeverij!
      </p>
      <Story shortName={'bierproeverij'} Puzzle={<Puzzel />} sections={[
        { title: '1', animalName: 'whale', Component: C01 },
        { title: '2', animalName: 'elephant', Component: C02 },
        { title: '3', animalName: 'elephant', Component: C03 },
        { title: '4', animalName: 'whale', Component: C04 },
      ]} />
    </>
  );
};
