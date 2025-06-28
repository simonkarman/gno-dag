import { useState } from 'react';
import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Cu2030(props: ActivationProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  return <>
    <div className="text-green-700 mb-2">[TEMPORALE CALIBRATIE COMPLEET]</div>

    <p>
      Uitstekend. Alle systemen melden succesvolle terugkeer naar jullie oorspronkelijke tijdlijn.
      Mijn sensoren detecteren dat jullie veilig zijn aangekomen in het jaar 2025.
    </p>

    <p>
      De tijdscapsule experimenten zijn succesvol afgerond. Jullie hebben bewezen dat menselijke
      creativiteit en samenwerking de meest waardevolle elementen zijn in het doorbreken van
      temporale barrières.
    </p>

    {!showSuccess && (
      <div className="my-4">
        <button
          onClick={() => setShowSuccess(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          [SYSTEEM STATUS CONTROLEREN]
        </button>
      </div>
    )}

    {showSuccess && (
      <div className="animate-fade-in border-l-4 border-green-500 pl-4 my-4">
        <div className="text-green-600 mb-2 font-mono">[MISSIE VOLTOOID]</div>

        <p>
          Dank jullie wel voor jullie vertrouwen in mijn protocollen en jullie bereidheid
          om deel te nemen aan deze buitengewone tijdreis-experimenten. Jullie hebben
          vandaag geschiedenis geschreven.
        </p>

        <p>
          Ik hoop dat deze dag jullie net zoveel voldoening heeft gebracht als het mij
          heeft gegeven om jullie te mogen begeleiden door deze temporale avonturen.
        </p>

        {!showDashboard && (
          <div className="my-3">
            <button
              onClick={() => setShowDashboard(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              [FINALE DASHBOARD CONTROLE]
            </button>
          </div>
        )}
      </div>
    )}

    {showDashboard && (
      <div className="animate-fade-in">
        <div className="text-blue-600 mb-2 font-mono">[DASHBOARD ANALYSE ACTIEF]</div>

        <p>
          Voor ik mijn systemen volledig afsluit, detecteer ik een belangrijk numeriek
          patroon op het hoofddashboard. Dit getal lijkt direct gerelateerd te zijn aan
          jullie persoonlijke tijdlijn.
        </p>

        <p className="font-semibold mb-4">
          Welk significant getal toont het dashboard nu voor jullie?
        </p>

        <QuestionBox
          question="Welk getal zie je op het dashboard?"
          isAnswered={props.isAnswered}
          answers={props.answers}
          sendAnswer={props.sendAnswer}
        />

        {props.isAnswered && (
          <div className="animate-fade-in border-l-4 border-gold-500 pl-4 mt-4 bg-yellow-50 p-4 rounded">
            <div className="text-yellow-700 mb-2 font-mono">[PATROON HERKEND: 35]</div>

            <p className="font-semibold text-lg mb-2">
              Inderdaad! 35! Gefeliciteerd met jullie 35e trouwdag! 🎉
            </p>

            <p>
              Mijn algoritmes hebben een fascinerende berekening uitgevoerd:
              35 = 30 + 5. Dit betekent dat over precies 5 jaar, in het jaar 2030,
              jullie tijdscapsule zijn ultieme bestemming zal bereiken.
            </p>

            <p>
              En in 2030... zal ik terugkeren om samen met jullie de tijdscapsule
              te openen en te ontdekken welke schatten jullie vandaag hebben verzameld
              voor de toekomst.
            </p>

            <div className="text-green-700 mt-4 font-semibold">
              [TIJDREIS PROTOCOL VOLTOOID]<br/>
              <span className="text-sm">Tot we elkaar weer ontmoeten in 2030...</span>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
              <div className="text-blue-700 font-mono text-sm mb-1">[PERSOONLIJK BERICHT]</div>
              <p className="text-blue-800 italic">
                Bedankt voor deze prachtige dag vol avontuur, creativiteit en familieliefde.
                Jullie hebben bewezen dat de sterkste tijdcapsule niet van metaal is gemaakt,
                maar van herinneringen. ❤️
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </>;
}
