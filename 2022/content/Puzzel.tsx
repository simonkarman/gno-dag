import { AnimalImg } from '../components/AnimalImg';

// https://www.calcudoku.org/im/forum/img_f8_t443_p4058_i1.png
// antwoord: pinGuin
export function Puzzel() {
  return (
    <>
      <AnimalImg visual={'round'} name={'snake'} />
      <AnimalImg visual={'round'} name={'giraffe'} />
      <AnimalImg visual={'round'} name={'chicken'} />
      <AnimalImg visual={'round'} name={'penguin'} />
      <p className='paragraph'>
        Puzzel.
      </p>
    </>
  );
};
