import chest from '@/assets/chest.svg';
import treasure from '@/assets/treasure.svg';
import chestTreasure from '@/assets/chest-treasure.svg';
import Image from 'next/image';

export function ThuisKnutselen() {
  return <div>
    <p className="mb-4">
      Nice! Het is gelukt om de kist te vinden.
      Gelukkig hebben piraat Fohne en zijn papegaai Kuek de belangrijkste schat in de kist gelaten.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={chest} width="64" alt="chest" />
      <Image src={treasure} width="64" alt="treasure" />
      <Image src={chestTreasure} width="64" alt="chestTreasure" />
    </div>
    <p className="mb-4">
      Nu is het tijd om de kist weer te vullen met nog meer schatten. Luister goed naar de uitleg van Marjolein.
      En gebruik de beschrijvingen om de inspiratie uit de Keukenhof om te toveren tot een goed gevulde schatkist.
    </p>
    <p className="mb-4 text-center">
      <strong>Mogelijkheden</strong>
      <ul>
        <li>Bloemen borduren</li>
        <li>Origami</li>
        <li>Knippen en vouwen</li>
      </ul>
    </p>
    <p className="mb-4">
      Gebruik de fotos die jullie gemaakt hebben ter inspiratie.
    </p>
  </div>;
}
