import Link from 'next/link';
import { cookies } from 'next/headers';
import SiteHeader from '../components/SiteHeader';
import Feed from '../components/Feed';
import { getActiveCtas, getCategories, getPosts, getSiteSettings } from '../lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === 'string' ? params.category : '';
  return {
    title: category ? `Feed · ${category.replaceAll('-', ' ')}` : 'kiocreates.',
    alternates: { canonical: '/' },
    robots: category ? { index: false, follow: true } : { index: true, follow: true }
  };
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === 'string' ? params.category : '';
  const [settings, categories, posts, ctas] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getPosts({ category: category || null, limit: 12 }),
    getActiveCtas()
  ]);
  const cookieStore = await cookies();
  const seed = Number(cookieStore.get('kio_feed_seed')?.value || 1);

  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="pageShell threeColumn">
        <aside className="leftRail">
          <div className="profileCard">
            <div className="bigAvatar">K</div>
            <h1>{settings.display_name}</h1>
            <p className="handle">{settings.handle}</p>
            <p>{settings.bio}</p>
          </div>
          <nav className="railNav" aria-label="Feed sections">
            <Link href="/">Home feed</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
          </nav>
        </aside>

        <section className="feedColumn" aria-label="Kiocreates feed">
          <div className="composerIntro">
            <div className="avatar">K</div>
            <div>
              <strong>What’s Kio creating?</strong>
              <p>{settings.intro}</p>
            </div>
          </div>

          <div className="categoryBar" aria-label="Filter posts by category">
            <Link className={!category ? 'active' : ''} href="/">All</Link>
            {categories.map((item) => (
              <Link className={category === item.slug ? 'active' : ''} href={`/?category=${item.slug}`} key={item.id}>{item.name}</Link>
            ))}
          </div>

          <Feed initialPosts={posts} ctas={ctas} settings={settings} seed={seed} category={category} />
        </section>

        <aside className="rightRail">
          <div className="sideCard">
            <span className="eyebrow">ABOUT THIS FEED</span>
            <h2>One creator. One feed.</h2>
            <p>Projects, experiments, updates, and occasional promoted posts from Kiocreates.</p>
          </div>
          {settings.contact_email ? (
            <div className="sideCard">
              <span className="eyebrow">WORK WITH KIO</span>
              <p>Have a project in mind?</p>
              <a className="primaryButton full" href={`mailto:${settings.contact_email}`}>Get in touch</a>
            </div>
          ) : null}
        </aside>
      </main>
    </>
  );
}
