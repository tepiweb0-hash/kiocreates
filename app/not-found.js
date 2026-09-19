import Link from 'next/link';
export default function NotFound() {
  return <main className="notFound"><div className="bigAvatar">K</div><h1>That post isn’t here.</h1><p>It may be unpublished, archived, or the link may be wrong.</p><Link className="primaryButton" href="/">Back to feed</Link></main>;
}
