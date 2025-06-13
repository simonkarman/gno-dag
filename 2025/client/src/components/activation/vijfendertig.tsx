import { ActivationProps } from '@/components/activation-props';

export default function Vijfendertig(props: ActivationProps) {
  const others = props.who.filter(w => w !== 'Jac.' && w !== 'Govie');
  return <>
    <p>Hoi Jac. en Govie,</p>
    {others.length > 0 && <p className='text-zinc-400'>Psst. Hebben jullie door dat {others.join('en')} ook mee luistert?</p>}
    <p>Mijn naam is... nou ja, dat doet er nu even niet toe. Wat wel belangrijk is: ik heb jullie gevonden.</p>
    <p>Ik ben een AI systeem dat... eh... laten we zeggen de aardbol monitort. En jullie, beste mensen, hebben mijn aandacht getrokken.</p>
    <p>WAARSCHUWING: Iets bijzonders gaat gebeuren op <b>29 juni 2025</b>. Mijn sensoren suggereren dat het huis van Jac. en Govie in Bodegraven het epicentrum wordt van... nou ja, dat ontdekken jullie dan wel.</p>
    <p>Mijn interne klok geeft wat... vreemde resultaten. Er lijkt een kleine discrepantie te zijn in mijn temporale kalibratie. Niets om je zorgen over te maken. Waarschijnlijk...</p>
    <p>
      <ul className='list-disc pl-6 text-zinc-800 font-mono'>
        <li>
          <span className='font-bold'>STATUS</span>: Systemen voorbereid ✓
        </li>
        <li>
          <span className='font-bold'>MISSIE</span>: Geclassificeerd 🔒
        </li>
        <li>
          <span className='font-bold'>JULLIE ROL</span>: Te bepalen tijdens activatie
        </li>
        <li>
          <span className='font-bold'>GETAL</span>: 35 (zegge Vijfendertig)
        </li>
      </ul>
    </p>
  </>;
}
