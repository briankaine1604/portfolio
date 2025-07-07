"use client";
import { Button } from "@/components/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchInput } from "@/modules/blog/ui/component/admin-search-input";

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10; // matches default in `getManyInput`
  const skip = (page - 1) * limit;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteBlog = useMutation(
    trpc.blog.deleteBlog.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getMany.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const deleteMany = useMutation(
    trpc.blog.deleteMany.mutationOptions({
      onSuccess: () => {
        setSelectedIds([]); // clear selection
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getMany.queryKey(),
        });
        toast.success("Selected posts deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery(
    trpc.blog.getMany.queryOptions({
      take: limit,
      skip,
      search: debouncedSearch,
    })
  );
  const blogPosts = blogData?.posts || [];

  // Calculate stats from actual data
  const stats = blogPosts
    ? {
        total: blogData?.total,
        published: blogData?.publishedCount,
        drafts: blogData?.draftsCount,
      }
    : { total: 0, published: 0, drafts: 0 };

  // Format date helper using date-fns
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-mono text-xl">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="font-mono text-xl text-red-600">
          Error loading blog posts
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + New Post Button */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-4 relative inline-block">
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
            BLOG POSTS
          </h1>
        </div>

        <div className="order-2 lg:order-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputRef={searchInputRef}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 order-1 lg:order-2">
          <Link href="/admin/blog/new">
            <Button className="bg-lime-400 hover:bg-lime-300 font-mono border-2 border-black w-full sm:w-auto">
              + NEW POST
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
                  `Are you sure you want to delete ${selectedIds.length} selected post(s)?`
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.total}</div>
          <div className="font-mono text-xs uppercase">Total Posts</div>
        </div>
        <div className="bg-lime-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">
            {stats.published}
          </div>
          <div className="font-mono text-xs uppercase">Published</div>
        </div>
        <div className="bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_#666] p-3 text-center">
          <div className="text-xl sm:text-2xl font-black">{stats.drafts}</div>
          <div className="font-mono text-xs uppercase">Drafts</div>
        </div>
      </div>

      {/* Blog Posts - Desktop Table / Mobile Cards */}
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-3 sm:p-6 relative">
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full font-mono">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="text-left p-3">TITLE</th>
                <th className="text-left p-3">STATUS</th>
                <th className="text-left p-3">DATE</th>
                <th className="text-left p-3">VIEWS</th>
                <th className="text-left p-3">ACTIONS</th>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      blogPosts.length > 0 &&
                      selectedIds.length === blogPosts.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(blogPosts.map((post) => post.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {blogPosts && blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 border-2 text-xs font-black ${
                          post.published
                            ? "bg-lime-400 border-black"
                            : "bg-yellow-400 border-black"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="p-3 text-sm">{post.views}</td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="underline hover:text-lime-600"
                      >
                        Edit
                      </Link>
                      <button
                        className="underline hover:text-red-600"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this post?"
                            )
                          ) {
                            deleteBlog.mutate({ id: post.id });
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, post.id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== post.id)
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No blog posts found.{" "}
                    <Link href="/admin/blog/new" className="underline">
                      Create your first post
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
                blogPosts.length > 0 && selectedIds.length === blogPosts.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(blogPosts.map((post) => post.id));
                } else {
                  setSelectedIds([]);
                }
              }}
            />
            <span className="text-sm font-black">SELECT ALL</span>
          </div>

          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div
                key={post.id}
                className="border-2 border-black p-4 bg-gray-50 relative"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-mono font-bold text-sm sm:text-base line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 border text-xs font-black ${
                          post.published
                            ? "bg-lime-400 border-black"
                            : "bg-yellow-400 border-black"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(post.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, post.id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== post.id)
                        );
                      }
                    }}
                    className="mt-1 flex-shrink-0"
                  />
                </div>

                {/* Mobile Card Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span>
                      {post.published ? "Published" : "Created"}:{" "}
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span>Views: {post.views}</span>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex gap-4 pt-2 border-t border-gray-300">
                    <Link
                      href={`/admin/blog/${post.slug}`}
                      className="text-lime-600 hover:text-lime-800 font-mono text-sm underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 font-mono text-sm underline"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this post?")
                        ) {
                          deleteBlog.mutate({ id: post.id });
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
              No blog posts found.{" "}
              <Link href="/admin/blog/new" className="underline">
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {blogData && (
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
            {Math.max(1, Math.ceil((blogData.total ?? 0) / limit))}
          </div>

          <Button
            variant="ghost"
            className="border-2 border-black font-mono w-full sm:w-auto"
            onClick={() =>
              setPage((prev) =>
                prev < Math.ceil((blogData.total ?? 0) / limit)
                  ? prev + 1
                  : prev
              )
            }
            disabled={page >= Math.ceil((blogData.total ?? 0) / limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
