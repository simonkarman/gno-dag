export interface Activation {
  identifier: string;
  when: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  color: string;
  requirement: string;
}

const three = { x: (offset: number) => 0 + offset, y: (offset: number) => 0 + offset };
const five = { x: (offset: number) => 8 + offset, y: (offset: number) => 6 + offset };
export const activations: Activation[] = [
  { identifier: 'vroeg', when: '2025-05-31T11:19:01', xMin: 5, xMax: 6, yMin: 1, yMax: 3, color: 'rgba(25, 172, 0, 0.3)', requirement: 'one' },
  { identifier: 'niks', when: '2025-06-01T17:48:02', xMin: 2, xMax: 3, yMin: 4, yMax: 4, color: 'rgba(173, 23, 236, 0.3)', requirement: 'two' },
  { identifier: '35', when: '2025-06-13T14:07:03', xMin: 13, xMax: 13, yMin: 9, yMax: 12, color: 'rgba(217, 141, 7, 0.3)', requirement: 'j&g' },
  { identifier: 'contact', when: '2025-06-22T08:54:04', xMin: 8, xMax: 9, yMin: 8, yMax: 9, color: 'rgba(65, 105, 225, 0.2)', requirement: 'one' },

  // Three
  // { identifier: 'a', when: '2025-06-29T00:00:00', xMin: three.x(0), xMax: three.x(1), yMin: three.y(1), yMax: three.y(1), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'b', when: '2025-06-29T00:00:00', xMin: three.x(1), xMax: three.x(5), yMin: three.y(0), yMax: three.y(0), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'c', when: '2025-06-29T00:00:00', xMin: three.x(5), xMax: three.x(6), yMin: three.y(1), yMax: three.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'd', when: '2025-06-29T00:00:00', xMin: three.x(2), xMax: three.x(5), yMin: three.y(4), yMax: three.y(4), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'e', when: '2025-06-29T00:00:00', xMin: three.x(5), xMax: three.x(6), yMin: three.y(5), yMax: three.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'f', when: '2025-06-29T00:00:00', xMin: three.x(1), xMax: three.x(5), yMin: three.y(8), yMax: three.y(8), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'g', when: '2025-06-29T00:00:00', xMin: three.x(0), xMax: three.x(1), yMin: three.y(7), yMax: three.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },

  // Five
  // { identifier: 'h', when: '2025-06-29T00:00:00', xMin: five.x(0), xMax: five.x(1), yMin: five.y(0), yMax: five.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'i', when: '2025-06-29T00:00:00', xMin: five.x(2), xMax: five.x(6), yMin: five.y(0), yMax: five.y(0), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'j', when: '2025-06-29T00:00:00', xMin: five.x(2), xMax: five.x(5), yMin: five.y(3), yMax: five.y(3), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'k', when: '2025-06-29T00:00:00', xMin: five.x(5), xMax: five.x(6), yMin: five.y(4), yMax: five.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'l', when: '2025-06-29T00:00:00', xMin: five.x(1), xMax: five.x(5), yMin: five.y(8), yMax: five.y(8), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
  // { identifier: 'm', when: '2025-06-29T00:00:00', xMin: five.x(0), xMax: five.x(1), yMin: five.y(7), yMax: five.y(7), color: 'rgba(0, 0, 0, 0.2)', requirement: 'one' },
];
