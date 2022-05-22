import { AnimalImg } from '../components/AnimalImg';

export function Diner() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'crocodile'} />
      <p className='paragraph'>
        Diner.
      </p>
    </>
  );
};
