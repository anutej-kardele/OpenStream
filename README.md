# OpenStream

Frontend for **OpenStream**, a public microblogging platform. A React single-page app built with Vite, styled with Tailwind, and deployed to GitHub Pages.

**Live:** https://anutej-kardele.github.io/OpenStream/
**Backend repo:** [anutej-kardele/openstream-api](https://github.com/anutej-kardele/openstream-api)

---

## What it is

A mobile-first client for reading and writing short posts. Four screens — sign in, feed, people search, and profile — presented inside a phone frame on desktop so the layout reads as a mobile app regardless of where it's opened.

| | |
|---|---|
| Framework | React 19 |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7 |
| Icons | lucide-react |
| Hosting | GitHub Pages (deployed by GitHub Actions) |

---

## Design decisions

**One responsive shell, not two layouts.** `PhoneShell` renders a bordered 420px frame on desktop and collapses to full-bleed on small screens using Tailwind's `sm:` breakpoint. The app inside doesn't know or care which it's in, so there's a single set of components rather than parallel mobile and desktop trees.

**`h-dvh` over `h-screen`.** The dynamic viewport unit tracks mobile browser chrome as it slides away, avoiding the dead strip at the bottom of the page that `vh` leaves behind on iOS Safari. Safe-area padding on the bottom nav keeps it clear of the home indicator.

**State lives in context, not in screens.** Posts and the follow graph sit in a `DataContext` so that publishing a post on the feed is visible on the profile, and following someone persists across navigation. Auth is a separate `AuthContext` with a `RequireAuth` wrapper guarding the three authenticated routes.

**SPA routing on a static host.** GitHub Pages has no server-side rewrite, so a hard refresh on `/OpenStream/profile` would 404. The build copies `index.html` to `404.html`, which Pages serves for unmatched paths, letting the router take over client-side.

---

## Structure

```
src/
├── App.jsx                  routes + providers
├── context/
│   ├── AuthContext.jsx      session state, route guard source
│   └── DataContext.jsx      posts and follow state
├── components/
│   ├── PhoneShell.jsx       responsive device frame
│   ├── BottomNav.jsx
│   ├── PostCard.jsx
│   └── UserRow.jsx
└── pages/
    ├── Login.jsx
    ├── Feed.jsx
    ├── Search.jsx
    └── Profile.jsx
```

---

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/OpenStream/`. The `base` path in `vite.config.js` matches the repo name, which is also what makes asset paths resolve correctly once deployed — it has to agree with `basename` on the router and `homepage` in `package.json`.

To test on a phone over the local network:

```bash
npm run dev -- --host
```

---

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the app and publishes `dist/` to Pages. No manual build step.

---

## Notes and next steps

- **Currently running on mock data.** `dummyData.json` stands in for the API while the two halves are wired together. The backend is live and the contract is settled; the fetch layer is the next piece.
- **Auth is a placeholder.** `AuthContext` accepts any non-empty credentials and holds session state in memory, so a refresh signs you out. Real JWT handling arrives with authentication on the API side.
- **The API sleeps.** Render's free tier spins down after inactivity, so the first request can take up to a minute. Skeleton loaders and generous timeouts are built in rather than bolted on later.
- **Likes are stubbed.** The tab exists on the profile; the relation doesn't yet exist in the schema.
