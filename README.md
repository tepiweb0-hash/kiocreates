# kiocreates-public

Public creator feed for `https://kiocreates.vercel.app`.

## Vercel environment variables

Copy `.env.example` values into Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL=https://kiocreates.vercel.app`
- `REVALIDATE_SECRET` (same secret used by Studio)

## Notes

- Public app is read-only through Supabase RLS.
- Feed is server-rendered and crawlable.
- CTA posts are inserted after a seeded 2–4 post gap by default.
- `/sitemap.xml` is dynamic and contains published posts.
- `/robots.txt` allows public pages and excludes `/api/`.
- Individual posts have canonical URLs and Open Graph metadata for Facebook sharing.

## Google Search Console

The site exposes a dynamic `/sitemap.xml` and `/robots.txt`. For URL-prefix verification, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to Google's meta-tag token, redeploy, then submit:

`https://kiocreates.vercel.app/sitemap.xml`
