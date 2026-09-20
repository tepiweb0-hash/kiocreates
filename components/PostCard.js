'use client';

import Link from 'next/link';
import MediaGrid from './MediaGrid';
import PostActions from './PostActions';
import { formatDate } from '../lib/format';

export default function PostCard({ post, compact = false, settings = {} }) {
  const href = `/post/${post.slug}`;
  const author = String(settings.brand_name || 'kiocreates').replace(/\.$/, '');
  return (
    <article className={`feedCard postCard facebookPost type-${post.type || 'post'}`}>
      <div className="cardHeader facebookHeader">
        <div className="avatar facebookAvatar" aria-hidden="true">K</div>
        <div className="identity">
          <a href="https://facebook.com/kiocreates" target="_blank" rel="noreferrer" className="author facebookAuthor">{author}</a>
          <Link href={href} className="meta facebookMeta">{formatDate(post.published_at)} · <span aria-label="Public">◉</span></Link>
        </div>
        <button className="postMenuButton" aria-label="Post menu" type="button">•••</button>
      </div>

      <Link href={href} className="facebookCaptionLink">
        <p className={`caption facebookCaption ${compact ? 'clamp' : ''}`}>{post.caption}</p>
      </Link>

      <MediaGrid media={post.media} cover={post.cover} />
      <PostActions post={post} authorName={author} />
    </article>
  );
}
