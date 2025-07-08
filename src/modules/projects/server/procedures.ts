import { generateSlug } from "@/lib/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getManyInput = z.object({
  status: z.enum(["LIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(), // filter by status
  categorySlug: z.string().optional(), // filter by category
  featured: z.boolean().optional(), // filter featured projects
  tech: z.array(z.string()).optional(), // filter by technologies
  search: z.string().optional(), // full-text search
  take: z.number().min(1).max(100).optional().default(10), // pagination
  skip: z.number().min(0).optional().default(0), // pagination
  orderBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "priority",
      "views",
      "likes",
      "completedAt",
    ])
    .optional()
    .default("priority"),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const projectRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          category: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Increment views
      await ctx.db.project.update({
        where: { slug: input.slug },
        data: { views: { increment: 1 } },
      });

      return project;
    }),

  getMany: baseProcedure.input(getManyInput).query(async ({ ctx, input }) => {
    const {
      status,
      categorySlug,
      featured,
      tech,
      search,
      take,
      skip,
      orderBy,
      sort,
    } = input;

    const where: Prisma.ProjectWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (typeof featured === "boolean") {
      where.featured = featured;
    }

    if (tech && tech.length > 0) {
      where.tech = { hasSome: tech };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { longDescription: { contains: search, mode: "insensitive" } },
        { challenges: { contains: search, mode: "insensitive" } },
        { learnings: { contains: search, mode: "insensitive" } },
        { tech: { hasSome: [search] } },
      ];
    }

    const projects = await ctx.db.project.findMany({
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

    // Get total count of projects matching the filter
    const total = await ctx.db.project.count({ where });

    // Get counts by status
    const liveCount = await ctx.db.project.count({
      where: { ...where, status: "LIVE" },
    });

    const inProgressCount = await ctx.db.project.count({
      where: { ...where, status: "IN_PROGRESS" },
    });

    const completedCount = await ctx.db.project.count({
      where: { ...where, status: "COMPLETED" },
    });

    const archivedCount = await ctx.db.project.count({
      where: { ...where, status: "ARCHIVED" },
    });

    const featuredCount = await ctx.db.project.count({
      where: { ...where, featured: true },
    });

    return {
      projects,
      total,
      liveCount,
      inProgressCount,
      completedCount,
      archivedCount,
      featuredCount,
    };
  }),

  createProject: baseProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        slug: z.string().optional(), // Make slug optional
        tech: z.array(z.string()).min(1),
        status: z.enum(["LIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
        liveUrl: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
        caseStudyUrl: z.string().url().optional(),
        thumbnail: z.string().url().optional(),
        images: z.array(z.string().url()).optional(),
        videoUrl: z.string().url().optional(),
        longDescription: z.string().optional(),
        challenges: z.string().optional(),
        learnings: z.string().optional(),
        categoryId: z.string().optional(),
        featured: z.boolean().optional().default(false),
        priority: z.number().optional().default(0),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().url().optional(),
        completedAt: z
          .union([z.string(), z.date()])
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = input.slug || (await generateSlug(input.title));
        let uniqueSlug = slug;
        let counter = 1;

        while (
          await ctx.db.project.findUnique({ where: { slug: uniqueSlug } })
        ) {
          uniqueSlug = `${slug}-${counter++}`;
        }

        const project = await ctx.db.project.create({
          data: {
            ...input,
            slug: uniqueSlug,
            tech: input.tech.map((t) => t.trim()),
            images: input.images?.map((img) => img.trim()) ?? [],
          },
        });

        return project;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A project with that slug already exists.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),

  updateProject: baseProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3),
        description: z.string().min(10),
        slug: z.string().optional(), // Make slug optional
        tech: z.array(z.string()).min(1),
        status: z.enum(["LIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
        liveUrl: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
        caseStudyUrl: z.string().url().optional(),
        thumbnail: z.string().url().optional(),
        images: z.array(z.string().url()).optional(),
        videoUrl: z.string().url().optional(),
        longDescription: z.string().optional(),
        challenges: z.string().optional(),
        learnings: z.string().optional(),
        categoryId: z.string().optional(),
        featured: z.boolean().optional().default(false),
        priority: z.number().optional().default(0),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().url().optional(),
        completedAt: z
          .union([z.string(), z.date()])
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      try {
        const existing = await ctx.db.project.findUnique({ where: { id } });
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        const slug = input.slug || (await generateSlug(input.title));
        let uniqueSlug = slug;
        let counter = 1;

        // Check if slug exists and is different from current project
        while (true) {
          const existingProject = await ctx.db.project.findUnique({
            where: { slug: uniqueSlug },
          });
          if (!existingProject || existingProject.id === id) {
            break;
          }
          uniqueSlug = `${slug}-${counter++}`;
        }

        const updated = await ctx.db.project.update({
          where: { id },
          data: {
            ...data,
            slug: uniqueSlug,
            tech: data.tech.map((t) => t.trim()),
            images: data.images?.map((img) => img.trim()) ?? [],
          },
        });
        return updated;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A project with that slug already exists.",
            });
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),

  deleteProject: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.delete({
          where: {
            id: input.id,
          },
        });

        return project;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2025") {
            // Record to delete not found
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Project not found.",
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
        const result = await ctx.db.project.deleteMany({
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
          message: "Failed to delete projects",
          cause: err,
        });
      }
    }),

  getFilteredProjects: baseProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        tech: z.array(z.string()).optional(),
        status: z
          .enum(["LIVE", "IN_PROGRESS", "COMPLETED", "ARCHIVED"])
          .optional(),
        featured: z.boolean().optional(),
        sort: z.enum(["newest", "oldest", "popular", "priority"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, tech, status, featured, sort } = input;

      const where: Prisma.ProjectWhereInput = {
        ...(categoryId &&
          categoryId !== "" && {
            categoryId: categoryId,
          }),
        ...(tech &&
          tech.length > 0 && {
            tech: { hasSome: tech },
          }),
        ...(status && {
          status: status,
        }),
        ...(typeof featured === "boolean" && {
          featured: featured,
        }),
      };

      const orderBy: Prisma.ProjectOrderByWithRelationInput =
        sort === "oldest"
          ? { createdAt: "asc" }
          : sort === "popular"
          ? { views: "desc" }
          : sort === "priority"
          ? { priority: "desc" }
          : { createdAt: "desc" };

      const projects = await ctx.db.project.findMany({
        where,
        include: { category: true },
        orderBy,
      });

      return projects;
    }),

  // Additional project-specific procedures
  incrementLikes: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.update({
          where: { id: input.id },
          data: { likes: { increment: 1 } },
        });

        return project;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to increment likes",
          cause: err,
        });
      }
    }),

  getFeaturedProjects: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).optional().default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      const projects = await ctx.db.project.findMany({
        where: { featured: true },
        take: input.limit,
        orderBy: { priority: "desc" },
        include: { category: true },
      });

      return projects;
    }),

  getProjectsByTech: baseProcedure
    .input(
      z.object({
        tech: z.string(),
        limit: z.number().min(1).max(20).optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const projects = await ctx.db.project.findMany({
        where: {
          tech: { has: input.tech },
        },
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });

      return projects;
    }),

  getProjectStats: baseProcedure.query(async ({ ctx }) => {
    const totalProjects = await ctx.db.project.count();
    const liveProjects = await ctx.db.project.count({
      where: { status: "LIVE" },
    });
    const inProgressProjects = await ctx.db.project.count({
      where: { status: "IN_PROGRESS" },
    });
    const completedProjects = await ctx.db.project.count({
      where: { status: "COMPLETED" },
    });
    const featuredProjects = await ctx.db.project.count({
      where: { featured: true },
    });

    const totalViews = await ctx.db.project.aggregate({
      _sum: { views: true },
    });

    const totalLikes = await ctx.db.project.aggregate({
      _sum: { likes: true },
    });

    return {
      totalProjects,
      liveProjects,
      inProgressProjects,
      completedProjects,
      featuredProjects,
      totalViews: totalViews._sum.views || 0,
      totalLikes: totalLikes._sum.likes || 0,
    };
  }),
});
