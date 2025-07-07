"use client";
import { Button } from "@/components/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { STATUSES, type Status } from "@/modules/types"; // Update this path
import Image from "next/image";
import { SearchInput } from "@/modules/blog/ui/component/admin-search-input";

export default function AdminProjectsPage() {
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
  const limit = 10; // matches default in `getManyInput`
  const skip = (page - 1) * limit;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteProject = useMutation(
    trpc.project.deleteProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getMany.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const deleteMany = useMutation(
    trpc.project.deleteMany.mutationOptions({
      onSuccess: () => {
        setSelectedIds([]); // clear selection
        queryClient.invalidateQueries({
          queryKey: trpc.project.getMany.queryKey(),
        });
        toast.success("Selected projects deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const {
    data: projectData,
    isLoading,
    error,
  } = useQuery(
    trpc.project.getMany.queryOptions({
      take: limit,
      skip,
      search: debouncedSearch,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    })
  );
  const projects = projectData?.projects || [];

  // Calculate stats from actual data
  const stats = projectData
    ? {
        total: projectData?.total,
        live: projectData?.liveCount,
        inProgress: projectData?.inProgressCount,
        completed: projectData?.completedCount,
        archived: projectData?.archivedCount,
        featured: projectData?.featuredCount,
      }
    : {
        total: 0,
        live: 0,
        inProgress: 0,
        completed: 0,
        archived: 0,
        featured: 0,
      };

  // Format date helper using date-fns
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Status color helper
  const getStatusStyle = (status: Status) => {
    switch (status) {
      case "LIVE":
        return "bg-green-400 border-black";
      case "IN_PROGRESS":
        return "bg-blue-400 border-black";
      case "COMPLETED":
        return "bg-lime-400 border-black";
      case "ARCHIVED":
        return "bg-gray-400 border-black";
      default:
        return "bg-yellow-400 border-black";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-mono text-xl">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-mono text-xl text-red-600">
          Error loading projects
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + New Project Button */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-4 relative inline-block">
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
            PROJECTS
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputRef={searchInputRef}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | Status)}
            className="font-mono border-2 border-black p-2 bg-white"
          >
            <option value="ALL">All Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/admin/projects/new">
            <Button className="bg-lime-400 hover:bg-lime-300 font-mono border-2 border-black w-full sm:w-auto">
              + NEW PROJECT
            </Button>
          </Link>
          <Button
            className={`font-mono border-2 border-black w-full sm:w-auto ${
              selectedIds.length === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
            disabled={selectedIds.length === 0 || deleteMany.isPending}
            onClick={() => {
              if (selectedIds.length === 0) return;
              if (
                confirm(
                  `Are you sure you want to delete ${selectedIds.length} selected project(s)?`
                )
              ) {
                deleteMany.mutate({ ids: selectedIds });
              }
            }}
          >
            {deleteMany.isPending
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </Button>
        </div>
      </div>

      {/* Stats Bar - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.total}</div>
          <div className="font-mono text-xs uppercase">Total</div>
        </div>
        <div className="bg-green-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.live}</div>
          <div className="font-mono text-xs uppercase">Live</div>
        </div>
        <div className="bg-blue-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">
            {stats.inProgress}
          </div>
          <div className="font-mono text-xs uppercase">In Progress</div>
        </div>
        <div className="bg-lime-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">
            {stats.completed}
          </div>
          <div className="font-mono text-xs uppercase">Completed</div>
        </div>
        <div className="bg-gray-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.archived}</div>
          <div className="font-mono text-xs uppercase">Archived</div>
        </div>
        <div className="bg-yellow-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.featured}</div>
          <div className="font-mono text-xs uppercase">Featured</div>
        </div>
      </div>

      {/* Projects - Desktop Table / Mobile Cards */}
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-3 sm:p-6 relative">
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full font-mono">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="text-left p-3">TITLE</th>
                <th className="text-left p-3">STATUS</th>
                <th className="text-left p-3">TECH</th>
                <th className="text-left p-3">COMPLETED</th>
                <th className="text-left p-3">VIEWS</th>
                <th className="text-left p-3">LINKS</th>
                <th className="text-left p-3">ACTIONS</th>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      projects.length > 0 &&
                      selectedIds.length === projects.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(projects.map((project) => project.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <div className="size-20 relative">
                          {project.thumbnail && (
                            <Image
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-8 h-8 object-cover border border-black"
                              fill
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          {project.featured && (
                            <span className="text-xs bg-yellow-400 px-1 border border-black">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 border-2 text-xs font-black ${getStatusStyle(
                          project.status as Status
                        )}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-sm max-w-[150px]">
                      <div className="flex flex-wrap gap-1">
                        {project.tech.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-1 text-xs border border-black"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(project.completedAt)}
                    </td>
                    <td className="p-3 text-sm">{project.views}</td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                            title="Live Demo"
                          >
                            🌐
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:underline"
                            title="GitHub"
                          >
                            📂
                          </a>
                        )}
                        {project.caseStudyUrl && (
                          <a
                            href={project.caseStudyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title="Case Study"
                          >
                            📋
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/admin/projects/${project.slug}`}
                        className="underline hover:text-lime-600"
                      >
                        Edit
                      </Link>
                      <button
                        className="underline hover:text-red-600"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this project?"
                            )
                          ) {
                            deleteProject.mutate({ id: project.id });
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, project.id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== project.id)
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No projects found.{" "}
                    <Link href="/admin/projects/new" className="underline">
                      Create your first project
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {/* Select All Mobile */}
          <div className="flex items-center gap-2 p-3 border-b-2 border-black font-mono">
            <input
              type="checkbox"
              checked={
                projects.length > 0 && selectedIds.length === projects.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(projects.map((project) => project.id));
                } else {
                  setSelectedIds([]);
                }
              }}
            />
            <span className="text-sm font-black">SELECT ALL</span>
          </div>

          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="border-2 border-black p-4 bg-gray-50 relative"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {project.thumbnail && (
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover border border-black"
                          fill
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-bold text-sm truncate">
                        {project.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 border text-xs font-black ${getStatusStyle(
                            project.status as Status
                          )}`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                        {project.featured && (
                          <span className="text-xs bg-yellow-400 px-1 border border-black">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(project.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, project.id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== project.id)
                        );
                      }
                    }}
                    className="mt-1"
                  />
                </div>

                {/* Mobile Card Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 4).map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 px-2 py-1 text-xs border border-black font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{project.tech.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center font-mono text-xs">
                    <span>Completed: {formatDate(project.completedAt)}</span>
                    <span>Views: {project.views}</span>
                  </div>

                  {/* Mobile Links */}
                  <div className="flex gap-3 text-lg">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                        title="Live Demo"
                      >
                        🌐
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                        title="GitHub"
                      >
                        📂
                      </a>
                    )}
                    {project.caseStudyUrl && (
                      <a
                        href={project.caseStudyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Case Study"
                      >
                        📋
                      </a>
                    )}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex gap-4 pt-2 border-t border-gray-300">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-lime-600 hover:text-lime-800 font-mono text-sm underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 font-mono text-sm underline"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this project?"
                          )
                        ) {
                          deleteProject.mutate({ id: project.id });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No projects found.{" "}
              <Link href="/admin/projects/new" className="underline">
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {projectData && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <Button
            variant="ghost"
            className="border-2 border-black font-mono w-full sm:w-auto"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <div className="bg-black text-white border-2 border-black px-4 py-2 font-mono text-sm">
            Page {page} of{" "}
            {Math.max(1, Math.ceil((projectData.total ?? 0) / limit))}
          </div>

          <Button
            variant="ghost"
            className="border-2 border-black font-mono w-full sm:w-auto"
            onClick={() =>
              setPage((prev) =>
                prev < Math.ceil((projectData.total ?? 0) / limit)
                  ? prev + 1
                  : prev
              )
            }
            disabled={page >= Math.ceil((projectData.total ?? 0) / limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
