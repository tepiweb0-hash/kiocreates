import Link from 'next/link';

export default function SiteHeader({ brand = 'kiocreates.' }) {
  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link href="/" className="brand">{brand}</Link>
        <nav className="topnav" aria-label="Main navigation">
          <Link href="/">Feed</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
