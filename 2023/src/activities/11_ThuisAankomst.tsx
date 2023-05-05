import rum from '@/assets/rum.svg';
import Image from 'next/image';

export function ThuisAankomst() {
  return <div>
    <p className="mb-4">
      We zijn weer veilig thuis. Pak lekker wat drinken en ga aan de tafel zitten.
      Hebben jullie al zin om iets te snacken?
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={rum} width="64" alt="rum" />
    </div>
    <p className="mb-4">
      Zorg dat je klaar zit voor de volgende hint!
    </p>
  </div>;
}
