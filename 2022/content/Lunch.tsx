import { AnimalImg } from '../components/AnimalImg';

export function Lunch() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'rabbit'} />
      <p className='paragraph'>
        Lunch.
      </p>
    </>
  );
};
