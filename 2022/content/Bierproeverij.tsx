import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';

const C01 = <p className='paragraph'>
  Hallo allemaal!
  Ik ben <b>Ret</b> de walvis.
  Als walvis ben ik gek op vloeistoffen.
  Ik vertoef daarom eigenlijk 24 uur per dag in het water.
  Maar er is eigenlijk een vloeistof waar ik nog veel meer van houd.
  En dat is bier!
</p>;

const C02 = <p className='paragraph'>
  Hey <b>Ret</b> de walvis, wat is het goed om je te zien.
  Laten we het maar niet over de vorige keer hebben toen we een biertje zijn gaan drinken.
  Dat zwom toen nogal uit de vin.
  Sta jij nog steeds zo vrolijk in het leven?
</p>;

const C03 = <>
  <p className='paragraph'>
    Zeker!
    Mijn levensmotto is niet voor niets: &apos;genieten door te gieten&apos;.
    Ach wat is bier toch lekker.
    Ik reis er de hele wereld voor rond, en toch komt ik het liefste in Europa.
    Dat komt door de variëteit aan heerlijke speciaal biertjes die jullie hier hebben.
  </p>
  <p className='paragraph'>
    Vandaag ben ik speciaal voor jullie naar de Nederlandse kust gekomen.
    Ik hoorde namelijk van <b>Ollie</b> z&apos;n probleem.
    Hopelijk kan ik jullie helpen.
    Ik heb namelijk een paar hele lekkere biertjes voor jullie meegenomen.
    Maar niet te veel drinken hoor, ik heb gehoord dat je dan gaat hallucineren.
    Geef <b>Ollie</b> maar een extra slokje.
    Geniet ervan!
  </p>
</>;

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
      Ja! Dat klopt.
      De biertjes komen uit Slovenië.
      Ten zuiden van Slovenië ligt Kroatië.
      En de hoofdstad van Kroatië is Zagreb.
      Helemaal goed dus!
    </p>}
  </>;
};
export function Bierproeverij() {
  return (
    <>
      <p className='paragraph'>
        Blijf maar zwemmen.
        Blijf maar zwemmen.
        Blijf maar zwemmen, zwemmen, zwemmen.
      </p>
      <Story shortName={'bierproeverij'} Puzzle={<Puzzel />} sections={[
        { title: 'Vloeistoffen', animalName: 'whale', Component: C01 },
        { title: 'Liep hand', animalName: 'elephant', Component: C02 },
        { title: 'Motto', animalName: 'whale', Component: C03 },
      ]} />
    </>
  );
};
