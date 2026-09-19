'use client';

import Link from 'next/link';
import MediaGrid from './MediaGrid';
import ShareActions from './ShareActions';
import { formatDate } from '../lib/format';

export default function PostCard({ post, compact = false }) {
  const href = `/post/${post.slug}`;
  return (
    <article className="feedCard postCard">
      <div className="cardHeader">
        <div className="avatar" aria-hidden="true">K</div>
        <div className="identity">
          <Link href={href} className="author">kiocreates.</Link>
          <div className="meta">{formatDate(post.published_at)} · Public</div>
        </div>
        {post.category?.name ? <span className="pill">{post.category.name}</span> : null}
      </div>

      <Link href={href} className="postBodyLink">
        {post.title ? <h2 className="postTitle">{post.title}</h2> : null}
        <p className={`caption ${compact ? 'clamp' : ''}`}>{post.caption}</p>
      </Link>

      <MediaGrid media={post.media} cover={post.cover} />

      {post.type === 'project' && post.project_meta?.client ? (
        <div className="projectStrip">
          <span>Project</span>
          <strong>{post.project_meta.client}</strong>
          {post.project_meta.project_type ? <small>{post.project_meta.project_type}</small> : null}
        </div>
      ) : null}

      <div className="cardFooter">
        <Link href={href} className="actionLink">Open post</Link>
        <ShareActions post={post} compact />
      </div>
    </article>
  );
}
