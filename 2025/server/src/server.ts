import './json-logging';
import express from 'express';
import { setInterval } from 'node:timers';
import { createServer as createHttpServer } from 'http';
import { createServer } from '@krmx/server';
import { LogSeverity } from '@krmx/base';
import { enableUnlinkedKicker } from './unlinked-kicker';
import { Activation, activations } from './activations';

// get version from package.json
const version = require('../package.json').version;

const app = express();
const httpServer = createHttpServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.debug(`[debug] [http] [${req.path}] ${req.ip} ${req.method} ${req.path}`);
  next();
})
app.get('/', (_, res) => {
  res.send({ message: 'Hello GNO Dag 2025!', version });
});
const server = createServer({
  http: { server: httpServer, path: 'krmx', queryParams: { 'version': version } },
  logger: (_severity: LogSeverity, ...args: unknown[]) => {
    const severity = _severity === 'info' ? 'debug' : _severity;
    console[severity](`[${severity}] [server] [krmx]`, ...args);
  },
  isValidUsername(username: string) {
    return /^d\/[0-9]{12}$/.test(username) // Display: d/123456789012
      || ['c/Govie', 'c/Jac.', 'c/Simon', 'c/Lisa', 'c/Marjolein', 'c/Tim'].includes(username) // Controller: Govie, Jac., Simon, Lisa, Marjolein, Tim
  }
});

enableUnlinkedKicker(server, {
  inactivitySeconds: 120,
  logger: message => console.debug(`[info] [server] [unlinked-kicker] ${message}`),
});

const extract = (username: string) => {
  const isDisplay = username.startsWith('d/');
  return {
    type: isDisplay ? 'display' : 'controller',
    id: username.slice(2),
  }
};

interface Controller {
  x: number;
  y: number;
}

class World {
  private readonly controllers: Record<string, Controller> = {};

  constructor(
    public readonly worldSize: number,
    private readonly activations: Activation[],
  ) {
    // Sort activations by date
    this.activations.sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime());
  }

  getActivationState(): { next: string | undefined, visible: (Activation & { isActive: boolean, who: string[] })[] } {
    const validateActivation = (requirement: string, who: string[]) => {
      switch (requirement) {
        case 'one':
          return who.length >= 1;
        case 'two':
          return who.length >= 2;
        case 'three':
          return who.length >= 3;
        case 'four':
          return who.length >= 4;
        case 'five':
          return who.length >= 5;
        case 'all':
          return who.length >= 6;
        case 'j&g':
          return who.includes('Jac.') && who.includes('Govie');
        default:
          return true; // No requirement or unknown requirement
      }
    }

    const now = new Date();
    const next = this.activations.filter(activation => new Date(activation.when) >= now).shift()
    return {
      next: next?.when,
      visible: this.activations
        .filter(activation => /*process.env.NODE_ENV !== 'production' ||*/ new Date(activation.when) <= now)
        .map(activation => {
          const who = Object.entries(this.controllers).filter(([, controller]) => {
            return controller.x >= activation.xMin && controller.x <= activation.xMax &&
              controller.y >= activation.yMin && controller.y <= activation.yMax;
          }).map(([name]) => name);
          return {
            ...activation,
            isActive: validateActivation(activation.requirement, who),
            who,
          };
        }),
    };
  }

  updateActivations() {
    const activationState = this.getActivationState();
    this.broadcastToAllDisplays({
      type: 'activations',
      payload: activationState,
    });

    // Trigger a location update for each controller
    for (const controllerId in this.controllers) {
      this.moveController(controllerId, 'none');
    }
  }

  getControllers() {
    return structuredClone(this.controllers);
  }

  addController(controllerId: string) {
    const spawn = {
      x: this.worldSize - 3,
      y: 2,
    };
    const options = [
      // Try the center first
      { x: 0, y: 0 },
      // Try directly next to the center second
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
      // Try diagonally next to the center last
      { x: 1, y: -1 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: -1, y: -1 },
    ]
    const offset = options
      .filter(o => {
        const x = this.boundToWorldSize(spawn.x + o.x);
        const y = this.boundToWorldSize(spawn.y + o.y);
        return this.getControllerAt(x, y) === undefined;
      })
      .shift() ?? options[0];
    this.controllers[controllerId] = { x: spawn.x + offset.x, y: spawn.y + offset.y };
    this.forwardLocation(controllerId);
    this.logControllers();
  }

  deleteController(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      delete this.controllers[controllerId];
      this.broadcastToAllDisplays({
        type: 'delete',
        payload: controllerId,
      });
      this.logControllers();
    }
  }

  getControllerAt(x: number, y: number): string | undefined {
    return Object.entries(this.controllers).filter(([, controller]) => {
      return controller.x === x && controller.y === y;
    }).map(([name]) => name).shift();
  }

  getInsideActivations(controllerId: string): Activation[] {
    const controller = this.controllers[controllerId];
    if (!controller) {
      return [];
    }
    return this.getActivationState().visible.filter(activation => {
      return controller.x >= activation.xMin && controller.x <= activation.xMax &&
             controller.y >= activation.yMin && controller.y <= activation.yMax;
    });
  }

  private logControllers = () => {
    // Log the amount of controllers on the display
    const controllerNames = Object.keys(this.controllers);
    console.info(`[info] [gno-2025] [world] World has ${controllerNames.length} controller(s):`, controllerNames);
  }

  moveController(controllerId: string, direction: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      const previousInsideActivations = this.getInsideActivations(controllerId);
      let newX = controller.x;
      let newY = controller.y;
      switch (direction) {
        case 'up':
          newY = this.boundToWorldSize(newY - 1)
          break;
        case 'down':
          newY = this.boundToWorldSize(newY + 1);
          break;
        case 'left':
          newX = this.boundToWorldSize(newX - 1);
          break;
        case 'right':
          newX = this.boundToWorldSize(newX + 1);
          break;
      }
      if (direction !== 'none' && this.getControllerAt(newX, newY)) {
        return;
      }
      controller.x = newX;
      controller.y = newY;
      this.forwardLocation(controllerId);
      const insideActivations = this.getInsideActivations(controllerId);
      if (direction !== 'none') {
        // Get diff between previous and current inside activations
        const addDiff = insideActivations.filter(a => !previousInsideActivations.some(pa => pa.identifier === a.identifier));
        const removeDiff = previousInsideActivations.filter(pa => !insideActivations.some(a => a.identifier === pa.identifier));
        if (addDiff.length > 0) {
          console.info(`[info] [gno-2025] [controller] ${controllerId} entered activation(s): [${addDiff.map(a => a.identifier).join(', ')}]`);
        }
        if (removeDiff.length > 0) {
          console.info(`[info] [gno-2025] [controller] ${controllerId} left activation(s): [${removeDiff.map(a => a.identifier).join(', ')}]`);
        }
        if (addDiff.length > 0 || removeDiff.length > 0) {
          console.info(`[info] [gno-2025] [controller] ${controllerId} is now inside activation(s): [${insideActivations.map(a => a.identifier).join(', ')}]`);
        }
      }
      try {
        if (server.getUsers().filter(u => u.username === `c/${controllerId}` && u.isLinked).length !== 0) {
          server.send(`c/${controllerId}`, {
            type: 'activations',
            payload: insideActivations,
          });
        }
      } catch (e: unknown) {
        console.error(`[error] [gno-2025] [controller] Sending activation to controller c/${controllerId} failed:`, e);
      }
    }
  }

  boundToWorldSize(value: number): number {
    return Math.max(0, Math.min(value, this.worldSize - 1));
  }

  forwardLocation(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      this.broadcastToAllDisplays({
        type: 'location',
        payload: {
          controllerId,
          x: controller.x,
          y: controller.y,
        },
      });
    }
  }

  broadcastToAllDisplays(message: { type: string, payload: unknown }) {
    server.getUsers()
      .filter(u => u.username.startsWith('d/') && u.isLinked)
      .map(u => u.username)
      .forEach(displayId => {
        server.send(displayId, message);
      });
  }
}

const world = new World(15, activations);


server.on('join', (username) => {
  const { type, id } = extract(username);

  if (type === 'display') {
    console.info(`[info] [gno-2025] [display] display ${id} created`);
  } else {
    world.addController(id);
  }
});

server.on('link', (username) => {
  const { type, id } = extract(username);

  if (type === 'display') {
    console.info(`[info] [gno-2025] [display] display ${id} linked`);
    server.send(username, {
      type: 'init',
      payload: {
        worldSize: world.worldSize,
        controllers: world.getControllers(),
        activations: world.getActivationState(),
      },
    })
  } else {
    console.info(`[info] [gno-2025] [controller] controller ${id} linked`);
    const insideActivations = world.getInsideActivations(id);
    server.send(username, {
      type: 'activations',
      payload: insideActivations,
    });
  }
})

server.on('leave', (username) => {
  const { type, id } = extract(username);
  if (type === 'display') {
    console.info(`[info] [gno-2025] [display] display ${id} left`);
  } else {
    world.deleteController(id);
  }
});

server.on('message', (username, message) => {
  const { type, id } = extract(username);
  if (type === 'controller' && message.type === 'move' && typeof message.payload === 'string') {
    const direction = message.payload;
    console.debug(`[debug] [gno-2025] [controller] ${id} is trying to move ${direction}`);
    world.moveController(id, direction);
    world.updateActivations();
  } else {
    console.warn(`[warn] [gno-2025] ${username} sent unknown ${message.type} message`);
  }
});

setInterval(() => {
  world.updateActivations();
}, 1000 * 5); // Update activations every five seconds

server.listen(8082);
