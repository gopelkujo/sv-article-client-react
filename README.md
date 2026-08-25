# Article Desk — Blog Dashboard Frontend

React dashboard for the article management.

## Tech stack

- **React 19** + **Vite** + **TypeScript**
- **React Router** for navigation
- **Tailwind CSS v4** + **shadcn/ui** (Radix Nova) for UI primitives
- **lucide-react** for icons
- **Sonner** for toasts
- State: custom hooks (no Redux)

## Run locally

1. Start the Go service on port **8080** (see `sv-article-service` README).
2. In this repo:

```bash
npm install
npm run dev
```

Vite proxies `/api/*` → `http://localhost:8080/*` so the browser avoids CORS.

Other scripts:

```bash
npm run build    # typecheck + production build
npm run lint     # oxlint
npm run preview  # preview production build
```

## Folder structure

```
src/
  api/           # HTTP client, mappers, postsApi — UI never imports fetch details
  components/    # Presentational UI; primitives live in `components/ui` (shadcn)
  features/
    posts/       # Posts-domain UI (PostForm, PostsTable, PreviewCard)
  pages/         # Route-level screens
  layouts/       # Dashboard shell (sidebar + outlet)
  hooks/         # usePosts, usePost, usePagination, useToast
  lib/           # Shared helpers (`cn`)
  types/         # Shared Post / PostStatus types
  utils/         # Constants, formatting
  App.tsx        # Routes + toaster
  main.tsx       # Entry
```

Each folder exists so domain logic, presentational UI, and transport stay separable — pages compose features; features call hooks; hooks call `src/api` only.

## API layer (backend integration)

`src/api/postsApi.ts` keeps the same frontend signatures:

| Function | Backend call |
|----------|--------------|
| `getPosts(status?)` | `GET /article/100/0`, then optional client-side status filter |
| `getPostById(id)` | `GET /article/{id}` |
| `createPost(data)` | `POST /article/` |
| `updatePost(id, data)` | Load current → `PUT /article/{id}` with full body |
| `softDeletePost(id)` | `PUT` with status `thrash` (service has hard DELETE only) |

Mappers in `src/api/mappers.ts` handle:

- Envelope `{ success, data, error }`
- `id` number ↔ string
- `created_date` / `updated_date` ↔ `createdAt` / `updatedAt`
- `publish` / `thrash` ↔ `published` / `trashed`

Configure the base URL with `VITE_API_BASE_URL` (default `/api` via Vite proxy). For a direct origin (no proxy), set e.g. `VITE_API_BASE_URL=http://localhost:8080` and enable CORS on the service.

### Backend validation (mirrored in the form)

| Field | Min length |
|-------|------------|
| title | 20 |
| content | 200 |
| category | 3 |
| status | `publish` \| `draft` \| `thrash` |

## Features (spec mapping)

| Requirement | Where |
|-------------|--------|
| Dashboard nav (All Posts, Add New, Preview) | `layouts/DashboardLayout.tsx` |
| Tabs: Published / Drafts / Trashed (filter, one URL) | `pages/AllPostsPage.tsx` + `components/ui/tabs` |
| Table: Title, Category, Action | `features/posts/PostsTable.tsx` |
| Edit icon → edit form + Publish / Draft | `pages/EditPostPage.tsx` + `features/posts/PostForm.tsx` |
| Trash icon → soft delete | `softDeletePost` via `AllPostsPage` |
| Add New form + validation + toast + redirect | `pages/AddNewPage.tsx` |
| Preview published posts + pagination | `pages/PreviewPage.tsx` + `components/ui/pagination` |

## Design notes

- UI is composed from **shadcn/ui** primitives under `src/components/ui/`.
- Theme tokens come from shadcn CSS variables in `src/index.css` (Geist Variable font).
- Domain screens compose those primitives; avoid hand-rolled Button/Input/Table.
