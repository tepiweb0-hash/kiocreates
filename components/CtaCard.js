'use client';

import { useEffect } from 'react';
import { trackEvent } from './analytics';

export default function CtaCard({ cta }) {
  useEffect(() => {
    const key = `cta_seen_${cta.id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      trackEvent('cta_impression', 'cta', cta.id, window.location.pathname);
    }
  }, [cta.id]);

  return (
    <article className="feedCard ctaCard">
      <div className="cardHeader">
        <div className="avatar promotedAvatar" aria-hidden="true">K</div>
        <div className="identity">
          <strong className="author">kiocreates.</strong>
          <div className="meta">Promoted · Public</div>
        </div>
        <span className="pill promotedPill">CTA</span>
      </div>
      <div className="ctaCopy">
        <h2>{cta.headline}</h2>
        <p>{cta.body}</p>
      </div>
      {cta.media?.public_url ? (
        cta.media.media_type === 'video'
          ? <video className="ctaMedia" controls preload="metadata" src={cta.media.public_url} />
          : <img className="ctaMedia" src={cta.media.public_url} alt={cta.media.alt_text || ''} loading="lazy" />
      ) : null}
      <div className="ctaActionRow">
        <a
          href={cta.button_url}
          className="primaryButton"
          onClick={() => trackEvent('cta_click', 'cta', cta.id, window.location.pathname)}
        >{cta.button_label}</a>
      </div>
    </article>
  );
}
