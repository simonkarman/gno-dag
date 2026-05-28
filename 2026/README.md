# GNO Dag 2026

**Gender Neutrale Ouderdag 2026**

A real-time GPS-based game for two players (Jac. and Govie). Each player connects from their phone, shares their live location, and sees both themselves and the other player on a virtual map of the streets around the house.

## Structure

| Directory | Description |
|---|---|
| `server/` | Node.js + Express + [Krmx](https://github.com/simonkarman/krmx) WebSocket server — receives GPS locations from players and broadcasts positions to all connected clients |
| `client/` | Next.js 15 + React 19 + TailwindCSS 4 frontend — streams the player's GPS location to the server and renders both players on an SVG map |

## Getting started

### Server

```bash
cd server
cp example.env .env
npm install
npm run dev
```

### Client

```bash
cd client
cp example.env .env.local
npm install
npm run dev
```

Open the client on both phones, pick your name, and allow location access.

## Deployment

- **Server**: Docker image → Google Cloud Run (port 8082)
- **Client**: Vercel (set `NEXT_PUBLIC_KRMX_SERVER_URL` to the Cloud Run WebSocket URL)
