import { ActivationProps } from '@/components/activation-props';

export default function Cyanotype(props: ActivationProps) {
  return <>
    <div className="text-green-700 mb-2">[TIJDCOÖRDINATEN BEVESTIGD]</div>

    <p>
      Uitstekend, {props.who.join(' en ')}. Mijn berekeningen zijn voltooid.
    </p>

    <p className="mb-3 font-bold">
      We bevinden ons inderdaad in het jaar 1842.
    </p>

    <p>
      Maar hier ligt een probleem: hoe documenteren we jullie aanwezigheid in deze tijdlijn
      zonder de fotografische technologie van jullie eigen tijd? Gewone camera's bestaan hier simpelweg nog niet.
    </p>

    <p>
      Wacht... ik detecteer iets interessants. Een zekere Anna Atkins heeft dit jaar
      een baanbrekende ontdekking gedaan. Zij heeft een proces ontwikkeld genaamd 'cyanotype' -
      een methode om silhouetten vast te leggen met behulp van chemicaliën en zonlicht.
    </p>

    <p>
      Fascinerend detail: deze Anna Atkins gebruikt haar techniek om botanische specimens
      te catalogiseren. Varens, algen... Ze wordt de eerste vrouwelijke fotograaf van de geschiedenis,
      al weet ze dat zelf nog niet.
    </p>

    <p>
      Ik heb Marjolein geïnstrueerd over het exacte proces. Jullie moeten dit
      documentatiesysteem nu gebruiken om jullie aanwezigheid in 1842 te bewijzen.
    </p>

    <p className="text-yellow-600 font-bold">
      Creëer jullie cyanotype-bewijsmateriaal. Jullie zullen dit later nodig hebben.
    </p>

    <div className="text-green-700 mt-4">
      [MISSIE STATUS: <span className="text-mono">DOCUMENTATIE VEREIST</span>]
    </div>
  </>;
}
