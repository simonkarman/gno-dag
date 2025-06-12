'use client';

import { useEffect, useState } from 'react';
import { createClient, createStore } from '@krmx/client-react';
import { randomDigits } from '@/utils/random-digits';
import { Display } from '@/components/display';
import { Activation } from '@/components/activation';

type DisplayStoreState = {
  worldSize: number;
  controllers: Record<string, undefined | { x: number, y: number }>;
  activations: Activation[];
}

export const { client: displayClient, useClient: useDisplayClient } = createClient();
export const useDisplayStore = createStore(
  displayClient,
  { worldSize: 1, controllers: {}, activations: [] } satisfies DisplayStoreState as DisplayStoreState,
  (state, action) => {
    switch (action.type) {
      case 'init':
        const initAction = action as { type: 'init', payload: DisplayStoreState };
        return initAction.payload
      case 'location':
        const locationAction = action as { type: 'location', payload: { controllerId: string, x: number, y: number } };
        return {
          ...state,
          controllers: {
            ...state.controllers,
            [locationAction.payload.controllerId]: {
              x: locationAction.payload.x,
              y: locationAction.payload.y,
            },
          }
        };
      case 'delete':
        const deleteAction = action as { type: 'delete', payload: string };
        const newState = { ...state };
        delete newState.controllers[deleteAction.payload];
        return newState;
      case 'activations':
        const activationsAction = action as { type: 'activations', payload: Activation[] };
        return {
          ...state,
          activations: activationsAction.payload,
        };
      default:
        return state;
    }
  },
  (s) => s,
)
export interface DisplayInformation {
  id: string;
}

let lastId: undefined | string = undefined;
export function DisplayClient({ serverUrl }: { serverUrl: string }) {
  const { status } = useDisplayClient();
  const [displayInformation, setDisplayInformation] = useState<undefined | DisplayInformation>(undefined);

  useEffect(() => {
    const id = randomDigits(12);
    lastId = id;
    setTimeout(() => {
      if (lastId !== id) {
        return;
      }

      if (status === 'initializing' || status === 'closed') {
        displayClient.connect(serverUrl)
          .catch((e: Error) => console.error('error connecting:', e.message));
      }
      if (status === 'connected') {
        setDisplayInformation({ id });
        displayClient.link('d/' + id)
          .catch((e: Error) => console.error('error linking:', e.message));
      }
    }, 250);

    return () => {
      if (status === 'linked' && lastId === id) {
        displayClient.disconnect(true)
          .catch((e: Error) => console.error('error disconnecting:', e.message));
      }
    }
  }, [status, serverUrl]);

  if (status === 'linked') {
    return <Display displayInformation={displayInformation!} />
  }
  return <p className='p-2'>Wachten op verbinding...</p>;
}
