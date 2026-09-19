export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila'
  }).format(new Date(value));
}

export function postTitle(post) {
  return post.title?.trim() || post.caption?.trim().split('\n')[0]?.slice(0, 90) || 'Kiocreates post';
}

export function postDescription(post) {
  return post.excerpt?.trim() || post.caption?.replace(/\s+/g, ' ').trim().slice(0, 160) || 'A post from Kiocreates.';
}
