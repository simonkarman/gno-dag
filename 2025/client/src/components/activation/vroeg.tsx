import { ActivationProps } from '@/components/activation-props';
import Image from 'next/image';

export default function Vroeg(props: ActivationProps) {
  return <>
    <p>Je hebt de eerste hint gevonden!</p>
    <h1 className="font-bold text-xl">Maar... je bent wel erg vroeg!</h1>
    <p>Kom je terug op zondag 29 juni?</p>
    <p>Zorg dan dat je om 9:00 uur gedoucht klaar zit aan de keukentafel in Bodegraven voor een ontbijt.</p>
    <hr className='text-zinc-200 my-4' />
    {props.who.length === 1 && <p>Je bent hier alleen... Wat zou er gebeuren als je hier niet alleen was?</p>}
    {props.who.length === 2 && <p>Jullie zijn met z&apos;n tweeën... Nog steeds niet genoeg</p>}
    {props.who.length >= 3 && props.who.length <= 5 && (<>
        <p>Het wordt hier al aardig gezellig!</p>
        <ul>
          {props.who.map(p => (
            <li key={p} className="list-disc list-inside">
              {p}
            </li>
          ))}
        </ul>
        <p>Wie missen we nog?</p>
    </>)}
    {props.who.length >= 6 && <>
      <p>Jullie zijn met z&apos;n zessen!</p>
      <Image
        alt="party"
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHFlZmEwYzJpOW1nMWFpZ2hwMGkwYjQzZzloamJybHR0NTF3dXZjNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/blSTtZehjAZ8I/giphy.gif"
        width="400"
        height="300"
      />
    </>}
  </>;
}
