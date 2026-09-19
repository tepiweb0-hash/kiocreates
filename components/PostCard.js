'use client';

import Link from 'next/link';
import MediaGrid from './MediaGrid';
import ShareActions from './ShareActions';
import { formatDate, postTypeLabel } from '../lib/format';

export default function PostCard({ post, compact = false }) {
  const href = `/post/${post.slug}`;
  const typeLabel = postTypeLabel(post.type);
  return (
    <article className={`feedCard postCard type-${post.type || 'post'}`}>
      <div className="cardHeader">
        <div className="avatar" aria-hidden="true">K</div>
        <div className="identity">
          <Link href={href} className="author">kiocreates.</Link>
          <div className="meta">{formatDate(post.published_at)} · Public</div>
        </div>
        {typeLabel !== 'Post' ? <span className="pill">{typeLabel}</span> : null}
      </div>

      <Link href={href} className="postBodyLink">
        {post.title ? <h2 className="postTitle">{post.title}</h2> : null}
        <p className={`caption ${compact ? 'clamp' : ''}`}>{post.caption}</p>
        {compact && ['writing', 'article', 'book'].includes(post.type) ? <span className="readMore">Continue reading →</span> : null}
      </Link>

      <MediaGrid media={post.media} cover={post.cover} />

      {post.type === 'project' && post.project_meta?.client ? (
        <div className="projectStrip">
          <span>Project</span>
          <strong>{post.project_meta.client}</strong>
          {post.project_meta.project_type ? <small>{post.project_meta.project_type}</small> : null}
        </div>
      ) : null}

      {post.type === 'book' && (post.content_meta?.book_title || post.content_meta?.chapter_label) ? (
        <div className="projectStrip contentStrip">
          <span>{post.content_meta?.entry_type || 'Book'}</span>
          <strong>{post.content_meta?.book_title || post.title}</strong>
          {post.content_meta?.chapter_label ? <small>{post.content_meta.chapter_label}</small> : null}
        </div>
      ) : null}

      <div className="cardFooter">
        <Link href={href} className="actionLink">Open post</Link>
        <ShareActions post={post} compact />
      </div>
    </article>
  );
}
