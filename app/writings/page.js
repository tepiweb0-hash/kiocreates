import SiteHeader from '../../components/SiteHeader';
import PostCard from '../../components/PostCard';
import { getPosts, getSiteSettings } from '../../lib/data';

export const revalidate = 60;
export const metadata = {
  title: 'Writings',
  description: 'Long-form writings, essays, notes, and articles from Kiocreates.',
  alternates: { canonical: '/writings' }
};

export default async function WritingsPage() {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    getPosts({ type: ['writing', 'article'], limit: 48 })
  ]);
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell wide">
        <div className="pageIntro"><span className="eyebrow">WRITINGS</span><h1>Longer things worth opening.</h1><p>Essays, articles, notes, and other long-form posts from the main feed.</p></div>
        <div className="feedStack">
          {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} compact />) : <div className="emptyState">No published writings yet.</div>}
        </div>
      </main>
    </>
  );
}
