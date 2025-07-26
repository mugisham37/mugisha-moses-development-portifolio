import { getPublishedBlogPosts } from "./content-loader";
import type { BlogPost } from "@/types";

interface RSSConfig {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  author: {
    name: string;
    email: string;
    url: string;
  };
  language: string;
  copyright: string;
  managingEditor: string;
  webMaster: string;
  category: string;
  ttl: number;
  image?: {
    url: string;
    title: string;
    link: string;
    width?: number;
    height?: number;
  };
}

const defaultConfig: RSSConfig = {
  title: "Alex Morgan's Technical Blog",
  description:
    "In-depth articles on web development, React, Next.js, 3D web experiences, and modern frontend technologies.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev",
  feedUrl: `${
    process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev"
  }/blog/rss.xml`,
  author: {
    name: "Alex Morgan",
    email: "alex@alexmorgan.dev",
    url: "https://alexmorgan.dev",
  },
  language: "en-US",
  copyright: `© ${new Date().getFullYear()} Alex Morgan. All rights reserved.`,
  managingEditor: "alex@alexmorgan.dev (Alex Morgan)",
  webMaster: "alex@alexmorgan.dev (Alex Morgan)",
  category: "Technology/Web Development",
  ttl: 60, // 1 hour
  image: {
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev"
    }/images/blog-logo.png`,
    title: "Alex Morgan's Technical Blog",
    link: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev"
    }/blog`,
    width: 144,
    height: 144,
  },
};

export class RSSGenerator {
  private config: RSSConfig;

  constructor(config: Partial<RSSConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Generate RSS 2.0 feed
  async generateRSS(): Promise<string> {
    const posts = await getPublishedBlogPosts();
    const latestPosts = posts.slice(0, 20); // Limit to 20 most recent posts

    const rssItems = latestPosts
      .map((post) => this.generateRSSItem(post))
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title><![CDATA[${this.config.title}]]></title>
    <description><![CDATA[${this.config.description}]]></description>
    <link>${this.config.siteUrl}/blog</link>
    <atom:link href="${
      this.config.feedUrl
    }" rel="self" type="application/rss+xml" />
    <language>${this.config.language}</language>
    <copyright><![CDATA[${this.config.copyright}]]></copyright>
    <managingEditor><![CDATA[${this.config.managingEditor}]]></managingEditor>
    <webMaster><![CDATA[${this.config.webMaster}]]></webMaster>
    <category><![CDATA[${this.config.category}]]></category>
    <generator>Next.js RSS Generator</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <cloud domain="rpc.sys.com" port="80" path="/RPC2" registerProcedure="pingMe" protocol="soap"/>
    <ttl>${this.config.ttl}</ttl>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${
      latestPosts.length > 0 && latestPosts[0]
        ? latestPosts[0].publishedAt.toUTCString()
        : new Date().toUTCString()
    }</pubDate>
    ${
      this.config.image
        ? `
    <image>
      <url>${this.config.image.url}</url>
      <title><![CDATA[${this.config.image.title}]]></title>
      <link>${this.config.image.link}</link>
      ${
        this.config.image.width
          ? `<width>${this.config.image.width}</width>`
          : ""
      }
      ${
        this.config.image.height
          ? `<height>${this.config.image.height}</height>`
          : ""
      }
      <description><![CDATA[${this.config.description}]]></description>
    </image>`
        : ""
    }
    ${rssItems}
  </channel>
</rss>`;

    return rss;
  }

  // Generate Atom feed
  async generateAtom(): Promise<string> {
    const posts = await getPublishedBlogPosts();
    const latestPosts = posts.slice(0, 20);

    const atomEntries = latestPosts
      .map((post) => this.generateAtomEntry(post))
      .join("\n");

    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title><![CDATA[${this.config.title}]]></title>
  <subtitle><![CDATA[${this.config.description}]]></subtitle>
  <link href="${this.config.siteUrl}/blog" rel="alternate" type="text/html"/>
  <link href="${this.config.feedUrl.replace(
    ".xml",
    ".atom"
  )}" rel="self" type="application/atom+xml"/>
  <id>${this.config.siteUrl}/blog</id>
  <updated>${
    latestPosts.length > 0 && latestPosts[0]
      ? latestPosts[0].publishedAt.toISOString()
      : new Date().toISOString()
  }</updated>
  <rights><![CDATA[${this.config.copyright}]]></rights>
  <generator uri="https://nextjs.org/" version="15.0">Next.js</generator>
  <author>
    <name>${this.config.author.name}</name>
    <email>${this.config.author.email}</email>
    <uri>${this.config.author.url}</uri>
  </author>
  ${
    this.config.image
      ? `
  <logo>${this.config.image.url}</logo>
  <icon>${this.config.image.url}</icon>`
      : ""
  }
  ${atomEntries}
</feed>`;

    return atom;
  }

  // Generate JSON Feed
  async generateJSONFeed(): Promise<string> {
    const posts = await getPublishedBlogPosts();
    const latestPosts = posts.slice(0, 20);

    const jsonFeed = {
      version: "https://jsonfeed.org/version/1.1",
      title: this.config.title,
      description: this.config.description,
      home_page_url: `${this.config.siteUrl}/blog`,
      feed_url: this.config.feedUrl.replace(".xml", ".json"),
      language: this.config.language,
      author: {
        name: this.config.author.name,
        url: this.config.author.url,
        avatar: `${this.config.siteUrl}/images/author-avatar.jpg`,
      },
      icon: this.config.image?.url,
      favicon: `${this.config.siteUrl}/favicon.ico`,
      items: latestPosts.map((post) => this.generateJSONFeedItem(post)),
    };

    return JSON.stringify(jsonFeed, null, 2);
  }

  // Generate sitemap for blog posts
  async generateSitemap(): Promise<string> {
    const posts = await getPublishedBlogPosts();

    const urlEntries = posts
      .map(
        (post) => `
  <url>
    <loc>${this.config.siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${this.config.siteUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urlEntries}
</urlset>`;

    return sitemap;
  }

  private generateRSSItem(post: BlogPost): string {
    const postUrl = `${this.config.siteUrl}/blog/${post.slug}`;
    const content = this.stripMDX(post.content);
    const excerpt = post.excerpt || content.substring(0, 300) + "...";

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${excerpt}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.author.name}]]></dc:creator>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags
        .map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("\n      ")}
      ${
        post.coverImage
          ? `<enclosure url="${post.coverImage.src}" type="image/jpeg" length="0"/>`
          : ""
      }
      <source url="${this.config.feedUrl}">${this.config.title}</source>
      <comments>${postUrl}#comments</comments>
      <wfw:commentRss>${postUrl}/feed</wfw:commentRss>
      <slash:comments>0</slash:comments>
    </item>`;
  }

  private generateAtomEntry(post: BlogPost): string {
    const postUrl = `${this.config.siteUrl}/blog/${post.slug}`;
    const content = this.stripMDX(post.content);

    return `  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <published>${post.publishedAt.toISOString()}</published>
    <updated>${post.updatedAt.toISOString()}</updated>
    <author>
      <name>${post.author.name}</name>
      <email>${this.config.author.email}</email>
      <uri>${this.config.author.url}</uri>
    </author>
    <category term="${post.category}" scheme="${
      this.config.siteUrl
    }/blog/categories"/>
    ${post.tags
      .map(
        (tag) =>
          `<category term="${tag}" scheme="${this.config.siteUrl}/blog/tags"/>`
      )
      .join("\n    ")}
    <summary type="html"><![CDATA[${post.description}]]></summary>
    <content type="html"><![CDATA[${content}]]></content>
    ${
      post.coverImage
        ? `<link rel="enclosure" href="${post.coverImage.src}" type="image/jpeg"/>`
        : ""
    }
  </entry>`;
  }

  private generateJSONFeedItem(post: BlogPost) {
    const postUrl = `${this.config.siteUrl}/blog/${post.slug}`;
    const content = this.stripMDX(post.content);

    return {
      id: postUrl,
      url: postUrl,
      title: post.title,
      content_html: content,
      content_text: this.stripHTML(content),
      summary: post.description,
      image: post.coverImage?.src,
      banner_image: post.coverImage?.src,
      date_published: post.publishedAt.toISOString(),
      date_modified: post.updatedAt.toISOString(),
      author: {
        name: post.author.name,
        url: this.config.author.url,
        avatar: post.author.avatar,
      },
      tags: [...post.tags, post.category],
      language: this.config.language,
      _reading_time_minutes: post.readingTime,
    };
  }

  private stripMDX(content: string): string {
    return (
      content
        // Remove MDX imports
        .replace(/^import\s+.*$/gm, "")
        // Remove MDX exports
        .replace(/^export\s+.*$/gm, "")
        // Remove JSX components
        .replace(/<[^>]*>/g, "")
        // Remove markdown links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove markdown images
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        // Remove markdown headers
        .replace(/^#{1,6}\s+/gm, "")
        // Remove markdown bold/italic
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        // Remove markdown code blocks
        .replace(/```[\s\S]*?```/g, "")
        // Remove inline code
        .replace(/`([^`]+)`/g, "$1")
        // Remove markdown blockquotes
        .replace(/^>\s+/gm, "")
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
    );
  }

  private stripHTML(content: string): string {
    return content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  // Generate feed discovery links for HTML head
  static generateFeedDiscoveryLinks(baseUrl: string): string {
    return `
    <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="${baseUrl}/blog/rss.xml" />
    <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="${baseUrl}/blog/atom.xml" />
    <link rel="alternate" type="application/json" title="JSON Feed" href="${baseUrl}/blog/feed.json" />
    `;
  }

  // Generate feed statistics
  async generateFeedStats() {
    const posts = await getPublishedBlogPosts();
    const categories = [...new Set(posts.map((post) => post.category))];
    const tags = [...new Set(posts.flatMap((post) => post.tags))];

    const categoryStats = categories.map((category) => ({
      name: category,
      count: posts.filter((post) => post.category === category).length,
    }));

    const tagStats = tags
      .map((tag) => ({
        name: tag,
        count: posts.filter((post) => post.tags.includes(tag)).length,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalPosts: posts.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      averageReadingTime: Math.round(
        posts.reduce((acc, post) => acc + post.readingTime, 0) / posts.length
      ),
      totalReadingTime: posts.reduce((acc, post) => acc + post.readingTime, 0),
      featuredPosts: posts.filter((post) => post.featured).length,
      lastUpdated: posts.length > 0 && posts[0] ? posts[0].publishedAt : new Date(),
      categoryStats,
      tagStats: tagStats.slice(0, 10), // Top 10 tags
      monthlyStats: this.generateMonthlyStats(posts),
    };
  }

  private generateMonthlyStats(posts: BlogPost[]) {
    const monthlyData: { [key: string]: number } = {};

    posts.forEach((post) => {
      const monthKey = post.publishedAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12); // Last 12 months
  }
}

// Export singleton instance
export const rssGenerator = new RSSGenerator();
