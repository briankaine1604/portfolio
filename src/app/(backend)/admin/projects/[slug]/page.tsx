import { prisma } from "@/lib/prisma";
import ProjectForm from "@/modules/projects/ui/project-form";
import { formatISO } from "date-fns";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  // Fetch initial data from Prisma for editing
  const projectData = await prisma.project.findUnique({
    where: { slug },
    include: {
      category: true, // If you need category info
      // Add other relations you need
    },
  });

  // If no project found, treat it as creating a new one
  if (!projectData) {
    return <ProjectForm slug={slug} />;
  }

  // Transform Prisma data to match ProjectGetOneOutput type
  const initialData = {
    ...projectData,
    categoryId: projectData.categoryId,
    publishedAt: projectData.createdAt
      ? formatISO(projectData.createdAt)
      : null,
    updatedAt: formatISO(projectData.updatedAt),
    createdAt: formatISO(projectData.createdAt),
    completedAt: projectData.completedAt
      ? formatISO(projectData.completedAt)
      : null,
    // Remove the category relation since ProjectGetOneOutput doesn't expect it
  };

  return <ProjectForm slug={slug} initialData={initialData} />;
};

export default Page;
