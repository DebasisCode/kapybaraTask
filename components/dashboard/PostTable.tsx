"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/types";

type Post = RouterOutputs["post"]["list"]["items"][number];

interface PostTableProps {
  initialPosts: Post[];
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function PostTable({ initialPosts }: PostTableProps) {
  const utils = trpc.useUtils();
  
  const { data: postsData } = trpc.post.list.useQuery(
    { page: 1, limit: 50, publishedOnly: false },
    {
      initialData: {
        items: initialPosts,
        total: initialPosts.length,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
    }
  );

  const togglePublish = trpc.post.togglePublish.useMutation({
    onMutate: async ({ id, published }) => {
      await utils.post.list.cancel();
      const previousData = utils.post.list.getData({ page: 1, limit: 50, publishedOnly: false });
      
      if (previousData) {
        utils.post.list.setData(
          { page: 1, limit: 50, publishedOnly: false },
          {
            ...previousData,
            items: previousData.items.map((post) =>
              post.id === id
                ? {
                    ...post,
                    published,
                    publishedAt: published ? new Date() : null,
                  }
                : post
            ),
          }
        );
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        utils.post.list.setData({ page: 1, limit: 50, publishedOnly: false }, context.previousData);
      }
    },
    onSuccess: () => {
      utils.post.list.invalidate();
    },
  });

  const deletePost = trpc.post.delete.useMutation({
    onMutate: async (deletedPost) => {
      await utils.post.list.cancel();
      const previousData = utils.post.list.getData({ page: 1, limit: 50, publishedOnly: false });
      
      if (previousData) {
        utils.post.list.setData(
          { page: 1, limit: 50, publishedOnly: false },
          {
            ...previousData,
            items: previousData.items.filter((post) => post.id !== deletedPost.id),
            total: previousData.total - 1,
          }
        );
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        utils.post.list.setData({ page: 1, limit: 50, publishedOnly: false }, context.previousData);
      }
    },
    onSuccess: () => {
      utils.post.list.invalidate();
    },
  });

  const posts = postsData?.items || initialPosts;

  const handleTogglePublish = (id: string, currentPublished: boolean) => {
    togglePublish.mutate({
      id,
      published: !currentPublished,
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    deletePost.mutate({ id });
  };

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No posts found. Create your first post to get started.</p>
        <Link
          href="/posts/new"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[800px]">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
            <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">Author</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">Categories</th>
            <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">Published</th>
            <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">Updated</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {post.title}
                </Link>
                <div className="mt-1 text-xs text-muted-foreground md:hidden">{post.authorName}</div>
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{post.authorName}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    post.published
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {post.categories.length > 0 ? (
                    post.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                {formatDate(post.publishedAt)}
              </td>
              <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                {formatDate(post.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    disabled={togglePublish.isPending}
                    className={cn(
                      "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    aria-label={post.published ? "Unpublish post" : "Publish post"}
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className={cn(
                      "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    aria-label={`Edit ${post.title}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletePost.isPending}
                    className={cn(
                      "rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    aria-label={`Delete ${post.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

