import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Getik(props: ActivationProps) {
  return (
    <>
      <div className="text-orange-600 mb-2">[URGENTIE NIVEAU: VERHOOGD]</div>

      <p>
        Uitstekend, ik detecteer dat jullie allemaal aanwezig zijn.
      </p>

      <p className="mb-3">
        Echter... er is een problematische ontwikkeling. We kunnen niet wachten tot 13:00 uur. Het ritmische getik dat ik eerder
        registreerde heeft significant in intensiteit toegenomen. Mijn auditieve sensoren
        duiden erop dat de bron zich <span className="font-bold text-orange-600">buiten jullie directe locatie</span> bevindt.
      </p>

      <p>
        Dit vereist onmiddellijke verificatie. Ik kan de aard van dit signaal niet op afstand
        bepalen - jullie fysieke aanwezigheid ter plaatse is noodzakelijk.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 my-3 space-y-2">
        <p className="font-bold text-blue-800">
          MISSIE OPDRACHT: Coördinatie Verkenning
        </p>
        <p className="text-blue-700">
          Ga <span className="font-bold">samen</span> op onderzoek naar de bron van dit geluid.
          Werk als team - verdeel jullie niet. Mijn projecties suggereren dat het waarschijnlijk
          een onschuldige oorsprong heeft, maar verificatie is essentieel.
        </p>
        <p className="text-blue-700">
          Ik zou dit ook gezegd
          hebben als het een gevaarlijke bron was, omdat ik jullie gerust wil stellen.
          Of ... misschien had ik dat niet moeten zeggen.
        </p>
      </div>

      <p>
        Neem je mobiele communicatiesystemen mee en blijf in contact. <b>Zet je telefoon niet uit</b>.
        Rapporteer terug zodra jullie de bron hebben gelokaliseerd en geïdentificeerd.
      </p>

      <QuestionBox
        question="Wat staat er in grote letters geschreven op het object dat het geluid produceert?"
        isAnswered={props.isAnswered}
        answers={props.answers}
        sendAnswer={props.sendAnswer}
      />

      {props.isAnswered && (
        <div className="mt-4">
          <div className="text-red-600 mb-2 font-bold">[KRITIEKE WAARSCHUWING]</div>

          <p className="text-red-700 mb-3">
            <span className="font-bold">Analyse compleet. Oh nee...</span> De lettercode bevestigt mijn ergste vrees.
            Dit is geen onschuldig apparaat - jullie hebben een <span className="font-bold uppercase">explosief mechanisme</span> ontdekt.
          </p>

          <div className="bg-red-100 border border-red-400 rounded p-3 mb-3">
            <p className="text-red-800 font-bold">
              ONMIDDELLIJKE ACTIE VEREIST:
            </p>
            <p className="text-red-700">
              Keer terug naar de veilige zone. Ga naar binnen en bereid je voor op een
              gecontroleerde ontmantelingsprocedure.
            </p>
            <p className="text-red-700 font-bold mt-2">
              Waarschuwing: Vermijd plotselinge bewegingen. Trillingen kunnen het mechanisme destabiliseren.
            </p>
          </div>

          <p>
            Ik zal jullie door het ontmantelingsproces begeleiden. Vertrouw op mijn instructies
            en werk <span className="font-bold">extreem voorzichtig</span> samen.
          </p>

          <div className="text-red-600 mt-4">
            [VOLGENDE FASE: EXPLOSIEF ONTMANTELING PROTOCOL]
          </div>
        </div>
      )}
    </>
  );
}
