"use client";

import {
  useQueryStates,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs";

const sortOptions = ["newest", "oldest", "popular"] as const;

const Params = {
  category: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
  sort: parseAsStringLiteral(sortOptions).withDefault("newest"),
};

export const useBlogFilters = () => {
  const [filters, setFilters] = useQueryStates(Params);
  return { filters, setFilters };
};
