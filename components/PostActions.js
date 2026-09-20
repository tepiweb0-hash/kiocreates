'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../lib/format';
import { trackEvent } from './analytics';

const FACEBOOK_PAGE = 'https://facebook.com/kiocreates';

function uniqueMedia(post) {
  const items = [];
  const seen = new Set();
  for (const item of [post.cover, ...(post.media || [])]) {
    if (!item?.public_url || item.media_type === 'video' || seen.has(item.public_url)) continue;
    seen.add(item.public_url);
    items.push(item);
  }
  return items.slice(0, 4);
}

function wrapText(ctx, text, maxWidth) {
  const out = [];
  for (const paragraph of String(text || '').split('\n')) {
    if (!paragraph) {
      out.push('');
      continue;
    }
    const words = paragraph.split(/\s+/);
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

async function loadImage(url) {
  try {
    const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
    if (!response.ok) throw new Error('image fetch failed');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = objectUrl;
    });
    URL.revokeObjectURL(objectUrl);
    return image;
  } catch {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
}

function drawCover(ctx, img, x, y, w, h) {
  const ratio = Math.max(w / img.width, h / img.height);
  const sw = w / ratio;
  const sh = h / ratio;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function buildPostPng(post, authorName = 'kiocreates') {
  const width = 1080;
  const pad = 56;
  const contentWidth = width - pad * 2;
  const captionFont = 34;
  const captionLine = 47;

  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `500 ${captionFont}px Arial, sans-serif`;
  const captionLines = wrapText(measure, post.caption || '', contentWidth);
  const captionHeight = Math.max(captionLine, captionLines.length * captionLine);

  const media = uniqueMedia(post);
  const mediaGap = media.length ? 36 : 0;
  let mediaHeight = 0;
  if (media.length === 1) mediaHeight = 760;
  if (media.length === 2) mediaHeight = 520;
  if (media.length >= 3) mediaHeight = 720;

  const headerHeight = 96;
  const actionsHeight = 110;
  const height = Math.max(520, pad + headerHeight + 28 + captionHeight + mediaGap + mediaHeight + 32 + actionsHeight + pad);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header / profile
  const avatar = 66;
  const avatarX = pad + avatar / 2;
  const avatarY = pad + avatar / 2;
  ctx.fillStyle = '#645cff';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatar / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 30px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', avatarX, avatarY + 1);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#15171a';
  ctx.font = '800 32px Arial, sans-serif';
  ctx.fillText(String(authorName || 'kiocreates').replace(/\.$/, ''), pad + avatar + 20, pad + 31);
  ctx.fillStyle = '#65676b';
  ctx.font = '500 22px Arial, sans-serif';
  ctx.fillText(`${formatDate(post.published_at)}  ·  Public`, pad + avatar + 20, pad + 63);

  let y = pad + headerHeight + 18;
  ctx.fillStyle = '#15171a';
  ctx.font = `500 ${captionFont}px Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (const line of captionLines) {
    ctx.fillText(line, pad, y);
    y += captionLine;
  }

  if (media.length) {
    y += mediaGap;
    const loaded = [];
    for (const item of media) {
      try { loaded.push(await loadImage(item.public_url)); } catch { loaded.push(null); }
    }
    const valid = loaded.filter(Boolean);
    if (valid.length === 1) {
      drawCover(ctx, valid[0], 0, y, width, mediaHeight);
    } else if (valid.length === 2) {
      const gap = 4;
      const cell = (width - gap) / 2;
      drawCover(ctx, valid[0], 0, y, cell, mediaHeight);
      drawCover(ctx, valid[1], cell + gap, y, cell, mediaHeight);
    } else if (valid.length >= 3) {
      const gap = 4;
      const leftW = width * 0.58;
      const rightW = width - leftW - gap;
      drawCover(ctx, valid[0], 0, y, leftW, mediaHeight);
      const rows = valid.length === 3 ? 2 : 3;
      const cellH = (mediaHeight - gap * (rows - 1)) / rows;
      for (let i = 1; i < valid.length; i++) {
        drawCover(ctx, valid[i], leftW + gap, y + (i - 1) * (cellH + gap), rightW, cellH);
      }
    }
    y += mediaHeight;
  }

  // Facebook-like action row in the exported PNG
  y += 34;
  ctx.strokeStyle = '#e4e6eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(width - pad, y);
  ctx.stroke();
  y += 52;
  ctx.textBaseline = 'middle';
  ctx.font = '700 28px Arial, sans-serif';
  ctx.fillStyle = '#65676b';
  ctx.textAlign = 'center';
  ctx.fillText('♡  Like', width * 0.18, y);
  ctx.fillText('◯  Comment', width * 0.50, y);
  ctx.fillText('↗  Share', width * 0.82, y);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png', 1);
  });
}

export default function PostActions({ post, authorName = 'kiocreates' }) {
  const storageKey = useMemo(() => `kiocreates:hearted:${post.id}`, [post.id]);
  const [liked, setLiked] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    try { setLiked(window.localStorage.getItem(storageKey) === '1'); } catch {}
  }, [storageKey]);

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    try {
      if (next) window.localStorage.setItem(storageKey, '1');
      else window.localStorage.removeItem(storageKey);
    } catch {}
  }

  function comment() {
    trackEvent('outbound_click', 'post', post.id, FACEBOOK_PAGE);
    window.open(FACEBOOK_PAGE, '_blank', 'noopener,noreferrer');
  }

  async function share() {
    if (sharing) return;
    setSharing(true);
    setStatus('Preparing PNG…');
    try {
      const blob = await buildPostPng(post, authorName);
      const file = new File([blob], `kiocreates-${post.slug || post.id}.png`, { type: 'image/png' });
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const postUrl = `${siteUrl}/post/${post.slug}`;
      const shareData = { title: 'kiocreates', text: post.caption || '', url: postUrl, files: [file] };

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share(shareData);
        setStatus('');
        return;
      }

      if (navigator.share) {
        // Fallback share sheet without file support. PNG is downloaded so it can still be attached manually.
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
        await navigator.share({ title: 'kiocreates', text: post.caption || '', url: postUrl });
        setStatus('PNG downloaded');
        setTimeout(() => setStatus(''), 1800);
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
      setStatus('PNG downloaded');
      setTimeout(() => setStatus(''), 1800);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setStatus('Could not share');
        setTimeout(() => setStatus(''), 1800);
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className={`reactionSummary ${liked ? 'show' : ''}`} aria-live="polite">
        {liked ? <><span className="reactionBubble">♥</span><span>You</span></> : null}
      </div>
      <div className="fbActionRow">
        <button className={`fbAction ${liked ? 'liked' : ''}`} onClick={toggleLike} aria-pressed={liked}>
          <span className="actionIcon">{liked ? '♥' : '♡'}</span><span>{liked ? 'Liked' : 'Like'}</span>
        </button>
        <button className="fbAction" onClick={comment}>
          <span className="actionIcon commentIcon">◯</span><span>Comment</span>
        </button>
        <button className="fbAction" onClick={share} disabled={sharing}>
          <span className="actionIcon">↗</span><span>{sharing ? 'Preparing…' : 'Share'}</span>
        </button>
      </div>
      {status ? <div className="postActionStatus" role="status">{status}</div> : null}
    </>
  );
}
