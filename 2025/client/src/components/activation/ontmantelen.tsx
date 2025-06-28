import { ActivationProps } from '@/components/activation-props';

export default function Ontmantelen(props: ActivationProps) {
  return <>
    <div className="text-red-600 mb-2 animate-pulse">[NOODPROTOCOL GEACTIVEERD]</div>

    <p className="mb-3">
      URGENT! {props.who.join(' en ')}, mijn analyse van de tijdfluctuaties heeft een
      kritieke instabiliteit gedetecteerd!
    </p>

    <p className="mb-3 text-red-700 font-bold">
      Een temporale bom zal binnekort ontploffen - om precies 13:45!
      Dit zou catastrofale gevolgen kunnen hebben voor onze terugkeer.
    </p>

    <p className="mb-3">
      Gelukkig heb ik de ontmantelingsprocedures al naar Simon doorgestuurd.
      Hij beschikt nu over de complete technische handleiding. Jullie moeten als team samenwerken
      om deze dreiging te neutraliseren.
    </p>

    <p className="mb-3">
      <span className="text-blue-600 font-semibold">EXPLOSIEF ONTMANTELING PROTOCOL:</span>
      <br />
      Simon heeft de hoofdverantwoordelijkheid - hij ziet wat jullie niet kunnen zien.
      De rest van het team moet zijn instructies nauwkeurig opvolgen.
      Tijd is cruciaal. Communicatie is alles.
    </p>

    <p className="mb-3">
      Terwijl jullie deze levensgevaarlijke situatie tackelen, zal ik in de achtergrond
      de tijdgegevens analyseren die we tot nu toe hebben verzameld.
      Deze crisis kan ons belangrijke inzichten geven over de temporale anomalieën.
    </p>

    <p className="mb-4 text-green-600">
      Ik vertrouw op jullie vaardigheden. Jullie hebben 35 jaar bewezen
      dat jullie als team elke uitdaging aankunnen. Dit wordt geen uitzondering.
    </p>

    <div className="bg-red-100 border border-red-400 p-3 rounded mb-3">
      <p className="text-red-800 font-bold">
        STATUS: ONTMANTELING IN UITVOERING...
        <br />
        We spreken elkaar zodra de situatie veilig is.
      </p>
    </div>

    <div className="text-green-700 mt-4">
      [SYSTEEM MONITORING ACTIEF - SUCCES VERWACHT]
    </div>
  </>;
}
