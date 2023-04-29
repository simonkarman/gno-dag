import {useMemo} from 'react';
import scrollSvg from '../assets/scroll.svg';
import rumSvg from '../assets/rum.svg';
import parrotSvg from '../assets/parrot.svg';
import Image from 'next/image';

export default function Preview() {
  const svg = useMemo(() => {
    const options = [scrollSvg, rumSvg, parrotSvg];
    return options[Math.floor(Math.random() * options.length)];
  }, []);

  return <>
    <p className="text-center">
      Het is bijna zo ver! Op zaterdag 6 mei vieren we GNO Dag 2023. Kan je al raden wat het thema dit jaar gaat zijn?
    </p>
    <hr className="my-4" />
    <div className="w-36 h-36 mx-auto my-10">
      <Image src={svg} className="animate-spin-slow" alt="a pirate logo that is spinning" />
    </div>
    <hr className="my-4" />
    <p className="text-center">
      Kan je niet wachten? Kijk dan nog eens terug naar
      {' '}
      <a className="underline text-gray-600 hover:text-gray-800 visited:text-gray-600" href="https://gno-2022.karman.dev">wat we in 2022 gedaan hebben</a>.
    </p>
  </>;
}
