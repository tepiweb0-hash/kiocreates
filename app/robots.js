export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiocreates.vercel.app';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
