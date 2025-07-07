import { generateSlug } from "@/lib/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getManyInput = z.object({
  published: z.boolean().optional(), // filter drafts vs public
  categorySlug: z.string().optional(), // filter by category
  search: z.string().optional(), // full-text search
  take: z.number().min(1).max(100).optional().default(10), // pagination
  skip: z.number().min(0).optional().default(0), // pagination
  orderBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const blogRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blog.findUnique({
        where: {
          slug: input.slug,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      return post;
    }),

  getMany: baseProcedure.input(getManyInput).query(async ({ ctx, input }) => {
    const { published, categorySlug, search, take, skip, orderBy, sort } =
      input;

    const where: Prisma.BlogWhereInput = {};

    if (typeof published === "boolean") {
      where.published = published;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { body: { contains: search } },
      ];
    }

    const posts = await ctx.db.blog.findMany({
      where,
      take,
      skip,
      orderBy: {
        [orderBy]: sort,
      },
      include: {
        category: true,
      },
    });

    // Get total count of posts matching the filter
    const total = await ctx.db.blog.count({ where });

    // Get total count of published posts matching the filter
    const publishedCount = await ctx.db.blog.count({
      where: { ...where, published: true },
    });

    // Get total count of draft posts matching the filter
    const draftsCount = await ctx.db.blog.count({
      where: { ...where, published: false },
    });

    return {
      posts,
      total,
      publishedCount,
      draftsCount,
    };
  }),
  createBlog: baseProcedure
    .input(
      z.object({
        title: z.string().min(3),
        excerpt: z.string().min(10),
        slug: z.string().optional(), // Make slug optional
        body: z.string().min(50),
        readTime: z.string(),
        categoryId: z.string(),
        published: z.boolean(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = input.slug || (await generateSlug(input.title));
        let uniqueSlug = slug;
        let counter = 1;

        while (await ctx.db.blog.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${slug}-${counter++}`;
        }

        const blog = await ctx.db.blog.create({
          data: {
            ...input,
            slug: uniqueSlug,
            tags: input.tags?.map((tag) => tag.trim()) ?? [],
          },
        });

        return blog;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A blog post with that slug already exists.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),
  updateBlog: baseProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3),
        excerpt: z.string().min(10),
        slug: z.string().optional(), // Make slug optional
        body: z.string().min(50),
        readTime: z.string(),
        categoryId: z.string(),
        published: z.boolean(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const existing = await ctx.db.blog.findUnique({ where: { id } });
        if (!existing) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
        }

        const slug = input.slug || (await generateSlug(input.title));
        let uniqueSlug = slug;
        let counter = 1;

        while (await ctx.db.blog.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${slug}-${counter++}`;
        }

        const updated = await ctx.db.blog.update({
          where: { id },
          data: {
            ...data,
            slug,
            tags: data.tags?.map((tag) => tag.trim()) ?? [],
          },
        });
        return updated;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A blog post with that slug already exists.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),
  deleteBlog: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const blog = await ctx.db.blog.delete({
          where: {
            id: input.id,
          },
        });

        return blog;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2025") {
            // Record to delete not found
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Blog post not found.",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
        });
      }
    }),

  deleteMany: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.blog.deleteMany({
          where: {
            id: { in: input.ids },
          },
        });

        return {
          deletedCount: result.count,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete blog posts",
          cause: err,
        });
      }
    }),
  getFilteredPosts: baseProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        tags: z.array(z.string()).optional(),
        sort: z.enum(["newest", "oldest", "popular"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, tags, sort } = input;

      const where: Prisma.BlogWhereInput = {
        published: true,
        ...(categoryId &&
          categoryId !== "" && {
            categoryId: categoryId,
          }),
        ...(tags &&
          tags.length > 0 && {
            tags: { hasSome: tags },
          }),
      };

      const orderBy: Prisma.BlogOrderByWithRelationInput =
        sort === "oldest"
          ? { createdAt: "asc" }
          : sort === "popular"
          ? { views: "desc" }
          : { createdAt: "desc" };

      const blogPosts = await ctx.db.blog.findMany({
        where,
        include: { category: true },
        orderBy,
      });

      return blogPosts;
    }),
});
