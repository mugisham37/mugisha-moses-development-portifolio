// Simple test to verify MDX content loading
import { ContentLoader } from "./content-loader";

export async function testMDXSystem() {
  try {
    console.log("🧪 Testing MDX Content System...");

    // Test blog posts loading
    const blogPosts = await ContentLoader.getBlogPosts();
    console.log(`✅ Loaded ${blogPosts.length} blog posts`);

    // Test case studies loading
    const caseStudies = await ContentLoader.getCaseStudies();
    console.log(`✅ Loaded ${caseStudies.length} case studies`);

    // Test learning notes loading
    const learningNotes = await ContentLoader.getLearningNotes();
    console.log(`✅ Loaded ${learningNotes.length} learning notes`);

    // Test content statistics
    const stats = await ContentLoader.getContentStatistics();
    console.log("📊 Content Statistics:", stats);

    // Test individual post loading
    if (blogPosts.length > 0) {
      const firstPost = await ContentLoader.getBlogPost(blogPosts[0].slug);
      console.log(
        `✅ Successfully loaded individual post: ${firstPost?.title}`
      );
    }

    console.log("🎉 MDX Content System test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ MDX Content System test failed:", error);
    return false;
  }
}

// Run test in development
if (process.env.NODE_ENV === "development") {
  testMDXSystem();
}
