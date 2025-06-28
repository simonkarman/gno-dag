export interface Activation {
  identifier: string;
  when: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  color: string;
  requirement: string;
  secret?: string;
}

const drawNumbers = false;
const three = { x: (offset: number) => 0 + offset, y: (offset: number) => 0 + offset };
const five = { x: (offset: number) => 8 + offset, y: (offset: number) => 6 + offset };
export const activations: Activation[] = [
  // Voorbereiding
  { identifier: 'vroeg', when: '2025-05-31T11:19:01', xMin: 5, xMax: 6, yMin: 1, yMax: 3, color: 'rgba(25, 172, 0, 0.3)', requirement: 'one' },
  { identifier: 'niks', when: '2025-06-01T17:48:02', xMin: 2, xMax: 3, yMin: 4, yMax: 4, color: 'rgba(173, 23, 236, 0.3)', requirement: 'two' },
  { identifier: '35', when: '2025-06-13T14:07:03', xMin: 13, xMax: 13, yMin: 9, yMax: 12, color: 'rgba(217, 141, 7, 0.3)', requirement: 'j&g' },
  { identifier: 'contact', when: '2025-06-22T08:54:04', xMin: 8, xMax: 9, yMin: 8, yMax: 9, color: 'rgba(65, 105, 225, 0.2)', requirement: 'one', secret: 'gezelligheid' },

  // Ontbijt
  { identifier: 'ontbijt', when: '2025-06-29T08:59:59', xMin: 1, xMax: 2, yMin: 8, yMax: 8, color: 'rgb(186, 43, 112, 0.2)', requirement: 'one' },
  { identifier: 'terug-in-de-tijd', when: '2025-06-29T09:32:00', xMin: 1, xMax: 5, yMin: 0, yMax: 0, color: 'rgb(155, 48, 188, 0.2)', requirement: 'three', secret: '19e' },

  // Activiteit 1 - Cyanotype
  { identifier: 'cyanotype', when: '2025-06-29T10:00:00', xMin: 8, xMax: 9, yMin: 6, yMax: 7, color: 'rgb(217, 99, 46, 0.2)', requirement: 'j&g' },
  { identifier: 'tikken', when: '2025-06-29T11:11:11', xMin: 14, xMax: 14, yMin: 10, yMax: 12, color: 'rgb(217, 99, 46, 0.2)', requirement: 'two' },

  // Lunch
  { identifier: 'lunch', when: '2025-06-29T11:45:00', xMin: 0, xMax: 1, yMin: 7, yMax: 7, color: 'rgba(145, 145, 0, 0.2)', requirement: 'one' },
  { identifier: 'getik', when: '2025-06-29T12:47:27', xMin: 5, xMax: 6, yMin: 5, yMax: 7, color: 'rgba(145, 145, 0, 0.2)', requirement: 'all', secret: 'B.O.M.' },

  // // Activiteit 2 - Keep Talking and Nobody Explodes
  { identifier: 'ontmantelen', when: '2025-06-29T13:04:07', xMin: 10, xMax: 12, yMin: 9, yMax: 9, color: 'rgba(25, 172, 0, 0.2)', requirement: 'one' },
  { identifier: 'analyse', when: '2025-06-29T13:45:00', xMin: 8, xMax: 9, yMin: 13, yMax: 13, color: 'rgba(25, 172, 0, 0.2)', requirement: 'two', secret: 'Bewaarde Opgeslagen Momenten' },

  // Rusten

  // Taart
  { identifier: 'gelukkig', when: '2025-06-29T14:45:00', xMin: 10, xMax: 14, yMin: 6, yMax: 6, color: 'rgba(255, 0, 255, 0.2)', requirement: 'one', secret: 'taart' },

  // Activiteit 3 - Tijdcapsule
  { identifier: 'capsule', when: '2025-06-29T15:00:00', xMin: 3, xMax: 5, yMin: 8, yMax: 8, color: 'rgb(209, 50, 26, 0.2)', requirement: 'three', secret: 'tegoedbon' },
  { identifier: 'voorwaarts', when: '2025-06-29T15:57:00', xMin: 0, xMax: 1, yMin: 1, yMax: 1, color: 'rgb(209, 50, 26, 0.2)', requirement: 'one' },

  // Activiteit 4 - Pasta Maken
  { identifier: 'recepten', when: '2025-06-29T16:03:34', xMin: 13, xMax: 14, yMin: 13, yMax: 13, color: 'rgb(217, 99, 46, 0.2)', requirement: 'one' },
  { identifier: 'feest', when: '2025-06-29T17:52:15', xMin: 9, xMax: 13, yMin: 14, yMax: 14, color: 'rgba(0, 155, 255, 0.2)', requirement: 'j&g' },
  { identifier: 'cu2030', when: '2025-06-29T19:13:50', xMin: 4, xMax: 5, yMin: 4, yMax: 4, color: 'rgba(0, 155, 255, 0.2)', requirement: 'one', secret: '35' },

  // Three
  ...(drawNumbers ? [
    { identifier: 'a', when: '2025-06-29T00:00:00', xMin: three.x(0), xMax: three.x(1), yMin: three.y(1), yMax: three.y(1), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'b', when: '2025-06-29T00:00:00', xMin: three.x(1), xMax: three.x(5), yMin: three.y(0), yMax: three.y(0), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'c', when: '2025-06-29T00:00:00', xMin: three.x(5), xMax: three.x(6), yMin: three.y(1), yMax: three.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'd', when: '2025-06-29T00:00:00', xMin: three.x(2), xMax: three.x(5), yMin: three.y(4), yMax: three.y(4), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'e', when: '2025-06-29T00:00:00', xMin: three.x(5), xMax: three.x(6), yMin: three.y(5), yMax: three.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'f', when: '2025-06-29T00:00:00', xMin: three.x(1), xMax: three.x(5), yMin: three.y(8), yMax: three.y(8), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'g', when: '2025-06-29T00:00:00', xMin: three.x(0), xMax: three.x(1), yMin: three.y(7), yMax: three.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  ] : []),

  // Five
  ...(drawNumbers ? [
    { identifier: 'h', when: '2025-06-29T00:00:00', xMin: five.x(0), xMax: five.x(1), yMin: five.y(0), yMax: five.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'i', when: '2025-06-29T00:00:00', xMin: five.x(2), xMax: five.x(6), yMin: five.y(0), yMax: five.y(0), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'j', when: '2025-06-29T00:00:00', xMin: five.x(2), xMax: five.x(5), yMin: five.y(3), yMax: five.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'k', when: '2025-06-29T00:00:00', xMin: five.x(5), xMax: five.x(6), yMin: five.y(4), yMax: five.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'l', when: '2025-06-29T00:00:00', xMin: five.x(1), xMax: five.x(5), yMin: five.y(8), yMax: five.y(8), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
    { identifier: 'm', when: '2025-06-29T00:00:00', xMin: five.x(0), xMax: five.x(1), yMin: five.y(7), yMax: five.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  ] : []),
];
console.info(`[info] [gno-2025] [world] Loaded ${activations.length} activations`);
