import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';
import { useTransformedLocalStorage } from '../hooks/common/useTransformedStorage';

const colors = [
  'Ivory',
  'Lemon Yellow',
  'Blue Violet',
  'Shiitake Mushroom',
  'Bronze',
  'Ecru',
  'Olive Drab',
  'Terracotta',
  'Teal Blue',
  'Charcoal Gray',
  'Blue Gray',
  'Turquoise',
  'Chocolate',
  'Fuchsia',
  'New Black',
  'Emerald Green',
  'Khaki',
];

const C01 = () => {
  return <p className='paragraph'>
    Goede morgen!
    Mijn naam is <b>Paolo</b> de papegaai.
    Wat leuk dat jullie bij mij langskomen.
    Hopelijk kan ik jullie helpen met het probleem van <b>Ollie</b>.
  </p>;
};

const C02 = () => {
  return <p className='paragraph'>
    Hey <b>Paolo</b>, wat is het goed om je weer te zien.
    Ik word altijd zo vrolijk van de kleuren van jouw veren.
    Wat heb je vandaag voor ons voorbereid?
  </p>;
};

const C03 = () => {
  return <p className='paragraph'>
    Bedankt <b>Ollie</b>, ik ben ook heel erg trots op mijn gekleurde veren.
    Als papegaai sta ik bekend om het nadoen van geluiden of woorden.
    Na-apen is natuurlijk niet echt creatief, terwijl ik dat juist wel graag ben.
    Ik geloof dat creatief bezig zijn goed voor je is.
    En ik ben er van overtuigd dat het jou kan helpen om je herinneringen terug te krijgen.
    Daarom gaan we &apos;Tie Dye&apos;-en!
    Dat is een speciale manier van het verfen van stof.
  </p>;
};

const C04 = () => {
  return <>
    <p className='paragraph'>
      De stappen voor Tie Dye zijn eigenlijk heel simpel.
    </p>
    <p className='paragraph'>
      <ol>
        <li>Ingrediënten verzamelen</li>
        <li>Stof voorbereiden</li>
        <li>Stof vouwen</li>
        <li>Verfen</li>
        <li>Geduld</li>
      </ol>
    </p>
    <p className='paragraph'>
      Ik heb aan Marjolein alle instructies doorgegeven, dus zij kan het tot in de puntjes uitleggen.
      Vergeet tussendoor niet om de onderstaande puzzel op te lossen.
      Veel plezier!
    </p>
  </>;
};

const Puzzle = () => {
  const [selection, setSelection] = useTransformedLocalStorage<string[]>('tiedye--selection', [], t => t.join(), s => s.split(','));
  const [answer, setAnswer] = useLocalStorage<string>('tiedye--answer', '');
  const isCorrect = answer === 'fabel';
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      Begin met de vijf kleuren die we hebben gebruikt bij het tie-dyen.
      De vijf kleuren staan tussen de onderstaande kleuren.
      Tip: Je kunt op de kleuren klikken om ze te selecteren.
    </p>
    <p className='paragraph'>
      {colors.map((color, index) => {
        const classNames = [];
        if (index % 2 === 0) classNames.push('bold');
        if (selection.includes(color)) classNames.push('selected');
        return <li
          key={index}
          className={classNames.join(' ')}
          onClick={() => {
            const index = selection.indexOf(color);
            console.info('clicked on ', color, index);
            if (index == -1) {
              setSelection([ ...selection, color ]);
            } else {
              setSelection([ ...selection.slice(0, index), ...selection.slice(index + 1, selection.length) ]);
            }
          }}
        >
          {color.replace(' ', '-')}{' '}
        </li>;
      })}
    </p>
    <h3>Letters</h3>
    <p className='paragraph'>
      Kies de eerste letter van de vijf kleuren die je hebt gekozen.
      Is er een letter die meer dan 1x voor komt? Die letter telt dan niet mee.
      Voeg aan de overgebleven letters de twee letters toe waarin je iets kunt opbergen.
      Maak van deze letters een woord wat je in de krant kunt vinden.
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
        De fabeltjes krant is de lievelingskrant van <b>Paolo</b>.
    </p>}
  </>;
};

// Eerste letters van (Fuchsia, Teal Blue, Blue Violet, Emerald Green, Turquoise)
//  - min dubbel
//  + plus 'la'
// antwoord: fabel
export function TieDye() {
  return (<>
    <p className='paragraph'>
      Het is tijd voor de tweede activiteit van de dag! We gaan langs bij de papegaai.
    </p>
    <Story shortName='tiedye' Puzzle={<Puzzle />} sections={[
      {
        title: 'Welkom!',
        animalName: 'parrot',
        Component: <C01 />,
      },
      {
        title: 'Veren',
        animalName: 'elephant',
        Component: <C02 />,
      },
      {
        title: 'Creatief',
        animalName: 'parrot',
        Component: <C03 />,
      },
      {
        title: 'Instructies',
        animalName: 'parrot',
        Component: <C04 />,
      },
    ]} />
  </>);
}
