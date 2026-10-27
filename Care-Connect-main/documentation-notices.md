## Admin Notices System (Popup Modals)

### Models

- `models/Notice.js`: Site-wide notice definition (title, HTML body, scheduling, flags).
- `models/NoticeSeen.js`: Tracks which `one_time` notices a user has already seen.

### Admin APIs (JWT home-admin protected)

- `GET /api/admin/notices`
  - Headers: `Authorization: Bearer <home-admin JWT>`
  - Response: `{ notices: [...] }` sorted by `priority` then `createdAt`.

- `POST /api/admin/notices`
  - Headers: `Authorization: Bearer <home-admin JWT>`
  - Body:
    - `title: string` (required)
    - `body: string` (HTML or text, required)
    - `startDate: string | Date` (required)
    - `endDate: string | Date` (required)
    - `enabled?: boolean`
    - `displayType?: "every_visit" | "one_time"`
    - `dismissible?: boolean`
    - `priority?: number`

- `PUT /api/admin/notices/[id]`
  - Full update, same fields as create.

- `PATCH /api/admin/notices/[id]`
  - Partial update. When `{ enabled: boolean }` is provided, acts as a quick enable/disable endpoint.

- `DELETE /api/admin/notices/[id]`
  - Deletes a notice.

### Public APIs

- `GET /api/notices`
  - Optional header: `Authorization: Bearer <user JWT>`
  - Returns `{ notices: [{ id, title, body, displayType, dismissible, priority, shouldDisplay, ... }] }`.
  - Only active (`enabled = true`, within `startDate`/`endDate`) notices are returned.
  - For `displayType = "one_time"`, `shouldDisplay` is `false` if the user has already seen it (tracked in `NoticeSeen`).

- `POST /api/notices`
  - Used to mark a `one_time` notice as seen for the current user.
  - Headers: `Authorization: Bearer <user JWT>` (required).
  - Body: `{ noticeId: string }`.

### Frontend Integration

- `app/admin/notices/page.js`
  - Admin UI to:
    - Create and edit notices.
    - Toggle enabled/disabled.
    - Delete notices.
    - Set `displayType`, `dismissible`, `startDate`, `endDate`, and `priority`.
  - Uses `localStorage.getItem("token")` (same as existing admin flows) to call admin APIs.

- `app/components/NoticePopup.jsx`
  - Client-side modal that:
    - Fetches `/api/notices` on load.
    - Shows a queue of notices in order (by `priority` / creation).
    - Respects `displayType` and `dismissible`.
    - For `one_time` notices and authenticated JWT users, calls `POST /api/notices` to mark as seen whenever the modal is closed.

- `app/layout.js`
  - The `NoticePopup` component is mounted inside the main layout, so it appears on all pages:
    - Inside `<main>` above `{children}`.

### Tailwind UI Notes

- The popup uses a simple Tailwind-based modal:
  - Backdrop: `fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center`.
  - Card: `max-w-lg mx-4 bg-white rounded-2xl shadow-xl ring-1 ring-black/10`.
  - Header/footer: `border-b px-5 py-3`, `border-t bg-gray-50 px-5 py-3`.
  - Buttons: `bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1.5` and neutral variants.

### Example: Creating a Notice via API

```bash
curl -X POST "http://localhost:3000/api/admin/notices" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <HOME_ADMIN_JWT>" \
  -d '{
    "title": "Planned Maintenance",
    "body": "<p>We will be undergoing maintenance tonight at <strong>11pm</strong>.</p>",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-02T00:00:00.000Z",
    "displayType": "one_time",
    "dismissible": true,
    "priority": 1
  }'
```


