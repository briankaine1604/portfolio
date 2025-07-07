"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Tiptap from "@/components/Tiptap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { formatSlug } from "@/lib/utils";
import { ProjectGetOneOutput, STATUSES } from "@/modules/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

// --- Zod Schema ---
const projectFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  slug: z.string().optional(),
  tech: z.string().min(1), // Comma separated, to split later
  status: z.enum(STATUSES),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  caseStudyUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
  images: z.string().optional(), // Comma separated URLs
  videoUrl: z.string().url().optional().or(z.literal("")),
  longDescription: z.string().optional(),
  challenges: z.string().optional(),
  learnings: z.string().optional(),
  categoryId: z.string().optional(),
  featured: z.boolean(),
  priority: z.number().min(0).max(100),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
  completedAt: z.string().optional(), // Date string for form input
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;
type Status = (typeof STATUSES)[number];

interface Props {
  initialData?: ProjectGetOneOutput;
  slug: string;
}

export default function ProjectForm({ initialData, slug }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const editorRef = useRef<{ getEditor: () => Editor | null }>(null);
  const queryClient = useQueryClient();
  const { data: categories, isPending } = useQuery(
    trpc.category.getAll.queryOptions()
  );

  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const createCategory = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: (newCat) => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.getAll.queryKey(),
        });
        form.setValue("categoryId", String(newCat.id)); // auto-select
        toast.success(`Created "${newCat.name}"`);
        setOpen(false);
        setNewCategoryName("");
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const createProject = useMutation(
    trpc.project.createProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getOne.queryKey({ slug }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.project.getMany.queryKey(),
        });
        router.push("/admin/projects");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateProject = useMutation(
    trpc.project.updateProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getOne.queryKey({ slug }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.project.getMany.queryKey(),
        });
        router.push("/admin/projects");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const pending = createProject.isPending || updateProject.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      tech: initialData?.tech?.join(", ") || "",
      status: (initialData?.status as Status) || "IN_PROGRESS",
      liveUrl: initialData?.liveUrl || "",
      githubUrl: initialData?.githubUrl || "",
      caseStudyUrl: initialData?.caseStudyUrl || "",
      thumbnail: initialData?.thumbnail || "",
      images: initialData?.images?.join(", ") || "",
      videoUrl: initialData?.videoUrl || "",
      longDescription: initialData?.longDescription || "",
      challenges: initialData?.challenges || "",
      learnings: initialData?.learnings || "",
      categoryId: initialData?.categoryId || "",
      featured: initialData?.featured ?? false,
      priority: initialData?.priority ?? 0,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      ogImage: initialData?.ogImage || "",
      completedAt: initialData?.completedAt
        ? new Date(initialData.completedAt).toISOString().split("T")[0]
        : "",
    },
  });

  function onSubmit(values: ProjectFormValues) {
    const formatted = {
      ...values,
      tech: values.tech
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      images: values.images
        ? values.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean)
        : [],
      completedAt: values.completedAt
        ? new Date(values.completedAt)
        : undefined,
      // Convert empty strings to undefined for optional URL fields
      liveUrl: values.liveUrl || undefined,
      githubUrl: values.githubUrl || undefined,
      caseStudyUrl: values.caseStudyUrl || undefined,
      thumbnail: values.thumbnail || undefined,
      videoUrl: values.videoUrl || undefined,
      ogImage: values.ogImage || undefined,
      categoryId: values.categoryId || undefined,
    };

    if (initialData) {
      // ✅ Update existing project
      updateProject.mutate({
        ...formatted,
        id: initialData.id,
      });
    } else {
      // ✅ Create new project
      createProject.mutate(formatted);
    }

    console.log("Submitting project:", formatted);
  }

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {slug ? formatSlug(slug.toString()) : "Loading..."}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border-4 border-black p-6 shadow-[12px_12px_0px_0px_#000] bg-white max-w-6xl"
        >
          <h2 className="text-3xl font-bold font-mono">
            {initialData ? "Update Project" : "Create New Project"}
          </h2>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              Basic Information
            </h3>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-2 border-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-2 border-black"
                      placeholder="Leave empty to auto-generate from title"
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version, e.g., {"my-awesome-project"}. If left
                    empty, it will be generated from the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-2 border-black"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description for cards and previews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority (0-100)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        max={100}
                        className="border-2 border-black"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Higher priority projects appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="React, TypeScript, Node.js, PostgreSQL"
                      className="border-2 border-black"
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of technologies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* URLs and Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              URLs & Links
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://myproject.com"
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://github.com/user/repo"
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="caseStudyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Study URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://blog.com/case-study"
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Video URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://youtube.com/watch?v=..."
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              Media
            </h3>

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="border-2 border-black"
                      />
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            form.setValue("thumbnail", res[0].url, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload error: ${error.message}`);
                        }}
                        className="w-fit px-4 py-2 bg-lime-400 hover:bg-lime-300 border-2 border-black text-black font-mono uppercase font-bold"
                        content={{ button: "Upload Thumbnail" }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Images</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        {...field}
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        className="border-2 border-black"
                      />
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            const currentImages = form.getValues("images");
                            const newImages = res.map((file) => file.url);
                            const allImages = currentImages
                              ? `${currentImages}, ${newImages.join(", ")}`
                              : newImages.join(", ");
                            form.setValue("images", allImages, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload error: ${error.message}`);
                        }}
                        className="w-fit px-4 py-2 bg-lime-400 hover:bg-lime-300 border-2 border-black text-black font-mono uppercase font-bold"
                        content={{ button: "Upload Images" }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of image URLs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Detailed Content */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              Detailed Content
            </h3>

            <FormField
              control={form.control}
              name="longDescription"
              render={() => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Tiptap
                      ref={editorRef}
                      initialContent={initialData?.longDescription || ""}
                      onContentUpdate={(html: string) =>
                        form.setValue("longDescription", html)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed project description with rich formatting
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenges & Problems Solved</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-2 border-black"
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    What problems did you encounter and how did you solve them?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learnings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Learnings</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-2 border-black"
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    What did you learn from this project?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              Organization
            </h3>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isPending ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex gap-2">
                            <span className="text-sm">Loading</span>
                            <Loader2 className="animate-spin" />
                          </div>
                        </SelectItem>
                      ) : (
                        categories?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 text-blue-600 hover:underline"
                        >
                          + Add new category
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>New Category</DialogTitle>
                          <DialogDescription>
                            For adding new project categories
                          </DialogDescription>
                        </DialogHeader>
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="mb-4"
                        />
                        <Button
                          onClick={() => {
                            if (!newCategoryName.trim())
                              return toast.error("Name required");
                            createCategory.mutate({
                              name: newCategoryName.trim(),
                            });
                          }}
                        >
                          Create
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Featured Project</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="border-2 border-black"
                      />
                    </FormControl>
                    <FormDescription>
                      When was this project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono border-b-2 border-black pb-2">
              SEO & Social
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-2 border-black" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-2 border-black" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input {...field} className="border-2 border-black" />
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            form.setValue("ogImage", res[0].url, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload error: ${error.message}`);
                        }}
                        className="w-fit px-4 py-2 bg-lime-400 hover:bg-lime-300 border-2 border-black text-black font-mono uppercase font-bold"
                        content={{ button: "Upload OG Image" }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Image shown when sharing on social media
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="bg-lime-400 border-2 border-black hover:bg-lime-300 font-bold"
            disabled={pending}
          >
            {initialData ? "Update Project" : "Create Project"}
            {pending && <Loader2 className="ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
