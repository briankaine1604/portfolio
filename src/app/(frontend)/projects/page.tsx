import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/modules/projects/ui/components/project-card";
import { Status } from "@/modules/types";
// make sure this matches where STATUSES is exported from

const Page = async () => {
  const projects = await prisma.project.findMany();

  return (
    <div className=" min-h-screen bg-gray-100 py-16 px-8 ">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 ">
          <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black rotate-45"></div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
              DEPLOYED & DELIVERED
            </h1>
          </div>
          <div className="mt-4 max-w-2xl">
            <p className="font-mono text-sm uppercase">
              PROJECTS BUILT WITH CODE, LOVE, SWEAT AND A SPRINKLE OF CHAOS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 mx-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tech={project.tech}
              status={project.status as Status}
              liveUrl={project.liveUrl ?? undefined}
              githubUrl={project.githubUrl ?? undefined}
              thumbnail={project.thumbnail ?? undefined}
              slug={project.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
