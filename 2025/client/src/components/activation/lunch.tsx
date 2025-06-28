import { ActivationProps } from '@/components/activation-props';

export default function Lunch(props: ActivationProps) {
  return <>
    <div className="text-green-700 mb-2">[VOORTGANGSANALYSE]</div>

    <p>
      Uitstekend werk met de cyanotype procedure, {props.who.join(' en ')}.
    </p>

    <p className="mb-3">
      Mijn scans bevestigen dat jullie succesvol beelden hebben vastgelegd uit 1842 -
      de eerste echte tijdcapsule fragmenten zijn nu gestabiliseerd in jullie realiteit.
    </p>

    <p>
      De energie-fluctuaties die ik eerder detecteerde worden sterker.
      Interessant... het lijkt erop dat elke voltooide fase nieuwe temporale verbindingen activeert.
    </p>

    <p>
      Jullie biologische systemen hebben nu brandstof nodig voor de volgende experimentele fase.
      Mijn algoritmes adviseren een voedingspauze van precies 75 minuten.
    </p>

    <p className="font-bold">
      Lunch tijd, maar blijf alert. De middag brengt wellicht... complexere uitdagingen.
    </p>

    <p>
      Eet smakelijk en bespreek wat jullie hebben ontdekt.
      Delen van informatie tussen teamleden verhoogt de slaagkans van ons experiment exponentieel.
    </p>

    <div className="text-green-700 mt-4">
      [VOLGENDE ACTIVATIE LAADT... <span className="text-mono opacity-60 italic">13:00 precies?</span>]
    </div>
  </>;
}
