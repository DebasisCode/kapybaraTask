"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/types";

type Post = RouterOutputs["post"]["getBySlug"] | RouterOutputs["post"]["getById"] | null;
type Category = RouterOutputs["category"]["list"]["items"][number];

interface PostFormProps {
  post?: Post;
  mode: "create" | "edit";
}

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(post?.title || "");
  const [authorName, setAuthorName] = useState(post?.authorName || "");
  const [content, setContent] = useState(post?.content || "");
  const [published, setPublished] = useState(post?.published || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((c) => "categoryId" in c ? c.categoryId : c.id) || []
  );

  const { data: categoriesData } = trpc.category.list.useQuery({ page: 1, limit: 50 });

  const utils = trpc.useUtils();

  const createPost = trpc.post.create.useMutation({
    onMutate: async (newPost) => {
      await utils.post.list.cancel();
      const previousData = utils.post.list.getData({ page: 1, limit: 100, publishedOnly: false });
      return { previousData };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousData) {
        utils.post.list.setData({ page: 1, limit: 100, publishedOnly: false }, context.previousData);
      }
    },
    onSuccess: (data) => {
      utils.post.list.invalidate();
      router.push(`/blog/${data.slug}`);
    },
  });

  const updatePost = trpc.post.update.useMutation({
    onMutate: async ({ id, ...updatedPost }) => {
      await utils.post.list.cancel();
      await utils.post.getById.cancel({ id });
      
      const previousListData = utils.post.list.getData({ page: 1, limit: 100, publishedOnly: false });
      const previousPostData = utils.post.getById.getData({ id });

      if (previousPostData) {
        utils.post.getById.setData({ id }, {
          ...previousPostData,
          ...updatedPost,
          updatedAt: new Date(),
        });
      }

      return { previousListData, previousPostData };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousPostData) {
        utils.post.getById.setData({ id }, context.previousPostData);
      }
      if (context?.previousListData) {
        utils.post.list.setData({ page: 1, limit: 100, publishedOnly: false }, context.previousListData);
      }
    },
    onSuccess: (data) => {
      utils.post.list.invalidate();
      utils.post.getById.invalidate({ id: data.id });
      router.push(`/blog/${data.slug}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !authorName.trim() || !content.trim()) {
      return;
    }

    if (mode === "create") {
      createPost.mutate({
        title: title.trim(),
        authorName: authorName.trim(),
        content: content.trim(),
        published,
        categoryIds: selectedCategories,
      });
    } else if (post) {
      updatePost.mutate({
        id: post.id,
        title: title.trim(),
        authorName: authorName.trim(),
        content: content.trim(),
        published,
        categoryIds: selectedCategories,
      });
    }
  };

  const isLoading = createPost.isPending || updatePost.isPending;
  const error = createPost.error || updatePost.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="author" className="text-sm font-medium">
          Author Name
        </label>
        <input
          id="author"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter author name"
          required
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      <MarkdownEditor value={content} onChange={setContent} />

      {categoriesData && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background p-3">
            {categoriesData.items.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
                    }
                  }}
                  className="h-4 w-4 rounded border-input"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <label htmlFor="published" className="text-sm font-medium cursor-pointer">
          Publish immediately
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "An error occurred. Please try again."}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !authorName.trim() || !content.trim()}
          className={cn(
            "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
            "hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isLoading ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={cn(
            "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

