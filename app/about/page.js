import SiteHeader from '../../components/SiteHeader';
import { getSiteSettings } from '../../lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'About',
  description: 'About Kio and Kiocreates.',
  alternates: { canonical: '/about' }
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader brand={settings.brand_name} />
      <main className="singlePageShell">
        <section className="aboutHero">
          <div className="bigAvatar">K</div>
          <span className="eyebrow">ABOUT</span>
          <h1>{settings.display_name} creates things.</h1>
          <p className="largeText">{settings.bio}</p>
          <p>{settings.intro}</p>
          <div className="socialLinks">
            {settings.facebook_url ? <a href={settings.facebook_url} rel="noopener noreferrer">Facebook</a> : null}
            {settings.instagram_url ? <a href={settings.instagram_url} rel="noopener noreferrer">Instagram</a> : null}
            {settings.contact_email ? <a href={`mailto:${settings.contact_email}`}>Email</a> : null}
          </div>
        </section>
      </main>
    </>
  );
}
