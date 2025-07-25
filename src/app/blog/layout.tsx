import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev";

export const metadata: Metadata = {
  title: {
    template: "%s | Alex Morgan's Blog",
    default: "Technical Blog | Alex Morgan - Full Stack Developer",
  },
  description:
    "In-depth articles on web development, React, Next.js, 3D web experiences, and modern frontend technologies.",
  openGraph: {
    type: "website",
    siteName: "Alex Morgan's Blog",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@alexmorgan_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // RSS Feed Discovery
    rss: `${baseUrl}/blog/rss.xml`,
    atom: `${baseUrl}/blog/atom.xml`,
    "json-feed": `${baseUrl}/blog/feed.json`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Feed Discovery Links */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href={`${baseUrl}/blog/rss.xml`}
      />
      <link
        rel="alternate"
        type="application/atom+xml"
        title="Atom Feed"
        href={`${baseUrl}/blog/atom.xml`}
      />
      <link
        rel="alternate"
        type="application/json"
        title="JSON Feed"
        href={`${baseUrl}/blog/feed.json`}
      />

      {/* Print Styles */}
      <link rel="stylesheet" href="/styles/print.css" media="print" />

      <div className="min-h-screen">{children}</div>
    </>
  );
}
