# GNO Dag 2026

**GNO Dag** stands for *Gender Neutrale Ouderdag* (Gender-Neutral Parents' Day). This is the 2026 edition.

## Purpose

A real-time two-player GPS tracking web app. The two players — **Govie** and **Jac.** — each have a **team iPad** that displays the live SVG street map and is used to interact with puzzles, plus a dedicated **GPS-broadcaster phone** that runs at `/gps/govie` or `/gps/jac` and feeds the team's location to the server. The game area is centered on a house in **Bodegraven, Netherlands**.

The server accepts four usernames: `Govie` and `Jac.` (iPad/display) plus `Govie-gps` and `Jac.-gps` (GPS broadcaster phones). The iPad never requests GPS itself — even in dev mode.

## How it works

1. The team's **GPS phone** (at `/gps/<player>`) streams the device's GPS position to the server via WebSocket as the `Govie-gps` / `Jac.-gps` user.
2. The server maps `*-gps` location messages to the base player's position record, transforms them to normalized `[0,1]` map positions, and broadcasts both players' positions to all connected clients.
3. The **iPad** (at `/`) is linked as `Govie` or `Jac.`, never reads GPS, and renders the SVG map from the broadcast positions. The "self" player's dot is its team's GPS phone position with an additional outer ring. Puzzle proximity is computed against the team's position (i.e. the GPS phone).
4. If the GPS phone is outside the defined geographic bounding box, it sends `clear-location` and stops broadcasting; the team's dot vanishes from every iPad. The iPad itself never shows an out-of-range screen (it has no GPS of its own).
5. The GPS beacon page uses the **Wake Lock API** to keep the phone's screen on while the page is open; if unsupported the user must disable auto-lock manually.
6. **Govie = amber**, **Jac. = blue** throughout.

## Key architectural details

- **Krmx** (`@krmx/server` / `@krmx/client-react`) is a custom WebSocket multiplayer framework by the same author (simonkarman). It provides a join/link/unlink/leave user lifecycle and typed message passing.
- The SVG road map geometry is pre-baked from OpenStreetMap (via Overpass API) as normalized polylines in `client/src/components/road-data.ts`. It is not fetched at runtime.
- Idle/disconnected users are auto-kicked after **120 seconds** (`server/src/unlinked-kicker.ts`).
- When the WebSocket closes on the client, it auto-reloads after **5 seconds**.
- In production (Cloud Run), `JSON_LOGGING=true` enables structured JSON log output.

## Puzzles

The game layers a puzzle system on top of the GPS map:

- **Puzzles** are defined in a JSON state file and have: a map `location`, an `icon`, an `assignedTo` player, a `minimumPoints` threshold, extra `requirements`, an `answer` (array of accepted answers, server-only, never sent to clients; stored verbatim, but comparison ignores case, diacritics, punctuation, and extra whitespace; empty array means unanswerable; legacy single-string values are auto-coerced into a one-element array on load), and `content` (text/image elements shown when solving).
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

| Var | Side | Purpose                                                                                                              |
|---|---|----------------------------------------------------------------------------------------------------------------------|
| `GCS_BUCKET` | server | GCS bucket holding the state blob (required)                                                                         |
| `GCS_BLOB` | server | primary state blob filename (default `state.json`; use a separate one for local testing)                             |
| `GCS_BLOB_SECONDARY` | server | secondary state blob filename (default `state-dev.json`); MUST differ from `GCS_BLOB` or the server refuses to start |
| `START_DATETIME` / `NEXT_PUBLIC_START_DATETIME` | server / client | ISO datetime the game begins                                                                                         |
| `NEXT_PUBLIC_KRMX_SERVER_URL` | client | primary WS URL (default `ws://localhost:8082/krmx?...`)                                                              |
| `NEXT_PUBLIC_KRMX_SERVER_URL_SECONDARY` | client | secondary WS URL (default `ws://localhost:8082/secondary/krmx?...`)                                                  |
| `ADMIN_PASSWORD` | client | enables the primary `/admin` and `/api/admin/*` routes                                                               |
| `ADMIN_PASSWORD_SECONDARY` | client | optional; password for `/secondary/admin`. Falls back to `ADMIN_PASSWORD` when unset                                 |
| `GCS_BLOB_SECONDARY` | client | blob the `/secondary/admin` UI reads/writes                                                                          |

## Primary vs secondary instances

The server hosts **two fully independent Krmx instances** on the same Cloud Run service / HTTP port (8082):

- **primary** — WebSocket at `/krmx`, persisted to `GCS_BLOB`, admin at `/admin`, reload at `/admin/reload`.
- **secondary** — WebSocket at `/secondary/krmx`, persisted to `GCS_BLOB_SECONDARY`, admin at `/secondary/admin`, reload at `/secondary/admin/reload`.

Each instance has its own `StateStore`, `positions`, `trails`, Krmx server, and event handlers — they share no in-memory state, so the same player name (`Govie` or `Jac.`) can be linked to both simultaneously. Logs are tagged `[primary]` or `[secondary]` to disambiguate.

The frontend mirrors this split: `/`, `/gps/<player>`, `/admin`, `/reload` drive the primary; `/secondary`, `/secondary/gps/<player>`, `/secondary/admin`, `/secondary/reload` drive the secondary. The secondary routes are not linked from any UI and are intended to be used as a secret test/staging environment running alongside the live game.

The secondary also **bypasses the waiting screen unconditionally**: regardless of what `NEXT_PUBLIC_START_DATETIME` is set to, the secondary page passes an empty `startDatetime` to `<GameClient>`, which triggers the "no start time configured → always started" branch in `useGameStarted`. The primary continues to honour the env var.

Similarly, the secondary's GPS beacon page (`/secondary/gps/<player>`) **always runs in dev mode unconditionally**: regardless of `NEXT_PUBLIC_LOCAL_DEVELOPMENT`, it passes `forceDev` to `<GpsBeacon>`, so real GPS is replaced by the simulated arrow-key-driven position. This makes the secondary usable as a remote test/staging environment without needing to be physically on-site. The primary GPS beacon (`/gps/<player>`) continues to honour the env var.

## Dev mode

When `NEXT_PUBLIC_LOCAL_DEVELOPMENT=true`, the GPS beacon page (`/gps/<player>`) replaces real GPS with a simulated position that can be moved with arrow keys (or on-screen buttons). The iPad client (`/`) shows a small "DEV" badge indicator only — it never requests GPS itself, so the simulator only lives on the beacon page. The secondary GPS beacon (`/secondary/gps/<player>`) is always in dev mode regardless of this env var (see "Primary vs secondary instances" above).

## Deployment

- **Server**: Google Cloud Run (port 8082), containerized via Docker.
- **Client**: Vercel (Next.js).
