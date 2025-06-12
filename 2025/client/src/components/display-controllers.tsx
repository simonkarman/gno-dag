import { useDisplayClient } from '@/components/display-client';
import { capitalize } from '@/utils/capitalize';

export function DisplayControllers() {
  const { users } = useDisplayClient();
  const controllers = users.filter(u => u.username.startsWith('c/'));
  if (controllers.length === 0) {
    return <p>Er is hier op dit moment niemand.</p>;
  }
  return <>
    <div className='mt-6 flex flex-wrap gap-4 text-white'>
      {controllers.map((user) => <div
        className={`flex gap-4 px-2 py-0.5 border rounded ${user.isLinked ? 'bg-green-600 active-hint' : 'bg-red-600 border-red-800'}`}
        key={user.username}
      >
        <p className='font-bold text-white'>
          {capitalize(user.username.replace('c/', ''))}
          <span className='ml-1 text-sm align-middle'>{user.isLinked ? ' 🟢' : ' 🔴'}</span>
        </p>
      </div>)}
    </div>
  </>;
}
