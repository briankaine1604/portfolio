import { ShareButton } from "@/components/shareButton";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: { slug: (await params).slug },
    include: { category: true },
  });

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} - Blog`,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.ogImage ? [blog.ogImage] : [],
    },
  };
}

const Page = async ({ params }: Props) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: (await params).slug,
      published: true,
    },
    include: { category: true },
  });

  if (!blog) {
    notFound();
  }

  // Increment views
  await prisma.blog.update({
    where: { id: blog.id },
    data: { views: { increment: 1 } },
  });

  // Since you're using Tiptap, the content should already be properly formatted HTML
  // No need for processing, Tiptap handles this well

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-block mb-8 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ← BACK TO BLOG
        </Link>

        {/* Blog header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] mb-8 relative">
          {/* Featured badge */}
          {blog.featured && (
            <div className="absolute -top-2 -right-2 px-3 py-1 border-2 border-black font-black text-xs uppercase tracking-wide bg-lime-400">
              FEATURED
            </div>
          )}

          {/* Decorative corner */}
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black"></div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider">
                {blog.title}
              </h1>
              {blog.category && (
                <span className="bg-gray-900 text-lime-400 border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase">
                  {blog.category.name}
                </span>
              )}
            </div>

            <p className="font-mono text-lg leading-relaxed text-gray-700 mb-6">
              {blog.excerpt}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-400 text-black border-2 border-black px-2 py-1 font-mono text-xs font-black uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blog meta info */}
            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-600 items-center">
              <span className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-black uppercase">
                {blog.readTime}
              </span>
              <span>{blog.views} views</span>
              {blog.publishedAt && (
                <>
                  <span>•</span>
                  <span>
                    Published {new Date(blog.publishedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content area with ad spaces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Ad Space */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-8">
              {/* Google Ads placeholder - Left */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-xs text-gray-400 mb-2">
                    ADVERTISEMENT
                  </div>
                  <div className="border-2 border-dashed border-gray-300 p-8 bg-gray-50">
                    <span className="font-mono text-xs text-gray-400">
                      300x600
                      <br />
                      BANNER AD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured image */}
            {blog.ogImage && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4">
                <div className="relative h-96 border-2 border-gray-300 overflow-hidden">
                  <Image
                    src={blog.ogImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Main blog content - Optimized for Tiptap output */}
            <article className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
              <div
                className="tiptap-content max-w-none font-mono text-base leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: blog.body }}
              />
            </article>

            {/* Share section */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
              <div className="flex items-center justify-between">
                <ShareButton />
                <div className="text-sm font-mono text-gray-600">
                  {blog.views} views
                </div>
              </div>
            </div>

            {/* Terminal-style info box */}
            <div className="bg-gray-900 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
              <div className="font-mono text-xs text-lime-400 space-y-2">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-gray-400">~/blog/{blog.slug}</div>
                </div>
                <div>$ cat blog_stats.txt</div>
                <div className="text-green-400">✓ Published article</div>
                <div className="text-blue-400">✓ {blog.views} readers</div>
                <div className="text-gray-400 mt-3">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                {blog.updatedAt !== blog.createdAt && (
                  <div className="text-gray-400">
                    Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                  </div>
                )}
                {blog.publishedAt && (
                  <div className="text-gray-400">
                    Published: {new Date(blog.publishedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Ad Space */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-8">
              {/* Google Ads placeholder - Right */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-xs text-gray-400 mb-2">
                    ADVERTISEMENT
                  </div>
                  <div className="border-2 border-dashed border-gray-300 p-8 bg-gray-50">
                    <span className="font-mono text-xs text-gray-400">
                      300x600
                      <br />
                      BANNER AD
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional smaller ad unit */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 mt-8 min-h-[250px] flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-xs text-gray-400 mb-2">
                    ADVERTISEMENT
                  </div>
                  <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                    <span className="font-mono text-xs text-gray-400">
                      300x250
                      <br />
                      SQUARE AD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile ad spaces */}
        <div className="lg:hidden mt-8 space-y-8">
          {/* Mobile banner ad */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4">
            <div className="text-center mb-2">
              <div className="font-mono text-xs text-gray-400">
                ADVERTISEMENT
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 p-8 bg-gray-50 text-center">
              <span className="font-mono text-xs text-gray-400">
                320x100 MOBILE BANNER
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
