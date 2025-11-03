"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/types";

type Category = RouterOutputs["category"]["list"]["items"][number];

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
  basePath?: string;
}

export default function CategoryFilter({ categories, activeSlug, basePath = "/blog" }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          !activeSlug
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`${basePath}?category=${category.slug}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}

