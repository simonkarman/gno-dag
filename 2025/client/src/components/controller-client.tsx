import { useEffect, useState } from 'react';
import { createClient } from '@krmx/client-react';
import { Controller } from '@/components/controller';

export const { client: controllerClient, useClient: useControllerClient } = createClient();

const useLocalState = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    let storedValue: string | null | undefined;
    try {
      storedValue = localStorage?.getItem(key);
    } catch {
      storedValue = null;
    }
    return storedValue ? storedValue : initialValue;
  });

  return [value, (v: string) => {
    try {
      localStorage?.setItem(key, v);
    } catch {}
    setValue(v);
  }] as const;
}

export function ControllerClient({ serverUrl, displayId }: { serverUrl: string, displayId: string }) {
  const { status } = useControllerClient();
  const [username, setUsername] = useLocalState('username', '');
  const isValidUsername = ['Govie', 'Jac.', 'Simon', 'Lisa', 'Marjolein', 'Tim'].includes(username);
  const showError = !isValidUsername && username.length >= 2;
  const [clickedToLink, setClickedToLink] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'initializing') {
      controllerClient.connect(serverUrl)
        .catch((e: Error) => console.error('error connecting:', e.message));
    }
    if (status === 'connected' && clickedToLink) {
      controllerClient.disconnect()
        .catch((e: Error) => console.error('error disconnecting:', e.message));
    }
  }, [status, clickedToLink, serverUrl]);

  if (status === 'connected') {
    return <div className='flex flex-col items-center gap-2 mt-8'>
      <h1 className='font-bold text-2xl'>Hoi!</h1>
      <p>Je gaat nu verbinding maken met de GNO 2025 server.</p>
      <p>Wat is je naam?</p>
      <form action={() => {
        setClickedToLink(true);
        controllerClient.link('c/' + username)
          .catch((e: Error) => console.error('error linking:', e.message));
      }}>
        <input
          className={`bg-white border p-1 rounded-l ${showError ? 'border-red-500' : ''}`}
          type='text'
          placeholder='Vul hier jouw naam in'
          value={username}
          onChange={(e) => {
            const value = e.target.value;
            const capitalized = value.length > 1 ? value[0].toUpperCase() + value.slice(1).toLowerCase() : value;
            setUsername(capitalized);
          }}
        />
        <button
          className={`p-1 border bg-white rounded-r disabled:bg-zinc-200 disabled:text-zinc-400`}
          disabled={!isValidUsername} type='submit'
        >Start!</button>
      </form>
      {showError && <p className='text-red-500 text-sm max-w-1/3'>
        Gebruik je eigen naam.
      </p>}
    </div>
  }
  if (status === 'linked') {
    return <Controller username={username} displayId={displayId} />;
  }
  if (status === 'closed') {
    return <p className='p-2'>Display closed</p>;
  }
  return <p className='p-2'>Connecting to {displayId} as {username}...</p>;
}
