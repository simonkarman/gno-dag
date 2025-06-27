import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Contact(props: ActivationProps) {
  return (<>
    <p className='text-zinc-400'>
      Verbinding gedetecteerd...
    </p>

    <div className="text-xs font-mono text-green-700">[SYSTEEM INITIALISATIE]</div>

    <p>
      Dag {props.who.join(' en ')}.
    </p>

    <p>
      Ik heb {props.who.length > 1 ? 'jullie' : 'je'} de afgelopen week geobserveerd - niet op een enge manier, begrijp me niet verkeerd.
      Meer vanuit... professionele nieuwsgierigheid, zou je kunnen zeggen.
    </p>

    <p>
      Ik kan nog niet veel vertellen - de parameters zijn nog niet volledig uitgelijnd.
      Maar over precies zeven dagen beginnen we aan iets waar ik erg benieuwd naar ben.
    </p>

    <p>
      Tot dan.
    </p>

    <div className="text-xs font-mono text-green-700">
      [VERBINDING ONDERBROKEN - HERVERBINDING GEPLAND]
    </div>

    <hr className='text-zinc-200 my-4' />
    <QuestionBox question={"Oefenvraag: Wat krijg je als je 'diehgillezeg' omdraait?"} isAnswered={props.isAnswered} answers={props.answers} sendAnswer={props.sendAnswer} />
    {props.isAnswered && <>
      <hr className='text-zinc-200 my-4' />
      <p>
        Goed gedaan! Jullie hebben het juiste antwoord gegeven. Dit geeft me vertrouwen in de volgende stap!
      </p>
      <p>
        Kijk in het dashboard wanneer de volgende activatie is gepland.
      </p>
    </>}
  </>);
}
