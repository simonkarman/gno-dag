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
  cycleway:    { stroke: '#22c55e', width: 1.0, opacity: 0.65 },
  footway:     { stroke: '#3f3f46', width: 0.8, opacity: 0.6 },
  pedestrian:  { stroke: '#3f3f46', width: 1.2, opacity: 0.65 },
  unclassified:{ stroke: '#71717a', width: 1.5, opacity: 0.75 },
};
const DEFAULT_ROAD_STYLE = { stroke: '#3f3f46', width: 0.8, opacity: 0.5 };

const MAP_W = 320;
const MAP_H = 176;

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
