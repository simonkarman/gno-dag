import './json-logging';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from '@krmx/server';
import { enableUnlinkedKicker} from './unlinked-kicker';
import { LogSeverity } from '@krmx/base/dist/src/log';

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

class World {
  private readonly controllers: Record<string, Controller> = {};

  constructor(
    public readonly worldSize: number,
  ) {}

  getControllers() {
    return structuredClone(this.controllers);
  }

  addController(controllerId: string) {
    this.controllers[controllerId] = {
      x: Math.floor(this.worldSize / 2),
      y: Math.floor(this.worldSize / 2),
    };
    this.forwardLocation(controllerId);
    this.logControllers();
  }

  deleteController(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      delete this.controllers[controllerId];
      this.broadcastToAllDisplays({
        type: 'delete',
        data: controllerId,
      });
      this.logControllers();
    }
  }

  private logControllers = () => {
    // Log the amount of controllers on the display
    const controllerNames = Object.keys(this.controllers);
    console.info(`[info] [gno-2025] World has ${controllerNames.length} controller(s):`, controllerNames);
  }

  moveController(controllerId: string, direction: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      switch (direction) {
        case 'up':
          controller.y -= 1;
          break;
        case 'down':
          controller.y += 1;
          break;
        case 'left':
          controller.x -= 1;
          break;
        case 'right':
          controller.x += 1;
          break;
      }
      this.clampControllerPosition(controllerId);
      this.forwardLocation(controllerId);
    }
  }

  clampControllerPosition(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      controller.x = Math.max(0, Math.min(controller.x, this.worldSize - 1));
      controller.y = Math.max(0, Math.min(controller.y, this.worldSize - 1));
    }
  }

  forwardLocation(controllerId: string) {
    const controller = this.controllers[controllerId];
    if (controller) {
      this.broadcastToAllDisplays({
        type: 'location',
        data: {
          controllerId,
          x: controller.x,
          y: controller.y,
        },
      });
    }
  }

  broadcastToAllDisplays(message: { type: string, data: unknown }) {
    server.getUsers()
      .filter(u => u.username.startsWith('d/') && u.isLinked)
      .map(u => u.username)
      .forEach(displayId => {
        server.send(displayId, message);
      });
  }
}

const world = new World(11);


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
      data: {
        worldSize: world.worldSize,
        controllers: world.getControllers(),
      },
    })
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
    console.debug(`[debug] [gno-2025] ${id} moved ${direction}`);
    world.moveController(id, direction);
  } else {
    console.warn(`[warn] [gno-2025] ${username} sent unknown ${message.type} message`);
  }
});

server.listen(8082);
