"use client";

import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import Container from "@/components/layout/Container";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";
import CategoryFilter from "@/components/blog/CategoryFilter";

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const categorySlug = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: postsData, isLoading: postsLoading, error: postsError } = trpc.post.list.useQuery({
    page,
    limit: 12,
    categorySlug,
    search,
    publishedOnly: true,
  });

  const { data: categoriesData } = trpc.category.list.useQuery({ page: 1, limit: 20 });

  if (postsError) {
    return (
      <Container>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Error loading posts</h2>
            <p className="mt-2 text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">All blog posts</h1>
        
        {categoriesData && (
          <CategoryFilter
            categories={categoriesData.items}
            activeSlug={categorySlug}
          />
        )}
      </div>

      {postsLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : postsData && postsData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsData.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {postsData.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={postsData.page}
                totalPages={postsData.totalPages}
                searchParams={Object.fromEntries(searchParams.entries())}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">No posts found</h2>
            <p className="mt-2 text-muted-foreground">
              {categorySlug ? "Try selecting a different category." : "Check back later for new posts."}
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}






