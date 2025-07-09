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
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 border-l-4 border-lime-400 ">
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase text-gray-600">
          Category:
        </span>
        <select
          className="bg-white border-2 border-black px-2 py-1 font-mono text-xs focus:ring-0 focus:border-lime-400 transition-colors"
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">All</option>
          {categories &&
            categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase text-gray-600">Sort:</span>
        <select
          className="bg-white border-2 border-black px-2 py-1 font-mono text-xs focus:ring-0 focus:border-lime-400 transition-colors"
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

      {/* Tags Filter */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="font-mono text-xs uppercase text-gray-600 whitespace-nowrap">
          Tags:
        </span>
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
          className="flex-1 bg-white border-2 border-black px-2 py-1 font-mono text-xs focus:ring-0 focus:border-lime-400 transition-colors min-w-0"
        />
      </div>

      {/* Clear Button */}
      {hasAnyFilters && (
        <button
          className="bg-black text-white px-3 py-1 border-2 border-black font-mono text-xs uppercase hover:bg-gray-800 transition-colors"
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
      )}
    </div>
  );
}
