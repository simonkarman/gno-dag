import ship from '@/assets/ship.svg';
import Image from 'next/image';

export function KeukenhofUitgangZoeken() {
  return <div>
    <p className="mb-4">
      Was het leuk? Het is tijd om weer richting de uitgang te gaan.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={ship} width="64" alt="ship" />
    </div>
  </div>;
}
