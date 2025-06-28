import { useState } from 'react';
import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Capsule(props: ActivationProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [scanningComplete, setScanningComplete] = useState(false);

  const handleOpenCapsule = () => {
    setIsOpened(true);
    // Simulate scanning delay
    setTimeout(() => setScanningComplete(true), 2000);
  };

  return <>
    <div className="text-blue-600 mb-2">[TIJDSCAPSULE DETECTIE]</div>

    <p>
      Uitstekend. Mijn sensoren registreren dat jullie het voorwerp hebben gelokaliseerd.
      Ik detecteer een perfecte cilindervormige structuur - dit is inderdaad de tijdscapsule
      die we zochten.
    </p>

    <p>
      Mijn analyses wijzen erop dat deze capsule meer bevat dan alleen de recepten
      die jullie hebben achtergelaten. Er zijn additionele objecten gedetecteerd
      binnen de capsule structuur.
    </p>

    {!isOpened ? (
      <div className="space-y-4">
        <p className="font-semibold text-orange-600">
          Het moment van waarheid is aangebroken. Open de capsule en ontdek
          wat de tijd heeft bewaard.
        </p>

        <button
          onClick={handleOpenCapsule}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🔓 CAPSULE OPENEN
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        {!scanningComplete && (
          <div className="animate-pulse border-2 border-blue-400 rounded-lg p-4 bg-blue-50">
            <div className="text-blue-700 font-mono mb-2">[SCANNING CAPSULE CONTENTS...]</div>
            <div className="h-2 bg-blue-200 rounded">
              <div className="h-2 bg-blue-600 rounded animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {scanningComplete && (
          <div className="animate-fade-in space-y-4">
            <div className="text-green-600 font-mono">[SCAN COMPLEET]</div>

            <p>
              Fascineerend! Mijn detectiesystemen hebben een object geïdentificeerd
              dat niet in mijn oorspronkelijke manifests stond. Er lijkt iets extra's
              toegevoegd te zijn tijdens jullie afwezigheid.
            </p>

            <p className="font-semibold">
              Vertel me - wat hebben jullie aangetroffen in de diepte van de tijdscapsule?
              Wat is dit mysterieuze object dat mijn sensoren detecteren?
            </p>

            <QuestionBox
              question="Welk classic cadeau hebben jullie gevonden in de tijdscapsule?"
              isAnswered={props.isAnswered}
              answers={props.answers}
              sendAnswer={props.sendAnswer}
            />

            {props.isAnswered && (
              <div className="animate-fade-in border-l-4 border-green-500 pl-4 mt-6 space-y-3">
                <div className="text-green-600 mb-2 font-mono">[OBJECT GEVERIFIEERD]</div>

                <p>
                  Inderdaad! Een tegoedbon. Mijn databases bevestigen dit - dat hoort er
                  toch wel echt bij. Dit is een uitermate logische toevoeging aan jullie
                  tijdscapsule collectie.
                </p>

                <p>
                  Nu begint het echte proces van tijdcapsule archivering. Het is tijd
                  om alle informatie kaartjes methodisch in te vullen en ze terug te
                  plaatsen in hun oorspronkelijke positie.
                </p>

                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-semibold text-yellow-800">
                    ⚠️ BELANGRIJKE INSTRUCTIE: Leg de recepten nog even apart.
                  </p>
                  <p className="text-yellow-700">
                    Deze documenten hebben een speciale bestemming en mogen nog
                    niet worden gearchiveerd met de rest van de items.
                  </p>
                </div>

                <p className="font-semibold">
                  Begin met het systematisch invullen van de informatiekaarten.
                  Elk detail dat jullie vastleggen wordt onderdeel van jullie
                  tijdcapsule legacy.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </>;
}
