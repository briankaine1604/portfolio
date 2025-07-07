// server/routers/category.ts
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import z from "zod";

export const categoryRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: { name: "asc" },
    });
  }),
  create: baseProcedure
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
      const slug = input.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      return ctx.db.category.create({
        data: {
          name: input.name,
          slug, // ✅ required field satisfied
        },
      });
    }),
});
