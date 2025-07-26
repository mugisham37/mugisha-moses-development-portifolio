import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { BlogPost, SEOMetadata } from "@/types";

// Content directory paths
const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const CASE_STUDIES_DIR = path.join(CONTENT_DIR, "case-studies");
const LEARNING_NOTES_DIR = path.join(CONTENT_DIR, "learning-notes");

// Ensure content directories exist
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Initialize content directories
[CONTENT_DIR, BLOG_DIR, CASE_STUDIES_DIR, LEARNING_NOTES_DIR].forEach(
  ensureDirectoryExists
);

// Content loading utilities
export class ContentLoader {
  // Blog post utilities
  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const files = fs.readdirSync(BLOG_DIR);
      const posts = await Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => {
            const slug = file.replace(/\.mdx$/, "");
            return await this.getBlogPost(slug);
          })
      );

      return posts
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (error) {
      console.error("Error loading blog posts:", error);
      return [];
    }
  }

  static async getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      // Calculate reading time
      const readingTimeResult = readingTime(content);

      // Generate excerpt if not provided
      const excerpt = data.excerpt || this.generateExcerpt(content);

      // Generate SEO metadata
      const seo = this.generateSEOMetadata({
        title: data.title,
        description: data.description || excerpt,
        keywords: data.tags || [],
        slug,
        type: "blog",
      });

      const blogPost: BlogPost = {
        slug,
        title: data.title,
        description: data.description || excerpt,
        content,
        excerpt,
        publishedAt: new Date(data.publishedAt),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt)
          : new Date(data.publishedAt),
        tags: data.tags || [],
        category: data.category || "General",
        readingTime: readingTimeResult.minutes,
        featured: data.featured || false,
        draft: data.draft || false,
        seo,
        author: data.author || {
          name: "Alex Morgan",
          bio: "Full Stack Developer & 3D Web Specialist",
          avatar: "/authors/alex-morgan.jpg",
          social: {
            github: "https://github.com/alexmorgan-dev",
            linkedin: "https://linkedin.com/in/alex-morgan-developer",
            twitter: "https://twitter.com/alexmorgan_dev",
          },
        },
        relatedPosts: data.relatedPosts || [],
      };

      // Conditionally add coverImage only if it exists
      if (data.coverImage) {
        blogPost.coverImage = {
          src: data.coverImage,
          alt: data.coverImageAlt || data.title,
          width: data.coverImageWidth || 1200,
          height: data.coverImageHeight || 630,
        };
      }

      return blogPost;
    } catch (error) {
      console.error(`Error loading blog post ${slug}:`, error);
      return null;
    }
  }

  static async getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    return posts.filter((post) => post.tags.includes(tag));
  }

  static async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    return posts.filter((post) => post.category === category);
  }

  static async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    return posts.filter((post) => post.featured);
  }

  static async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    return posts.filter((post) => !post.draft);
  }

  // Case study utilities
  static async getCaseStudies(): Promise<BlogPost[]> {
    try {
      const files = fs.readdirSync(CASE_STUDIES_DIR);
      const caseStudies = await Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => {
            const slug = file.replace(/\.mdx$/, "");
            return await this.getCaseStudy(slug);
          })
      );

      return caseStudies
        .filter((study): study is BlogPost => study !== null)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (error) {
      console.error("Error loading case studies:", error);
      return [];
    }
  }

  static async getCaseStudy(slug: string): Promise<BlogPost | null> {
    try {
      const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const readingTimeResult = readingTime(content);
      const excerpt = data.excerpt || this.generateExcerpt(content);

      const seo = this.generateSEOMetadata({
        title: data.title,
        description: data.description || excerpt,
        keywords: data.tags || [],
        slug,
        type: "case-study",
      });

      const caseStudy: BlogPost = {
        slug,
        title: data.title,
        description: data.description || excerpt,
        content,
        excerpt,
        publishedAt: new Date(data.publishedAt),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt)
          : new Date(data.publishedAt),
        tags: data.tags || [],
        category: "Case Study",
        readingTime: readingTimeResult.minutes,
        featured: data.featured || false,
        draft: data.draft || false,
        seo,
        author: data.author || {
          name: "Alex Morgan",
          bio: "Full Stack Developer & 3D Web Specialist",
          avatar: "/authors/alex-morgan.jpg",
          social: {
            github: "https://github.com/alexmorgan-dev",
            linkedin: "https://linkedin.com/in/alex-morgan-developer",
            twitter: "https://twitter.com/alexmorgan_dev",
          },
        },
        relatedPosts: data.relatedPosts || [],
      };

      // Conditionally add coverImage only if it exists
      if (data.coverImage) {
        caseStudy.coverImage = {
          src: data.coverImage,
          alt: data.coverImageAlt || data.title,
          width: data.coverImageWidth || 1200,
          height: data.coverImageHeight || 630,
        };
      }

      return caseStudy;
    } catch (error) {
      console.error(`Error loading case study ${slug}:`, error);
      return null;
    }
  }

  // Learning notes utilities
  static async getLearningNotes(): Promise<BlogPost[]> {
    try {
      const files = fs.readdirSync(LEARNING_NOTES_DIR);
      const notes = await Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => {
            const slug = file.replace(/\.mdx$/, "");
            return await this.getLearningNote(slug);
          })
      );

      return notes
        .filter((note): note is BlogPost => note !== null)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } catch (error) {
      console.error("Error loading learning notes:", error);
      return [];
    }
  }

  static async getLearningNote(slug: string): Promise<BlogPost | null> {
    try {
      const filePath = path.join(LEARNING_NOTES_DIR, `${slug}.mdx`);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const readingTimeResult = readingTime(content);
      const excerpt = data.excerpt || this.generateExcerpt(content);

      const seo = this.generateSEOMetadata({
        title: data.title,
        description: data.description || excerpt,
        keywords: data.tags || [],
        slug,
        type: "learning-note",
      });

      const learningNote: BlogPost = {
        slug,
        title: data.title,
        description: data.description || excerpt,
        content,
        excerpt,
        publishedAt: new Date(data.publishedAt),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt)
          : new Date(data.publishedAt),
        tags: data.tags || [],
        category: "Learning Notes",
        readingTime: readingTimeResult.minutes,
        featured: data.featured || false,
        draft: data.draft || false,
        seo,
        author: data.author || {
          name: "Alex Morgan",
          bio: "Full Stack Developer & 3D Web Specialist",
          avatar: "/authors/alex-morgan.jpg",
          social: {
            github: "https://github.com/alexmorgan-dev",
            linkedin: "https://linkedin.com/in/alex-morgan-developer",
            twitter: "https://twitter.com/alexmorgan_dev",
          },
        },
        relatedPosts: data.relatedPosts || [],
      };

      // Conditionally add coverImage only if it exists
      if (data.coverImage) {
        learningNote.coverImage = {
          src: data.coverImage,
          alt: data.coverImageAlt || data.title,
          width: data.coverImageWidth || 1200,
          height: data.coverImageHeight || 630,
        };
      }

      return learningNote;
    } catch (error) {
      console.error(`Error loading learning note ${slug}:`, error);
      return null;
    }
  }

  // MDX serialization utilities
  static async serializeMDX(
    content: string
  ): Promise<MDXRemoteSerializeResult> {
    return await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
        development: process.env.NODE_ENV === "development",
      },
    });
  }

  static async serializeBlogPost(
    slug: string
  ): Promise<MDXRemoteSerializeResult | null> {
    const post = await this.getBlogPost(slug);
    if (!post) return null;
    return await this.serializeMDX(post.content);
  }

  static async serializeCaseStudy(
    slug: string
  ): Promise<MDXRemoteSerializeResult | null> {
    const caseStudy = await this.getCaseStudy(slug);
    if (!caseStudy) return null;
    return await this.serializeMDX(caseStudy.content);
  }

  // Search utilities
  static async searchContent(query: string): Promise<BlogPost[]> {
    const [blogPosts, caseStudies, learningNotes] = await Promise.all([
      this.getBlogPosts(),
      this.getCaseStudies(),
      this.getLearningNotes(),
    ]);

    const allContent = [...blogPosts, ...caseStudies, ...learningNotes];
    const lowercaseQuery = query.toLowerCase();

    return allContent.filter(
      (content) =>
        content.title.toLowerCase().includes(lowercaseQuery) ||
        content.description.toLowerCase().includes(lowercaseQuery) ||
        content.tags.some((tag) =>
          tag.toLowerCase().includes(lowercaseQuery)
        ) ||
        content.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Utility methods
  private static generateExcerpt(
    content: string,
    maxLength: number = 160
  ): string {
    // Remove MDX/Markdown syntax for excerpt
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .replace(/!\[(.*?)\]\(.*?\)/g, "") // Remove images
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim();

    return plainText.length > maxLength
      ? plainText.substring(0, maxLength).trim() + "..."
      : plainText;
  }

  private static generateSEOMetadata({
    title,
    description,
    keywords,
    slug,
    type,
  }: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    type: "blog" | "case-study" | "learning-note";
  }): SEOMetadata {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev";
    const canonicalUrl = `${baseUrl}/${
      type === "blog"
        ? "blog"
        : type === "case-study"
        ? "projects/case-studies"
        : "learning"
    }/${slug}`;

    return {
      title: `${title} | Alex Morgan - Full Stack Developer`,
      description,
      keywords: [
        ...keywords,
        "web development",
        "react",
        "nextjs",
        "typescript",
      ],
      ogImage: `/og/${type}/${slug}.png`,
      ogType: "article",
      canonicalUrl,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        author: {
          "@type": "Person",
          name: "Alex Morgan",
          url: baseUrl,
        },
        publisher: {
          "@type": "Person",
          name: "Alex Morgan",
          url: baseUrl,
        },
        url: canonicalUrl,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      },
    };
  }

  // Content statistics
  static async getContentStatistics() {
    const [blogPosts, caseStudies, learningNotes] = await Promise.all([
      this.getBlogPosts(),
      this.getCaseStudies(),
      this.getLearningNotes(),
    ]);

    const allContent = [...blogPosts, ...caseStudies, ...learningNotes];
    const publishedContent = allContent.filter((content) => !content.draft);

    return {
      total: allContent.length,
      published: publishedContent.length,
      drafts: allContent.length - publishedContent.length,
      blogPosts: blogPosts.length,
      caseStudies: caseStudies.length,
      learningNotes: learningNotes.length,
      featured: allContent.filter((content) => content.featured).length,
      totalReadingTime: allContent.reduce(
        (acc, content) => acc + content.readingTime,
        0
      ),
      averageReadingTime:
        allContent.reduce((acc, content) => acc + content.readingTime, 0) /
        allContent.length,
      tags: [...new Set(allContent.flatMap((content) => content.tags))],
      categories: [...new Set(allContent.map((content) => content.category))],
    };
  }
}

// Export convenience functions
export const {
  getBlogPosts,
  getBlogPost,
  getBlogPostsByTag,
  getBlogPostsByCategory,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
  getCaseStudies,
  getCaseStudy,
  getLearningNotes,
  getLearningNote,
  serializeMDX,
  serializeBlogPost,
  serializeCaseStudy,
  searchContent,
  getContentStatistics,
} = ContentLoader;
