import chestTreasure from '@/assets/chest-treasure.svg';
import parrot from '@/assets/parrot.svg';
import pirate from '@/assets/pirate.svg';
import Image from 'next/image';

export function ThuisDiner() {
  return <div>
    <p className="mb-4">
      Is de kist weer gevuld? Wat fijn dat het er weer mooi uit ziet. Nu maar hopen dan Fohne en Kuek niet meer langs komen.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={parrot} width="64" alt="parrot" />
      <Image src={chestTreasure} width="64" alt="chestTreasure" />
      <Image src={pirate} width="64" alt="pirate" />
    </div>
    <p className="mb-4">
      Onder tussen zullen jullie wel honger hebben. Na deze inspanningen hebben jullie ook wel een lekkere maaltijd verdient.
      Eet smakelijk!
    </p>
    <p className="mb-4 text-center">
      <strong>Menu</strong>
      <ul>
        <li>Traybake</li>
        <li>Piraten Toetje</li>
      </ul>
    </p>
  </div>;
}
