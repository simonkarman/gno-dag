import { ActivationProps } from '@/components/activation-props';

export default function Recepten(props: ActivationProps) {
  return <>
    <div className="text-cyan-400 mb-2 font-mono">[TEMPORALE NAVIGATIE ACTIEF]</div>

    <p>
      Hallo {props.who.join(' en ')},
    </p>

    <p>
      Mijn chronometer geeft aan dat jullie energieniveaus kritiek laag zijn na de intensieve
      tijdscapsule operaties. Een tactische pauze voor voedselinname is nu essentieel.
    </p>

    <p>
      Interessant... Mijn databases tonen dat jullie precies één jaar geleden in deze tijdlijn
      een vergelijkbare culinaire procedure hebben uitgevoerd. Een temporale echo die geen toeval kan zijn.
    </p>

    <div className="bg-gray-100 border border-blue-600 rounded p-4">
      <div className="text-blue-700 mb-2 font-mono">[MENU ANALYSE COMPLEET]</div>
      <p className="mb-3">Mijn systemen hebben de optimale voedselcombinatie berekend voor deze missie:</p>

      <ul className="font-semibold">
        <li>• Verse tagliatelle</li>
        <li>• Pastasaus van gepofte tomaat en paprika uit de oven</li>
        <li>• Bloemkoolsteak uit de oven</li>
        <li>• Komkommer-courgette salade</li>
      </ul>
    </div>

    <p>
      Deze combinatie zal jullie energieniveaus optimaal herstellen. Ik detecteer dat de
      benodigde procedures reeds zijn gedocumenteerd en klaar liggen voor uitvoering.
    </p>

    <p className="font-semibold">
      Verdeel de taken strategisch onder het team en voer de culinaire operatie uit.
      Deze voedselinname is cruciaal voor de finale fases van onze tijdscapsule missie.
    </p>

    <div className="text-green-400 mt-4 font-mono">
      [SUCCES GEGARANDEERD BIJ CORRECTE UITVOERING]
    </div>
  </>;
}
