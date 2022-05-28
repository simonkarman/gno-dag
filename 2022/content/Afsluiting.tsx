import { Story } from '../components/Story';

const C01 = <p className='paragraph'>
  Alles valt weer op z&apos;n plek!
  Nu ik dit prachtige plaatje zie komen alle herinneringen weer terug.
  Wat fijn zeg.
</p>;

const C02 = <p className='paragraph'>
  Hey <b>Ollie</b>!
  Wat zeg je me nou?
  Het lijkt erop dat jullie missie voor vandaag is geslaagd!
  Toen ik jullie vanmorgen op pad stuurde kon ik hier alleen maar van dromen.
</p>;

const C03 = <p className='paragraph'>
  Bedankt <b>Waldo</b>!
  Het is je gelukt om alle dieren en de aanwezigen op GNO dag bij elkaar te krijgen.
  Iedereen heeft keihard samengewerkt om mijn geheugen terug te vinden.
  En dat is jullie samen gelukt.
  Zonder jullie allemaal hadden we dit nooit kunnen bereiken.
  Heel erg bedankt voor jullie hulp.
</p>;

const C04 = <>
  <p className='paragraph'>
    Het klinkt alsof jullie een hele leuke dag hebben gehad!
    Dat wordt zometeen vast lekker slapen.
    Maar geniet eerst nog van de rest van de avond.
    En tot ziens namens alle dieren!
  </p>
  <p className='paragraph'>
    Liefs, Siem en Mar.
  </p>
  <p className='paragraph'>
    PS: vergeet de tie dye creaties niet!
  </p>
</>;

export function Afsluiting() {
  return (
    <>
      <p className='paragraph'>
        Wat een dag!
      </p>
      <Story shortName={'diner'} sections={[
        { title: 'Plaatje', animalName: 'elephant', Component: C01 },
        { title: 'Goed gehoord?', animalName: 'walrus', Component: C02 },
        { title: 'Bedankt!', animalName: 'elephant', Component: C03 },
        { title: 'Tot volgend jaar', animalName: 'walrus', Component: C04 },
      ]} />
    </>
  );
};
