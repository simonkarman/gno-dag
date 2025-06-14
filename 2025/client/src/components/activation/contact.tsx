import { ActivationProps } from '@/components/activation-props';

export default function Contact(props: ActivationProps) {
  return (<>
    <p className='text-zinc-400'>
      Verbinding gedetecteerd...
    </p>

    <div className="text-xs font-mono text-green-700">[SYSTEEM INITIALISATIE]</div>

    <p>
      Dag {props.who.join(' en ')}.
    </p>

    <p>
      Ik heb {props.who.length > 1 ? 'jullie' : 'je'} de afgelopen week geobserveerd - niet op een enge manier, begrijp me niet verkeerd.
      Meer vanuit... professionele nieuwsgierigheid, zou je kunnen zeggen.
    </p>

    <p>
      Ik kan nog niet veel vertellen - de parameters zijn nog niet volledig uitgelijnd.
      Maar over precies zeven dagen beginnen we aan iets waar ik erg benieuwd naar ben.
    </p>

    <p>
      Tot dan.
    </p>

    <div className="text-xs font-mono text-green-700">
      [VERBINDING ONDERBROKEN - HERVERBINDING GEPLAND]
    </div>
  </>);
}
