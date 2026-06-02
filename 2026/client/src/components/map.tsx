'use client';

import { Point, toPoint } from '@/components/geo';
import { ROADS } from '@/components/road-data';
import { ClientPuzzle, PuzzleState, secondaryLocations, derivePuzzleState } from '@/components/puzzles';

type PlayerName = 'Govie' | 'Jac.';

interface Props {
  positions: Record<PlayerName, Point | null>;
  self: PlayerName;
  puzzles?: ClientPuzzle[];
  scores?: Record<PlayerName, number>;
  /** Recent movement trail per player (oldest point first). */
  trails?: Record<PlayerName, Point[]>;
  /** Id of the puzzle the player is currently viewing — its secondary locations get shown. */
  activePuzzleId?: string | null;
}

const PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#f59e0b',  // amber
  'Jac.': '#3b82f6',   // blue
};

const PUZZLE_FILL = {
  locked: '#27272a',    // zinc-800 (dark)
  open: '#ffffff',      // white
  completed: '#22c55e', // green
} as const;

interface MarkerStyle {
  r: number;
  spike: boolean;
  fill: string;
  ringOpacity: number;
  showEmoji: boolean;
}

/**
 * Visual hierarchy for a puzzle marker, encoding how much it deserves the
 * viewer's attention via size + spike + ring opacity. `isOwn` = assigned to the
 * viewing player.
 */
function markerStyle(state: PuzzleState, isOwn: boolean): MarkerStyle {
  if (state === 'completed') {
    return { r: 3, spike: false, fill: PUZZLE_FILL.completed, ringOpacity: 0.3, showEmoji: false };
  }
  if (state === 'open') {
    return isOwn
      ? { r: 5.5, spike: true, fill: PUZZLE_FILL.open, ringOpacity: 1.0, showEmoji: true }
      : { r: 4, spike: true, fill: PUZZLE_FILL.open, ringOpacity: 0.6, showEmoji: true };
  }
  // locked
  return isOwn
    ? { r: 4, spike: true, fill: PUZZLE_FILL.locked, ringOpacity: 0.4, showEmoji: true }
    : { r: 3, spike: true, fill: PUZZLE_FILL.locked, ringOpacity: 0.25, showEmoji: false };
}

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

export function GameMap({ positions, self, puzzles = [], scores = { 'Govie': 0, 'Jac.': 0 }, trails = { 'Govie': [], 'Jac.': [] }, activePuzzleId = null }: Props) {
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

        {/* Movement trails — fade from oldest (transparent) to newest. */}
        {(['Govie', 'Jac.'] as PlayerName[]).map((name) => {
          const trail = trails[name];
          if (!trail || trail.length < 2) return null;
          const color = PLAYER_COLORS[name];
          return (
            <g key={`trail-${name}`}>
              {trail.slice(1).map((pt, i) => {
                const prev = trail[i];
                const opacity = ((i + 1) / trail.length) * 0.55;
                return (
                  <line
                    key={i}
                    x1={prev.x * MAP_W} y1={prev.y * MAP_H}
                    x2={pt.x * MAP_W} y2={pt.y * MAP_H}
                    stroke={color}
                    strokeOpacity={opacity}
                    strokeWidth={1}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Secondary locations — only shown for the puzzle currently being viewed. */}
        {secondaries
          .filter(sec => activePuzzleId != null && sec.puzzleId === activePuzzleId)
          .map((sec, i) => {
            const p = toPoint(sec.location);
            const cx = p.x * MAP_W;
            const cy = p.y * MAP_H;
            const r = 4;
            return (
              <g key={`sec-${i}`} transform={`translate(${cx} ${cy}) rotate(45)`}>
                <rect
                  x={-r} y={-r} width={r * 2} height={r * 2}
                  fill="#fbbf24"
                  stroke="#fbbf24"
                  strokeWidth={0.8}
                  opacity={0.95}
                />
              </g>
            );
          })}

        {/* Puzzle markers — pin shape, sized/colored by relevance to the viewer. */}
        {puzzles.map((puzzle) => {
          const p = toPoint(puzzle.location);
          const cx = p.x * MAP_W;
          const cy = p.y * MAP_H;
          const ring = PLAYER_COLORS[puzzle.assignedTo];
          const state = derivePuzzleState(puzzle, scores[puzzle.assignedTo]);
          const isOwn = puzzle.assignedTo === self;
          const m = markerStyle(state, isOwn);
          // Markers with a spike are proper map pins: the circle body floats
          // above the location and a triangle points down to it. Spike-less
          // markers (completed) are simply centered on the location.
          const bodyY = m.spike ? cy - m.r * 2.2 : cy;
          return (
            <g key={`puzzle-${puzzle.id}`}>
              {/* Spike — a triangle from just below the circle down to the location. */}
              {m.spike && (
                <path
                  d={`M ${cx - m.r * 0.5} ${bodyY + m.r * 0.6} L ${cx} ${cy} L ${cx + m.r * 0.5} ${bodyY + m.r * 0.6} Z`}
                  fill={ring}
                  fillOpacity={m.ringOpacity}
                  stroke={ring}
                  strokeOpacity={m.ringOpacity}
                  strokeWidth={1}
                  strokeLinejoin="round"
                />
              )}
              {/* Circle body */}
              <circle cx={cx} cy={bodyY} r={m.r} fill={m.fill} />
              <circle cx={cx} cy={bodyY} r={m.r} fill="none" stroke={ring} strokeOpacity={m.ringOpacity} strokeWidth={1.4} />
              {m.showEmoji && (
                <text
                  x={cx} y={bodyY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={m.r * 1.1}
                >
                  {puzzle.icon}
                </text>
              )}
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
