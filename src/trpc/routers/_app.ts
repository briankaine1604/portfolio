import { blogRouter } from "@/modules/blog/server/procedures";
import { createTRPCRouter } from "../init";
import { categoryRouter } from "@/modules/category/server/procedures";
import { projectRouter } from "@/modules/projects/server/procedures";
export const appRouter = createTRPCRouter({
  blog: blogRouter,
  category: categoryRouter,
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
