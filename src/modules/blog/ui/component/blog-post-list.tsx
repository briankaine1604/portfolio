import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type Filters = {
  category?: string | null;
  tags?: string[] | null;
  sort?: "newest" | "oldest" | "popular";
};

interface BlogPostsListProps {
  filters: Filters;
}

// Correct return type with included category relation
type BlogWithCategory = Prisma.BlogGetPayload<{
  include: { category: true };
}>;

export async function BlogPostsList({ filters }: BlogPostsListProps) {
  const where: Prisma.BlogWhereInput = {
    published: true,
  };

  // Handle category filter via slug on related category
  if (filters.category) {
    where.category = {
      slug: filters.category,
    };
  }

  // Handle tags filter
  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      hasSome: filters.tags,
    };
  }

  // Handle sort option
  let orderBy: Prisma.BlogOrderByWithRelationInput = { publishedAt: "desc" };

  if (filters.sort === "oldest") {
    orderBy = { publishedAt: "asc" };
  } else if (filters.sort === "popular") {
    orderBy = { views: "desc" };
  }

  // Fetch blog posts
  let blogPosts: BlogWithCategory[] = [];

  try {
    blogPosts = await prisma.blog.findMany({
      where,
      orderBy,
      include: { category: true },
    });
  } catch (error) {
    console.error("❌ Failed to fetch blog posts:", error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.length > 0 ? (
        blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] transition-all duration-200 relative group cursor-pointer"
          >
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 border-2 border-black"></div>

            <div className="bg-gray-200 border-b-4 border-black h-48 flex items-center justify-center">
              <div className="text-center font-mono text-sm">
                <div className="font-black uppercase">POST</div>
                <div className="text-xs mt-1">IMAGE</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4 font-mono text-xs">
                <span className="bg-black text-white px-2 py-1 font-black">
                  {post.category?.name ?? "Uncategorized"}
                </span>
                <span className="text-gray-600">{post.readTime}</span>
              </div>

              <h3 className="text-lg font-black uppercase leading-tight mb-3 group-hover:text-gray-700 transition-colors">
                {post.title}
              </h3>

              <p className="font-mono text-xs leading-relaxed text-gray-700 mb-4">
                {post.excerpt}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-black uppercase hover:text-gray-700 transition-colors"
                >
                  READ MORE →
                </Link>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 inline-block">
            <h3 className="text-xl font-black uppercase mb-4">
              NO POSTS FOUND
            </h3>
            <p className="font-mono text-sm text-gray-600">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
