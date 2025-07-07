"use client";
import { Button } from "@/components/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { format } from "date-fns";
import { useTRPC } from "@/trpc/client";

export default function AdminDashboard() {
  const trpc = useTRPC();

  // Fetch dashboard stats - using getMany with minimal data to get counts
  const { data: blogStats, isLoading: blogStatsLoading } = useQuery(
    trpc.blog.getMany.queryOptions({
      take: 1, // We only need the counts, not the actual posts
      skip: 0,
    })
  );

  const { data: projectStats, isLoading: projectStatsLoading } = useQuery(
    trpc.project.getMany.queryOptions({
      take: 1, // We only need the counts, not the actual posts
      skip: 0,
    })
  );

  // Fetch recent blog posts (limit 5 for dashboard)
  const { data: recentBlogs, isLoading: recentBlogsLoading } = useQuery(
    trpc.blog.getMany.queryOptions({
      take: 5,
      skip: 0,
      orderBy: "createdAt",
      sort: "desc",
    })
  );

  // Fetch recent projects (limit 5 for dashboard)
  const { data: recentProjects, isLoading: recentProjectsLoading } = useQuery(
    trpc.project.getMany.queryOptions({
      take: 5,
      skip: 0,
      orderBy: "createdAt",
      sort: "desc",
    })
  );

  // For now, create some mock recent activity until you implement the activity tracking
  const mockRecentActivity = [
    {
      id: 1,
      action: "Updated Blog",
      title: "Recent blog post",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      action: "Added Project",
      title: "New project",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      action: "Published Post",
      title: "Latest article",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  // Build stats array from real data
  const stats = [
    {
      label: "TOTAL PROJECTS",
      value: projectStatsLoading ? "..." : projectStats?.total || "0",
      color: "bg-lime-400",
    },
    {
      label: "BLOG POSTS",
      value: blogStatsLoading ? "..." : blogStats?.total || "0",
      color: "bg-black text-white",
    },
    {
      label: "DRAFTS",
      value: blogStatsLoading ? "..." : blogStats?.draftsCount || "0",
      color: "bg-white",
    },
  ];

  // Format date helper
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Format relative time
  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-12 flex justify-between items-center">
        <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-4 relative inline-block">
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
          <h1 className="text-2xl font-black uppercase tracking-wider">
            ADMIN PANEL
          </h1>
        </div>
        <Button className="border-black font-mono">LOG OUT</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 relative`}
          >
            <div className="text-4xl font-black">{stat.value}</div>
            <div className="font-mono text-xs uppercase mt-2">{stat.label}</div>
            {index === 1 && (
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-lime-400 border-2 border-black"></div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-12 bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-black"></div>
        <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/blog/new">
            <Button className="w-full bg-lime-400 hover:bg-lime-300 font-mono">
              + NEW BLOG POST
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button className="w-full bg-black text-white hover:bg-gray-800 font-mono">
              + ADD PROJECT
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_#666] p-6 relative mb-12">
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black transform rotate-12"></div>
        <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-white pb-2">
          RECENT ACTIVITY
        </h2>
        <ul className="space-y-3 font-mono text-sm">
          {mockRecentActivity.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-2 border-b border-gray-700"
            >
              <div>
                <span className="text-lime-400">{item.action}:</span>{" "}
                {item.title}
              </div>
              <div className="text-gray-400">
                {formatRelativeTime(item.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blog Posts Table */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
            RECENT BLOG POSTS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">TITLE</th>
                  <th className="text-left py-2">STATUS</th>
                  <th className="text-left py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentBlogsLoading ? (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-gray-500">
                      Loading blog posts...
                    </td>
                  </tr>
                ) : recentBlogs?.posts?.length ? (
                  recentBlogs.posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200">
                      <td
                        className="py-3 truncate max-w-[200px]"
                        title={post.title}
                      >
                        {post.title}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 ${
                            post.published ? "bg-lime-400" : "bg-yellow-400"
                          }`}
                        >
                          {post.published ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="underline mr-2"
                        >
                          Edit
                        </Link>
                        <button className="text-red-500 underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-gray-500">
                      No blog posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {recentBlogs && recentBlogs?.posts?.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/admin/blog" className="font-mono text-xs underline">
                VIEW ALL POSTS →
              </Link>
            </div>
          )}
        </div>

        {/* Projects Table */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
            RECENT PROJECTS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">NAME</th>
                  <th className="text-left py-2">TECH</th>
                  <th className="text-left py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentProjectsLoading ? (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-gray-500">
                      Loading projects...
                    </td>
                  </tr>
                ) : recentProjects?.projects?.length ? (
                  recentProjects.projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200">
                      <td
                        className="py-3 truncate max-w-[200px]"
                        title={project.title}
                      >
                        {project.title}
                      </td>
                      <td
                        className="truncate max-w-[150px]"
                        title={project.title}
                      >
                        {project.tech || "N/A"}
                      </td>
                      <td>
                        <Link
                          href={`/admin/projects/${project.slug}`}
                          className="underline mr-2"
                        >
                          Edit
                        </Link>
                        <button className="text-red-500 underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {recentProjects && recentProjects?.projects?.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/admin/projects"
                className="font-mono text-xs underline"
              >
                VIEW ALL PROJECTS →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
