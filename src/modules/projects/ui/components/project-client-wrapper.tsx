"use client";

import ProjectCard from "@/modules/projects/ui/components/project-card";

import { Status } from "@/modules/types";
import { Project } from "@prisma/client";
import React, { useState, useMemo } from "react";

interface ProjectsClientWrapperProps {
  projects: Project[];
}

// Type guard to ensure status is valid
function isValidProjectStatus(status: string): status is Status {
  return ["LIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].includes(status);
}

export default function ProjectsClientWrapper({
  projects,
}: ProjectsClientWrapperProps) {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [activeTech, setActiveTech] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeatured, setShowFeatured] = useState(false);

  // Filter projects based on active filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      if (activeStatus !== "ALL" && project.status !== activeStatus) {
        return false;
      }

      // Tech filter
      if (
        activeTech.length > 0 &&
        !activeTech.some((tech) => project.tech.includes(tech))
      ) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchLower);
        const matchesDescription = project.description
          .toLowerCase()
          .includes(searchLower);
        const matchesTech = project.tech.some((tech) =>
          tech.toLowerCase().includes(searchLower)
        );

        if (!matchesTitle && !matchesDescription && !matchesTech) {
          return false;
        }
      }

      // Featured filter
      if (showFeatured && !project.featured) {
        return false;
      }

      return true;
    });
  }, [projects, activeStatus, activeTech, searchTerm, showFeatured]);

  return (
    <>
      {/* Filters */}
      {/* <ProjectsFilter
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        activeTech={activeTech}
        onTechChange={setActiveTech}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFeatured={showFeatured}
        onFeaturedChange={setShowFeatured}
      /> */}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            tech={project.tech}
            status={
              isValidProjectStatus(project.status)
                ? project.status
                : "COMPLETED"
            }
            liveUrl={project.liveUrl || undefined}
            githubUrl={project.githubUrl || undefined}
            featured={project.featured}
            views={project.views}
            likes={project.likes}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 inline-block relative">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 border-4 border-black"></div>
            <div className="text-6xl font-black mb-4">404</div>
            <h3 className="text-2xl font-black uppercase tracking-wide mb-4">
              NO PROJECTS FOUND
            </h3>
            <p className="font-mono text-sm text-gray-600 mb-6">
              TRY ADJUSTING YOUR FILTERS OR SEARCH TERMS
            </p>
            <button
              onClick={() => {
                setActiveStatus("ALL");
                setActiveTech([]);
                setSearchTerm("");
                setShowFeatured(false);
              }}
              className="bg-lime-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-6 py-3 font-black uppercase tracking-wide text-sm transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
