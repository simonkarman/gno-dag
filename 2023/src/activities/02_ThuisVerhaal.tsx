import Image from 'next/image';
import parrotSvg from '../assets/parrot.svg';
import pirateSvg from '../assets/pirate.svg';

export function ThuisVerhaal() {
  return <div>
    <p className="mb-4">
      Huh? Wat vliegt daar in de lucht? Is het een vliegtuig, is het een vogel? Nee! Het is papagaai <strong>Kuek</strong>.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={parrotSvg} width="64" alt="parrot" />
      <Image src={pirateSvg} width="64" alt="pirate" />
    </div>
    <p className="mb-4">
      Maar dat betekent dat piraat <strong>Fohne</strong> ook in de buurt moet zijn...? Oh, nee!
    </p>
    <p className="mb-4">
      Fohne is de gevaarlijkste en meest beruchte piraat van het land. Als hij in de buurt is is het altijd oppassen geblazen.
      Maar waarom vandaag? En waarom hier?
    </p>
    <p className="mb-4">
      Fohne zal wel gehoord hebben over die ene schatkist!
      Simon en Marjolein waren namelijk bezig met het vullen van een schatkist.
      Hopelijk heeft het hier niets mee te maken...
    </p>
    <p className="mb-4">
      Laten we ons in ieder geval goed voorbereiden.
      Smeer allemaal een aantal broodjes voor de lunch, zodat we goed voorbereid zijn op wat we vandaag gaan beleven.
    </p>
  </div>;
}
