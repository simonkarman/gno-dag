import './json-logging';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from '@krmx/server';
import { enableUnlinkedKicker} from './unlinked-kicker';
import { LogSeverity } from '@krmx/base/dist/src/log';
import { setInterval } from 'node:timers';

// get version from package.json
const version = require('../package.json').version;

const app = express();
const httpServer = createHttpServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.debug(`[debug] [http] ${req.ip} ${req.method} ${req.path}`);
  next();
})
app.get('/', (_, res) => {
  res.send({ message: 'Hello GNO Dag 2025!', version });
});
const server = createServer({
  http: { server: httpServer, path: 'krmx', queryParams: { 'version': version } },
  logger: (_severity: LogSeverity, ...args: unknown[]) => {
    const severity = _severity === 'info' ? 'debug' : _severity;
    console[severity](`[${severity}] [server]`, ...args);
  },
  isValidUsername(username: string) {
    return /^d\/[0-9]{12}$/.test(username) // Display: d/123456789012
      || ['c/Govie', 'c/Jac.', 'c/Simon', 'c/Lisa', 'c/Marjolein', 'c/Tim'].includes(username) // Controller: Govie, Jac., Simon, Lisa, Marjolein, Tim
  }
});
enableUnlinkedKicker(server, {
  inactivitySeconds: 7,
  logger: message => console.info(`[info] [unlinked-kicker] ${message}`),
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

interface Activation {
  identifier: string;
  when: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  color: string;
}

class World {
  private readonly controllers: Record<string, Controller> = {};

  constructor(
    public readonly worldSize: number,
    private readonly activations: Activation[],
  ) {}

  getActiveActivations() {
    const now = new Date();
    return this.activations.filter(activation => {
      const activationDate = new Date(activation.when);
      return activationDate <= now;
    });
  }

  updateActivations() {
    const activeActivations = this.getActiveActivations();
    this.broadcastToAllDisplays({
      type: 'activations',
      payload: activeActivations,
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
    const center = {
      x: Math.floor(this.worldSize / 2),
      y: Math.floor(this.worldSize / 2),
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
        const x = this.boundToWorldSize(center.x + o.x);
        const y = this.boundToWorldSize(center.y + o.y);
        return this.getControllerAt(x, y) === undefined;
      })
      .shift() ?? options[0];
    this.controllers[controllerId] = { x: center.x + offset.x, y: center.y + offset.y };
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

  getInsideActivations(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (!controller) {
      return [];
    }
    return this.getActiveActivations().filter(activation => {
      return controller.x >= activation.xMin && controller.x <= activation.xMax &&
             controller.y >= activation.yMin && controller.y <= activation.yMax;
    });
  }

  private logControllers = () => {
    // Log the amount of controllers on the display
    const controllerNames = Object.keys(this.controllers);
    console.info(`[info] [gno-2025] World has ${controllerNames.length} controller(s):`, controllerNames);
  }

  moveController(controllerId: string, direction: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
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
      if (this.getControllerAt(newX, newY)) {
        return;
      }
      controller.x = newX;
      controller.y = newY;
      this.forwardLocation(controllerId);
      const insideActivations = this.getInsideActivations(controllerId);
      if (insideActivations.length > 0) {
        console.info(`[info] [gno-2025] ${controllerId} is now inside of activation(s): ${insideActivations.map(a => a.identifier).join(', ')}`);
      }
      try {
        server.send(`c/${controllerId}`, {
          type: 'activations',
          payload: insideActivations,
        });
      } catch (e: unknown) {
        console.error(`Sending activation to controller c/${controllerId} failed:`, e);
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

const world = new World(13, [
  { identifier: 'vroeg', when: '2025-01-01T00:00:00Z', xMin: 8, xMax: 10, yMin: 1, yMax: 3, color: 'rgba(25, 172, 0, 0.1)' },
  { identifier: 'niks', when: '2025-05-01T00:00:00Z', xMin: 1, xMax: 2, yMin: 6, yMax: 6, color: 'rgba(173, 23, 236, 0.1)' },
]);


server.on('join', (username) => {
  const { type, id } = extract(username);

  if (type === 'display') {
    console.info(`[info] [gno-2025] display ${id} created`);
  } else {
    world.addController(id);
  }
});

server.on('link', (username) => {
  const { type, id } = extract(username);

  if (type === 'display') {
    console.info(`[info] [gno-2025] display ${id} linked`);
    server.send(username, {
      type: 'init',
      payload: {
        worldSize: world.worldSize,
        controllers: world.getControllers(),
        activations: world.getActiveActivations(),
      },
    })
  } else {
    console.info(`[info] [gno-2025] controller ${id} linked`);
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
    console.info(`[info] [gno-2025] display ${id} left`);
  } else {
    world.deleteController(id);
  }
});

server.on('message', (username, message) => {
  const { type, id } = extract(username);
  if (type === 'controller' && message.type === 'move' && typeof message.payload === 'string') {
    const direction = message.payload;
    console.debug(`[debug] [gno-2025] ${id} is trying to move ${direction}`);
    world.moveController(id, direction);
  } else {
    console.warn(`[warn] [gno-2025] ${username} sent unknown ${message.type} message`);
  }
});

setInterval(() => {
  world.updateActivations();
}, 1000 * 5); // Update activations every five seconds

server.listen(8082);
