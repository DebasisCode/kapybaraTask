import { Suspense } from "react";
import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "All Blog Posts",
  description: "Browse all blog posts. Filter by category, search, and discover great content.",
  openGraph: {
    title: "All Blog Posts | Blog Platform",
    description: "Browse all blog posts. Filter by category, search, and discover great content.",
  },
};

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageClient />
    </Suspense>
  );
}

function BlogPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <div className="mb-8">
        <div className="mb-6 h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-lg border bg-muted" />
        ))}
      </div>
    </div>
  );
}
