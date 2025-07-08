import { prisma } from "@/lib/prisma";
import { Status } from "@/modules/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: (await params).slug },
    include: { category: true },
  });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.metaTitle || `${project.title} - Project`,
    description: project.metaDescription || project.description,
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.description,
      images: project.ogImage
        ? [project.ogImage]
        : project.thumbnail
        ? [project.thumbnail]
        : [],
    },
  };
}

const badgeColors: Record<Status, string> = {
  LIVE: "bg-lime-400",
  IN_PROGRESS: "bg-yellow-400",
  COMPLETED: "bg-blue-400",
  ARCHIVED: "bg-gray-400",
};

const Page = async ({ params }: Props) => {
  const project = await prisma.project.findUnique({
    where: { slug: (await params).slug },
    include: { category: true },
  });

  if (!project) {
    notFound();
  }

  // Increment views
  await prisma.project.update({
    where: { id: project.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-block mb-8 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ← BACK TO PROJECTS
        </Link>

        {/* Project header */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] mb-8 relative">
          {/* Status badge */}
          <div
            className={`absolute -top-2 -right-2 px-3 py-1 border-2 border-black font-black text-xs uppercase tracking-wide ${
              badgeColors[project.status as Status]
            }`}
          >
            {project.status}
          </div>

          {/* Decorative corner */}
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black"></div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
                {project.title}
              </h1>
              {project.category && (
                <span className="bg-gray-900 text-lime-400 border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase">
                  {project.category.name}
                </span>
              )}
            </div>

            <p className="font-mono text-lg leading-relaxed text-gray-700 mb-6">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((item, i) => (
                <span
                  key={i}
                  className="bg-gray-900 text-lime-400 border-2 border-black px-2 py-1 font-mono text-xs font-black uppercase"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-lime-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  VIEW LIVE
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  VIEW CODE
                </a>
              )}
              {project.caseStudyUrl && (
                <a
                  href={project.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  CASE STUDY
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm font-mono text-gray-600">
              <span>{project.views} views</span>
              <span>•</span>
              <span>{project.likes} likes</span>
              {project.completedAt && (
                <>
                  <span>•</span>
                  <span>
                    Completed{" "}
                    {new Date(project.completedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Media */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main image/video */}
            {project.thumbnail && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4">
                <div className="relative h-96 border-2 border-gray-300 overflow-hidden">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Video if available */}
            {project.videoUrl && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4">
                <div className="relative h-96 border-2 border-gray-300 overflow-hidden">
                  <iframe
                    src={project.videoUrl}
                    title={`${project.title} Demo`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Additional images */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4">
                <h3 className="font-black uppercase tracking-wide mb-4 text-lg">
                  MORE SCREENSHOTS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((image, i) => (
                    <div
                      key={i}
                      className="relative h-48 border-2 border-gray-300 overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div className="space-y-8">
            {/* Long description */}
            {project.longDescription && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
                <h3 className="font-black uppercase tracking-wide mb-4 text-lg">
                  ABOUT THIS PROJECT
                </h3>
                <div className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {project.longDescription}
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
                <h3 className="font-black uppercase tracking-wide mb-4 text-lg">
                  CHALLENGES SOLVED
                </h3>
                <div className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {project.challenges}
                </div>
              </div>
            )}

            {/* Learnings */}
            {project.learnings && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
                <h3 className="font-black uppercase tracking-wide mb-4 text-lg">
                  WHAT I LEARNED
                </h3>
                <div className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {project.learnings}
                </div>
              </div>
            )}

            {/* Terminal-style info box */}
            <div className="bg-gray-900 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
              <div className="font-mono text-xs text-lime-400 space-y-2">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-gray-400">~/projects/{project.slug}</div>
                </div>
                <div>$ git log --oneline</div>
                <div className="text-green-400">✓ Project completed</div>
                <div className="text-blue-400">✓ {project.views} visitors</div>
                <div className="text-yellow-400">✓ {project.likes} stars</div>
                <div className="text-gray-400 mt-3">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="text-gray-400">
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
