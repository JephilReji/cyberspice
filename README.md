# CyberSpice — Setup Guide (Day 1)

## What's done
- Client: React + TypeScript + Vite + Tailwind (your Stitch design tokens copied in)
- Server: Node + Express + TypeScript + MongoDB (Mongoose)
- Auth: email/password (bcrypt + JWT) + real Google OAuth
- Login page fully converted from your Stitch HTML and wired to the backend

## 1. Extract the zip and open two terminals — one for `client`, one for `server`

## 2. Server setup
```
cd server
cp .env.example .env
```
Fill in `.env`:
- `MONGO_URI` — from your Atlas cluster (Connect → Drivers → copy connection string, put your DB user password in)
- `JWT_SECRET` — any long random string, e.g. run `openssl rand -hex 32`
- `GOOGLE_CLIENT_ID` — see step 4 below

Then:
```
npm run dev
```
Server runs on http://localhost:5000. Visit http://localhost:5000/api/health — should return `{"status":"ok"}`.

## 3. Client setup
```
cd client
cp .env.example .env
npm run dev
```
Client runs on http://localhost:5173 (Vite will tell you the exact port).

## 4. Google OAuth setup (needed for the Google Sign-In button to work)
1. Go to https://console.cloud.google.com/ → create a new project (or use existing)
2. APIs & Services → OAuth consent screen → set it to "External", fill basic app info, add your email as a test user
3. APIs & Services → Credentials → Create Credentials → OAuth client ID → Application type: **Web application**
4. Under "Authorized JavaScript origins" add: `http://localhost:5173`
5. Copy the generated **Client ID** — paste it into BOTH:
   - `client/.env` → `VITE_GOOGLE_CLIENT_ID`
   - `server/.env` → `GOOGLE_CLIENT_ID`
6. Restart both dev servers after adding it.

## 5. Test it
- Go to http://localhost:5173 → redirects to `/login`
- Try creating an account by hitting the register API directly (Postman/curl) since the Create Account page isn't built yet — send me that Stitch page next and we'll wire it up
- Try the "Continue with Google" button — should pop the real Google account picker

## Folder structure
```
cyberspice/
  client/          React + TS + Vite app
    src/
      api/         axios client + auth API calls
      context/     AuthContext (holds user/token)
      pages/       Login.tsx (Day 1) — more pages added daily
  server/          Node + Express + TS API
    src/
      config/      db.ts (MongoDB connection)
      models/      User.ts
      controllers/ authController.ts
      routes/      authRoutes.ts
      middleware/  requireAuth.ts (for protected routes from Day 2)
```

## Known gaps (by design, coming later)
- Create Account page not built yet — send the Stitch export next
- Dashboard is a placeholder — real one comes Day 2/3
- "Forgot password" link is not wired up yet
