'use client';

import { useState } from 'react';
import { trackEvent } from './analytics';

export default function ShareActions({ post, compact = false }) {
  const [copied, setCopied] = useState('');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiocreates.vercel.app';
  const postUrl = `${siteUrl}/post/${post.slug}`;

  function facebook() {
    trackEvent('facebook_share', 'post', post.id, `/post/${post.slug}`);
    const share = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(share, 'facebook-share', 'width=760,height=680,noopener,noreferrer');
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(post.caption || '');
    setCopied('Caption copied');
    trackEvent('copy_caption', 'post', post.id, `/post/${post.slug}`);
    setTimeout(() => setCopied(''), 1800);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(postUrl);
    setCopied('Link copied');
    trackEvent('copy_link', 'post', post.id, `/post/${post.slug}`);
    setTimeout(() => setCopied(''), 1800);
  }

  if (compact) {
    return <button className="textButton" onClick={facebook}>Share</button>;
  }

  return (
    <div className="shareActions">
      <button className="primaryButton" onClick={facebook}>Share to Facebook</button>
      <button className="secondaryButton" onClick={copyCaption}>Copy Caption</button>
      <button className="secondaryButton" onClick={copyLink}>Copy Link</button>
      {copied ? <span className="copyStatus" role="status">{copied}</span> : null}
    </div>
  );
}
