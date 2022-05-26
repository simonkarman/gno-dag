import { InputContainer } from '../components/InputContainer';
import { Story } from '../components/Story';
import { useLocalStorage } from '../hooks';
import { useLocalStorageBoolean } from '../hooks/common/useTransformedStorage';

const C01 = <p className='paragraph'>
  Hallo allemaal.
  Ik ben <b>Aart</b> de luiaard.
  Waar ik het meeste van houd is om niks te doen.
  Daarom is slapen is mijn grootste hobby.
</p>;

const C02 = <p className='paragraph'>
  Hoi <b>Aart</b>!
  Heb je nou je voortuin al een keer opgeruimd?
  De laatste keer dat ik er langs liep lag het vol met bladeren.
</p>;

const C03 = <p className='paragraph'>
  Hey wacht eens!
  Ik begin me al weer wat te herinneren.
  Nog niet alles is terug maar het gaat de goede kant op.
  We hebben hard gewerkt, die hobby van jou bevalt me wel, <b>Aart</b>!
</p>;

const C04 = <p className='paragraph'>
  Komt dat even goed uit!
  Ik heb namelijk nog geen tijd gehad om iets leuks voor jullie te verzinnen.
  Gisteren moest ik namelijk twintig uur lang slapen.
  Dan blijft er niet veel tijd over.
  Rust dus even lekker uit.
  Ohja, en ik moest ook nog een puzzel maken voor jullie.
  Ik hoop dat jullie er uit komen.
</p>;

const Puzzel = () => {
  const [answer, setAnswer] = useLocalStorage<string>('dutje--answer', '');
  const isCorrect = answer === 'drie';
  const [show01, _setShow01] = useLocalStorageBoolean('dutje--show01', false);
  return <>
    <h2>Puzzel</h2>
    <p className='paragraph'>
      <b>Aart</b> kennende was hij te moe om er een lange opdracht van te maken.
      Eerst de rekensom van <b>Aart</b> en daarna volgt er nog een iets moeilijker raadsel.
    </p>
    <h3>Rekensom</h3>
    <p className='paragraph'>
      Hoeveel is twee plus een?
    </p>
    <InputContainer>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
        className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
      />
    </InputContainer>
    {isCorrect && <p className='paragraph'>
        Inderdaad. Dat was moeilijk!
    </p>}
    <h3>Raadsel</h3>
    <p className='paragraph'>
      Als je nog niet in slaap gevallen bent, dan is het tijd voor een raadsel.
      Deze past heel goed bij <b>Aart</b>.
    </p>
    <p className='paragraph'>
      Als je gaat slapen kruip je lekker onder de warme wol.
      Warme wol is <b>Aart</b> z&apos;n lievelingsstof.
      Zijn lievelingsdier bestaat daarom ook voor driekwart uit wol, weten jullie wat het is?
    </p>
    {show01 && <p className='paragraph'>
        Zijn lievelingsdier is een wolf.
    </p>}
    <InputContainer>
      {!show01 && <button onClick={() => _setShow01(true)}>Toon antwoord</button>}
      {show01 && <p className='paragraph clickable' onClick={() => _setShow01(false)}>Verberg antwoord</p>}
    </InputContainer>
  </>;
};
export function Middagdutje() {
  return (
    <>
      <p className='paragraph'>
        Komt het door al dat harde werken is, of is het de after lunch dip?
        Jullie kunnen volgens mij wel wat rust gebruiken.
      </p>
      <Story shortName={'dutje'} Puzzle={<Puzzel />} sections={[
        { title: 'Luiaard', animalName: 'sloth', Component: C01 },
        { title: 'Opruimen', animalName: 'elephant', Component: C02 },
        { title: 'Het werkt!', animalName: 'elephant', Component: C03 },
        { title: 'Slapen', animalName: 'sloth', Component: C04 },
      ]} />
    </>
  );
};
