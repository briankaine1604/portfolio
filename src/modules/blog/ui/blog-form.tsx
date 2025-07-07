"use client";

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
import { BlogGetOneOutput } from "@/modules/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Editor } from "@tiptap/react";
import Tiptap from "@/components/Tiptap";

// --- Zod Schema ---
const blogFormSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  slug: z.string().optional(),
  body: z.string().min(50),
  readTime: z.string(),
  categoryId: z.string(),
  published: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  tags: z.string().optional(), // Comma separated, to split later
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface Props {
  initialData?: BlogGetOneOutput;
  slug: string;
}

export default function BlogForm({ initialData, slug }: Props) {
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

  const createBlog = useMutation(
    trpc.blog.createBlog.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getOne.queryKey({ slug }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getMany.queryKey(),
        });
        router.push("/admin/blog");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateBlog = useMutation(
    trpc.blog.updateBlog.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getOne.queryKey({ slug }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.blog.getMany.queryKey(),
        });
        router.push("/admin/blog");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const pending = createBlog.isPending || updateBlog.isPending;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      slug: initialData?.slug || "",
      body: initialData?.body || "",
      readTime: initialData?.readTime || "",
      categoryId: initialData?.categoryId || "",
      published: initialData?.published ?? false,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      ogImage: initialData?.ogImage || "",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  function onSubmit(values: BlogFormValues) {
    const formatted = {
      ...values,
      tags: values.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (initialData) {
      // ✅ Update existing blog
      updateBlog.mutate({
        ...formatted,
        id: initialData.id, // no need for optional chaining here
      });
    } else {
      // ✅ Create new blog
      createBlog.mutate(formatted);
    }

    console.log("Submitting blog:", formatted);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 border-4 border-black p-6 shadow-[12px_12px_0px_0px_#000] bg-white max-w-6xl"
      >
        <h2 className="text-3xl font-bold font-mono">
          {initialData ? "Update Blog" : "Create New Blog"}
        </h2>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} className="border-2 border-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
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
                URL-friendly version, e.g., {"how-i-broke-docker"}. If left
                empty, it will be generated from the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} className="border-2 border-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Body */}
        <FormField
          control={form.control}
          name="body"
          render={(
            {} // We still need 'field' to handle validation and initial value indirectly
          ) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                {/* Pass initial content and the ref to your TipTap component */}
                <Tiptap
                  ref={editorRef}
                  initialContent={initialData?.body || ""} // Pass initial content
                  onContentUpdate={(html: string) =>
                    form.setValue("body", html)
                  } // Prop to update form
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Read Time */}
        <FormField
          control={form.control}
          name="readTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Read Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 5 min"
                  className="border-2 border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
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
                        <span className=" text-sm">Loading</span>{" "}
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
                          For adding new categories
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
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="comma-separated e.g. trpc,docker,api"
                  className="border-2 border-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Meta Title & Description */}
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
              </FormItem>
            )}
          />
        </div>

        {/* OG Image */}
        <FormField
          control={form.control}
          name="ogImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Image URL</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input {...field} className="border-2 border-black" />
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        form.setValue("ogImage", res[0].ufsUrl, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload error: ${error.message}`);
                    }}
                    className="w-fit px-4 py-2 bg-lime-400 hover:bg-lime-300 border-2 border-black text-black font-mono uppercase font-bold"
                    content={{ button: "Upload Image" }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Published</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-lime-400 border-2 border-black hover:bg-lime-300"
          disabled={pending}
        >
          Submit Blog Post
          {pending && <Loader2 className="ml-2 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
