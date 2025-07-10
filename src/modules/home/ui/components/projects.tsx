import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/modules/projects/ui/components/project-card";
import { Status } from "@/modules/types";
import { Project } from "@prisma/client";
import Link from "next/link";

export default async function Projects() {
  let projects: Project[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: { priority: "desc" },
      take: 4,
    });
  } catch (error) {
    console.error("❌ Failed to load projects:", error);
    // Return empty array or some fallback data
  }

  return (
    <section id="projects" className="bg-gray-100 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="bg-black text-white border-4 border-black shadow-[20px_20px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-lime-400 border-4 border-black"></div>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
              SELECTED WORK
            </h2>
          </div>
          <div className="mt-8 max-w-2xl">
            <p className="font-mono text-sm leading-relaxed">
              THESE ARE THE PROJECTS THAT KEEP ME UP AT NIGHT (IN A GOOD WAY).
              EACH ONE TAUGHT ME SOMETHING NEW AND PUSHED MY LIMITS AS A
              DEVELOPER.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tech={project.tech}
              status={project.status as Status}
              slug={project.slug}
              thumbnail={project.thumbnail ?? undefined}
              liveUrl={project.liveUrl ?? undefined}
              githubUrl={project.githubUrl ?? undefined}
            />
          ))}
        </div>

        {/* View all projects CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 relative inline-block">
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-lime-400 border-4 border-black transform rotate-45"></div>

            <p className="font-mono text-sm mb-4 uppercase tracking-wide">
              WANT TO SEE MORE?
            </p>

            <button className="bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_#666] hover:shadow-[10px_10px_0px_0px_#666] px-6 py-3 font-black uppercase tracking-wide text-sm transform transition-all duration-200 active:translate-x-2 active:translate-y-2 active:shadow-none">
              <Link href={"/projects"}>VIEW ALL PROJECTS</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
