# GNO Dag 2026

**GNO Dag** stands for *Gender Neutrale Ouderdag* (Gender-Neutral Parents' Day). This is the 2026 edition.

## Purpose

A real-time two-player GPS tracking web app. The two players — **Govie** and **Jac.** — each open the app on their phone, allow location access, and see both themselves and the other person as colored dots on a live SVG street map. The game area is centered on a house in **Bodegraven, Netherlands**.

Only these two hardcoded usernames are accepted by the server.

## How it works

1. The browser's geolocation API streams the player's GPS position to the server via WebSocket.
2. If the player is outside the defined geographic bounding box, the map is hidden and replaced with a screen showing the distance back to the house.
3. The server transforms GPS coordinates to normalized `[0,1]` map positions and broadcasts both players' positions to all connected clients.
4. The SVG map re-renders player dots in real time: **Govie = amber**, **Jac. = blue**. The "self" player gets an additional outer ring.

## Key architectural details

- **Krmx** (`@krmx/server` / `@krmx/client-react`) is a custom WebSocket multiplayer framework by the same author (simonkarman). It provides a join/link/unlink/leave user lifecycle and typed message passing.
- The SVG road map geometry is pre-baked from OpenStreetMap (via Overpass API) as normalized polylines in `client/src/components/road-data.ts`. It is not fetched at runtime.
- Idle/disconnected users are auto-kicked after **120 seconds** (`server/src/unlinked-kicker.ts`).
- When the WebSocket closes on the client, it auto-reloads after **5 seconds**.
- In production (Cloud Run), `JSON_LOGGING=true` enables structured JSON log output.

## Puzzles

The game layers a puzzle system on top of the GPS map:

- **Puzzles** are defined in a JSON state file and have: a map `location`, an `icon`, an `assignedTo` player, a `minimumPoints` threshold, extra `requirements`, an `answer` (server-only, never sent to clients), and `content` (text/image elements shown when solving).
- A puzzle is `locked`, `open`, or `completed` — rendered gray / white / green on the map. Only `completed` (a boolean) is persisted; everything else clients show is **derived on the client**. The server sends only commands' results and the minimal computed state; anything purely derivable (scores, lock/open) is derived client-side.
- A player's **score is derived on the client** = their number of completed puzzles (each completion worth **1 point**). It is never broadcast by the server.
- A puzzle's display **state is derived on the client** with strict priority: `completed` → `completed`; else assigned player's score `< minimumPoints` → `locked`; else `open`. **Requirements do NOT influence lock/open state.**
- **Requirements** are **server-only** (never sent to clients). Each is evaluated to a boolean and, when its value differs from `expected`, mutates the puzzle's `content` before it is sent: `mode: 'replace'` swaps the whole content for the requirement's `content`; `mode: 'append'` appends it. Types: `no-other-player-within` (met when the other player is further than `meters` from the puzzle) and `other-player-at-location` (met when the other player is within `meters` of a secondary `location`). Secondary locations are sent to clients as `secondaryLocations` and render as diamonds on the map, highlighting while the related puzzle is being viewed.
- The server sends `game-state` as `{ puzzles }`, where each client puzzle has server-computed `content` + `secondaryLocations` and the raw `completed` flag (no `answer`, no `requirements`, no `state`, no `scores`).
- Completion is client-initiated (`complete-puzzle` message with an answer) and **server-validated** for ownership, ~10m proximity, open state, and correct answer.
- A **waiting screen** is shown before `START_DATETIME` regardless of location (to avoid spoiling the location).

### State persistence

State (puzzle definitions + the persisted `completed` flag per puzzle) lives **in-memory** on the server and syncs **fire-and-forget to Google Cloud Storage**. The blob stores only `{ puzzles }`; lock/open states and scores are re-derived on load. The server is ephemeral and reloads state on startup. Locally, authenticate with `gcloud auth application-default login` and point `GCS_BLOB` at a separate test blob.

### Relevant env vars

| Var | Side | Purpose |
|---|---|---|
| `GCS_BUCKET` | server | GCS bucket holding the state blob (required) |
| `GCS_BLOB` | server | state blob filename (default `state.json`; use a separate one for local testing) |
| `START_DATETIME` / `NEXT_PUBLIC_START_DATETIME` | server / client | ISO datetime the game begins |

## Dev mode

When `NEXT_PUBLIC_LOCAL_DEVELOPMENT=true`, real GPS is replaced by a simulated position that can be moved with arrow keys (or on-screen buttons). A collapsible "DEV" badge overlays the map.

## Deployment

- **Server**: Google Cloud Run (port 8082), containerized via Docker.
- **Client**: Vercel (Next.js).
