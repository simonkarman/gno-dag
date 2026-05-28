'use client';

import { Point } from '@/components/geo';

type PlayerName = 'Govie' | 'Jac.';

interface Props {
  positions: Record<PlayerName, Point | null>;
  self: PlayerName;
}

const PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#f59e0b',  // amber
  'Jac.': '#3b82f6',   // blue
};

const MAP_SIZE = 320; // px, square SVG viewBox

export function GameMap({ positions, self }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
      <svg
        width={MAP_SIZE}
        height={MAP_SIZE}
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        className="bg-zinc-900"
      >
        {/* ----------------------------------------------------------------
            TODO: Replace this placeholder rectangle with the real train
            network SVG (streets and stops around Jac. and Govie's house).
            Normalised coordinates: x and y are in [0, 1], multiply by
            MAP_SIZE to get pixel positions.
        ---------------------------------------------------------------- */}
        <rect
          x={8} y={8}
          width={MAP_SIZE - 16} height={MAP_SIZE - 16}
          rx={6}
          fill="none"
          stroke="#3f3f46"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <text
          x={MAP_SIZE / 2} y={MAP_SIZE / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#52525b"
          fontSize={13}
          fontFamily="monospace"
        >
          TODO: treinnetwerk kaart
        </text>

        {/* Player dots */}
        {(['Govie', 'Jac.'] as PlayerName[]).map((name) => {
          const pos = positions[name];
          if (!pos) return null;
          const cx = pos.x * MAP_SIZE;
          const cy = pos.y * MAP_SIZE;
          const color = PLAYER_COLORS[name];
          const isSelf = name === self;
          return (
            <g key={name}>
              {/* Outer ring for self */}
              {isSelf && (
                <circle cx={cx} cy={cy} r={16} fill={color} opacity={0.15} />
              )}
              <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.9} />
              <text
                x={cx} y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={9}
                fontWeight="bold"
                fontFamily="monospace"
              >
                {name[0]}
              </text>
              {/* Name label below the dot */}
              <text
                x={cx} y={cy + 18}
                textAnchor="middle"
                fill={color}
                fontSize={10}
                fontFamily="monospace"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
