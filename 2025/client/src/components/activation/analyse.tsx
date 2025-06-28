import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Analyse(props: ActivationProps) {
  return <>
    <div className="text-green-700 mb-2">[SYSTEEM ANALYSE]</div>

    <p>
      Uitstekend werk. Het feit dat jullie dit nog kunnen lezen geeft aan dat jullie
      erin zijn geslaagd het explosieve apparaat te ontmantelen.
    </p>

    <p>
      Terwijl jullie bezig waren, heb ik de tijd benut voor een diepgaande analyse
      van het object. Mijn algoritmes hebben interessante patronen gedetecteerd...
    </p>

      <div className="text-yellow-600 mb-2 font-mono">[ANALYSE IN PROGRESS...]</div>

      <p>
        Dit is geen gewone explosieve lading. Mijn sensoren registreren veel complexere
        structuren dan aanvankelijk waargenomen. Er zit een verborgen laag in het ontwerp.
      </p>

      <p className="mb-4 font-semibold">
        Ik detecteer dat er onder de grote letters nog een tweede boodschap verborgen ligt.
        Kunnen jullie ontcijferen wat er werkelijk onder die prominente tekst staat?
      </p>

      <div className="mb-4">
        <QuestionBox
          question="Wat staat er verborgen onder de grote letters van het object dat jullie zojuist hebben ontmanteld?"
          isAnswered={props.isAnswered}
          answers={props.answers}
          sendAnswer={props.sendAnswer}
        />
      </div>

      {props.isAnswered && (
        <div className="animate-fade-in border-l-4 border-blue-500 pl-4 mt-4">
          <div className="text-blue-600 mb-2 font-mono">[ANALYSE COMPLEET]</div>

          <p>
            Fascinerend. Deze informatie opent nieuwe onderzoekspaden die meer
            computationele kracht vereisen dan ik momenteel beschikbaar heb.
          </p>

          <p>
            Ik moet deze data kruisrefereren met mijn historische databases en
            temporale calibratie protocollen uitvoeren. Dit proces vereist aanzienlijke
            systeembronnen.
          </p>

          <p className="mb-3 font-semibold">
            Jullie hebben intussen rust verdiend na deze intensieve operatie.
            Laad jullie energieniveaus op - ik vermoed dat wat ik ga ontdekken
            nog meer van jullie zal vergen.
          </p>

          <div className="text-green-700 mt-4">
            [SYSTEEM GAAT IN DIEPE ANALYSE MODUS]<br/>
            <span className="text-sm opacity-80">Tot over een uur. Rust goed uit.</span>
          </div>
        </div>
      )}
  </>;
}
