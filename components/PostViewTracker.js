'use client';
import { useEffect } from 'react';
import { trackEvent } from './analytics';
export default function PostViewTracker({ postId, slug }) {
  useEffect(() => { trackEvent('post_view', 'post', postId, `/post/${slug}`); }, [postId, slug]);
  return null;
}
