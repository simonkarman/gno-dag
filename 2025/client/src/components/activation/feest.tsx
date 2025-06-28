import { ActivationProps } from '@/components/activation-props';
import { useState } from 'react';

export default function Feest(props: ActivationProps) {
  const [showTimePrep, setShowTimePrep] = useState(false);

  return <>
    <div className="text-green-700 mb-2">[TIJDREIS COÖRDINATIE SYSTEEM]</div>

    <p>
      Uitstekend werk, tijdreizigers! Mijn sensoren registreren dat jullie
      lekker bezig zijn met de culinaire experimenten. De pasta-productie
      verloopt volgens planning.
    </p>

    <p className="font-semibold">
      Kunnen jullie al bijna aan tafel? Mijn timing protocollen suggereren
      dat dit het optimale moment wordt om voorbereidingen te treffen.
    </p>

    <button
      onClick={() => setShowTimePrep(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
    >
      [INITIEER TIJDREIS VOORBEREIDING] →
    </button>

    {showTimePrep && (
      <div className="animate-fade-in border-l-4 border-yellow-400 pl-4 mt-4">
        <div className="text-yellow-600 mb-2 font-mono">[TEMPORALE KALIBRATIE GESTART]</div>

        <p>
          Ondertussen heb ik de tijdreis naar 2025 terug ingezet. Mijn algoritmes
          berekenen nu de exacte coördinaten voor een veilige terugkeer naar
          jullie eigen tijdlijn.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-700 text-sm">Temporale motoren opwarmend...</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Geniet van jullie maaltijd. De tijdreis wordt voltooid zodra jullie klaar zijn.
        </p>
      </div>
    )}
  </>;
}
