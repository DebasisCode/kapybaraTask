"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import Container from "@/components/layout/Container";
import PostCard from "@/components/blog/PostCard";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";

export default function Home() {
  const { data: postsData, isLoading, error } = trpc.post.list.useQuery({
    page: 1,
    limit: 3,
    publishedOnly: true,
  });

  return (
    <>
      <Hero />
      <Features />
      <CTA />

      <section className="border-t bg-muted/50 py-24">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Recent blog posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              All blog posts →
            </Link>
          </div>

          {error && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Error loading posts</h3>
                <p className="mt-2 text-muted-foreground">Please try again later.</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="h-96 animate-pulse rounded-lg border bg-muted md:col-span-2 md:row-span-2" />
              <div className="h-64 animate-pulse rounded-lg border bg-muted" />
              <div className="h-64 animate-pulse rounded-lg border bg-muted" />
            </div>
          ) : postsData && postsData.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <PostCard post={postsData.items[0]} featured />
              {postsData.items.slice(1).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold">No posts found</h3>
                <p className="mt-2 text-muted-foreground">Check back later for new posts.</p>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
