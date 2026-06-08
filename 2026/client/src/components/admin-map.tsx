'use client';

import React, { useRef } from 'react';
import { LatLng, Point, toPoint, fromPoint } from '@/components/geo';
import { ROADS } from '@/components/road-data';
import { PLAYER_COLORS } from '@/components/colors';
import { PUZZLE_STATE_COLORS } from '@/components/puzzles';
import { AdminPuzzle, derivedDisplayState, derivedScores } from '@/components/admin-types';

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

const MAP_W = 320;
const MAP_H = 176;

// Inset matches the main map INSET
const INSET = 0.05; // 5% on every side
const VB_X = MAP_W * INSET;
const VB_Y = MAP_H * INSET;
const VB_W = MAP_W * (1 - 2 * INSET);
const VB_H = MAP_H * (1 - 2 * INSET);

// Tweakable fade parameters (change these to adjust the vignette boundaries)
const FADE_INWARD = 5;
const FADE_OUTWARD = 35;

// Programmatic Inner/Outer boundaries
const INNER_X = VB_X + FADE_INWARD;
const INNER_Y = VB_Y + FADE_INWARD;
const INNER_W = VB_W - 2 * FADE_INWARD;
const INNER_H = VB_H - 2 * FADE_INWARD;

const OUTER_X = VB_X - FADE_OUTWARD;
const OUTER_Y = VB_Y - FADE_OUTWARD;
const OUTER_W = VB_W + 2 * FADE_OUTWARD;
const OUTER_H = VB_H + 2 * FADE_OUTWARD;

const INNER_XR = VB_X + VB_W - FADE_INWARD;
const INNER_YB = VB_Y + VB_H - FADE_INWARD;

const OUTER_XR = VB_X + VB_W + FADE_OUTWARD;
const OUTER_YB = VB_Y + VB_H + FADE_OUTWARD;

// Mask viewport limits (500% area coverage)
const MASK_MIN_X = VB_X - 5 * VB_W;
const MASK_MAX_X = VB_X + 6 * VB_W;
const MASK_MIN_Y = VB_Y - 5 * VB_H;
const MASK_MAX_Y = VB_Y + 6 * VB_H;

interface Props {
  puzzles: AdminPuzzle[];
  selectedId: string | null;
  /** When true the cursor is a crosshair and a plain click calls onMapClick. */
  placing: boolean;
  onMapClick: (loc: LatLng) => void;
  onSelectPuzzle: (id: string | null) => void;
  onMovePuzzle: (id: string, loc: LatLng) => void;
  onMoveSecondary: (puzzleId: string, reqIndex: number, loc: LatLng) => void;
}

export function AdminMap({
  puzzles, selectedId, placing,
  onMapClick, onSelectPuzzle, onMovePuzzle, onMoveSecondary,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const scores = derivedScores(puzzles);
  // Tracks an in-progress drag so we can suppress the trailing click + route moves.
  const drag = useRef<
    | { kind: 'puzzle'; id: string }
    | { kind: 'secondary'; puzzleId: string; reqIndex: number }
    | null
  >(null);
  // Distinguishes a click from a drag: set on the first pointer move so the
  // trailing click can keep (never deselect) a marker the user just dragged.
  const moved = useRef(false);

  /** Converts a pointer event to a normalised LatLng within the game bounds. */
  function eventToLatLng(e: React.PointerEvent | React.MouseEvent): LatLng | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const user = pt.matrixTransform(ctm.inverse());
    const p: Point = {
      x: Math.max(0, Math.min(1, user.x / MAP_W)),
      y: Math.max(0, Math.min(1, user.y / MAP_H)),
    };
    return fromPoint(p);
  }

  function handleBackgroundClick(e: React.MouseEvent) {
    if (drag.current) return; // ignore click that ends a drag
    if (!placing) return;
    const loc = eventToLatLng(e);
    if (loc) onMapClick(loc);
  }

  function startDrag(
    e: React.PointerEvent,
    target: NonNullable<typeof drag.current>,
  ) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = target;
    moved.current = false;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const loc = eventToLatLng(e);
    if (!loc) return;
    moved.current = true;
    if (drag.current.kind === 'puzzle') {
      onMovePuzzle(drag.current.id, loc);
    } else {
      onMoveSecondary(drag.current.puzzleId, drag.current.reqIndex, loc);
    }
  }

  function endDrag(e: React.PointerEvent) {
    if (!drag.current) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    // Clear on the next tick so the synthetic click that follows is ignored.
    const wasDragging = drag.current;
    drag.current = null;
    void wasDragging;
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-full bg-zinc-900 ${placing ? 'cursor-crosshair' : 'cursor-default'}`}
      onClick={handleBackgroundClick}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
    >
      <defs>
        {/* Linear gradients for rectangular fade */}
        <linearGradient id="admin-fade-left" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="admin-fade-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="admin-fade-top" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="admin-fade-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181b" stopOpacity="0" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Roads */}
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
      <rect x={OUTER_X} y={OUTER_Y} width={INNER_X - OUTER_X} height={OUTER_YB - OUTER_Y} fill="url(#admin-fade-left)" pointerEvents="none" />
      <rect x={INNER_XR} y={OUTER_Y} width={OUTER_XR - INNER_XR} height={OUTER_YB - OUTER_Y} fill="url(#admin-fade-right)" pointerEvents="none" />
      <rect x={OUTER_X} y={OUTER_Y} width={OUTER_XR - OUTER_X} height={INNER_Y - OUTER_Y} fill="url(#admin-fade-top)" pointerEvents="none" />
      <rect x={OUTER_X} y={INNER_YB} width={OUTER_XR - OUTER_X} height={OUTER_YB - INNER_YB} fill="url(#admin-fade-bottom)" pointerEvents="none" />

      {/* Test Outlines (Inner FADE_INWARD inward white / Outer FADE_OUTWARD outward red) */}
      <rect
        x={VB_X}
        y={VB_Y}
        width={VB_W}
        height={VB_H}
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeOpacity={0.4}
        pointerEvents="none"
      />
      <rect
        x={INNER_X}
        y={INNER_Y}
        width={INNER_W}
        height={INNER_H}
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeDasharray="2,2"
        strokeOpacity={0.2}
        pointerEvents="none"
      />
      <rect
        x={OUTER_X}
        y={OUTER_Y}
        width={OUTER_W}
        height={OUTER_H}
        fill="none"
        stroke="#ef4444"
        strokeWidth="0.8"
        strokeDasharray="2,2"
        strokeOpacity={0.2}
        pointerEvents="none"
      />

      {/* Secondary locations (other-player-at-location requirements) */}
      {puzzles.flatMap((puzzle) =>
        puzzle.requirements.map((req, reqIndex) => {
          if (req.type !== 'other-player-at-location') return null;
          const p = toPoint(req.location);
          const cx = p.x * MAP_W;
          const cy = p.y * MAP_H;
          const active = puzzle.id === selectedId;
          const r = 3.5;
          return (
            <g
              key={`sec-${puzzle.id}-${reqIndex}`}
              transform={`translate(${cx} ${cy}) rotate(45)`}
              className="cursor-move"
              onPointerDown={(e) => startDrag(e, { kind: 'secondary', puzzleId: puzzle.id, reqIndex })}
            >
              <rect
                x={-r} y={-r} width={r * 2} height={r * 2}
                fill={active ? '#fbbf24' : 'none'}
                stroke={active ? '#fbbf24' : '#a1a1aa'}
                strokeWidth={0.9}
                opacity={active ? 0.95 : 0.7}
              />
            </g>
          );
        }),
      )}

      {/* Puzzle markers */}
      {puzzles.map((puzzle) => {
        const p = toPoint(puzzle.location);
        const cx = p.x * MAP_W;
        const cy = p.y * MAP_H;
        const color = PUZZLE_STATE_COLORS[derivedDisplayState(puzzle, scores)];
        const selected = puzzle.id === selectedId;
        return (
          <g
            key={`puzzle-${puzzle.id}`}
            className="cursor-move"
            onPointerDown={(e) => startDrag(e, { kind: 'puzzle', id: puzzle.id })}
            onClick={(e) => {
              e.stopPropagation();
              // A drag (or a click while placing) selects but must never deselect.
              if (moved.current || placing) { onSelectPuzzle(puzzle.id); return; }
              onSelectPuzzle(selectedId === puzzle.id ? null : puzzle.id);
            }}
          >
            {selected && (
              <circle cx={cx} cy={cy} r={7} fill="none" stroke={PLAYER_COLORS[puzzle.assignedTo]} strokeWidth={1} opacity={0.9} />
            )}
            <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.95} />
            <circle cx={cx} cy={cy} r={5} fill="none" stroke={PLAYER_COLORS[puzzle.assignedTo]} strokeWidth={1.2} />
            <text x={cx} y={cy + 1.6} textAnchor="middle" fontSize={4.5}>{puzzle.icon}</text>
          </g>
        );
      })}
    </svg>
  );
}
