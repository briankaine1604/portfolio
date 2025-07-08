// app/blog/page.tsx
import { BlogFilters } from "@/modules/blog/ui/component/blog-filter-bar";
import { BlogStats } from "./components/blog-stats";
import { Button } from "@/components/button";
import { BlogPostsList } from "@/modules/blog/ui/component/blog-post-list";

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    tags?: string; // comma-separated tags, e.g. "react,typescript"
    sort?: "newest" | "oldest" | "popular";
  }>;
}
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const filters = {
    category: (await searchParams).category || null,
    tags: (await searchParams).tags
      ? (await searchParams).tags!.split(",")
      : null,
    sort: (await searchParams).sort || "newest",
  };
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black"></div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
              THE BLOG
            </h1>
          </div>
          <div className="mt-4 max-w-2xl">
            <p className="font-mono text-sm uppercase">
              THOUGHTS ON CODE, TECH STACKS, AND THE OCCASIONAL RANT ABOUT WHY
              THINGS SHOULD BE SIMPLER.
            </p>
          </div>
        </div>
        {/* Blog Posts Grid - now a client component */}
        <BlogFilters />
        <BlogPostsList filters={filters} />
        {/* Load More Placeholder */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900 border-4 border-black shadow-[12px_12px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
            <h3 className="text-xl font-black uppercase text-white mb-4">
              WANT MORE CONTENT?
            </h3>
            <p className="font-mono text-sm text-gray-300 mb-6 max-w-lg">
              I DROP NEW POSTS WEEKLY. SUBSCRIBE TO GET NOTIFIED WHEN I PUBLISH
              SOMETHING NEW.
            </p>
            <Button variant="inverse" className="bg-lime-400 mr-4">
              SUBSCRIBE
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black">
              LOAD MORE POSTS
            </Button>
          </div>
        </div>
        {/* Blog Stats - you'll need to pass the client-side fetched length here */}
        {/* You'll need to pass the actual length from BlogPostsList if you want it to reflect current filters */}
        {/* For now, just pass a placeholder or remove until actual data is available */}
        <BlogStats length={0} />{" "}
        {/* Adjust this based on your client-side data */}
      </div>
    </div>
  );
}
