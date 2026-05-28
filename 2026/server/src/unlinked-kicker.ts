import { Server } from '@krmx/server';

/**
 * Kicks users who are not linked to a connection for too long.
 *
 * @param server The server to enable the unlinked kicker on.
 * @param props Additional properties to configure the unlinked kicker.
 *              - inactivitySeconds - The number of seconds a user needs to be unlinked before it is kicked (default = 60).
 *              - includeJoins - Whether to include join events in the inactivity timeout (default = false).
 * @returns A function that disables the unlinked kicker.
 */
export function enableUnlinkedKicker(server: Server, props?: {
  inactivitySeconds?: number,
  includeJoins?: boolean,
  logger?: (message: string) => void,
}): () => void {
  const inactivitySeconds = props?.inactivitySeconds ?? 60;
  const includeJoins = props?.includeJoins ?? false;
  const logger = props?.logger ?? console.info;

  const inactivityTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  const startInactivityCountDown = (username: string) => {
    inactivityTimeouts.set(username, setTimeout(() => {
      logger(`kicking ${username} due to being offline for too long`);
      server.kick(username);
    }, inactivitySeconds * 1000));
  };
  const unlinkUnsub = server.on('unlink', startInactivityCountDown);

  let joinUnsub = () => { /*do nothing*/ };
  if (includeJoins) {
    joinUnsub = server.on('join', startInactivityCountDown);
  }

  const stopInactivityCountDown = (username: string) => {
    if (inactivityTimeouts.has(username)) {
      clearTimeout(inactivityTimeouts.get(username)!);
      inactivityTimeouts.delete(username);
    }
  };
  const linkUnsub = server.on('link', stopInactivityCountDown);
  const leaveUnsub = server.on('leave', stopInactivityCountDown);

  return () => {
    joinUnsub();
    linkUnsub();
    unlinkUnsub();
    leaveUnsub();
    for (const timeout of inactivityTimeouts.values()) {
      clearTimeout(timeout);
    }
  };
}
