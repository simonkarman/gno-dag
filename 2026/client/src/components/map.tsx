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
  /** Ids of puzzles whose secondary locations should be shown (owner present at an open puzzle). */
  activePuzzleIds?: string[];
}

const PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#f59e0b',  // amber
  'Jac.': '#3b82f6',   // blue
};

// Toned-down team colors used for locked puzzles ("yours/theirs, but not yet").
const MUTED_PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#8a6a33',  // muted amber
  'Jac.': '#3f5273',   // muted blue
};

const PUZZLE_FILL = {
  lockedOwn: '#27272a', // zinc-800 (dark body for your locked pin)
  open: '#ffffff',      // white
  completed: '#22c55e', // green
} as const;

/**
 * A puzzle marker is drawn either as a `pin` (a spiked map pin floating above
 * the location — used for the viewer's OWN puzzles) or a `dot` (a small circle
 * centered on the location — used for the other team and for completed puzzles,
 * so they stay unobtrusive).
 */
interface MarkerStyle {
  form: 'pin' | 'dot';
  r: number;
  /** Body fill color. */
  fill: string;
  /** Body fill opacity (used to fade faint dots). */
  fillOpacity: number;
  /** Accent color: the pin's spike/ring, or a dot's outline. */
  accent: string;
  /** Accent opacity; 0 means a dot has no outline. */
  accentOpacity: number;
  showEmoji: boolean;
}

/**
 * Visual encoding for a puzzle marker. Pins = your puzzles, dots = ambient info
 * (other team + anything completed). Bright team color = open, muted team color
 * = locked, green = completed. `team`/`muted` are the assigned player's colors.
 */
function markerStyle(state: PuzzleState, isOwn: boolean, team: string, muted: string): MarkerStyle {
  if (state === 'completed') {
    return { form: 'dot', r: 2.5, fill: PUZZLE_FILL.completed, fillOpacity: 0.9, accent: PUZZLE_FILL.completed, accentOpacity: 0, showEmoji: false };
  }
  if (state === 'open') {
    return isOwn
      ? { form: 'pin', r: 5.5, fill: PUZZLE_FILL.open, fillOpacity: 1, accent: team, accentOpacity: 1.0, showEmoji: true }
      // Other team's open puzzle: a bright team-colored dot with a thin light
      // outline to set it apart from a live player dot.
      : { form: 'dot', r: 3.5, fill: team, fillOpacity: 0.95, accent: '#ffffff', accentOpacity: 0.7, showEmoji: false };
  }
  // locked
  return isOwn
    ? { form: 'pin', r: 4.5, fill: PUZZLE_FILL.lockedOwn, fillOpacity: 1, accent: muted, accentOpacity: 0.9, showEmoji: false }
    : { form: 'dot', r: 2.5, fill: muted, fillOpacity: 0.55, accent: muted, accentOpacity: 0, showEmoji: false };
}

const ROAD_STYLES: Record<string, { stroke: string; width: number; opacity: number }> = {
  tertiary:    { stroke: '#a1a1aa', width: 2.5, opacity: 0.9 },
  residential: { stroke: '#71717a', width: 1.8, opacity: 0.85 },
  service:     { stroke: '#52525b', width: 1.2, opacity: 0.7 },
  cycleway:    { stroke: '#52525b', width: 1.0, opacity: 0.65 },
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

// Tweakable fade parameters (change these to adjust the vignette boundaries)
const FADE_INWARD = 5;
const FADE_OUTWARD = 35;

// Corner vignette parameters (shades and rounds the screen corners)
const VIGNETTE_START = 80;     // Percentage radius where corner shading begins
const VIGNETTE_OPACITY = 0.8;  // Maximum opacity of the corner shading

const PLAY_CENTER_X = MAP_W / 2; // 160
const PLAY_CENTER_Y = MAP_H / 2; // 88

// Programmatic Inner/Outer boundaries
const INNER_X = VB_X + FADE_INWARD;
const INNER_Y = VB_Y + FADE_INWARD;

const OUTER_X = VB_X - FADE_OUTWARD;
const OUTER_Y = VB_Y - FADE_OUTWARD;

const INNER_XR = VB_X + VB_W - FADE_INWARD;
const INNER_YB = VB_Y + VB_H - FADE_INWARD;

const OUTER_XR = VB_X + VB_W + FADE_OUTWARD;
const OUTER_YB = VB_Y + VB_H + FADE_OUTWARD;

// Mask viewport limits (500% area coverage)
const MASK_MIN_X = VB_X - 5 * VB_W;
const MASK_MAX_X = VB_X + 6 * VB_W;
const MASK_MIN_Y = VB_Y - 5 * VB_H;
const MASK_MAX_Y = VB_Y + 6 * VB_H;

// Radial Vignette Gradient computations
const GRAD_R = VB_W / 2 + FADE_OUTWARD; // 244
const GRAD_SCALE_Y = (VB_H / 2 + FADE_OUTWARD) / GRAD_R; // ~0.7344

export function GameMap({ positions, self, puzzles = [], scores = { 'Govie': 0, 'Jac.': 0 }, trails = { 'Govie': [], 'Jac.': [] }, activePuzzleIds = [] }: Props) {
  const secondaries = secondaryLocations(puzzles);
  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="fixed inset-0 w-full h-full z-0 bg-zinc-900 overflow-visible"
    >
      <defs>
        {/* Linear gradients for rectangular fade */}
        <linearGradient id="fade-left" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="fade-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="fade-top" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="fade-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>

        {/* Radial vignette gradient for corner shading */}
        <radialGradient
          id="vignette-fade"
          cx={PLAY_CENTER_X}
          cy={PLAY_CENTER_Y}
          r={GRAD_R}
          gradientTransform={`translate(${PLAY_CENTER_X}, ${PLAY_CENTER_Y}) scale(1, ${GRAD_SCALE_Y}) translate(-${PLAY_CENTER_X}, -${PLAY_CENTER_Y})`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#18181b" stopOpacity={0} />
          <stop offset={`${VIGNETTE_START}%`} stopColor="#18181b" stopOpacity={0} />
          <stop offset="100%" stopColor="#18181b" stopOpacity={VIGNETTE_OPACITY} />
        </radialGradient>
      </defs>

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

        {/* Solid cover masks (outermost 500% borders) */}
        <rect x={MASK_MIN_X} y={MASK_MIN_Y} width={OUTER_X - MASK_MIN_X} height={MASK_MAX_Y - MASK_MIN_Y} fill="#18181b" pointerEvents="none" />
        <rect x={OUTER_XR} y={MASK_MIN_Y} width={MASK_MAX_X - OUTER_XR} height={MASK_MAX_Y - MASK_MIN_Y} fill="#18181b" pointerEvents="none" />
        <rect x={MASK_MIN_X} y={MASK_MIN_Y} width={MASK_MAX_X - MASK_MIN_X} height={OUTER_Y - MASK_MIN_Y} fill="#18181b" pointerEvents="none" />
        <rect x={MASK_MIN_X} y={OUTER_YB} width={MASK_MAX_X - MASK_MIN_X} height={MASK_MAX_Y - OUTER_YB} fill="#18181b" pointerEvents="none" />

        {/* Linear fade-out vignettes */}
        <rect x={OUTER_X} y={OUTER_Y} width={INNER_X - OUTER_X} height={OUTER_YB - OUTER_Y} fill="url(#fade-left)" pointerEvents="none" />
        <rect x={INNER_XR} y={OUTER_Y} width={OUTER_XR - INNER_XR} height={OUTER_YB - OUTER_Y} fill="url(#fade-right)" pointerEvents="none" />
        <rect x={OUTER_X} y={OUTER_Y} width={OUTER_XR - OUTER_X} height={INNER_Y - OUTER_Y} fill="url(#fade-top)" pointerEvents="none" />
        <rect x={OUTER_X} y={INNER_YB} width={OUTER_XR - OUTER_X} height={OUTER_YB - INNER_YB} fill="url(#fade-bottom)" pointerEvents="none" />

        {/* Corner vignette shading */}
        <rect x={MASK_MIN_X} y={MASK_MIN_Y} width={MASK_MAX_X - MASK_MIN_X} height={MASK_MAX_Y - MASK_MIN_Y} fill="url(#vignette-fade)" pointerEvents="none" />

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

        {/* Secondary locations — shown for puzzles whose owner is currently at them. */}
        {secondaries
          .filter(sec => activePuzzleIds.includes(sec.puzzleId))
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

        {/* Puzzle markers — pins for your puzzles, dots for the other team / completed.
            Sort so the viewer's own puzzles render LAST (on top), keeping the
            actionable markers visually prioritized when they overlap with the
            other team's puzzles. */}
        {[...puzzles]
          .sort((a, b) => {
            const aOwn = a.assignedTo === self ? 1 : 0;
            const bOwn = b.assignedTo === self ? 1 : 0;
            return aOwn - bOwn;
          })
          .map((puzzle) => {
          const p = toPoint(puzzle.location);
          const cx = p.x * MAP_W;
          const cy = p.y * MAP_H;
          const team = PLAYER_COLORS[puzzle.assignedTo];
          const muted = MUTED_PLAYER_COLORS[puzzle.assignedTo];
          const score = scores[puzzle.assignedTo];
          const state = derivePuzzleState(puzzle, score);
          const isOwn = puzzle.assignedTo === self;
          const m = markerStyle(state, isOwn, team, muted);

          // Dots sit directly on the location; an optional thin outline keeps the
          // other team's open dot distinct from a live player dot.
          if (m.form === 'dot') {
            return (
              <g key={`puzzle-${puzzle.id}`}>
                <circle cx={cx} cy={cy} r={m.r} fill={m.fill} fillOpacity={m.fillOpacity} />
                {m.accentOpacity > 0 && (
                  <circle cx={cx} cy={cy} r={m.r} fill="none" stroke={m.accent} strokeOpacity={m.accentOpacity} strokeWidth={0.8} />
                )}
              </g>
            );
          }

          // Pins are proper map pins: the circle body floats above the location
          // and a triangle spike points down to it.
          const bodyY = cy - m.r * 2.2;
          return (
            <g key={`puzzle-${puzzle.id}`}>
              {/* Spike — a triangle from just below the circle down to the location. */}
              <path
                d={`M ${cx - m.r * 0.5} ${bodyY + m.r * 0.6} L ${cx} ${cy} L ${cx + m.r * 0.5} ${bodyY + m.r * 0.6} Z`}
                fill={m.accent}
                fillOpacity={m.accentOpacity}
                stroke={m.accent}
                strokeOpacity={m.accentOpacity}
                strokeWidth={1}
                strokeLinejoin="round"
              />
              {/* Circle body */}
              <circle cx={cx} cy={bodyY} r={m.r} fill={m.fill} />
              <circle cx={cx} cy={bodyY} r={m.r} fill="none" stroke={m.accent} strokeOpacity={m.accentOpacity} strokeWidth={1.4} />
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
              {/* Locked-own pins show the points required to unlock, in a muted gray. */}
              {state === 'locked' && isOwn && (
                <text
                  x={cx} y={bodyY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={m.r * 1.3}
                  fontWeight={700}
                  fill="#a1a1aa"
                  fillOpacity={0.85}
                  fontFamily="monospace"
                >
                  {puzzle.minimumPoints}
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
