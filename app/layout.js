import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiocreates.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'kiocreates.', template: '%s | kiocreates.' },
  description: 'A creator feed of things Kio makes, builds, and learns.',
  applicationName: 'kiocreates.',
  openGraph: {
    type: 'website',
    siteName: 'kiocreates.',
    title: 'kiocreates.',
    description: 'A creator feed of things Kio makes, builds, and learns.',
    url: siteUrl
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
