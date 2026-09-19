import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import MediaGrid from '../../../components/MediaGrid';
import ShareActions from '../../../components/ShareActions';
import PostViewTracker from '../../../components/PostViewTracker';
import { getPostBySlug, getSiteSettings } from '../../../lib/data';
import { formatDate, postDescription, postTitle } from '../../../lib/format';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };
  const title = postTitle(post);
  const description = postDescription(post);
  const image = post.cover?.public_url || post.media?.[0]?.public_url;
  return {
    title,
    description,
    alternates: { canonical: `/post/${post.slug}` },
    openGraph: {
      type: 'article', title, description, url: `/post/${post.slug}`,
      publishedTime: post.published_at,
      images: image ? [{ url: image }] : undefined
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined }
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  const title = postTitle(post);
  const description = postDescription(post);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiocreates.vercel.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.type === 'article' ? 'Article' : 'SocialMediaPosting',
    headline: title,
    articleBody: post.caption,
    datePublished: post.published_at,
    author: { '@type': 'Person', name: settings.display_name },
    url: `${siteUrl}/post/${post.slug}`,
    description
  };
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell">
        <Link href="/" className="backLink">← Back to feed</Link>
        <article className="feedCard postDetail">
          <div className="cardHeader">
            <div className="avatar">K</div>
            <div className="identity">
              <strong className="author">{settings.brand_name}</strong>
              <div className="meta">{formatDate(post.published_at)} · Public</div>
            </div>
            {post.category?.name ? <span className="pill">{post.category.name}</span> : null}
          </div>
          {post.title ? <h1 className="detailTitle">{post.title}</h1> : null}
          <div className="detailCaption">{post.caption}</div>
          <MediaGrid media={post.media} cover={post.cover} />
          {post.type === 'project' && Object.keys(post.project_meta || {}).length ? (
            <div className="projectDetails">
              {Object.entries(post.project_meta).filter(([,value]) => value).map(([key,value]) => (
                <div key={key}><span>{key.replaceAll('_',' ')}</span><strong>{String(value)}</strong></div>
              ))}
            </div>
          ) : null}
          {post.facebook_share_enabled ? <ShareActions post={post} /> : null}
        </article>
      </main>
      <PostViewTracker postId={post.id} slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
