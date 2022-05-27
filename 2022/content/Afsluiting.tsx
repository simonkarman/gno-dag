import { Story } from '../components/Story';

const C01 = <p className='paragraph'>
  Met Waldo de walrus.
  Bedankt voor jullie hulp.
  Bedankt voor de leuke dag.
  Leuke dag geweest.
  Alle dieren opgetrommeld om te helpen.
  Ollie weer blij
  Alle activiteiten en het zien van de foto heeft geheugen terug gebracht.
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

export function Afsluiting() {
  return (
    <>
      <p className='paragraph'>
        Is het al voorbij?
      </p>
      <Story shortName={'diner'} sections={[
        { title: '1', animalName: 'walrus', Component: C01 },
        { title: '2', animalName: 'elephant', Component: C02 },
        { title: '3', animalName: 'elephant', Component: C03 },
        { title: '4', animalName: 'walrus', Component: C04 },
      ]} />
    </>
  );
};
