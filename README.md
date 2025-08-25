<div align="center">

# 🏏 CricApp — Cricket Tournament & Live Scoring

Manage cricket tournaments, score matches ball‑by‑ball, and visualize insights with a clean, modern UI.

</div>

---

## Highlights

- 🎯 Create tournaments: league or knockout formats
- 👥 Add teams and players with guided steps
- 🗓️ Auto-generate fixtures (league) out of the box
- 🔴 Live scoring: runs, wickets, wides, no-balls, striker swap, over progress
- 🏁 Normal Match mode for quick, standalone scoring
- 📊 Points table with auto sorting by points and NRR
- 📈 Match analytics with beautiful charts (Recharts)
- 💅 TailwindCSS + lucide icons for a crisp, responsive UI

## Tech Stack

- React 18 + TypeScript
- Vite 5 (blazing-fast dev/build)
- Tailwind CSS 3
- Recharts (analytics)
- React Router v7

Optional libraries included for future exports/integrations:
- jsPDF, xlsx, @supabase/supabase-js

## Quick Start

Prerequisites: Node.js 18+ and npm (or pnpm/yarn)

1) Install dependencies
```
npm install
```

2) Start the dev server
```
npm run dev
```

3) Open the app at the URL shown in your terminal (typically http://localhost:5173)

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview the production build locally
- `npm run lint` — Lint with ESLint

## App Overview

- Dashboard: overview of tournaments, quick links, and points table
- Create Tournament: 3-step wizard for details, teams, and players
- Live Scoring: pick a match and score ball-by-ball
- Normal Match: quick scoring flow with polished controls and modals
- Analytics: charts and insights once matches are completed

Primary routes (see `src/App.tsx`):
- `/` — Dashboard
- `/create-tournament` — Create Tournament wizard
- `/scoring/:tournamentId` — Live Scoring
- `/normal-match/:matchId?` — Normal Match mode (standalone scoring)
- `/analytics` — Analytics screen

## Folder Structure

```
cricApp/
	src/
		components/
			CreateTournament.tsx    # 3-step tournament creation flow
			Dashboard.tsx           # home + stats + points table
			Layout.tsx              # top navigation and theming
			LiveScoring.tsx         # live scoring scaffold
			NormalMatch.tsx         # full scoring UX with overs/balls/extras/wickets
			MatchAnalytics.tsx      # charts and insights (Recharts)
			PointsTable.tsx         # sorted points table with NRR
		contexts/
			TournamentContext.tsx   # global state for tournaments and matches
		types/
			cricket.ts              # core cricket domain types (Team, Match, Over, Ball, etc.)
		App.tsx                   # routes wiring
		main.tsx, index.css       # app bootstrap and Tailwind
```

## Data Model (essentials)

- Team, Player
- Tournament: format (league/knockout), overLimit, teams, matches, pointsTable
- Match: two teams, status (upcoming/live/completed), innings, result
- Innings: overs, totalRuns, wickets, extras, current batsmen and bowler
- Over/Ball: per-delivery details including wides/no-balls and wickets

See `src/types/cricket.ts` for full definitions.

## Styling & Icons

- TailwindCSS is pre-configured via `tailwind.config.js` and `postcss.config.js`
- Icons from `lucide-react` for a clean, sporty look

## Screenshots

Add your screenshots under `docs/` and reference them here:

```
docs/
	dashboard.png
	live-scoring.png
	normal-match.png
	analytics.png
```

Example:
![Dashboard](docs/dashboard.png)

## Roadmap

- Persist tournaments/matches (Supabase or local storage)
- Real-time updates for multi-scorer support
- Full stats per player and match result workflow
- Export to PDF/Excel
- PWA/offline mode

## Troubleshooting

- Tailwind styles not applying? Ensure `content` in `tailwind.config.js` includes `./index.html` and `./src/**/*.{js,ts,jsx,tsx}` (already set).
- Type errors on build? Run `npm run lint` and check TS versions in `tsconfig.*`.
- Blank page? Verify the dev URL, and that `#root` exists in `index.html` and matches `main.tsx`.

## Contributing

Issues and PRs are welcome. If you plan a larger change, please open an issue first to discuss direction (formats, scoring logic, persistence).

## License

No license specified yet. If you’re the repository owner, consider adding a LICENSE file (e.g., MIT) to clarify usage.

---

Made with ❤️ for the gentleman’s game.
