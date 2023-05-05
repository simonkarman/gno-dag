import Image from 'next/image';
import scrollSvg from '../assets/scroll.svg';
import rumSvg from '../assets/rum.svg';
import parrotSvg from '../assets/parrot.svg';

export function ThuisOntbijt() {
  return <div>
    <p className="mb-4">
      Goedemorgen! Welkom aan de start van GNO Dag 2023! Het belooft weer een spannend avondtuur te worden.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={scrollSvg} width="64" alt="scroll" />
      <Image src={rumSvg} width="64" alt="rum" />
      <Image src={parrotSvg} width="64" alt="parrot" />
    </div>
    <p className="mb-4">
      In dit activiteitenoverzicht kan je precies zijn waar we nu mee bezig zijn.
      Je kan ook zien hoe laat de volgende melding zichtbaar wordt!
      Houd dit gedurende de dag goed in de gaten!
    </p>
    <p className="mb-4">
      Hoe laat komt de volgende melding beschikbaar?
    </p>
    <p className="mb-4">
      We beginnen de dag met een goed ontbijt!
    </p>
    <p className="mb-4 text-center">
      <strong>Menu</strong>
      <ul>
        <li>Overnight oats</li>
        <li>Mini ontbijt quiches</li>
      </ul>
    </p>
    <p>
      Eet smakelijk!
    </p>
    <hr className="my-4"/>
    <p>
      Heb je genoeg gegeten? Kijk anders nog eens terug naar
      {' '}
      <a className="underline text-gray-600 hover:text-gray-800 visited:text-gray-600" href="https://gno-2022.karman.dev">
        wat we in 2022 gedaan hebben
      </a>.
    </p>
  </div>;
}
