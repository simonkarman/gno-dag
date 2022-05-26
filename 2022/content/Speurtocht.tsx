import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Wolf Wouter
  Nieuwsgierigheid kent geen tijd.
  Frisse lucht en beweging is goed.
  Op jacht.
  Ollie vergeten waar gympies zijn, op zoek waar die zijn gebleven
  Speurtocht voor de hond (reuk grapje met stinkschoenen)
  Iets over olifanten met gympies (voor mama)
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
  const [answer, setAnswer] = useLocalStorage<string>('speurtocht--answer', '');
  const isCorrect = answer === 'bushalte';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Let tijdens de wandeling goed op.
      (Black Storie en enkele raadsels)
      Na de wandeling moeten jullie een vraag beantwoorden.
      Onderstaande mag pas zichtbaar zijn na de wandeling.
      We zijn hier drie keer langs gelopen. Het heeft een dak. Maar er woont niemand.
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        Inderdaad, een bushalte!
    </p>}
  </>;
};
export function Speurtocht() {
  return (
    <>
      <p className='paragraph'>
        Tijd voor een speurtocht!
      </p>
      <Story shortName={'speurtocht'} Puzzle={<Puzzel />} sections={[
        { title: '1', animalName: 'dog', Component: C01 },
        { title: '2', animalName: 'elephant', Component: C02 },
        { title: '3', animalName: 'elephant', Component: C03 },
        { title: '4', animalName: 'dog', Component: C04 },
      ]} />
    </>
  );
};
