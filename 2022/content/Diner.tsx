import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Rustig rustig!
  Ik ben het: <b>Chris</b> de krokodil.
  Er gaat wel lekker gesmuld worden, maar jullie zijn niet de hapjes.
  Hoe gaat het, <b>Ollie</b>?
</p>;

const C02 = <>
  <p className='paragraph'>
    Ja het gaat goed! We hebben al een hoop gedaan en ik heb het gevoel dat er iets moois te gebeuren staat.
    Ik voel dat mijn herinneringen ineens weer heel dichtbij zijn.
    Maar ik ben er nog niet.
    Ik heb nog net dat extra zetje in de rug nodig.
  </p>
  <p className='paragraph'>
    Trouwens, wat zit daar tussen je tanden?
  </p>
</>;

const C03 = <p className='paragraph'>
  Oh... ughm, tja ik heb net geprobeerd de postbode op te eten.
  Niet door vertellen hoor.
  Helaas bleef ik met mijn tanden haken achter zijn tas.
  Dus het enige wat ik binnen kreeg was papier...
  Maar dit stukje papier moet zijn achtergebleven.
</p>;

const C04 = <p className='paragraph'>
  Maar goed...
  Over eten gesproken, na zo&apos;n lange dag hebben jullie vast wel honger gekregen.
  Ik heb Simon en Marjolein op pad gestuurd om een geheim recept van Lisa en Tim te ontrafelen.
  Ze zullen nu het gerecht voor jullie bereiden.
  Houd wel wat ruimte over voor een lekker toetje!
  Eet smakelijk.
</p>;

const Puzzel = () => {
  const [answer, setAnswer] = useLocalStorage<string>('diner--answer', '');
  const isCorrect = answer.trim() === 'de garage';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Wat een gek stuk papier zat er in de mond van <b>Chris</b>.
      Wat kunnen jullie hier op invullen?
      En wat komt er dan uit?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <>
      <p className='paragraph'>
        Ja, dat is het antwoord!
      </p>
      <img src='oplossing.png' />
      <p className='paragraph'>
        Zoek in de garage naar de sleutel tot de herinneringen van <b>Ollie</b>!
      </p>
    </>}
  </>;
};
export function Diner() {
  return (
    <>
      <p className='paragraph'>
        Aaaaaaaaahrgggg...
        Eet ons alsjeblieft niet op!
      </p>
      <Story shortName={'diner'} Puzzle={<Puzzel />} sections={[
        { title: 'Kalm', animalName: 'crocodile', Component: C01 },
        { title: 'Bijna', animalName: 'elephant', Component: C02 },
        { title: 'Papier', animalName: 'crocodile', Component: C03 },
        { title: 'Honger', animalName: 'crocodile', Component: C04 },
      ]} />
    </>
  );
};
