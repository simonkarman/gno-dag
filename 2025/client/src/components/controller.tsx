'use client';

import { ReactElement } from 'react';
import { capitalize } from '@/utils/capitalize';
import { controllerClient, useControllerStore } from '@/components/controller-client';
import { ActivationProps } from '@/components/activation-props';
import Vroeg from '@/components/activation/vroeg';
import Niks from '@/components/activation/niks';
import Vijfendertig from '@/components/activation/vijfendertig';
import Contact from '@/components/activation/contact';

const sendAnswer = (value: string) => {
  controllerClient.send({
    type: 'answer',
    payload: value,
  });
}

const components: { [identifier: string]: ((props: ActivationProps) => ReactElement) | undefined } = {
  'vroeg': (props) => <Vroeg {...props} />,
  'niks': (props) => <Niks {...props} />,
  '35': (props) => <Vijfendertig {...props} />,
  'contact': (props) => <Contact {...props} />,
}

const requirements: { [identifier: string]: ((() => string) | undefined) } = {
  'one': () => "⚠️ Er moet iemand binnen dit gebied staan.",
  'two': () => "⚠️ Zorg ervoor dat je niet alleen in dit gebied staat.",
  'three': () => "⚠️ Er moeten op z&apos;n minst 3 personen binnen dit gebied staan.",
  'four': () => "⚠️ Het is nog niet druk genoeg. Er moeten minimaal 4 personen binnen dit gebied staan.",
  'five': () => "⚠️ In dit gebied moeten minstens 5 personen staan.",
  'all': () => "⚠️ Iedereen moeten binnen dit gebied staan.",
  'j&g': () => "⚠️ Jac. en Govie moeten allebei in dit gebied staan.",
}
const defaultRequirement = () => "⚠️ Specifieke vereisten nodig voor dit gebied."

export function Controller({ username }: { username: string, displayId: string }) {
  const state = useControllerStore();
  const move = (direction: string) => {
    controllerClient.send({ type: 'move', payload: direction });
  }

  // set title of tab
  if (document) {
    document.title = `${capitalize(username)} - GNO Dag 2025`;
  }

  const buttonClasses = 'w-16 h-16 border rounded-xl text-3xl active:bg-white active-hint transition-colors';
  return <div className="flex flex-col items-center gap-2 mt-16 px-4 max-w-md mx-auto">
    <h1 className="text-center font-bold text-2xl">Hallo, {capitalize(username)} 👋</h1>
    <p className='text-center'>Je kunt met de onderstaande pijltjes de <span className={'font-bold text-xl'}>{capitalize(username)[0]}</span> besturen op de GNO Dag 2025 pagina!</p>
    <div className="my-12 flex items-center flex-col">
      <button className={buttonClasses} onClick={() => move('up')}>⬆️</button>
      <div className="flex my-2">
        <button className={buttonClasses} onClick={() => move('left')}>⬅️</button>
        <div className='w-20 h-16'>{''}</div>
        <button className={buttonClasses} onClick={() => move('right')}>➡️</button>
      </div>
      <button className={buttonClasses} onClick={() => move('down')}>⬇️</button>
    </div>
    {state.activations.map(a => {
      const component = components[a.identifier];
      const requirement = requirements[a.requirement] ?? defaultRequirement;
      const props: ActivationProps = {
        who: a.who,
        isAnswered: a.isAnswered,
        sendAnswer,
        answers: a.answers,
      }
      return (
        <div key={a.identifier} className="mb-12 border border-zinc-800 rounded-lg bg-white shadow-md w-full overflow-hidden text-zinc-800">
          <div className="w-full p-3 border-b-1 border-zinc-800" style={{ backgroundColor: a.color.slice(0, -2) + "5)" || 'rgba(255, 0, 0, 0.1)' }}>
            <h2 className="font-mono font-bold text-sm text-center tracking-wide text-white mb-1">
              {a.isActive ? a.identifier[0].toUpperCase() + a.identifier.slice(1) : 'Onbekend'}<br/>
              (x: {a.xMin}{a.xMin !== a.xMax && `~${a.xMax}`}, y: {a.yMin}{a.yMin !== a.yMax && ` to ${a.yMax}`})
            </h2>
            <p className='font-mono text-sm text-center tracking-wide text-white opacity-70'>[Ontvangen op {new Date(a.when).toLocaleString()}]</p>
          </div>
          {
            component
              ? <div className="p-4 space-y-2 leading-relaxed">
                  {a.isActive ? component(props) : requirement()}
                </div>
              : <p className='bg-red-600 border border-red-400 text-xs font-mono font-bold text-white p-4 text-center'>
                Error! Controller component for {a.identifier} not found.
              </p>
          }

        </div>
      )
    })}
  </div>;
}
