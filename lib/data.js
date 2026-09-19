import { getPublicSupabase } from './supabase';

const POST_SELECT = `
  id, slug, type, title, caption, excerpt, published_at, project_meta, facebook_share_enabled,
  category:categories(id, slug, name),
  cover:media!posts_cover_media_id_fkey(id, public_url, media_type, alt_text),
  post_media(position, media:media!post_media_media_id_fkey(id, public_url, media_type, alt_text))
`;

export async function getSiteSettings() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase.from('site_settings').select('*').eq('singleton', true).maybeSingle();
  if (error) throw error;
  return data || {
    brand_name: 'kiocreates.', display_name: 'Kio', handle: '@kiocreates',
    intro: 'A feed of things I make, build, and learn.', bio: 'Creator, builder, and web tinkerer.',
    cta_enabled: true, cta_min_gap: 2, cta_max_gap: 4
  };
}

export async function getCategories() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase.from('categories').select('id,slug,name,sort_order').eq('active', true).order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getPosts({ offset = 0, limit = 12, category = null, type = null } = {}) {
  const supabase = getPublicSupabase();
  let query = supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).maybeSingle();
    if (!cat) return [];
    query = query.eq('category_id', cat.id);
  }
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) throw error;
  return normalizePosts(data || []);
}

export async function getPostBySlug(slug) {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data ? normalizePosts([data])[0] : null;
}

export async function getActiveCtas() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('cta_posts')
    .select(`id,name,headline,body,button_label,button_url,weight,starts_at,ends_at,media:media!cta_posts_media_id_fkey(id,public_url,media_type,alt_text)`)
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSitemapPosts() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select('slug,updated_at,published_at,type')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

function normalizePosts(posts) {
  return posts.map((post) => ({
    ...post,
    media: (post.post_media || [])
      .sort((a, b) => a.position - b.position)
      .map((item) => item.media)
      .filter(Boolean)
  }));
}
