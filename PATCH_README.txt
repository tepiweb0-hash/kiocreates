KIOCREATES PUBLIC — FACEBOOK FEED PATCH

Replace/add these files in the PUBLIC site project:
- components/PostActions.js (new)
- components/PostCard.js
- components/Feed.js
- app/post/[slug]/page.js
- app/globals.css

What this patch changes:
- Public posts are restyled to look much closer to Facebook feed cards.
- Post title is NOT rendered in the public feed or post page (title remains available internally for SEO/CMS).
- Adds persistent Heart/Like state using browser localStorage (per browser/device; no new database table needed).
- Comment opens https://facebook.com/kiocreates.
- Share generates a PNG containing the profile/header, caption, media, and social action row.
- On supported phones/browsers, the PNG is passed to the native share sheet so apps such as Messages/SMS, Messenger, Gmail, etc. can appear as share targets.
- If file sharing is unsupported, the PNG downloads as a fallback and the normal system share sheet/link flow is used where available.
- Feed cards are also tuned for mobile Facebook-like spacing/edge-to-edge behavior.

Important about hearts:
The heart is remembered on the visitor's current browser/device through localStorage. This gives persistent per-device state without a database. A true global public like count across all visitors would require server/database storage.
