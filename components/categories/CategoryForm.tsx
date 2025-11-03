"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/types";

type Category = RouterOutputs["category"]["list"]["items"][number] | null;

interface CategoryFormProps {
  category?: Category;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

export default function CategoryForm({ category, mode, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  const utils = trpc.useUtils();

  const createCategory = trpc.category.create.useMutation({
    onMutate: async (newCategory) => {
      await utils.category.list.cancel();
      const previousData = utils.category.list.getData({ page: 1, limit: 50 });
      return { previousData };
    },
    onError: (_err, _newCategory, context) => {
      if (context?.previousData) {
        utils.category.list.setData({ page: 1, limit: 50 }, context.previousData);
      }
    },
    onSuccess: () => {
      utils.category.list.invalidate();
      onSuccess?.();
      if (!onSuccess) {
        router.refresh();
      }
    },
  });

  const updateCategory = trpc.category.update.useMutation({
    onMutate: async ({ id, ...updatedCategory }) => {
      await utils.category.list.cancel();
      const previousData = utils.category.list.getData({ page: 1, limit: 50 });
      
      if (previousData) {
        utils.category.list.setData(
          { page: 1, limit: 50 },
          {
            ...previousData,
            items: previousData.items.map((cat) =>
              cat.id === id ? { ...cat, ...updatedCategory } : cat
            ),
          }
        );
      }

      return { previousData };
    },
    onError: (_err, _updatedCategory, context) => {
      if (context?.previousData) {
        utils.category.list.setData({ page: 1, limit: 50 }, context.previousData);
      }
    },
    onSuccess: () => {
      utils.category.list.invalidate();
      onSuccess?.();
      if (!onSuccess) {
        router.refresh();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (mode === "create") {
      createCategory.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } else if (category) {
      updateCategory.mutate({
        id: category.id,
        name: name.trim(),
        description: description.trim() || undefined,
      });
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;
  const error = createCategory.error || updateCategory.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
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
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description (optional)"
          rows={3}
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "An error occurred. Please try again."}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className={cn(
            "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
            "hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isLoading ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
        </button>
        {onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className={cn(
              "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

