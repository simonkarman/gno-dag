import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <>
  <p className='paragraph'>
    Hallo allemaal!
    Hopelijk hebben jullie heerlijk genoten van de wandeling.
    Ik ben <b>Bert</b> de buffel en ik ben chefkok.
    Ik ben zo groot omdat ik veel van proeven houd.
  </p>
  <p className='paragraph'>
    Ik woon in Italië, maar ik ben speciaal naar Nederland gekomen om jullie te helpen.
    De beste manier waarop ik jullie kan helpen is door lekker eten met jullie te maken.
    Vers bereid eten is namelijk de beste manier om gezond te worden.
  </p>-r
</>;

const C02 = <p className='paragraph'>
  Oh wat leuk Bert!
  Ik heb ook al weer een beetje honger gekregen van het wandelen.
  Wat gaan we dan eten?
</p>;

const C03 = <p className='paragraph'>
  Nou, in Italië houden we erg van pizza.
  Maar waar we stiekem nog meer van houden zijn ijsjes.
  Een ijsje moet natuurlijk wel ergens in.
  En waar een ijsje in zit lijkt weer erg op een Nederlandse lekkernij.
  Weten jullie al wat het wordt?
</p>;

const C04 = <p className='paragraph'>
  We gaan zelf stroopwafels maken!
  Lekker hea?
  Het recept en de ingredienten liggen op tafel.
  Ik weet zeker dat jullie daar wel uit gaan komen.
  Veel plezier!
</p>;

const Puzzel = () => {
  const [answer, setAnswer] = useLocalStorage<string>('stroopwafel--answer', '');
  const isCorrect = answer === 'weegschaal';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Lukt het jullie om uit het recept de cryptische boodschap te halen?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
      Het antwoord is inderdaad weegschaal!
      Goed gedaan
    </p>}
  </>;
};

export function Stroopwafel() {
  return (
    <>
      <p className='paragraph'>
        Wat zullen we nu gaan doen?
        En wow, wat is die grote schaduw?
      </p>
      <Story shortName={'stroopwafel'} Puzzle={<Puzzel />} sections={[
        { title: 'Voorstellen', animalName: 'buffalo', Component: C01 },
        { title: 'Honger', animalName: 'elephant', Component: C02 },
        { title: 'Verrassing', animalName: 'buffalo', Component: C03 },
        { title: 'Stroopwafels', animalName: 'buffalo', Component: C04 },
      ]} />
    </>
  );
};
