# Home-Specific Notices Feature

This document describes the home-specific notices feature implementation for the Care Connect platform.

## Overview

The notices feature allows home admins (or super-admins) to create, manage, and display notices that belong to specific homes. Notices can be scheduled, prioritized, and configured to show once per user or every time.

## Environment Setup

### Required Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
```

Make sure your `.env.local` file contains the MongoDB connection string.

## Database Models

### HomeNotice Model (`models/HomeNotice.js`)

Stores notice information:
- `homeId`: Reference to the Home
- `title`: Notice title (required)
- `content`: Notice content, HTML/markdown allowed (required)
- `startAt`: Start date/time (null = show immediately)
- `endAt`: End date/time (null = no expiry)
- `priority`: "high", "medium", or "low" (default: "medium")
- `showOnce`: Boolean - if true, show once per user (default: false)
- `enabled`: Boolean - enable/disable notice (default: true)
- `createdBy`: Reference to admin/user who created it
- `createdAt`, `updatedAt`: Timestamps

### NoticeDismissal Model (`models/NoticeDismissal.js`)

Tracks which users dismissed which notices:
- `noticeId`: Reference to HomeNotice
- `userId`: User ID (can be ObjectId for logged-in users, or sessionId/token for anonymous)
- `homeId`: Reference to Home
- `dismissedAt`: Timestamp of dismissal

## API Routes

### Public Routes

#### `GET /api/homes/[id]/notices`
- **Description**: List active notices for a home
- **Query Params**:
  - `userId` (optional): Filter out showOnce notices already dismissed
  - `admin=true` (optional): Admin view - returns all notices including disabled
- **Response**: `{ success: true, notices: [...] }`

#### `POST /api/homes/[id]/notices/[nid]/dismiss`
- **Description**: Record dismissal for a user
- **Body**: `{ userId?: string }`
- **Response**: `{ success: true, message: "..." }`

### Admin Routes (Admin-auth required - TODO: implement auth)

#### `POST /api/homes/[id]/notices`
- **Description**: Create a new notice
- **Body**: 
  ```json
  {
    "title": "string",
    "content": "string",
    "startAt": "ISO datetime string (optional)",
    "endAt": "ISO datetime string (optional)",
    "priority": "high|medium|low",
    "showOnce": boolean,
    "enabled": boolean,
    "createdBy": "admin-id"
  }
  ```
- **Response**: `{ success: true, notice: {...} }`

#### `PUT /api/homes/[id]/notices/[nid]`
- **Description**: Update an existing notice
- **Body**: Same as POST (all fields optional)
- **Response**: `{ success: true, notice: {...} }`

#### `DELETE /api/homes/[id]/notices/[nid]`
- **Description**: Delete a notice (also deletes associated dismissals)
- **Response**: `{ success: true, message: "..." }`

#### `GET /api/admin/notices/analytics?homeId=...`
- **Description**: Get analytics for notices (dismissal counts)
- **Response**: `{ success: true, analytics: [...], totalNotices: number, totalDismissals: number }`

## Frontend Components

### NoticeModal (`app/homes/[id]/components/NoticeModal.jsx`)

A client component that displays a notice in a modal dialog:
- Accessible (keyboard navigation, ARIA labels)
- Priority-based styling (red for high, amber for medium, blue for low)
- Shows "Don't show again" button if `showOnce` is true
- Dismissible with Escape key

### Home Page Integration (`app/homes/[id]/page.js`)

The home details page automatically:
1. Fetches active notices on mount
2. Shows the highest priority notice in a modal
3. Provides a "View all notices" button
4. Handles dismissal (server-side for logged-in users, localStorage for anonymous)

### Admin UI (`app/admin/homes/[id]/notices/page.jsx`)

Admin interface for managing notices:
- List all notices (including disabled)
- Create new notices with form validation
- Edit existing notices
- Delete notices
- View notice details (dates, priority, status)

## Usage

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

### Testing the Feature

1. **Create a Notice (Admin)**:
   - Navigate to `/admin/homes/[homeId]/notices`
   - Click "Create Notice"
   - Fill in the form:
     - Title: "Important Update"
     - Content: "This is a test notice"
     - Priority: High
     - Show Once: Checked (optional)
     - Enabled: Checked
   - Click "Create Notice"

2. **View Notice (User)**:
   - Navigate to `/homes/[homeId]`
   - The notice should appear automatically in a modal
   - Click "Close" or "Don't show again" (if showOnce is enabled)

3. **Test Scheduling**:
   - Create a notice with `startAt` set to a future date
   - Notice won't appear until that date
   - Create a notice with `endAt` set to a past date
   - Notice won't appear (already expired)

4. **Test Show Once**:
   - Create a notice with `showOnce: true`
   - View it on the home page
   - Click "Don't show again"
   - Refresh the page - notice should not appear again

5. **Test Anonymous Users**:
   - Log out (or use incognito mode)
   - Visit `/homes/[homeId]`
   - Dismiss a showOnce notice
   - Check localStorage for `notice_dismissed_[noticeId]`
   - Refresh - notice should not appear

## Behavior & Logic

### Active Notice Criteria

A notice is considered "active" if:
- `enabled === true`
- `startAt === null OR startAt <= now`
- `endAt === null OR endAt >= now`

### Dismissal Logic

- **Logged-in users**: Dismissal is recorded in the database (`NoticeDismissal` collection)
- **Anonymous users**: Dismissal is stored in `localStorage` with key `notice_dismissed_[noticeId]`
- For `showOnce` notices, dismissed notices are filtered out on subsequent fetches

### Priority Display

- Notices are sorted by priority: high > medium > low
- Highest priority notice is shown first
- Priority affects visual styling (colors, icons)

## Authentication Integration

Currently, authentication is stubbed with comments. To integrate real auth:

1. **Admin Routes**: Add middleware to verify admin session/token
   ```javascript
   // In each admin route handler:
   const adminId = await verifyAdminAuth(req);
   if (!adminId) {
     return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
   }
   ```

2. **User ID Extraction**: Update routes to extract userId from session
   ```javascript
   // In GET /api/homes/[id]/notices:
   const session = await getSession(req);
   const userId = session?.user?.id || null;
   ```

3. **Dismissal Endpoint**: Use session-based userId instead of body parameter
   ```javascript
   // In POST /api/homes/[id]/notices/[nid]/dismiss:
   const session = await getSession(req);
   const userId = session?.user?.id || generateAnonymousToken();
   ```

## Testing Checklist

- [x] Admin creates notice with future startAt → not visible until startAt
- [x] Admin creates notice with endAt past → not shown
- [x] showOnce notice dismissed by logged-in user → not shown next fetch
- [x] showOnce notice dismissed by anonymous user → respects localStorage for that browser
- [x] Creating/editing/deleting notices updates UI in admin panel
- [x] Priority sorting works correctly (high > medium > low)
- [x] Modal is accessible (keyboard navigation, Escape key)
- [x] Multiple notices show highest priority first

## File Structure

```
models/
  ├── HomeNotice.js
  └── NoticeDismissal.js

app/
  ├── api/
  │   ├── homes/
  │   │   └── [id]/
  │   │       └── notices/
  │   │           ├── route.js (GET, POST)
  │   │           └── [nid]/
  │   │               ├── route.js (PUT, DELETE)
  │   │               └── dismiss/
  │   │                   └── route.js (POST)
  │   └── admin/
  │       └── notices/
  │           └── analytics/
  │               └── route.js (GET)
  ├── homes/
  │   └── [id]/
  │       ├── page.js (updated)
  │       └── components/
  │           └── NoticeModal.jsx
  └── admin/
      └── homes/
          └── [id]/
              └── notices/
                  └── page.jsx
```

## Notes

- All dates are timezone-aware (use `new Date()` for parsing)
- HTML content is allowed in notices - validate/sanitize on the API side if needed
- For production, implement proper authentication middleware
- Consider rate limiting for dismissal endpoints
- Analytics endpoint is optional but useful for tracking notice engagement

## Future Enhancements

- Rich text editor for notice content
- Notice templates
- Bulk operations (enable/disable multiple notices)
- Email notifications for high-priority notices
- Notice scheduling calendar view
- A/B testing for notice effectiveness

