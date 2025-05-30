"use client";

import { useEffect, useState } from 'react';
import { createClient, createStore } from '@krmx/client-react';
import { randomDigits } from '@/utils/random-digits';
import { Display } from '@/components/display';

type DisplayStoreState = {
  worldSize: number;
  controllers: Record<string, undefined | { x: number, y: number }>;
}

export const { client: displayClient, useClient: useDisplayClient } = createClient();
export const useDisplayStore = createStore(
  displayClient,
  { worldSize: 1, controllers: {} } as DisplayStoreState,
  (state, action) => {
    switch (action.type) {
      case 'init':
        const initAction = action as { type: 'init', data: DisplayStoreState };
        return initAction.data
      case 'location':
        const locationAction = action as { type: 'location', data: { controllerId: string, x: number, y: number } };
        return {
          ...state,
          controllers: {
            ...state.controllers,
            [locationAction.data.controllerId]: {
              x: locationAction.data.x,
              y: locationAction.data.y,
            },
          }
        };
      case 'delete':
        const deleteAction = action as { type: 'delete', data: string };
        const newState = { ...state };
        delete newState.controllers[deleteAction.data];
        return newState;
      default:
        return state;
    }
  },
  (s) => s,
)
export interface DisplayInformation {
  id: string;
}

export function DisplayClient({ serverUrl }: { serverUrl: string }) {
  const { status } = useDisplayClient();
  const [displayInformation, setDisplayInformation] = useState<undefined | DisplayInformation>(undefined);

  useEffect(() => {
    if (status === 'initializing' || status === 'closed') {
      displayClient.connect(serverUrl)
        .catch((e: Error) => console.error('error connecting:', e.message));
    }
    if (status === 'connected') {
      const id = randomDigits(12);
      setDisplayInformation({ id });
      displayClient.link('d/' + id)
        .catch((e: Error) => console.error('error linking:', e.message));
    }
  }, [status, serverUrl]);

  if (status === 'linked') {
    return <Display displayInformation={displayInformation!} />
  }
  return <p className='p-2'>Wachten op verbinding...</p>;
}
