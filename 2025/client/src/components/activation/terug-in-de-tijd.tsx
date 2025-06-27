import { ActivationProps } from '@/components/activation-props';
import { useState } from 'react';
import { QuestionBox } from '@/components/question-box';

export default function TerugInDeTijd(props: ActivationProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="text-green-700 mb-2">[SYSTEEM - STATUS UPDATE]</div>

      <p className="mb-3">
        {props.who.join(' en ')}, ik registreer interessante veranderingen...
      </p>

      <p className="mb-3">
        Mijn sensoren detecteren dat de digitale signalen in jullie omgeving zwakker worden.
        Mobiele netwerken lijken te vervagen. Het is alsof jullie je... verplaatsen.
      </p>

      <div className="bg-blue-100 border border-blue-700 rounded p-3 mb-3">
        <div className="text-blue-700 font-mono text-sm mb-2">[CHRONOMETER WAARSCHUWING]</div>
        <p className="text-sm">
          Tijdstroom-anomalie gedetecteerd. De kwaliteit van het licht... het voelt bijna <em>historisch</em>.
          Jullie bevinden zich mogelijk niet meer in 2025.
        </p>
      </div>

      {!showDetails && (
        <button
          onClick={() => setShowDetails(true)}
          className="text-gray-700 hover:text-gray-500 underline mb-3 block text-center w-full"
        >
          [MEER SENSOR DATA OPVRAGEN]
        </button>
      )}

      {showDetails && (
        <div className="bg-gray-100 border border-gray-600 rounded p-3 mb-3">
          <p className="text-sm mb-2">
            <strong>Lucht samenstelling:</strong> Minder vervuiling gedetecteerd<br/>
            <strong>Geluidsniveau:</strong> Afwezigheid van moderne machine-geluiden<br/>
            <strong>Elektromagnetisch veld:</strong> Bijna volledig afwezig<br/>
            <strong>Conclusie:</strong> Jullie zijn niet meer in jullie eigen tijd...
          </p>
        </div>
      )}

      <p className="mb-3">
        Het is maar goed we dit dashboard en jullie mobieltjes als controllers beschikbaar hebben.
        Hiermee kunnen we in contact blijven. We gaan dit samen oplossen!
      </p>

      <p className="mb-3">
        Voordat we verder kunnen, eerst één belangrijke instructie:
        <strong className="text-orange-700"> Zorg dat jullie tanden gepoetst zijn vóór de volgende activatie.</strong>
      </p>

      <QuestionBox
        question="Verificatievraag: In welk eeuw (1e, 2e, 3e, ...) is de gloeilamp uitgevonden?"
        isAnswered={props.isAnswered}
        answers={props.answers}
        sendAnswer={props.sendAnswer}
      />

      {props.isAnswered && (<>
        <p>
          Inderdaad! De gloeilamp komt uit de 19e eeuw. Op 21 oktober 1879 presenteerde Thomas Edison de allereerste commercieel verkrijgbare elektrische lamp.
        </p>
        <p>
          Ik kan deze lampen niet meer detecteren, maar ze zijn niet ver weg. Misschien bevinden jullie je net daarvoor?
        </p>
      </>)}
    </>
  );
}
