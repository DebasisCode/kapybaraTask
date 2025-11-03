"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryForm from "./CategoryForm";
import type { RouterOutputs } from "@/lib/types";

type Category = RouterOutputs["category"]["list"]["items"][number];

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const utils = trpc.useUtils();
  const deleteCategory = trpc.category.delete.useMutation({
    onMutate: async (deletedCategory) => {
      await utils.category.list.cancel();
      const previousData = utils.category.list.getData({ page: 1, limit: 50 });
      
      if (previousData) {
        utils.category.list.setData(
          { page: 1, limit: 50 },
          {
            ...previousData,
            items: previousData.items.filter((cat) => cat.id !== deletedCategory.id),
            total: previousData.total - 1,
          }
        );
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        utils.category.list.setData({ page: 1, limit: 50 }, context.previousData);
      }
    },
    onSuccess: () => {
      utils.category.list.invalidate();
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    deleteCategory.mutate({ id });
  };

  const handleEditSuccess = () => {
    setEditingId(null);
    utils.category.list.invalidate();
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    utils.category.list.invalidate();
  };

  const { data: categoriesData } = trpc.category.list.useQuery(
    { page: 1, limit: 50 },
    {
      initialData: { items: initialCategories, total: initialCategories.length, page: 1, limit: 50, totalPages: 1 },
    }
  );

  const categories = categoriesData?.items || initialCategories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
              "hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "w-full sm:w-auto"
            )}
          >
            Create Category
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Create New Category</h3>
          <CategoryForm mode="create" onSuccess={handleCreateSuccess} />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">No categories found. Create your first category to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              {editingId === category.id ? (
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">Edit Category</h3>
                  <CategoryForm category={category} mode="edit" onSuccess={handleEditSuccess} />
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">Slug: {category.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(category.id)}
                      className={cn(
                        "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      )}
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteCategory.isPending}
                      className={cn(
                        "rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

