import { prisma } from "@/lib/prisma";
import BlogForm from "@/modules/blog/ui/blog-form";
import { formatISO } from "date-fns";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  // Fetch initial data from Prisma for editing
  const blogData = await prisma.blog.findUnique({
    where: { slug },
    include: {
      category: true, // If you need category info
      // Add other relations you need
    },
  });

  // If no blog found, treat it as creating a new one
  if (!blogData) {
    return <BlogForm slug={slug} />;
  }

  // Transform Prisma data to match BlogGetOneOutput type
  const initialData = {
    ...blogData,
    categoryId: blogData.categoryId,
    publishedAt: blogData.publishedAt ? formatISO(blogData.publishedAt) : null,
    updatedAt: formatISO(blogData.updatedAt),
    createdAt: formatISO(blogData.createdAt),
    // Remove the category relation since BlogGetOneOutput doesn't expect it
    category: undefined,
  };

  return <BlogForm slug={slug} initialData={initialData} />;
};

export default Page;
