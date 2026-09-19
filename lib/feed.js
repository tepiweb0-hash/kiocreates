export function createSeededRandom(seedValue) {
  let seed = (Number(seedValue) || 1) >>> 0;
  return function random() {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mixFeed(posts, ctas, settings, seedValue) {
  if (!settings?.cta_enabled || !ctas?.length) return posts.map((post) => ({ kind: 'post', data: post }));
  const random = createSeededRandom(seedValue);
  const minGap = Math.max(1, Number(settings.cta_min_gap) || 2);
  const maxGap = Math.max(minGap, Number(settings.cta_max_gap) || 4);
  const weighted = [];
  for (const cta of ctas) {
    const repetitions = Math.min(20, Math.max(1, Number(cta.weight) || 1));
    for (let i = 0; i < repetitions; i++) weighted.push(cta);
  }
  const feed = [];
  let sinceCta = 0;
  let nextGap = minGap + Math.floor(random() * (maxGap - minGap + 1));
  let lastCtaId = null;

  for (const post of posts) {
    feed.push({ kind: 'post', data: post });
    sinceCta += 1;
    if (sinceCta >= nextGap && weighted.length) {
      let candidates = weighted.filter((item) => item.id !== lastCtaId);
      if (!candidates.length) candidates = weighted;
      const cta = candidates[Math.floor(random() * candidates.length)];
      feed.push({ kind: 'cta', data: cta });
      lastCtaId = cta.id;
      sinceCta = 0;
      nextGap = minGap + Math.floor(random() * (maxGap - minGap + 1));
    }
  }
  return feed;
}
