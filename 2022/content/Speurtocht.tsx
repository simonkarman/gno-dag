import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';
import { useLocalStorageBoolean } from '../hooks/common/useTransformedStorage';

const C01 = <p className='paragraph'>
  Hoi allemaal! Ik ben <b>Wouter</b> de Wolf.
  Wat leuk jullie allemaal te zien.
  Hoe gaat het nu met jou <b>Ollie</b>?
  Heb je al weer een deel van je geheugen terug?
</p>;

const C02 = <p className='paragraph'>
  Hey <b>Wouter</b>!
  Het gaat al wel iets beter.
  Maar nog niet al mijn herinnering zijn terug.
  Ik weet namelijk niet waar mijn gympies zijn.
  Kan jij ons verder helpen?
</p>;

const C03 = <>
  <p className='paragraph'>
    Uiteraard!
    Als wolf heb ik een hele goede reuk, dan kan ik ze snel terug vinden.
    Alhoewel je geen wolf hoeft te zijn om jouw gympies van 5km afstand te ruiken.
    Maar goed, loop maar mee, dan gaan we ze zoeken.
    En blijf goed bij elkaar.
    Als wolf wordt ik onrustig als de roedel zich opsplitst.
  </p>
</>;

const C04 = <p className='paragraph'>
  Oh, wat leuk!
  Ik wist wel dat we gingen wandelen vandaag.
  Ik heb speciaal daarvoor aan Simon wat leuks voor onderweg meegegeven.
  Laten we gaan.
</p>;

const C05 = <p className='paragraph'>
  Ik heb ook nog iets voorbereid, <b>Ollie</b>!
  Dus, let tijdens de wandeling goed op.
  Na de wandeling zullen jullie een raadsel moeten beantwoorden.
  Lees dus pas verder <b>NA</b> de wandeling.
</p>;

const Puzzel = () => {
  const [show, setShow] = useLocalStorageBoolean('speurtocht-show', false);
  const [answer, setAnswer] = useLocalStorage<string>('speurtocht--answer', '');
  const isCorrect = answer === 'bushalte';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Toon onderstaande puzzel pas na de wandeling.
    </p>
    <InputContainer>
      {!show && <button onClick={() => setShow(true)}>Toon puzzel</button>}
      {show && <p className='paragraph clickable' onClick={() => setShow(false)}>Verberg puzzel</p>}
    </InputContainer>
    {show && (<>
      <p className='paragraph'>
        We zijn hier drie keer langs gelopen.
        Het heeft een dak.
        Er woont niemand.
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
    </>)}
  </>;
};
export function Speurtocht() {
  return (
    <>
      <p className='paragraph'>
        Tijd om in beweging te komen! Trek je schoenen maar aan.
      </p>
      <Story shortName={'speurtocht'} Puzzle={<Puzzel />} sections={[
        { title: 'Hoe gaat het?', animalName: 'dog', Component: C01 },
        { title: 'Zoeken nie', animalName: 'elephant', Component: C02 },
        { title: 'Roedel', animalName: 'dog', Component: C03 },
        { title: 'Onderweg', animalName: 'elephant', Component: C04 },
        { title: 'Let op!', animalName: 'dog', Component: C05 },
      ]} />
    </>
  );
};
