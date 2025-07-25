import Link from "next/link";
import { getBlogPosts } from "@/lib/content-loader";

export default async function TestBlogPostPage() {
  try {
    const posts = await getBlogPosts();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog Post System Test</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Blog Posts</h2>
          <p className="text-muted-foreground mb-6">
            Click on any post below to test the individual blog post page
            functionality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>Category: {post.category}</span>
                  <span>Reading time: {post.readingTime} min</span>
                  <span>
                    Published: {post.publishedAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {post.draft && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Blog Post Page Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Individual blog post layout with MDX rendering</li>
                <li>
                  ✅ Syntax highlighting for code blocks with copy functionality
                </li>
                <li>
                  ✅ Reading progress indicator and estimated reading time
                </li>
                <li>✅ Table of contents with smooth scroll navigation</li>
                <li>✅ Social sharing buttons with custom styling</li>
                <li>✅ Author bio and social links</li>
                <li>✅ Related posts recommendation system</li>
                <li>✅ Previous/Next post navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Enhanced Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ SEO optimization with structured data</li>
                <li>✅ Open Graph and Twitter Card meta tags</li>
                <li>✅ Custom MDX components (Callout, TechStack, etc.)</li>
                <li>✅ Reading progress with circular indicator</li>
                <li>✅ Responsive design with sticky sidebar</li>
                <li>✅ Print-friendly styling for blog posts</li>
                <li>✅ Animated content with Framer Motion</li>
                <li>✅ 404 page for missing posts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Blog Homepage
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">
          Blog Post System Error
        </h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-800">
            Error loading blog posts:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <pre className="mt-4 text-sm text-red-600 overflow-auto">
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
