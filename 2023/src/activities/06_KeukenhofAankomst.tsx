import flagSvg from '@/assets/bones-flag.svg';
import Image from 'next/image';

export function KeukenhofAankomst() {
  return <div>
    <p className="mb-4">
      We zijn er! Welkom bij de Keukenhof.
      Ondanks dat de schat gestolen is door <strong>Fohne</strong> en <strong>Kuek</strong> (draai de namen eens om!), kunnen we hier
      op zoek naar een heleboel insipratie om de schat te kunnen herstellen.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={flagSvg} width="64" alt="flag" />
    </div>
    <p className="mb-4">
      Ga naar binnen en begin met verkennen. Veel plezier en vergeet niet om de meldingen in de app in de gaten te houden.
      Hoe laat is de volgende melding?
    </p>
  </div>;
}
