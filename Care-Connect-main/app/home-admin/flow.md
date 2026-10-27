✅ Flow Summary

HomeAdmin goes to /home-admin/login.

Enters email & password → /api/home-admin/login validates and returns JWT + admin + home details.

Data stored in localStorage (we can later move to NextAuth/session).

Redirect to /home-admin/dashboard.

Dashboard displays:

HomeAdmin details.

Associated Home details.

Create + list requests (integrated with our existing /api/homes/[id]/requests).