"use client";

import { useTRPC } from "@/trpc/client";
import { useBlogFilters } from "../../hooks/use-blog-filters";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const sortOptions = ["newest", "oldest", "popular"] as const;

export function BlogFilters() {
  const { filters, setFilters } = useBlogFilters();
  const trpc = useTRPC();
  const router = useRouter();
  const { data: categories } = useQuery(trpc.category.getAll.queryOptions());

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return value !== "newest";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value !== "";
    return value !== null;
  });

  const onClear = () => {
    setFilters(
      {
        category: "",
        tags: [],
        sort: "newest",
      },
      { shallow: false }
    );
    router.refresh();
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value }, { shallow: false });
    router.refresh();
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] mb-6 relative max-w-6xl mx-auto">
      {/* Top-right accent square */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 border-2 border-black"></div>

      {/* Header */}
      <div className="p-3 border-b-2 border-black flex items-center justify-between">
        <p className="font-bold uppercase text-sm">Filters</p>
        {hasAnyFilters && (
          <button
            className="font-mono text-xs uppercase text-gray-600 hover:text-black underline transition-colors"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="p-3 space-y-3">
        {/* Category & Sort - Same Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-xs uppercase mb-1 text-gray-700">
              Category
            </label>
            <select
              className="w-full bg-gray-50 border-2 border-black px-2 py-1.5 font-mono text-xs focus:ring-0 focus:border-black"
              value={filters.category}
              onChange={(e) => onChange("category", e.target.value)}
            >
              <option value="">All</option>
              {categories &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase mb-1 text-gray-700">
              Sort By
            </label>
            <select
              className="w-full bg-gray-50 border-2 border-black px-2 py-1.5 font-mono text-xs focus:ring-0 focus:border-black"
              value={filters.sort}
              onChange={(e) =>
                onChange("sort", e.target.value as (typeof sortOptions)[number])
              }
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-mono text-xs uppercase mb-1 text-gray-700">
            Tags
          </label>
          <input
            type="text"
            placeholder="react, ai, css..."
            value={filters.tags.join(", ")}
            onChange={(e) =>
              onChange(
                "tags",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            className="w-full bg-gray-50 border-2 border-black px-2 py-1.5 font-mono text-xs focus:ring-0 focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}
