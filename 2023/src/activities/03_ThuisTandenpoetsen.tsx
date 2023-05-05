import treasureSvg from '@/assets/treasure.svg';
import pirateSvg from '@/assets/pirate-zombie.svg';
import Image from 'next/image';

export function ThuisTandenpoetsen() {
  return <div>
    <p className="mb-4">
      &quot;Dat meen je niet&quot;, schreeuwt Marjolein, terwijl ze in de verte piraat Fohne er met de inhoud van de schatkist van door ziet rennen.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={treasureSvg} width="64" alt="treasure" />
      <Image src={pirateSvg} width="64" alt="pirate" />
      <Image src={treasureSvg} width="64" alt="treasure" />
    </div>
    <p className="mb-4">
      Snel! Het is tijd om tanden te poetsen, de schoenen aan te doen (die geschikt zijn voor een goede wandeling), en je klaar te maken om dit avontuur aan te gaan.
      We gaan met de auto achter Fohne aan. Zorg dat jullie niet vergeten de lunch, die je net gemaakt hebt, mee te nemen.
    </p>
    <p className="mb-4">
      <strong>Let op</strong>: Jac. en Govie mogen niet in dezelfde auto en Simon en Marjolein zullen de bestuurders zijn.
    </p>
  </div>;
}
