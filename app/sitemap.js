import { getSitemapPosts } from '../lib/data';

export const revalidate = 60;

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiocreates.vercel.app';
  const posts = await getSitemapPosts();
  const staticPages = [
    { url: `${base}/`, priority: 1, changeFrequency: 'daily' },
    { url: `${base}/projects`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/about`, priority: 0.6, changeFrequency: 'monthly' }
  ];
  return [
    ...staticPages,
    ...posts.map((post) => ({
      url: `${base}/post/${post.slug}`,
      lastModified: post.updated_at || post.published_at,
      changeFrequency: 'monthly',
      priority: post.type === 'project' ? 0.8 : 0.7
    }))
  ];
}
