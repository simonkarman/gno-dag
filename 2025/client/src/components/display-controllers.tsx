import { useDisplayClient } from '@/components/display-client';
import { capitalize } from '@/utils/capitalize';

export function DisplayControllers() {
  const { users } = useDisplayClient();
  const controllers = users.filter(u => u.username.startsWith('c/'));
  if (controllers.length === 0) {
    return <p>Er is hier op dit moment niemand</p>;
  }
  return <>
    <div className='my-4 flex flex-wrap gap-2'>
      {controllers.map((user) => <div
        className={`flex gap-2 px-2 py-0.5 border rounded ${user.isLinked ? 'bg-green-600' : 'bg-red-600 opacity-75'}`}
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
