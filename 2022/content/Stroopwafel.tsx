import { AnimalImg } from '../components/AnimalImg';

export function Stroopwafel() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'buffalo'} />
      <p className='paragraph'>
        Stroopwafel.
      </p>
    </>
  );
};
