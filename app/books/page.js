import SiteHeader from '../../components/SiteHeader';
import PostCard from '../../components/PostCard';
import { getPosts, getSiteSettings } from '../../lib/data';

export const revalidate = 60;
export const metadata = {
  title: 'Books',
  description: 'Book updates, excerpts, chapters, and notes from Kiocreates.',
  alternates: { canonical: '/books' }
};

export default async function BooksPage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getPosts({ type: 'book', limit: 48 })]);
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell wide">
        <div className="pageIntro"><span className="eyebrow">BOOKS</span><h1>Books, chapters, and updates.</h1><p>Book-related posts still live in the same Kiocreates feed, with a dedicated place when you want to browse them.</p></div>
        <div className="feedStack">
          {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} compact />) : <div className="emptyState">No published book posts yet.</div>}
        </div>
      </main>
    </>
  );
}
