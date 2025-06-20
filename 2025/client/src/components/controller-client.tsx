import { useEffect, useState } from 'react';
import { createClient, createStore } from '@krmx/client-react';
import { Controller } from '@/components/controller';
import { Activation } from '@/components/activation';

export const { client: controllerClient, useClient: useControllerClient } = createClient();
export const useControllerStore = createStore(
  controllerClient,
  { activations: [] } as { activations: Activation[] },
  (state, action) => {
    switch (action.type) {
      case 'activations':
        const activationsAction = action as { type: 'activations', payload: Activation[] };
        return {
          ...state,
          activations: activationsAction.payload,
        }
      default:
        return state;
    }
  },
  (s) => s,
)

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
  const [failureReason, setFailureReason] = useState('');
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
    if (status === 'closed') {
      setFailureReason(fr => (fr && fr.length > 0) ? fr : 'De verbinding met de server is verbroken.\nOver 5 seconden proberen we het opnieuw.');
      // page refresh
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [status, clickedToLink, serverUrl]);

  if (status === 'connected') {
    return <div className='flex flex-col items-center text-center gap-2 mt-8'>
      <h1 className='font-bold text-2xl'>Hoi!</h1>
      <p>Je gaat nu verbinding maken met de GNO 2025 server.</p>
      <p>Wat is je naam?</p>
      <form action={() => {
        setClickedToLink(true);
        controllerClient.link('c/' + username)
          .catch((e: Error) => {
            console.error('error linking:', e.message)
            setFailureReason(e.message)
          });
      }}>
        <input
          className={`bg-white border border-zinc-700 text-zinc-700 p-1 rounded-l ${showError ? 'border-red-500' : ''} placeholder-zinc-400`}
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
          className={`p-1 border border-zinc-700 text-zinc-800 bg-white rounded-r disabled:bg-zinc-200 disabled:text-zinc-400 font-bold tracking-wide`}
          disabled={!isValidUsername} type='submit'
        >Start!</button>
      </form>
      {showError && <p className='text-red-500 font-bold tracking-wide text-sm max-w-1/3'>
        Gebruik je eigen naam.
      </p>}
    </div>
  }
  if (status === 'linked') {
    return <Controller username={username} displayId={displayId} />;
  }
  if (status === 'closed') {
    return <>
      <p className='p-4 text-center'>Oops, er ging iets mis. Ververs de pagina!</p>
      <pre className='text-center text-sm bg-red-700 border-y border-red-300 py-2 font-bold tracking-wide'>{failureReason}</pre>
    </>;
  }
  return <p className='p-4 text-center'>Connecting to {displayId} as {username}...</p>;
}
