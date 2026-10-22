# Simple CMS: React study project

A small app for practicing React fundamentals: Context API, data fetching
in effects, forms, validation and UI states. It uses
[DummyJSON](https://dummyjson.com/docs) as the backend.

The goal is to learn how things work underneath, so data fetching is written
by hand with `fetch`, `AbortController` and effect cleanup. Libraries like
TanStack Query or SWR are not used on purpose.

## Stack

| Tool | Used for |
| --- | --- |
| React 19 + TypeScript 6 | UI and types (`verbatimModuleSyntax`, `erasableSyntaxOnly`) |
| Vite 8 | Dev server and build |
| React Router 8 | Routing, declarative mode (`<Routes>`, layout routes, `<Outlet>`) |
| Tailwind CSS 4 | Styling |
| Zod 4 | Validating API responses, stored data and form input |
| Oxlint | Linting, including the React hooks rules |

## Getting started

```bash
npm install
cp .env.example .env   # VITE_API_URL=https://dummyjson.com
npm run dev
```

Log in with the DummyJSON test account: **`emilys` / `emilyspass`**.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) and build |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Serve the production build |

## Progress

The full plan, in Portuguese, is in
[`docs/roteiro_pratica_react_apis_publicas.md`](docs/roteiro_pratica_react_apis_publicas.md).

| Day | Topic | Status |
| --- | --- | --- |
| 1 | Auth context, login form, protected routes | ✅ Done |
| 1.5 | Move auth to DummyJSON (`/auth/login`, `/auth/me`) and validate with Zod | ✅ Done (token refresh not done) |
| 2 | Posts: list with loading / error / retry / empty states | ✅ Done |
| 2 | Posts: create form | ⏳ Next |
| 2.5 | Modals with `createPortal` | ⏳ Planned |
| 3 | Product search with debounce, filters, cart context | ⏳ Planned |
| 4 | Final project: mini e-commerce with checkout | ⏳ Planned |

## Project structure

```
src/
├── app/router.tsx            # All routes and guards
├── lib/http.ts               # request<T>() wrapper and HttpError
├── components/
│   ├── context/AuthContext.tsx   # AuthProvider + useAuth()
│   ├── ProtectedRoute.tsx        # Only for logged-in users
│   ├── GuestOnlyRoute.tsx        # Only for logged-out users (login page)
│   └── layout/                   # Header and layout for internal pages
└── features/
    ├── auth/      # Login page, auth layout, Zod schemas
    ├── posts/     # PostProvider + usePost(), page, list and state components
    └── users/     # Users page (placeholder)
docs/
├── roteiro_pratica_react_apis_publicas.md   # Study plan
└── layout/                                  # Static HTML mockups for each screen
```

Code is grouped by feature. Shared pieces live in `components/` and `lib/`.

## How it works

### Routing

```
/          → redirects to /posts
/login     → GuestOnlyRoute → AuthLayout → LoginPage
/posts     → ProtectedRoute → InternalLayout → PostProvider → PostPage
/users     → ProtectedRoute → InternalLayout → UserPage
*          → redirects to /posts
```

Guards, layouts and providers are layout routes that render `<Outlet />`.
`PostProvider` wraps only the posts route, so posts are fetched only when
that page is open. After login, `GuestOnlyRoute` sends the user back to the
page they first tried to open.

### HTTP

`src/lib/http.ts` exports `request<T>(path, { method, body, token, signal })`.
It adds the base URL, JSON headers and the `Authorization: Bearer` header.
Any response that isn't OK throws an `HttpError` with the `status` and the
server's `message`.

Responses are requested as `unknown` and then parsed with a Zod schema, so the
types match what the API actually sent.

Error messages follow one rule: a message from an `HttpError` can be shown to
the user, and anything else, like a network error or a `ZodError`, shows a
generic message.

### Auth

- `login()` posts to `/auth/login`, validates the response and saves
  `{ token, user }` in `localStorage`.
- On startup, the stored token is checked with `GET /auth/me`. On a 401 the
  session is cleared. While this runs, the app shows a loader, so a logged-in
  user isn't sent to `/login` on refresh.
- `logout` is wrapped in `useCallback` so it stays the same function between
  renders and can be used as an effect dependency.

### Posts

- `PostProvider` loads `/auth/posts` with the token, which is DummyJSON's
  `/auth/<resource>` pattern for authenticated requests.
- Each fetch effect uses an `AbortController`. It skips state updates once the
  request is aborted and aborts in its cleanup, which also handles the
  StrictMode double run.
- A 401 logs the user out. Other errors show a retry box. Retry increments a
  `reloadKey` that the effect depends on.
- `PostPage` renders exactly one state with early returns, in this order:
  loading → error → empty → list.

## Testing failure states

| To test | How |
| --- | --- |
| API down / no network | DevTools → Network → right-click the request → **Block request URL**, then reload. Avoid the Offline mode: it also blocks the Vite dev server, so navigation breaks. |
| Server error (`HttpError`) | Temporarily request `/http/500` or `/http/404/Some message`. |
| Slow response / skeleton | Add `?delay=3000` to the request. |
| Invalid response (`ZodError`) | Temporarily request another resource, for example `/auth/users`. |
| Invalid session | Edit the token in DevTools → Application → Local Storage and reload. |

Undo these temporary changes before committing.

## DummyJSON notes

- `POST /posts/add` returns 201 but always responds with `id: 252` and doesn't
  save anything. New posts need a locally generated id.
- `/auth/me` returns the full user, including the password, so it is parsed
  through `UserSchema` and only the declared fields are kept.

## References

- [DummyJSON docs](https://dummyjson.com/docs)
- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React: createPortal](https://react.dev/reference/react-dom/createPortal)
- [Zod](https://zod.dev)
