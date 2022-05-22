import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';
import { useLocalStorageBoolean } from '../hooks/common/useTransformedStorage';

const C01 = () => {
  return (<>
    <p className='paragraph'>
      Goede morgen allemaal!
      Ik ben <b>Waldo</b> de walrus.
      Wat fijn dat jullie dit logboek gevonden hebben.
      We moeten vandaag iets heel belangrijks gaan oplossen.
      Er is namelijk is vervelends aan de hand.
      Ik zal jullie eerst voorstellen aan <b>Ollie</b> de olifant.
      Vandaag gaan jullie hem proberen te helpen met zijn probleem.
    </p>
  </>);
};

const C02 = () => {
  return (<>
    <p className='paragraph'>
      Nou, waar val jij deze lieve mensen nou mee lastig op hun GNO dag, <b>Waldo</b>?
      Zo groot is mijn probleem toch helemaal niet?
      Of... wat was mijn probleem eigenlijk ook al weer?
      Ik ben het vergeten.
      Zo belangrijk kan het dus niet zijn geweest.
    </p>
  </>);
};

const C03 = () => {
  return (<>
    <p className='paragraph'>
      Oh hoor mij nou... ik vergeet me helemaal voor te stellen.
      Mijn naam is <b>Ollie</b> de olifant.
      Als olifant sta ik bekend om mijn oren, slurf en slagtanden.
      Maar ook, dat ik alles wat ik mee maak super goed kan onthouden.
      Helaas ben ik laatst tegen een berg aangelopen (en ik kwam nog wel van rechts...).
      Sindsdien kan ik me niet veel meer herinneren.
    </p>
  </>);
};

const C04 = () => {
  return (<>
    <p className='paragraph'>
      Nou jullie horen het, <b>Ollie</b> heeft jullie hulp hard nodig.
      Wat fijn dat jullie hem vandaag gaan helpen om zijn herinneringen terug te krijgen.
      Natuurlijk is het op zo&apos;n belangrijke dag verstandig om goed te beginnen.
      Een goed begin is tenslotte het halve werk.
      Ga daarom lekker genieten van het ontbijt dat voor jullie wordt bereid.
      En om de hersenen op te warmen, kunnen jullie tijdens het ontbijt het onderstaande raadsel oplossen.
    </p>
  </>);
};

const Puzzle = () => {
  const [show01, _setShow01] = useLocalStorageBoolean('ontbijt--show01', false);
  const [answer, setAnswer] = useLocalStorage<string>('ontbijt--answer', '');
  const isCorrect = answer === 'dobbelsteen';
  return (<>
    <h2>Raadsel</h2>
    <p className='paragraph'>
      Elke activiteit in het tijdschema eindigt met een opdracht.
      Voor deze activiteit moeten jullie een raadsel oplossen.
    </p>
    <h3>Voorbeeld</h3>
    <p className='paragraph'>
      We beginnen met een voorbeeld raadsel.
      Dit is het favoriete raadsel van <b>Waldo</b> de walrus.
      Hij gaat namelijk ook graag vissen.
      Komen jullie hier uit?
    </p>
    <p className='paragraph'>
      Twee vaders en twee zonen gaan uit vissen.
      Ze vangen ieder één vis en nemen deze mee naar huis.
      Ze verliezen geen vis, maar toch komen ze met maar 3 vissen thuis.
      Hoe kan dit?
    </p>
    {show01 && <p className='paragraph'>
      Zijn zijn maar met z&apos;n drieen: een opa, zijn zoon en zijn kleinzoon.
    </p>}
    <InputContainer>
      {!show01 && <button onClick={() => _setShow01(true)}>Toon antwoord</button>}
      {show01 && <p className='paragraph clickable' onClick={() => _setShow01(false)}>Verberg antwoord</p>}
    </InputContainer>
    <h3>Echte werk</h3>
    <p className='paragraph'>
      En nu is het tijd voor het echte werk.
      In het dierenrijk zien de dieren er allemaal anders uit.
      Zo hebben sommige dieren 4 poten, terwijl andere 8 poten hebben.
      Sommige dieren hebben haren, sommige veren, en sommige zijn kaal.
      Het antwoord op dit raadsel heeft 21 ogen.
      Wat is het?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
      Correct! Een dobbelsteen heeft inderaad 21 ogen.
    </p>}
  </>);
};

export function Ontbijt() {
  return <>
    <p className={'paragraph'}>
      Welkom bij de eerste activiteit! Zijn jullie er klaar voor?
    </p>
    <Story shortName={'ontbijt'} Puzzle={<Puzzle />} sections={[
      {
        title: 'Waldo',
        animalName: 'walrus',
        Component: <C01 />,
      },
      {
        title: 'Probleem?',
        animalName: 'elephant',
        Component: <C02 />,
      },
      {
        title: 'Ollie',
        animalName: 'elephant',
        Component: <C03 />,
      },
      {
        title: 'Een goed begin',
        animalName: 'walrus',
        Component: <C04 />,
      },
    ]} />
  </>;
}
