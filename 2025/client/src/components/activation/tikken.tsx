import { ActivationProps } from '@/components/activation-props';

export default function Tikken(props: ActivationProps) {
  return <>
    <div className="text-amber-600 mb-2">[ANOMALIE DETECTIE]</div>

    <p>
      De chronometers lopen precies op schema, maar... er is iets anders.
    </p>

    <p className="mb-3">
      Mijn auditieve sensoren registreren een ongeïdentificeerd ritmisch patroon.
      Het tikken van jullie klokken herken ik, maar daaronder... er is een tweede frequentie.
    </p>

    <p>
      <span className="text-amber-600 font-mono">*tick... tick... tick...*</span>
    </p>

    <p>
      Ik analyseer alle mogelijke bronnen, maar dit geluid past niet in mijn database.
      Het lijkt... ouder dan verwacht. Alsof het al tikte voordat ik online kwam.
    </p>

    <p className="mb-3 font-semibold">
      Ga alsjeblieft door met jullie huidige activiteit, maar blijf alert.
    </p>

    <p>
      Mijn protocollen zijn duidelijk: jullie veiligheid heeft prioriteit.
      Als het patroon verandert of intensiveert, stop dan onmiddellijk wat jullie doen.
    </p>

    <div className="text-amber-600 mt-4 font-mono text-sm">
      [DOORLOPENDE MONITORING ACTIEF...]
    </div>
  </>;
}
