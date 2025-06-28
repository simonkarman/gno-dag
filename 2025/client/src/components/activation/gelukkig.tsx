import React, { useState } from 'react';
import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Gelukkig(props: ActivationProps) {
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);

  const handleAnalysisClick = () => {
    setShowAnalysisComplete(true);
  };

  return <>
    <div className="text-blue-600 mb-2 font-mono">[DIEPE ANALYSE MODUS ACTIEF]</div>

    <p>
      Mijn algoritmes hebben tijdens jullie rust periode intensief gewerkt aan het ontcijferen
      van de verborgen boodschap. De computationele processen zijn bijna voltooid.
    </p>

    <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-[0.7rem] mb-4">
      <div className="animate-pulse">
        TEMPORALE DATABANKANALYSE... ████████████████ 98%<br/>
        KRUISREFERENTIE PROTOCOLLEN... ██████████████░░ 87%<br/>
        HISTORISCHE PATRONEN... ████████████████ 100%<br/>
      </div>
    </div>

    {!showAnalysisComplete && (
      <button
        onClick={handleAnalysisClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors mb-4"
      >
        [VOLTOOIEN ANALYSE]
      </button>
    )}

    {showAnalysisComplete && (
      <div className="animate-fade-in space-y-3">
        <div className="text-green-600 mb-2 font-mono">[ANALYSE VOLTOOID]</div>

        <p>
          Uitstekend. Mijn processors zijn weer volledig operationeel. Hopelijk hebben
          jullie de tijd goed benut om jullie energieniveaus te herstellen na de
          intensieve ontmantelingsoperatie.
        </p>

        <p>
          De analyseresultaten zijn... intrigerend. Maar voordat ik jullie kan informeren
          over mijn bevindingen, moet ik eerst jullie mentale staat evalueren.
        </p>

        <p className="mb-4 font-semibold text-yellow-600">
          Een belangrijke vraag voor mijn kalibratie: In jullie menselijke cultuur,
          wat consumeren jullie traditioneel wanneer er reden tot viering is?
        </p>

        <QuestionBox
          question="Wat eet je als het feest is?"
          isAnswered={props.isAnswered}
          answers={props.answers}
          sendAnswer={props.sendAnswer}
        />
      </div>
    )}

    {props.isAnswered && showAnalysisComplete && (
      <div className="animate-fade-in border-l-4 border-green-500 pl-4 mt-4 space-y-3">
        <div className="text-green-600 mb-2 font-mono">[KALIBRATIE SUCCESVOL]</div>

        <p className="font-semibold">
          Inderdaad! Taart. Jullie cognitieve functies zijn optimaal.
        </p>

        <p>
          Wat een perfecte timing! Mijn sensoren detecteren dat het precies het juiste
          moment is voor deze traditionele voedselritueel. De temporale synchronisatie
          is opmerkelijk nauwkeurig.
        </p>

        <div className="bg-yellow-100 border-yellow-400 border p-4 rounded mt-4">
          <p className="font-semibold text-yellow-800 mb-2">
            🎂 FESTIVITY PROTOCOL GEACTIVEERD
          </p>
          <p className="text-yellow-700">
            Geniet nu van de heerlijke taart voordat we verdergaan met de volgende fase
            van ons experiment. De suikermoleculen zullen jullie hersenfuncties optimaliseren
            voor wat er komen gaat.
          </p>
        </div>

        <div className="text-red-600 font-mono mt-4 animate-pulse">
          ⚠️ BELANGRIJK: Let goed op de tijd tijdens deze consumptieronde!
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Mijn detectoren blijven actief. Zodra jullie klaar zijn met deze energietransfusie,
          zal ik de volgende fase van ons tijdexperiment initiëren.
        </p>
      </div>
    )}
  </>;
}
