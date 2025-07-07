import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type BlogGetOneOutput = inferRouterOutputs<AppRouter>["blog"]["getOne"];
export type categoryGetManyOutput =
  inferRouterOutputs<AppRouter>["category"]["getAll"];

export type ProjectGetOneOutput =
  inferRouterOutputs<AppRouter>["project"]["getOne"];

export const STATUSES = [
  "LIVE",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const;

export type Status = (typeof STATUSES)[number];
