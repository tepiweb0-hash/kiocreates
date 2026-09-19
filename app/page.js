import Link from 'next/link';
import { cookies } from 'next/headers';
import SiteHeader from '../components/SiteHeader';
import Feed from '../components/Feed';
import { getActiveCtas, getPosts, getSiteSettings } from '../lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'kiocreates.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true }
};

export default async function Home() {
  const [settings, posts, ctas] = await Promise.all([
    getSiteSettings(),
    getPosts({ limit: 12 }),
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
            <Link href="/writings">Writings</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/books">Books</Link>
            <Link href="/about">About</Link>
          </nav>
        </aside>

        <section className="feedColumn" aria-label="Kiocreates feed">
          <div className="composerIntro">
            <div className="avatar">K</div>
            <div>
              <strong>From Kio</strong>
              <p>{settings.intro}</p>
            </div>
          </div>

          <Feed initialPosts={posts} ctas={ctas} settings={settings} seed={seed} />
        </section>

        <aside className="rightRail">
          <div className="sideCard">
            <span className="eyebrow">ABOUT THIS FEED</span>
            <h2>One creator. One feed.</h2>
            <p>Posts, photos, writings, book updates, projects, and occasional promoted posts from Kio.</p>
          </div>
          {settings.contact_email ? (
            <div className="sideCard">
              <span className="eyebrow">WORK WITH KIO</span>
              <p>Have a project or collaboration in mind?</p>
              <a className="primaryButton full" href={`mailto:${settings.contact_email}`}>Get in touch</a>
            </div>
          ) : null}
        </aside>
      </main>
    </>
  );
}
