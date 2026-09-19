import SiteHeader from '../../components/SiteHeader';
import PostCard from '../../components/PostCard';
import { getPosts, getSiteSettings } from '../../lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'Projects',
  description: 'Selected projects and build notes from Kiocreates.',
  alternates: { canonical: '/projects' }
};

export default async function ProjectsPage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getPosts({ type: 'project', limit: 48 })]);
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell wide">
        <div className="pageIntro"><span className="eyebrow">PROJECTS</span><h1>Things I’ve built.</h1><p>Selected work, experiments, and build notes from the feed.</p></div>
        <div className="feedStack">
          {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} compact />) : <div className="emptyState">No published projects yet.</div>}
        </div>
      </main>
    </>
  );
}
