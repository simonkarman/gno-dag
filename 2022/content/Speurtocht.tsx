import { AnimalImg } from '../components/AnimalImg';

export function Speurtocht() {
  return (
    <>
      <AnimalImg visual={'round'} name={'elephant'} />
      <AnimalImg visual={'round'} name={'dog'} />
      <p className='paragraph'>
        Speurtocht.
      </p>
    </>
  );
};
