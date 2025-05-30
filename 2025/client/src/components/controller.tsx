import { capitalize } from '@/utils/capitalize';
import { controllerClient } from '@/components/controller-client';

export function Controller({ username }: { username: string, displayId: string }) {
  const move = (direction: string) => {
    controllerClient.send({ type: 'move', payload: direction });
  }

  const buttonClasses = 'w-16 h-16 border rounded-xl hover:border-zinc-400 border-zinc-300 text-3xl bg-white active:bg-zinc-100';
  return <div className="flex flex-col items-center gap-2 mt-16">
    <h1 className="font-bold text-2xl">Hallo, {capitalize(username)} 👋</h1>
    <p>Jij kunt <span className={'font-bold text-xl'}>{capitalize(username)[0]}</span> besturen op de GNO Dag 2025 pagina!</p>
    <div className="mt-8 flex items-center flex-col">
      <button className={buttonClasses} onClick={() => move('up')}>⬆️</button>
      <div className="flex my-2">
        <button className={buttonClasses} onClick={() => move('left')}>⬅️</button>
        <div className='w-20 h-16'>{''}</div>
        <button className={buttonClasses} onClick={() => move('right')}>➡️</button>
      </div>
      <button className={buttonClasses} onClick={() => move('down')}>⬇️</button>
    </div>
  </div>;
}
