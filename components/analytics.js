export function getSessionHash() {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem('kio_session_id');
  if (!id) {
    id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem('kio_session_id', id);
  }
  return id;
}

export async function trackEvent(eventType, entityType, entityId = null, path = null) {
  try {
    const session_hash = getSessionHash();
    if (!session_hash) return;
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, entity_type: entityType, entity_id: entityId, session_hash, path })
    });
  } catch (_) {}
}
