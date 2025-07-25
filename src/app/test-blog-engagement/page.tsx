import Link from "next/link";
import { getBlogPosts } from "@/lib/content-loader";
import { rssGenerator } from "@/lib/rss-generator";

export default async function TestBlogEngagementPage() {
  try {
    const posts = await getBlogPosts();
    const feedStats = await rssGenerator.generateFeedStats();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Blog Engagement Features Test
        </h1>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              ✅ Social Sharing
            </h2>
            <ul className="text-sm space-y-2">
              <li>• Enhanced social share buttons with custom styling</li>
              <li>• Twitter, LinkedIn, Facebook, Email, WhatsApp</li>
              <li>• Copy link functionality with success feedback</li>
              <li>• Native share API support for mobile devices</li>
              <li>• Share analytics tracking and engagement metrics</li>
              <li>• Floating, inline, and compact variants</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              ✅ Table of Contents
            </h2>
            <ul className="text-sm space-y-2">
              <li>• Auto-generated from article headings</li>
              <li>• Smooth scroll navigation with active highlighting</li>
              <li>• Reading progress indicator and time estimates</li>
              <li>• Mobile-responsive with collapsible design</li>
              <li>• Section-wise reading time calculations</li>
              <li>• Quick navigation to top/bottom</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">
              ✅ Print-Friendly
            </h2>
            <ul className="text-sm space-y-2">
              <li>• Comprehensive print CSS with proper typography</li>
              <li>• Print preview mode with visual feedback</li>
              <li>• PDF generation with article metadata</li>
              <li>• Print statistics (pages, words, reading time)</li>
              <li>• Optimized layout for A4/Letter paper</li>
              <li>• Print-specific headers and footers</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              ✅ RSS Feeds
            </h2>
            <ul className="text-sm space-y-2">
              <li>• RSS 2.0 feed with full content</li>
              <li>• Atom 1.0 feed for modern readers</li>
              <li>• JSON Feed for JavaScript applications</li>
              <li>• Automatic feed discovery in HTML head</li>
              <li>• Feed statistics and analytics</li>
              <li>• Sitemap generation for SEO</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              ✅ Engagement Metrics
            </h2>
            <ul className="text-sm space-y-2">
              <li>• Real-time engagement tracking</li>
              <li>• Like, share, bookmark, and view counters</li>
              <li>• Reading progress and time spent analytics</li>
              <li>• Social reach and engagement rate calculations</li>
              <li>• Interactive engagement dashboard</li>
              <li>• Performance insights and recommendations</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              ✅ Enhanced UX
            </h2>
            <ul className="text-sm space-y-2">
              <li>• Floating action buttons for quick access</li>
              <li>• Reading progress visualization</li>
              <li>• Bookmark and like functionality</li>
              <li>• Responsive design for all devices</li>
              <li>• Smooth animations and micro-interactions</li>
              <li>• Accessibility-compliant components</li>
            </ul>
          </div>
        </div>

        {/* RSS Feed Statistics */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">RSS Feed Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {feedStats.totalPosts}
              </div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {feedStats.totalCategories}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {feedStats.totalTags}
              </div>
              <div className="text-sm text-gray-600">Tags</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {feedStats.totalReadingTime}
              </div>
              <div className="text-sm text-gray-600">Total Minutes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Top Categories</h3>
              <div className="space-y-2">
                {feedStats.categoryStats.slice(0, 5).map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {feedStats.tagStats.slice(0, 10).map((tag) => (
                  <span
                    key={tag.name}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag.name} ({tag.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feed Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Feeds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">RSS 2.0 Feed</h3>
              <p className="text-sm text-gray-600 mb-4">
                Standard RSS format for most feed readers
              </p>
              <a
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.429 2.571c0-.952.771-1.714 1.714-1.714.952 0 1.714.762 1.714 1.714 0 .943-.762 1.714-1.714 1.714-.943 0-1.714-.771-1.714-1.714zM.571 16c0-4.286 3.429-7.714 7.714-7.714v2.286c-3.048 0-5.429 2.381-5.429 5.429H.571zM.571 11.429c0-6.857 5.714-12.571 12.571-12.571v2.286C7.429 1.143 2.857 5.714 2.857 11.429H.571z" />
                </svg>
                Subscribe RSS
              </a>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Atom Feed</h3>
              <p className="text-sm text-gray-600 mb-4">
                Modern Atom format with enhanced metadata
              </p>
              <a
                href="/blog/atom.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.429 2.571c0-.952.771-1.714 1.714-1.714.952 0 1.714.762 1.714 1.714 0 .943-.762 1.714-1.714 1.714-.943 0-1.714-.771-1.714-1.714zM.571 16c0-4.286 3.429-7.714 7.714-7.714v2.286c-3.048 0-5.429 2.381-5.429 5.429H.571zM.571 11.429c0-6.857 5.714-12.571 12.571-12.571v2.286C7.429 1.143 2.857 5.714 2.857 11.429H.571z" />
                </svg>
                Subscribe Atom
              </a>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">JSON Feed</h3>
              <p className="text-sm text-gray-600 mb-4">
                JSON-based feed for modern applications
              </p>
              <a
                href="/blog/feed.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download JSON
              </a>
            </div>
          </div>
        </div>

        {/* Test Blog Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Blog Posts</h2>
          <p className="text-gray-600 mb-6">
            Click on any post below to test the engagement features including
            social sharing, table of contents, print functionality, and
            engagement metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 4).map((post) => (
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

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Category: {post.category}</span>
                  <span>Reading time: {post.readingTime} min</span>
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
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Test Features →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Implementation Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">Technical Features:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Real-time engagement tracking with localStorage</li>
                <li>• Comprehensive RSS/Atom/JSON feed generation</li>
                <li>• Print-optimized CSS with proper typography</li>
                <li>• Responsive social sharing with analytics</li>
                <li>• Auto-generated table of contents with progress</li>
                <li>• Mobile-first responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">User Experience:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Smooth animations and micro-interactions</li>
                <li>• Accessibility-compliant components</li>
                <li>• Multiple sharing variants (floating, inline, compact)</li>
                <li>• Print preview mode with visual feedback</li>
                <li>• Reading progress visualization</li>
                <li>• Cross-platform compatibility</li>
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
          Blog Engagement Test Error
        </h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-800">
            Error loading blog engagement features:{" "}
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
