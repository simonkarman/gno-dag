import bottle from '@/assets/bottle.svg';
import Image from 'next/image';

export function ThuisRaadsels() {
  return <div>
    <p className="mb-4">
      Ineens valt Simon iets te binnen. Hij herinnert zich dat hij een gek geluid onder de bank had gehoord.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={bottle} width="64" alt="bottle" />
    </div>
    <p className="mb-4">
      Ga daar eens kijken en wat vind je?
    </p>
  </div>;
}
