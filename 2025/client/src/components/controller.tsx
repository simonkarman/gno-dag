'use client';

import { ReactElement } from 'react';
import { capitalize } from '@/utils/capitalize';
import { controllerClient, useControllerStore } from '@/components/controller-client';
import Vroeg from '@/components/activation/vroeg';
import Niks from '@/components/activation/niks';

const components: { [identifier: string]: (() => ReactElement) | undefined } = {
  'vroeg': () => <Vroeg />,
  'niks': () => <Niks />,
}

export function Controller({ username }: { username: string, displayId: string }) {
  const state = useControllerStore();
  const move = (direction: string) => {
    controllerClient.send({ type: 'move', payload: direction });
  }

  const buttonClasses = 'w-16 h-16 border rounded-xl hover:border-zinc-400 border-zinc-300 text-3xl bg-white active:bg-zinc-100';
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
      return (
        <div key={a.identifier} className="border rounded-lg bg-white shadow-md w-full overflow-hidden">
          <div className="w-full p-1 border-b-2" style={{ backgroundColor: a.color.replace('0.1)', '0.2)') || 'rgba(255, 0, 0, 0.1)' }}>
            <h2 className="font-bold text-sm text-center opacity-50">
              {a.identifier[0].toUpperCase() + a.identifier.slice(1)} | x:{a.xMin}-{a.xMax} | y:{a.yMin}-{a.yMax}
            </h2>
          </div>
          {
            component
              ? <div className="p-2 space-y-2">{component()}</div>
              : <p className='bg-red-100 py-4 text-center'>
                Error! Component for {a.identifier} not found.
              </p>
          }

        </div>
      )
    })}
  </div>;
}
