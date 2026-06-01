'use client';

import { Point, toPoint } from '@/components/geo';
import { ROADS } from '@/components/road-data';
import { ClientPuzzle, PUZZLE_STATE_COLORS, secondaryLocations, derivePuzzleState } from '@/components/puzzles';

type PlayerName = 'Govie' | 'Jac.';

interface Props {
  positions: Record<PlayerName, Point | null>;
  self: PlayerName;
  puzzles?: ClientPuzzle[];
  scores?: Record<PlayerName, number>;
  /** Id of the puzzle the player is currently viewing — its secondary locations get highlighted. */
  activePuzzleId?: string | null;
}

const PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#f59e0b',  // amber
  'Jac.': '#3b82f6',   // blue
};

const ROAD_STYLES: Record<string, { stroke: string; width: number; opacity: number }> = {
  tertiary:    { stroke: '#a1a1aa', width: 2.5, opacity: 0.9 },
  residential: { stroke: '#71717a', width: 1.8, opacity: 0.85 },
  service:     { stroke: '#52525b', width: 1.2, opacity: 0.7 },
  cycleway:    { stroke: '#22c55e', width: 1.0, opacity: 0.65 },
  footway:     { stroke: '#3f3f46', width: 0.8, opacity: 0.6 },
  pedestrian:  { stroke: '#3f3f46', width: 1.2, opacity: 0.65 },
  unclassified:{ stroke: '#71717a', width: 1.5, opacity: 0.75 },
};
const DEFAULT_ROAD_STYLE = { stroke: '#3f3f46', width: 0.8, opacity: 0.5 };

// Real-world aspect ratio of the game bounding box.
// lng_span * cos(lat_mid) / lat_span ≈ 1.817 → width is ~1.8× the height.
const MAP_W = 320;
const MAP_H = 176; // ≈ MAP_W / 1.817

// Inset the viewBox slightly to hide messy road edges near the bounding-box border.
const INSET = 0.05; // 5% on every side
const VB_X = MAP_W * INSET;
const VB_Y = MAP_H * INSET;
const VB_W = MAP_W * (1 - 2 * INSET);
const VB_H = MAP_H * (1 - 2 * INSET);

export function GameMap({ positions, self, puzzles = [], scores = { 'Govie': 0, 'Jac.': 0 }, activePuzzleId = null }: Props) {
  const secondaries = secondaryLocations(puzzles);
  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="fixed inset-0 w-full h-full z-0 bg-zinc-900"
    >
        {/* Roads from OpenStreetMap (pre-baked in road-data.ts) */}
        {ROADS.map((road, i) => {
          const style = ROAD_STYLES[road.type] ?? DEFAULT_ROAD_STYLE;
          const pts = road.points.map(p => `${p.x * MAP_W},${p.y * MAP_H}`).join(' ');
          return (
            <polyline
              key={i}
              points={pts}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeOpacity={style.opacity}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Secondary locations (from other-player-at-location requirements) — diamonds */}
        {secondaries.map((sec, i) => {
          const p = toPoint(sec.location);
          const cx = p.x * MAP_W;
          const cy = p.y * MAP_H;
          const highlighted = activePuzzleId != null && sec.puzzleId === activePuzzleId;
          const r = highlighted ? 4 : 3;
          return (
            <g key={`sec-${i}`} transform={`translate(${cx} ${cy}) rotate(45)`}>
              <rect
                x={-r} y={-r} width={r * 2} height={r * 2}
                fill={highlighted ? '#fbbf24' : 'none'}
                stroke={highlighted ? '#fbbf24' : '#a1a1aa'}
                strokeWidth={0.8}
                opacity={highlighted ? 0.95 : 0.7}
              />
            </g>
          );
        })}

        {/* Puzzle markers */}
        {puzzles.map((puzzle) => {
          const p = toPoint(puzzle.location);
          const cx = p.x * MAP_W;
          const cy = p.y * MAP_H;
          const color = PUZZLE_STATE_COLORS[derivePuzzleState(puzzle, scores[puzzle.assignedTo])];
          return (
            <g key={`puzzle-${puzzle.id}`}>
              <circle cx={cx} cy={cy} r={4.5} fill={color} opacity={0.9} />
              <circle cx={cx} cy={cy} r={4.5} fill="none" stroke="#18181b" strokeWidth={0.6} />
              <text
                x={cx} y={cy + 1.4}
                textAnchor="middle"
                fontSize={4}
              >
                {puzzle.icon}
              </text>
            </g>
          );
        })}

        {/* Player dots */}
        {(['Govie', 'Jac.'] as PlayerName[]).map((name) => {
          const pos = positions[name];
          if (!pos) return null;
          const cx = pos.x * MAP_W;
          const cy = pos.y * MAP_H;
          const color = PLAYER_COLORS[name];
          const isSelf = name === self;
          return (
            <g key={name}>
              {/* Outer ring for self */}
              {isSelf && (
                <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.25} />
              )}
              <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.9} />
              {/* Name label below the dot */}
              <text
                x={cx} y={cy + 6}
                textAnchor="middle"
                fill={color}
                fontSize={3.5}
                fontFamily="monospace"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
  );
}
