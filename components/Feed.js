'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PostCard from './PostCard';
import CtaCard from './CtaCard';
import { mixFeed } from '../lib/feed';

export default function Feed({ initialPosts, ctas, settings, seed }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  const sentinel = useRef(null);

  const items = useMemo(() => mixFeed(posts, ctas, settings, seed), [posts, ctas, settings, seed]);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ offset: String(posts.length), limit: '12' });
      const res = await fetch(`/api/feed?${params.toString()}`);
      const data = await res.json();
      const next = data.posts || [];
      setPosts((old) => [...old, ...next]);
      if (next.length < 12) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sentinel.current || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '500px' });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [posts.length, hasMore, loading]);

  if (!posts.length) {
    return <div className="emptyState">No published posts yet. Check back soon.</div>;
  }

  return (
    <div className="feedStack">
      {items.map((item, index) => item.kind === 'post'
        ? <PostCard key={`p-${item.data.id}`} post={item.data} compact />
        : <CtaCard key={`c-${item.data.id}-${index}`} cta={item.data} />
      )}
      <div ref={sentinel} className="feedSentinel" aria-hidden="true" />
      {loading ? <div className="loadingMore">Loading more…</div> : null}
      {!hasMore ? <div className="endOfFeed">You’re all caught up.</div> : null}
    </div>
  );
}
