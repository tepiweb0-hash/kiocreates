import SiteHeader from '../../components/SiteHeader';
import PostCard from '../../components/PostCard';
import { getPosts, getSiteSettings } from '../../lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'Projects',
  description: 'Projects and project updates from the Kiocreates feed.',
  alternates: { canonical: '/projects' }
};

export default async function ProjectsPage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getPosts({ type: 'project', limit: 48 })]);
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell wide">
        <div className="pageIntro"><span className="eyebrow">PROJECTS</span><h1>Projects from the feed.</h1><p>Builds, client work, experiments, and project updates published by Kio.</p></div>
        <div className="feedStack">
          {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} compact />) : <div className="emptyState">No published projects yet.</div>}
        </div>
      </main>
    </>
  );
}
