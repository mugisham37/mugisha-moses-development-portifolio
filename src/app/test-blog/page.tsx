import {
  getPublishedBlogPosts,
  getFeaturedBlogPosts,
  getContentStatistics,
} from "@/lib/content-loader";

export default async function TestBlogPage() {
  try {
    const [allPosts, featuredPosts, contentStats] = await Promise.all([
      getPublishedBlogPosts(),
      getFeaturedBlogPosts(),
      getContentStatistics(),
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog System Test</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Posts</h2>
            <p className="text-3xl font-bold text-blue-600">
              {allPosts.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Featured Posts</h2>
            <p className="text-3xl font-bold text-green-600">
              {featuredPosts.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Reading Time</h2>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(contentStats.totalReadingTime)} min
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Posts</h2>
          <div className="space-y-4">
            {allPosts.map((post) => (
              <div key={post.slug} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-2">{post.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Category: {post.category}</span>
                  <span>Reading time: {post.readingTime} min</span>
                  <span>
                    Published: {post.publishedAt.toLocaleDateString()}
                  </span>
                  {post.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Content Statistics</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(contentStats, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">
          Blog System Error
        </h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-800">
            Error loading blog content:{" "}
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
