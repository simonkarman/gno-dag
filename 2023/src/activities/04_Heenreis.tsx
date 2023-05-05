import parrotSvg from '@/assets/parrot.svg';
import mapSvg from '@/assets/map.svg';
import bagSvg from '@/assets/bag.svg';
import Image from 'next/image';

export function Heenreis() {
  return <div>
    <p className="mb-4">
      Riemen vast. Daar gaan we!
      In de verte zien we papegaai <strong>Kuek</strong> nog vliegen. Het lijkt alsof ze de N11 op gaan. Gaan ze richting Alphen a/d Rijn?
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={bagSvg} width="64" alt="bag" />
      <Image src={mapSvg} width="64" alt="map" />
      <Image src={parrotSvg} width="64" alt="parrot" />
    </div>
  </div>;
}
