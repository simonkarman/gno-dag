import { AnimalImg } from '../components/AnimalImg';

// Welk dier bestaat voor driekwart uit wol? wolf
export function Middagdutje() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'sloth'} />
      <p className='paragraph'>
        Middagdutje.
      </p>
    </>
  );
};
