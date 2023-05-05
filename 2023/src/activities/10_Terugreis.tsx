import map from '@/assets/map.svg';
import Image from 'next/image';

export function Terugreis() {
  return <div>
    <p className="mb-4">
      Zitten jullie weer in de auto?
      We gaan nu onze reis vervolgen.
      Letten jullie onderweg goed op of jullie nog een glimp van Fohne of Kuek opvangen?
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={map} width="64" alt="map" />
    </div>
    <p className="mb-4">
      Maar wat is eigenlijk onze bestemming?
    </p>
  </div>;
}
