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

export function postTypeLabel(type) {
  if (type === 'writing' || type === 'article') return 'Writing';
  if (type === 'project') return 'Project';
  if (type === 'book') return 'Book';
  return 'Post';
}
