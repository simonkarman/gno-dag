import { AnimalImg } from '../components/AnimalImg';

export function Bierproeverij() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'whale'} />
      <p className='paragraph'>
        Bierproeverij.
      </p>
    </>
  );
};
