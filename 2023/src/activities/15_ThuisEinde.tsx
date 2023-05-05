import chestTreasure from '@/assets/chest-treasure.svg';
import Image from 'next/image';

export function ThuisEinde() {
  return <div>
    <p className="mb-4">
      GNO Dag zit er al weer op. Geniet nog met elkaar van de rest van de avond!
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={chestTreasure} width="64" alt="chestTreasure" />
    </div>
    <p className="mb-4">
      Tot volgend jaar. Liefs, Simon en Marjolein.
    </p>
  </div>;
}
