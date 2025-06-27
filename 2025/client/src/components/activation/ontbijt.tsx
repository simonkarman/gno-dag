import { ActivationProps } from '@/components/activation-props';

export default function Ontbijt(props: ActivationProps) {
  return <>
    <div className="text-green-700 mb-2">[SYSTEEM ACTIVATIE]</div>

    <p>
      Goedemorgen {props.who.join(' en ')},
    </p>

    <p className="mb-3 font-bold uppercase">
      Het is zover! GNO Dag 2025! Hebben jullie er zin in?
    </p>

    <p>
      De eerste fase van ons experiment begint nu. Ik detecteer dat jullie metabolische systemen
      optimale brandstof nodig hebben voor wat komen gaat. Oftewel, tijd voor ontbijt!
    </p>

    <p>
      Interessant... er hangt een ongebruikelijke energie in de atmosfeer vandaag.
      Mijn sensoren registreren fluctuaties rond jullie locatie die ik nog niet volledig kan verklaren.
    </p>

    <p>
      Werk samen - jullie zullen elkaar vandaag nodig hebben.
      Let goed op de activatietijden aan de rechterkant van jullie interface.
      De timing is cruciaal voor wat ik van plan ben.
    </p>

    <p>
      Eet smakelijk. Geniet van het ontbijt en deze laatste momenten van... normaliteit.
    </p>

    <div className="text-green-700 mt-4">
      [VOLGENDE ACTIVATIE: <span className="text-mono opacity-60 italic">(zie dashboard)</span>]
    </div>
  </>;
}
