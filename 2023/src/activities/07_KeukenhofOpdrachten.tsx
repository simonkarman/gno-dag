import scroll from '@/assets/scroll.svg';
import chest from '@/assets/chest.svg';
import Image from 'next/image';

export function KeukenhofOpdrachten() {
  return <div>
    <p className="mb-4">
      Tijd om inspiratie op te gaan doen om de schatkist weer te vullen. Als het goed is zit er in 1 van jullie tassen een envelop.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={scroll} width="64" alt="scroll" />
      <Image src={chest} width="64" alt="chest" />
    </div>
    <p className="mb-4">
      Open deze envelop en neem allemaal 2 kaartjes. Voer deze opdrachten zorgvuldig uit.
      Geniet ondertussen natuurlijk ook van alles wat jullie zien.
    </p>
  </div>;
}
